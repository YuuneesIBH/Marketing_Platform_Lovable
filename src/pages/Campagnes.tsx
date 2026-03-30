import { useState } from "react";
import { Megaphone, Plus, Filter, ArrowUpRight, X, Pencil } from "lucide-react";
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

const statusVariant: Record<string, string> = {
  Actief: "bg-sage/30 text-foreground border-sage",
  Gepland: "bg-secondary text-secondary-foreground border-border",
  Review: "bg-accent text-accent-foreground border-accent",
  Afgerond: "bg-muted text-muted-foreground border-border",
};

const emptyForm = { name: "", platform: "", budget: "", spent: "", impressions: "", conversions: "", progress: "", status: "Gepland" };

const Campagnes = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [open, setOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [form, setForm] = useState(emptyForm);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const openCreate = () => {
    setForm(emptyForm);
    setEditIndex(null);
    setOpen(true);
  };

  const openEdit = (index: number) => {
    const c = campaigns[index];
    setForm({
      name: c.name,
      platform: c.platform,
      budget: c.budget.replace("€", ""),
      spent: c.spent.replace("€", ""),
      impressions: c.impressions === "—" ? "" : c.impressions,
      conversions: c.conversions === "—" ? "" : c.conversions,
      progress: String(c.progress),
      status: c.status,
    });
    setEditIndex(index);
    setOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.platform || !form.budget) {
      toast({ title: "Vul naam, platform en budget in", variant: "destructive" });
      return;
    }
    const campaign: Campaign = {
      name: form.name,
      status: form.status,
      platform: form.platform,
      budget: `€${form.budget}`,
      spent: form.spent ? `€${form.spent}` : "€0",
      impressions: form.impressions || "—",
      conversions: form.conversions || "—",
      progress: Number(form.progress) || 0,
    };
    if (editIndex !== null) {
      const updated = [...campaigns];
      updated[editIndex] = campaign;
      setCampaigns(updated);
      toast({ title: "Campagne bijgewerkt", description: `"${form.name}" is opgeslagen.` });
    } else {
      setCampaigns([campaign, ...campaigns]);
      toast({ title: "Campagne aangemaakt", description: `"${form.name}" is toegevoegd.` });
    }
    setForm(emptyForm);
    setEditIndex(null);
    setOpen(false);
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
              <SelectItem value="Afgerond">Afgerond</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={openCreate}>
            <Plus className="w-4 h-4" /> Nieuwe Campagne
          </Button>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Megaphone className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>Geen campagnes gevonden. Maak je eerste campagne aan!</p>
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
                <button onClick={() => openEdit(realIndex)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(realIndex)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditIndex(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">{editIndex !== null ? "Campagne bewerken" : "Nieuwe Campagne"}</DialogTitle>
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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Budget (€)</Label>
                <Input type="number" placeholder="2000" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} />
              </div>
              <div>
                <Label>Besteed (€)</Label>
                <Input type="number" placeholder="0" value={form.spent} onChange={e => setForm({ ...form, spent: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Impressies</Label>
                <Input placeholder="Bijv. 500K" value={form.impressions} onChange={e => setForm({ ...form, impressions: e.target.value })} />
              </div>
              <div>
                <Label>Conversies</Label>
                <Input placeholder="Bijv. 1.2K" value={form.conversions} onChange={e => setForm({ ...form, conversions: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Voortgang (%)</Label>
                <Input type="number" min="0" max="100" placeholder="0" value={form.progress} onChange={e => setForm({ ...form, progress: e.target.value })} />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Gepland">Gepland</SelectItem>
                    <SelectItem value="Actief">Actief</SelectItem>
                    <SelectItem value="Review">Review</SelectItem>
                    <SelectItem value="Afgerond">Afgerond</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleSave} className="w-full">
              {editIndex !== null ? "Opslaan" : "Campagne aanmaken"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Campagnes;
