import { LayoutDashboard, Calendar, Users, Settings, MessageCircle, MessagesSquare, Workflow, Contact, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import oppaLogo from "../../assets/oppa_logo.png";

const Sidebar = () => {
  const location = useLocation();
  const { locale, setLocale, t } = useLanguage();
  const navItems = [
    { icon: LayoutDashboard, label: t("nav.dashboard"), path: "/" },
    { icon: Workflow, label: t("nav.automations"), path: "/automations" },
    { icon: MessageCircle, label: t("nav.messages"), path: "/berichten" },
    { icon: Contact, label: t("nav.contacts"), path: "/contacten" },
    { icon: Radio, label: t("nav.broadcasts"), path: "/broadcasts" },
    { icon: Calendar, label: t("nav.contentCalendar"), path: "/content-kalender" },
    { icon: MessagesSquare, label: t("nav.groupChat"), path: "/groepschat" },
    { icon: Users, label: t("nav.team"), path: "/team" },
    { icon: Settings, label: t("nav.settings"), path: "/instellingen" },
  ];

  return (
    <aside className="w-64 min-h-screen bg-card border-r border-border flex flex-col shrink-0">
      <div className="p-6 border-b border-border flex justify-center">
        <img
          src={oppaLogo}
          alt="Oppa Seoul logo"
          className="h-24 w-auto object-contain"
        />
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-green-light text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border">
        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-2">{t("common.language")}</p>
        <div className="flex rounded-lg bg-secondary p-1 gap-1">
          <Button
            type="button"
            variant={locale === "nl" ? "default" : "ghost"}
            size="sm"
            className="flex-1 justify-center"
            onClick={() => setLocale("nl")}
          >
            {t("common.dutch")}
          </Button>
          <Button
            type="button"
            variant={locale === "en" ? "default" : "ghost"}
            size="sm"
            className="flex-1 justify-center"
            onClick={() => setLocale("en")}
          >
            {t("common.english")}
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
