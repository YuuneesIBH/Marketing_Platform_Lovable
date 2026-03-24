import { BarChart3, TrendingUp, Eye, Heart, ShoppingBag, ArrowUpRight, ArrowDownRight } from "lucide-react";

const metrics = [
  { label: "Totaal Impressies", value: "12.4M", change: "+18.3%", up: true, icon: Eye },
  { label: "Engagement Rate", value: "4.8%", change: "+0.6%", up: true, icon: Heart },
  { label: "Conversie Rate", value: "2.3%", change: "-0.2%", up: false, icon: ShoppingBag },
  { label: "Omzet deze maand", value: "€48.2K", change: "+23.1%", up: true, icon: TrendingUp },
];

const channelData = [
  { channel: "Instagram", impressions: "5.2M", engagement: "5.1%", conversions: "4.8K", revenue: "€18.4K" },
  { channel: "TikTok", impressions: "3.8M", engagement: "6.2%", conversions: "3.2K", revenue: "€12.1K" },
  { channel: "Google Ads", impressions: "2.1M", engagement: "2.8%", conversions: "2.9K", revenue: "€11.2K" },
  { channel: "YouTube", impressions: "890K", engagement: "4.5%", conversions: "1.1K", revenue: "€4.8K" },
  { channel: "Email", impressions: "420K", engagement: "22.1%", conversions: "680", revenue: "€1.7K" },
];

const weeklyData = [
  { day: "Ma", value: 65 }, { day: "Di", value: 78 }, { day: "Wo", value: 82 }, { day: "Do", value: 71 },
  { day: "Vr", value: 90 }, { day: "Za", value: 58 }, { day: "Zo", value: 45 },
];

const Analytics = () => (
  <div className="flex-1 p-8 overflow-auto">
    <div className="mb-8">
      <h1 className="text-3xl font-display font-semibold text-foreground">Analytics</h1>
      <p className="text-muted-foreground mt-1">Inzichten en prestaties van je marketing kanalen.</p>
    </div>

    <div className="grid grid-cols-4 gap-4 mb-8">
      {metrics.map((m, i) => (
        <div key={m.label} className="glass-card rounded-xl p-5 animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
          <div className="flex items-center justify-between mb-3">
            <m.icon className="w-5 h-5 text-primary" />
            <span className={`text-xs font-medium flex items-center gap-0.5 ${m.up ? "text-sage" : "text-destructive"}`}>
              {m.change} {m.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            </span>
          </div>
          <p className="text-2xl font-semibold text-foreground">{m.value}</p>
          <p className="text-sm text-muted-foreground">{m.label}</p>
        </div>
      ))}
    </div>

    {/* Mini bar chart */}
    <div className="glass-card rounded-xl p-5 mb-8 animate-fade-in" style={{ animationDelay: "200ms" }}>
      <h3 className="font-display font-semibold text-foreground mb-4">Engagement deze week</h3>
      <div className="flex items-end gap-3 h-32">
        {weeklyData.map(d => (
          <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full bg-primary/20 rounded-t-md relative" style={{ height: `${d.value}%` }}>
              <div className="absolute inset-0 bg-primary rounded-t-md" style={{ height: `${d.value}%` }} />
            </div>
            <span className="text-[10px] text-muted-foreground">{d.day}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Channel table */}
    <div className="glass-card rounded-xl p-5 animate-fade-in" style={{ animationDelay: "300ms" }}>
      <h3 className="font-display font-semibold text-foreground mb-4">Kanaal Prestaties</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground">Kanaal</th>
              <th className="text-right py-3 px-2 text-xs font-medium text-muted-foreground">Impressies</th>
              <th className="text-right py-3 px-2 text-xs font-medium text-muted-foreground">Engagement</th>
              <th className="text-right py-3 px-2 text-xs font-medium text-muted-foreground">Conversies</th>
              <th className="text-right py-3 px-2 text-xs font-medium text-muted-foreground">Omzet</th>
            </tr>
          </thead>
          <tbody>
            {channelData.map(c => (
              <tr key={c.channel} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                <td className="py-3 px-2 font-medium text-foreground">{c.channel}</td>
                <td className="py-3 px-2 text-right text-muted-foreground">{c.impressions}</td>
                <td className="py-3 px-2 text-right text-muted-foreground">{c.engagement}</td>
                <td className="py-3 px-2 text-right text-muted-foreground">{c.conversions}</td>
                <td className="py-3 px-2 text-right font-medium text-foreground">{c.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default Analytics;
