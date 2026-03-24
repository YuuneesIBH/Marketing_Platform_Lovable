import { Megaphone, Plus, Filter, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const campaigns = [
  { name: "Glass Skin Serum Launch", status: "Actief", platform: "Instagram", budget: "€2.400", spent: "€1.728", impressions: "842K", conversions: "3.2K", progress: 72 },
  { name: "K-Beauty Routine Guide", status: "Gepland", platform: "TikTok", budget: "€1.800", spent: "€0", impressions: "—", conversions: "—", progress: 0 },
  { name: "Sheet Mask Bundel Sale", status: "Actief", platform: "Meta Ads", budget: "€3.200", spent: "€1.440", impressions: "1.2M", conversions: "5.8K", progress: 45 },
  { name: "Influencer Collab Q2", status: "Review", platform: "YouTube", budget: "€5.000", spent: "€4.500", impressions: "2.1M", conversions: "8.4K", progress: 90 },
  { name: "Summer Glow Collectie", status: "Gepland", platform: "Instagram", budget: "€2.000", spent: "€0", impressions: "—", conversions: "—", progress: 0 },
  { name: "Retinol Nachtcrème Push", status: "Actief", platform: "Google Ads", budget: "€1.600", spent: "€960", impressions: "620K", conversions: "2.1K", progress: 60 },
];

const statusVariant: Record<string, string> = {
  Actief: "bg-sage/30 text-foreground border-sage",
  Gepland: "bg-secondary text-secondary-foreground border-border",
  Review: "bg-accent text-accent-foreground border-accent",
};

const Campagnes = () => (
  <div className="flex-1 p-8 overflow-auto">
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-display font-semibold text-foreground">Campagnes</h1>
        <p className="text-muted-foreground mt-1">Beheer en monitor al je marketing campagnes.</p>
      </div>
      <div className="flex gap-2">
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors">
          <Filter className="w-4 h-4" /> Filter
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Nieuwe Campagne
        </button>
      </div>
    </div>

    <div className="grid gap-4">
      {campaigns.map((c, i) => (
        <div key={c.name} className="glass-card rounded-xl p-5 animate-fade-in hover:shadow-md transition-shadow cursor-pointer" style={{ animationDelay: `${i * 80}ms` }}>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-rose-light flex items-center justify-center shrink-0">
              <Megaphone className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <p className="text-sm font-semibold text-foreground">{c.name}</p>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${statusVariant[c.status]}`}>{c.status}</span>
              </div>
              <p className="text-xs text-muted-foreground">{c.platform}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-muted-foreground">Budget</p>
              <p className="text-sm font-semibold text-foreground">{c.budget}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-muted-foreground">Besteed</p>
              <p className="text-sm font-medium text-foreground">{c.spent}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-muted-foreground">Impressies</p>
              <p className="text-sm font-medium text-foreground">{c.impressions}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-muted-foreground">Conversies</p>
              <p className="text-sm font-medium text-foreground flex items-center gap-1">{c.conversions} {c.conversions !== "—" && <ArrowUpRight className="w-3 h-3 text-sage" />}</p>
            </div>
            {c.progress > 0 && (
              <div className="w-24 shrink-0">
                <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${c.progress}%` }} />
                </div>
                <p className="text-[10px] text-muted-foreground text-right mt-1">{c.progress}%</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Campagnes;
