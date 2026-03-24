import { useState } from "react";
import { Megaphone, Plus, Filter, ArrowUpRight, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface Campaign {
  name: string;
  status: string;
  platform: string;
  budget: string;
  spent: string;
  impressions: string;
  conversions: string;
  progress: number;
}

const initialCampaigns: Campaign[] = [
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

const Campagnes = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [open, setOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [form, setForm] = useState({ name: "", platform: "", budget: "", status: "Gepland" });

  const handleCreate = () => {
    if (!form.name || !form.platform || !form.budget) {
      toast({ title: "Vul alle velden in", variant: "destructive" });
      return;
    }
    const newCampaign: Campaign = {
      name: form.name,
      status: form.status,
      platform: form.platform,
      budget: `€${form.budget}`,
      spent: "€0",
      impressions: "—",
      conversions: "—",
      progress: 0,
    };
    setCampaigns([newCampaign, ...campaigns]);
    setForm({ name: "", platform: "", budget: "", status: "Gepland" });
    setOpen(false);
    toast({ title: "Campagne aangemaakt", description: `"${form.name}" is toegevoegd.` });
  };

  const handleDelete = (index: number) => {
    const name = campaigns[index].name;
    setCampaigns(campaigns.filter((_, i) => i !== index));
    toast({ title: "Campagne verwijderd", description: `"${name}" is verwijderd.` });
  };

  const filtered = filterStatus === "all" ? campaigns : campaigns.filter(c => c.status === filterStatus);

  return (
    <div className="flex-1 p-8 overflow-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-semibold text-foreground">Campagnes</h1>
          <p className="text-muted-foreground mt-1">Beheer en monitor al je marketing campagnes.</p>
        </div>
        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[130px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle</SelectItem>
              <SelectItem value="Actief">Actief</SelectItem>
              <SelectItem value="Gepland">Gepland</SelectItem>
              <SelectItem value="Review">Review</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4" /> Nieuwe Campagne
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-display">Nieuwe Campagne</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div>
                  <Label>Naam</Label>
                  <Input placeholder="Bijv. Summer Glow Launch" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <Label>Platform</Label>
                  <Select value={form.platform} onValueChange={v => setForm({ ...form, platform: v })}>
                    <SelectTrigger><SelectValue placeholder="Kies platform" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Instagram">Instagram</SelectItem>
                      <SelectItem value="TikTok">TikTok</SelectItem>
                      <SelectItem value="Meta Ads">Meta Ads</SelectItem>
                      <SelectItem value="Google Ads">Google Ads</SelectItem>
                      <SelectItem value="YouTube">YouTube</SelectItem>
                      <SelectItem value="Email">Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Budget (€)</Label>
                  <Input type="number" placeholder="2000" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Gepland">Gepland</SelectItem>
                      <SelectItem value="Actief">Actief</SelectItem>
                      <SelectItem value="Review">Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleCreate} className="w-full">Campagne aanmaken</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Megaphone className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>Geen campagnes gevonden.</p>
        </div>
      )}

      <div className="grid gap-4">
        {filtered.map((c, i) => {
          const realIndex = campaigns.indexOf(c);
          return (
            <div key={`${c.name}-${i}`} className="glass-card rounded-xl p-5 animate-fade-in group" style={{ animationDelay: `${i * 80}ms` }}>
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
                <button onClick={() => handleDelete(realIndex)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Campagnes;
