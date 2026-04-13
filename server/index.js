import cors from "cors";
import express from "express";
import pg from "pg";

const { Pool } = pg;

const app = express();
const port = Number(process.env.API_PORT ?? 3001);
const connectionString =
  process.env.DATABASE_URL ??
  `postgresql://${encodeURIComponent(process.env.PGUSER ?? "postgres")}:${encodeURIComponent(
    process.env.PGPASSWORD ?? "",
  )}@${process.env.PGHOST ?? "127.0.0.1"}:${process.env.PGPORT ?? "5432"}/${process.env.PGDATABASE ?? "postgres"}`;

const pool = new Pool({
  connectionString,
  ssl:
    process.env.PGSSLMODE === "disable"
      ? false
      : {
          rejectUnauthorized: false,
        },
});

const defaults = {
  team: [],
  contacts: [],
  broadcasts: [],
  automations: [],
  calendar: [],
  groupchat: {
    channels: [],
    sharedAssets: [],
  },
  messages: {
    accounts: [],
    conversations: [],
  },
  settings: {
    profile: { bedrijfsnaam: "", email: "", website: "" },
    notif: { email: true, push: true, weeklyReport: false, campagneAlerts: true },
    branding: { primaryColor: "#E8A0BF", logoUrl: "", slogan: "" },
    channels: { instagram: "", tiktok: "", facebook: "", youtube: "" },
  },
};

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS app_state (
      key TEXT PRIMARY KEY,
      value JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

app.use(cors());
app.use(express.json({ limit: "20mb" }));

app.get("/api/health", async (_request, response) => {
  try {
    await pool.query("SELECT 1");
    response.json({ ok: true });
  } catch (error) {
    console.error(error);
    response.status(500).json({ ok: false, error: "Database unavailable" });
  }
});

app.get("/api/state/:key", async (request, response) => {
  const { key } = request.params;

  if (!(key in defaults)) {
    response.status(404).json({ error: "Unknown state key" });
    return;
  }

  try {
    const result = await pool.query("SELECT value FROM app_state WHERE key = $1", [key]);
    const value = result.rows[0]?.value ?? defaults[key];
    response.json({ key, value });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Failed to load state" });
  }
});

app.put("/api/state/:key", async (request, response) => {
  const { key } = request.params;
  const { value } = request.body ?? {};

  if (!(key in defaults)) {
    response.status(404).json({ error: "Unknown state key" });
    return;
  }

  try {
    const result = await pool.query(
      `
        INSERT INTO app_state (key, value, updated_at)
        VALUES ($1, $2::jsonb, NOW())
        ON CONFLICT (key)
        DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
        RETURNING value
      `,
      [key, JSON.stringify(value ?? defaults[key])],
    );

    response.json({ key, value: result.rows[0].value });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Failed to save state" });
  }
});

initDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`API listening on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize database", error);
    process.exit(1);
  });
