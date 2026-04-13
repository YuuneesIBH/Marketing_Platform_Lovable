# Oppa Seoul Marketing Platform

Interne marketingtool voor Oppa Seoul.

## Database setup

1. Kopieer `.env.example` naar `.env`.
2. Vul je Postgres-gegevens in.
3. Start de API met `npm run dev:api`.
4. Start de frontend met `npm run dev`.

Alle user-aangemaakte data wordt via `/api/state/:key` in Postgres opgeslagen.

Belangrijk: de API leest nu automatisch `.env` in via `dotenv`.
