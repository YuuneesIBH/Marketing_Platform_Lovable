import { useState, type ElementType } from "react";
import { Workflow, Plus, Pencil, Trash2, Play, Pause, Instagram, Music2, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { usePersistedState } from "@/lib/api";
import type { Automation, MultiPlatform } from "@/lib/app-types";

const triggerOptions = [
  { value: "dm_keyword", label: "DM Keyword" },
  { value: "comment_keyword", label: "Comment Keyword" },
  { value: "story_reply", label: "Story Reply" },
  { value: "new_follower", label: "Nieuwe Volger" },
  { value: "story_mention", label: "Story Mention" },
];

const platformIcons: Record<string, ElementType> = {
  instagram: Instagram,
  tiktok: Music2,
  all: Workflow,
};

const Automations = () => {
  const { value: automations, setValue: setAutomations, loading } = usePersistedState<Automation[]>("automations", []);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    trigger: "dm_keyword",
    platform: "instagram" as MultiPlatform,
    steps: 1,
  });

  const resetForm = () => {
    setForm({ name: "", trigger: "dm_keyword", platform: "instagram", steps: 1 });
    setEditId(null);
  };

  const save = async () => {
    if (!form.name.trim()) return;

    if (editId) {
      await setAutomations((prev) =>
        prev.map((automation) =>
          automation.id === editId ? { ...automation, ...form } : automation,
        ),
      );
      toast({ title: "Automation bijgewerkt" });
    } else {
      await setAutomations((prev) => [
        ...prev,
        {
          id: `auto-${Date.now()}`,
          name: form.name,
          trigger: form.trigger,
          platform: form.platform,
          status: "draft",
          steps: form.steps,
          reached: 0,
          converted: 0,
        },
      ]);
      toast({ title: "Automation aangemaakt" });
    }

    resetForm();
    setOpen(false);
  };

  const toggleStatus = async (id: string) => {
    await setAutomations((prev) =>
      prev.map((automation) =>
        automation.id === id
          ? {
              ...automation,
              status: automation.status === "active" ? "paused" : "active",
            }
          : automation,
      ),
    );
  };

  const deleteAuto = async (id: string) => {
    await setAutomations((prev) => prev.filter((automation) => automation.id !== id));
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
    <div className="flex-1 overflow-auto p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-semibold text-foreground">Automations</h1>
          <p className="mt-1 text-muted-foreground">Flows worden nu persistent in Postgres opgeslagen.</p>
        </div>
        <Dialog
          open={open}
          onOpenChange={(nextOpen) => {
            setOpen(nextOpen);
            if (!nextOpen) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="gap-1.5">
              <Plus className="h-4 w-4" /> Nieuwe Flow
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">
                {editId ? "Flow Bewerken" : "Nieuwe Automation Flow"}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-2 space-y-4">
              <div>
                <Label>Naam</Label>
                <Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
              </div>
              <div>
                <Label>Trigger</Label>
                <Select value={form.trigger} onValueChange={(value) => setForm({ ...form, trigger: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {triggerOptions.map((trigger) => (
                      <SelectItem key={trigger.value} value={trigger.value}>
                        {trigger.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Platform</Label>
                <Select value={form.platform} onValueChange={(value) => setForm({ ...form, platform: value as MultiPlatform })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="all">Alle Platformen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Aantal stappen</Label>
                <Input
                  type="number"
                  min={1}
                  max={20}
                  value={form.steps}
                  onChange={(event) => setForm({ ...form, steps: Number(event.target.value) })}
                />
              </div>
              <Button onClick={() => void save()} className="w-full">
                {editId ? "Opslaan" : "Aanmaken"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-8 grid grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-5">
          <p className="text-sm text-muted-foreground">Actieve Flows</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">
            {automations.filter((automation) => automation.status === "active").length}
          </p>
        </div>
        <div className="glass-card rounded-xl p-5">
          <p className="text-sm text-muted-foreground">Totaal Bereikt</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">
            {automations.reduce((sum, automation) => sum + automation.reached, 0)}
          </p>
        </div>
        <div className="glass-card rounded-xl p-5">
          <p className="text-sm text-muted-foreground">Conversies</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">
            {automations.reduce((sum, automation) => sum + automation.converted, 0)}
          </p>
        </div>
      </div>

      {loading && automations.length === 0 ? (
        <div className="glass-card rounded-xl p-10 text-center text-sm text-muted-foreground">
          Automations worden geladen...
        </div>
      ) : automations.length > 0 ? (
        <div className="space-y-3">
          {automations.map((automation, index) => {
            const PlatformIcon = platformIcons[automation.platform] || Workflow;
            const triggerLabel =
              triggerOptions.find((trigger) => trigger.value === automation.trigger)?.label ??
              automation.trigger;

            return (
              <div key={automation.id} className="glass-card group rounded-xl p-5" style={{ animationDelay: `${index * 60}ms` }}>
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <PlatformIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{automation.name}</p>
                      <Badge className={`text-[10px] ${statusColors[automation.status]}`}>
                        {statusLabels[automation.status]}
                      </Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{triggerLabel}</span>
                      <ArrowRight className="h-3 w-3" />
                      <span>{automation.steps} stap(pen)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => void toggleStatus(automation.id)}>
                      {automation.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => {
                        setForm({
                          name: automation.name,
                          trigger: automation.trigger,
                          platform: automation.platform,
                          steps: automation.steps,
                        });
                        setEditId(automation.id);
                        setOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => void deleteAuto(automation.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card rounded-xl p-12 text-center">
          <Workflow className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
          <p className="mb-1 text-sm font-medium text-foreground">Geen automation flows</p>
          <p className="mb-4 text-xs text-muted-foreground">Maak je eerste chatflow aan. Die blijft nu bewaard in de database.</p>
          <Button variant="outline" onClick={() => setOpen(true)} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Eerste Flow Aanmaken
          </Button>
        </div>
      )}
    </div>
  );
};

export default Automations;
