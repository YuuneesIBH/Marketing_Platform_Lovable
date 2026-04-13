import { useState } from "react";
import { Workflow, Plus, Pencil, Trash2, Play, Pause, Instagram, Music2, ToggleRight, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

interface Automation {
  id: string;
  name: string;
  trigger: string;
  platform: "instagram" | "tiktok" | "all";
  status: "active" | "paused" | "draft";
  steps: number;
  reached: number;
  converted: number;
}

const triggerOptions = [
  { value: "dm_keyword", label: "DM Keyword" },
  { value: "comment_keyword", label: "Comment Keyword" },
  { value: "story_reply", label: "Story Reply" },
  { value: "new_follower", label: "Nieuwe Volger" },
  { value: "story_mention", label: "Story Mention" },
];

const platformIcons: Record<string, React.ElementType> = {
  instagram: Instagram,
  tiktok: Music2,
  all: Workflow,
};

const Automations = () => {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [open, setOpen] = useState(false);
  const [editIdx, setEditIdx] = useState(-1);
  const [form, setForm] = useState({
    name: "",
    trigger: "dm_keyword",
    platform: "instagram" as "instagram" | "tiktok" | "all",
    steps: 1,
  });

  const save = () => {
    if (!form.name.trim()) return;
    if (editIdx >= 0) {
      setAutomations((prev) =>
        prev.map((a, i) =>
          i === editIdx ? { ...a, name: form.name, trigger: form.trigger, platform: form.platform, steps: form.steps } : a
        )
      );
      toast({ title: "Automation bijgewerkt" });
    } else {
      const newAuto: Automation = {
        id: `auto-${Date.now()}`,
        name: form.name,
        trigger: form.trigger,
        platform: form.platform,
        status: "draft",
        steps: form.steps,
        reached: 0,
        converted: 0,
      };
      setAutomations((prev) => [...prev, newAuto]);
      toast({ title: "Automation aangemaakt", description: "Stel je flow samen en activeer wanneer je klaar bent." });
    }
    setForm({ name: "", trigger: "dm_keyword", platform: "instagram", steps: 1 });
    setEditIdx(-1);
    setOpen(false);
  };

  const toggleStatus = (idx: number) => {
    setAutomations((prev) =>
      prev.map((a, i) =>
        i === idx ? { ...a, status: a.status === "active" ? "paused" : "active" } : a
      )
    );
  };

  const deleteAuto = (idx: number) => {
    setAutomations((prev) => prev.filter((_, i) => i !== idx));
    toast({ title: "Automation verwijderd" });
  };

  const statusColors: Record<string, string> = {
    active: "bg-primary/10 text-primary",
    paused: "bg-secondary text-muted-foreground",
    draft: "bg-accent text-accent-foreground",
  };

  const statusLabels: Record<string, string> = {
    active: "Actief",
    paused: "Gepauzeerd",
    draft: "Concept",
  };

  return (
    <div className="flex-1 p-8 overflow-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-semibold text-foreground">Automations</h1>
          <p className="text-muted-foreground mt-1">Maak chatflows en automatische reacties voor je social media.</p>
        </div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setEditIdx(-1); setForm({ name: "", trigger: "dm_keyword", platform: "instagram", steps: 1 }); } }}>
          <DialogTrigger asChild>
            <Button className="gap-1.5"><Plus className="w-4 h-4" /> Nieuwe Flow</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">{editIdx >= 0 ? "Flow Bewerken" : "Nieuwe Automation Flow"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <Label>Naam</Label>
                <Input placeholder="Bijv. Welkomstbericht nieuwe volger" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <Label>Trigger</Label>
                <Select value={form.trigger} onValueChange={(v) => setForm({ ...form, trigger: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {triggerOptions.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Platform</Label>
                <Select value={form.platform} onValueChange={(v) => setForm({ ...form, platform: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="all">Alle Platformen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Aantal stappen</Label>
                <Input type="number" min={1} max={20} value={form.steps} onChange={(e) => setForm({ ...form, steps: Number(e.target.value) })} />
              </div>
              <Button onClick={save} className="w-full">{editIdx >= 0 ? "Opslaan" : "Aanmaken"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="glass-card rounded-xl p-5">
          <p className="text-sm text-muted-foreground">Actieve Flows</p>
          <p className="text-2xl font-semibold text-foreground mt-1">{automations.filter((a) => a.status === "active").length}</p>
        </div>
        <div className="glass-card rounded-xl p-5">
          <p className="text-sm text-muted-foreground">Totaal Bereikt</p>
          <p className="text-2xl font-semibold text-foreground mt-1">{automations.reduce((s, a) => s + a.reached, 0)}</p>
        </div>
        <div className="glass-card rounded-xl p-5">
          <p className="text-sm text-muted-foreground">Conversies</p>
          <p className="text-2xl font-semibold text-foreground mt-1">{automations.reduce((s, a) => s + a.converted, 0)}</p>
        </div>
      </div>

      {automations.length > 0 ? (
        <div className="space-y-3">
          {automations.map((auto, i) => {
            const PlatformIcon = platformIcons[auto.platform] || Workflow;
            const triggerLabel = triggerOptions.find((t) => t.value === auto.trigger)?.label || auto.trigger;
            return (
              <div key={auto.id} className="glass-card rounded-xl p-5 animate-fade-in group" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <PlatformIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{auto.name}</p>
                      <Badge className={`text-[10px] ${statusColors[auto.status]}`}>{statusLabels[auto.status]}</Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span>{triggerLabel}</span>
                      <ArrowRight className="w-3 h-3" />
                      <span>{auto.steps} stap(pen)</span>
                      <span>·</span>
                      <span>{auto.reached} bereikt</span>
                      <span>·</span>
                      <span>{auto.converted} conversies</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => toggleStatus(i)}>
                      {auto.status === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setForm({ name: auto.name, trigger: auto.trigger, platform: auto.platform, steps: auto.steps }); setEditIdx(i); setOpen(true); }}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => deleteAuto(i)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card rounded-xl p-12 text-center">
          <Workflow className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground mb-1">Geen automation flows</p>
          <p className="text-xs text-muted-foreground mb-4">Maak je eerste chatflow om automatische DM's, comment replies en meer in te stellen.</p>
          <Button variant="outline" onClick={() => setOpen(true)} className="gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Eerste Flow Aanmaken
          </Button>
        </div>
      )}
    </div>
  );
};

export default Automations;
