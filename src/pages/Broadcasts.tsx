import { useState } from "react";
import { Radio, Plus, Trash2, Pencil, Send, Instagram, Music2, Clock, Users } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface Broadcast {
  id: string;
  name: string;
  message: string;
  platform: "instagram" | "tiktok" | "all";
  audience: string;
  status: "draft" | "scheduled" | "sent";
  scheduledAt: string;
  recipients: number;
  opened: number;
  clicked: number;
}

const Broadcasts = () => {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [open, setOpen] = useState(false);
  const [editIdx, setEditIdx] = useState(-1);
  const [form, setForm] = useState({
    name: "",
    message: "",
    platform: "instagram" as "instagram" | "tiktok" | "all",
    audience: "",
    scheduledAt: "",
  });

  const save = () => {
    if (!form.name.trim() || !form.message.trim()) return;
    if (editIdx >= 0) {
      setBroadcasts((prev) =>
        prev.map((b, i) =>
          i === editIdx ? { ...b, name: form.name, message: form.message, platform: form.platform, audience: form.audience, scheduledAt: form.scheduledAt, status: form.scheduledAt ? "scheduled" : "draft" } : b
        )
      );
      toast({ title: "Broadcast bijgewerkt" });
    } else {
      const newBroadcast: Broadcast = {
        id: `bc-${Date.now()}`,
        name: form.name,
        message: form.message,
        platform: form.platform,
        audience: form.audience || "Alle contacten",
        status: form.scheduledAt ? "scheduled" : "draft",
        scheduledAt: form.scheduledAt,
        recipients: 0,
        opened: 0,
        clicked: 0,
      };
      setBroadcasts((prev) => [...prev, newBroadcast]);
      toast({ title: "Broadcast aangemaakt" });
    }
    setForm({ name: "", message: "", platform: "instagram", audience: "", scheduledAt: "" });
    setEditIdx(-1);
    setOpen(false);
  };

  const sendNow = (idx: number) => {
    setBroadcasts((prev) =>
      prev.map((b, i) => (i === idx ? { ...b, status: "sent" as const } : b))
    );
    toast({ title: "Broadcast verstuurd!", description: "Je bericht wordt nu verzonden naar je contacten." });
  };

  const deleteBroadcast = (idx: number) => {
    setBroadcasts((prev) => prev.filter((_, i) => i !== idx));
    toast({ title: "Broadcast verwijderd" });
  };

  const statusColors: Record<string, string> = {
    draft: "bg-secondary text-muted-foreground",
    scheduled: "bg-accent text-accent-foreground",
    sent: "bg-primary/10 text-primary",
  };

  const statusLabels: Record<string, string> = {
    draft: "Concept",
    scheduled: "Ingepland",
    sent: "Verstuurd",
  };

  return (
    <div className="flex-1 p-8 overflow-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-semibold text-foreground">Broadcasts</h1>
          <p className="text-muted-foreground mt-1">Stuur massa-berichten naar je contacten via DM.</p>
        </div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setEditIdx(-1); setForm({ name: "", message: "", platform: "instagram", audience: "", scheduledAt: "" }); } }}>
          <DialogTrigger asChild>
            <Button className="gap-1.5"><Plus className="w-4 h-4" /> Nieuwe Broadcast</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">{editIdx >= 0 ? "Broadcast Bewerken" : "Nieuwe Broadcast"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div><Label>Naam</Label><Input placeholder="Bijv. Lancering aankondiging" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>Bericht</Label><Textarea placeholder="Typ je broadcast bericht..." rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
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
              <div><Label>Doelgroep / Tag</Label><Input placeholder="Bijv. VIP, klant (leeg = iedereen)" value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })} /></div>
              <div><Label>Inplannen (optioneel)</Label><Input type="datetime-local" value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} /></div>
              <Button onClick={save} className="w-full">{editIdx >= 0 ? "Opslaan" : "Aanmaken"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="glass-card rounded-xl p-5">
          <p className="text-sm text-muted-foreground">Verstuurd</p>
          <p className="text-2xl font-semibold text-foreground mt-1">{broadcasts.filter((b) => b.status === "sent").length}</p>
        </div>
        <div className="glass-card rounded-xl p-5">
          <p className="text-sm text-muted-foreground">Ingepland</p>
          <p className="text-2xl font-semibold text-foreground mt-1">{broadcasts.filter((b) => b.status === "scheduled").length}</p>
        </div>
        <div className="glass-card rounded-xl p-5">
          <p className="text-sm text-muted-foreground">Concepten</p>
          <p className="text-2xl font-semibold text-foreground mt-1">{broadcasts.filter((b) => b.status === "draft").length}</p>
        </div>
      </div>

      {broadcasts.length > 0 ? (
        <div className="space-y-3">
          {broadcasts.map((bc, i) => {
            const PlatformIcon = bc.platform === "instagram" ? Instagram : bc.platform === "tiktok" ? Music2 : Radio;
            return (
              <div key={bc.id} className="glass-card rounded-xl p-5 animate-fade-in group" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <PlatformIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{bc.name}</p>
                      <Badge className={`text-[10px] ${statusColors[bc.status]}`}>{statusLabels[bc.status]}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{bc.message}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{bc.audience}</span>
                      {bc.scheduledAt && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(bc.scheduledAt).toLocaleString("nl-NL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {bc.status !== "sent" && (
                      <Button size="sm" variant="outline" className="gap-1 h-7 text-xs" onClick={() => sendNow(i)}>
                        <Send className="w-3 h-3" /> Nu versturen
                      </Button>
                    )}
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => {
                      setForm({ name: bc.name, message: bc.message, platform: bc.platform, audience: bc.audience, scheduledAt: bc.scheduledAt });
                      setEditIdx(i);
                      setOpen(true);
                    }}><Pencil className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => deleteBroadcast(i)}>
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
          <Radio className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground mb-1">Geen broadcasts</p>
          <p className="text-xs text-muted-foreground mb-4">Maak een broadcast om een bericht te sturen naar meerdere contacten tegelijk.</p>
          <Button variant="outline" onClick={() => setOpen(true)} className="gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Eerste Broadcast
          </Button>
        </div>
      )}
    </div>
  );
};

export default Broadcasts;
