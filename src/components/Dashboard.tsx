import { useLanguage } from "@/contexts/LanguageContext";

const Dashboard = () => {
  const { t } = useLanguage();

  return (
    <div className="flex-1 p-8 overflow-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-semibold text-foreground">{t("nav.dashboard")}</h1>
        <p className="text-muted-foreground mt-1">{t("dashboard.welcome")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-display font-semibold text-foreground mb-2">{t("dashboard.gettingStarted")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("dashboard.gettingStartedBody")}
          </p>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h3 className="font-display font-semibold text-foreground mb-2">{t("dashboard.overview")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("dashboard.overviewBody")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
