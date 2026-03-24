import { TrendingUp, Eye, Heart, ShoppingBag, ArrowUpRight, Calendar, Clock } from "lucide-react";
import heroProducts from "@/assets/hero-products.jpg";

const stats = [
  { label: "Impressies", value: "2.4M", change: "+12.3%", icon: Eye },
  { label: "Engagement", value: "184K", change: "+8.7%", icon: Heart },
  { label: "Conversies", value: "12.8K", change: "+23.1%", icon: ShoppingBag },
  { label: "Bereik", value: "892K", change: "+5.4%", icon: TrendingUp },
];

const campaigns = [
  { name: "Glass Skin Serum Launch", status: "Actief", platform: "Instagram", progress: 72 },
  { name: "K-Beauty Routine Guide", status: "Gepland", platform: "TikTok", progress: 0 },
  { name: "Sheet Mask Bundel Sale", status: "Actief", platform: "Meta Ads", progress: 45 },
  { name: "Influencer Collab Q2", status: "Review", platform: "YouTube", progress: 90 },
];

const calendarItems = [
  { date: "25 mrt", title: "Productfoto shoot", time: "10:00" },
  { date: "26 mrt", title: "Social media planning Q2", time: "14:00" },
  { date: "27 mrt", title: "Influencer meeting", time: "11:00" },
  { date: "28 mrt", title: "Newsletter verzenden", time: "09:00" },
];

const topProducts = [
  { name: "Hydra Glow Serum", sales: "4.2K", trend: "+18%" },
  { name: "Rice Water Toner", sales: "3.8K", trend: "+12%" },
  { name: "Snail Mucin Cream", sales: "2.9K", trend: "+9%" },
];

const statusColor: Record<string, string> = {
  Actief: "bg-sage text-charcoal",
  Gepland: "bg-secondary text-secondary-foreground",
  Review: "bg-accent text-accent-foreground",
};

const Dashboard = () => {
  return (
    <div className="flex-1 p-8 overflow-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-semibold text-foreground">
          Welkom terug, Ji-Soo ✨
        </h1>
        <p className="text-muted-foreground mt-1">
          Hier is je marketing overzicht voor deze week.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="glass-card rounded-xl p-5 animate-fade-in"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="w-5 h-5 text-primary" />
              <span className="text-xs font-medium text-sage flex items-center gap-0.5">
                {stat.change} <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
            <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Hero Banner */}
        <div className="col-span-2 rounded-xl overflow-hidden relative h-52 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <img src={heroProducts} alt="Oppa Seoul producten" className="w-full h-full object-cover" width={1280} height={720} />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/70 to-transparent flex items-center">
            <div className="p-8">
              <p className="text-sm font-medium text-blush mb-1">Nieuw deze maand</p>
              <h2 className="text-2xl font-display font-semibold text-card">
                Glass Skin Collectie
              </h2>
              <p className="text-sm text-card/80 mt-1 max-w-xs">
                Lancering campagne materialen klaar voor review.
              </p>
              <button className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                Bekijk campagne
              </button>
            </div>
          </div>
        </div>

        {/* Upcoming */}
        <div className="glass-card rounded-xl p-5 animate-fade-in" style={{ animationDelay: "300ms" }}>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-primary" />
            <h3 className="font-display font-semibold text-foreground">Aankomend</h3>
          </div>
          <div className="space-y-3">
            {calendarItems.map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <div className="w-10 text-center shrink-0">
                  <p className="text-xs font-semibold text-primary">{item.date.split(" ")[0]}</p>
                  <p className="text-[10px] text-muted-foreground">{item.date.split(" ")[1]}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Campaigns */}
        <div className="col-span-2 glass-card rounded-xl p-5 animate-fade-in" style={{ animationDelay: "400ms" }}>
          <h3 className="font-display font-semibold text-foreground mb-4">Actieve Campagnes</h3>
          <div className="space-y-3">
            {campaigns.map((c) => (
              <div key={c.name} className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.platform}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor[c.status]}`}>
                  {c.status}
                </span>
                {c.progress > 0 && (
                  <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${c.progress}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="glass-card rounded-xl p-5 animate-fade-in" style={{ animationDelay: "500ms" }}>
          <h3 className="font-display font-semibold text-foreground mb-4">Top Producten</h3>
          <div className="space-y-4">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-rose-light text-primary text-xs font-semibold flex items-center justify-center">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.sales} verkocht</p>
                </div>
                <span className="text-xs font-medium text-sage">{p.trend}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
