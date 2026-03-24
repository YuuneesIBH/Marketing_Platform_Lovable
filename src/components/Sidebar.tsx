import { LayoutDashboard, Calendar, Package, Megaphone, BarChart3, Users, Settings, Sparkles } from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Megaphone, label: "Campagnes" },
  { icon: Calendar, label: "Content Kalender" },
  { icon: Package, label: "Producten" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Users, label: "Team" },
  { icon: Settings, label: "Instellingen" },
];

const Sidebar = () => {
  return (
    <aside className="w-64 min-h-screen bg-card border-r border-border flex flex-col">
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
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              item.active
                ? "bg-rose-light text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold">
            JS
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Ji-Soo Kim</p>
            <p className="text-xs text-muted-foreground">Marketing Lead</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
