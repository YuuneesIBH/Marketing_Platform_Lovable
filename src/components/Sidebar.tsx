import { LayoutDashboard, Calendar, BarChart3, Users, Settings, Sparkles, MessageCircle, MessagesSquare, Workflow, Contact, Radio } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Workflow, label: "Automations", path: "/automations" },
  { icon: MessageCircle, label: "Berichten", path: "/berichten" },
  { icon: Contact, label: "Contacten", path: "/contacten" },
  { icon: Radio, label: "Broadcasts", path: "/broadcasts" },
  { icon: Calendar, label: "Content Kalender", path: "/content-kalender" },
  { icon: MessagesSquare, label: "Groepschat", path: "/groepschat" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: Users, label: "Team", path: "/team" },
  { icon: Settings, label: "Instellingen", path: "/instellingen" },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 min-h-screen bg-card border-r border-border flex flex-col shrink-0">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <span className="font-display text-xl font-semibold text-foreground tracking-tight">
            Oppa Seoul
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1 font-body">Marketing Platform</p>
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
    </aside>
  );
};

export default Sidebar;
