import { useState } from "react";
import { Radio, Plus, Trash2, Pencil, Send, Instagram, Music2, Clock, Users } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";
import { usePersistedState } from "@/lib/api";
import type { Broadcast, MultiPlatform } from "@/lib/app-types";

const Broadcasts = () => {
  const { t, locale } = useLanguage();
  const { value: broadcasts, setValue: setBroadcasts, loading } = usePersistedState<Broadcast[]>("broadcasts", []);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    message: "",
    platform: "instagram" as MultiPlatform,
    audience: "",
    scheduledAt: "",
  });

  const resetForm = () => {
    setForm({ name: "", message: "", platform: "instagram", audience: "", scheduledAt: "" });
    setEditId(null);
  };

  const save = async () => {
    if (!form.name.trim() || !form.message.trim()) return;

    if (editId) {
      await setBroadcasts((prev) =>
        prev.map((broadcast) =>
          broadcast.id === editId
            ? {
                ...broadcast,
                ...form,
                status: form.scheduledAt ? "scheduled" : "draft",
              }
            : broadcast,
        ),
      );
      toast({ title: t("broadcasts.updated") });
    } else {
      await setBroadcasts((prev) => [
        ...prev,
        {
          id: `bc-${Date.now()}`,
          name: form.name,
          message: form.message,
          platform: form.platform,
          audience: form.audience || t("broadcasts.allContacts"),
          status: form.scheduledAt ? "scheduled" : "draft",
          scheduledAt: form.scheduledAt,
          recipients: 0,
          opened: 0,
          clicked: 0,
        },
      ]);
      toast({ title: t("broadcasts.created") });
    }

    resetForm();
    setOpen(false);
  };

  const sendNow = async (id: string) => {
    await setBroadcasts((prev) =>
      prev.map((broadcast) =>
        broadcast.id === id ? { ...broadcast, status: "sent" } : broadcast,
      ),
    );
    toast({ title: t("broadcasts.sent") });
  };

  const deleteBroadcast = async (id: string) => {
    await setBroadcasts((prev) => prev.filter((broadcast) => broadcast.id !== id));
    toast({ title: t("broadcasts.deleted") });
  };

  const statusColors: Record<string, string> = {
    draft: "bg-secondary text-muted-foreground",
    scheduled: "bg-accent text-accent-foreground",
    sent: "bg-primary/10 text-primary",
  };

  return (
    <div className="flex-1 overflow-auto p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-foreground">{t("broadcasts.title")}</h1>
          <p className="mt-1 text-muted-foreground">{t("broadcasts.subtitle")}</p>
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
              <Plus className="h-4 w-4" /> {t("broadcasts.newBroadcast")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">
                {editId ? t("broadcasts.editBroadcast") : t("broadcasts.newBroadcast")}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-2 space-y-4">
              <div>
                <Label>{t("broadcasts.name")}</Label>
                <Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
              </div>
              <div>
                <Label>{t("broadcasts.message")}</Label>
                <Textarea rows={4} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} />
              </div>
              <div>
                <Label>{t("broadcasts.platform")}</Label>
                <Select value={form.platform} onValueChange={(value) => setForm({ ...form, platform: value as MultiPlatform })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="all">{t("common.allPlatforms")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{t("broadcasts.audience")}</Label>
                <Input value={form.audience} onChange={(event) => setForm({ ...form, audience: event.target.value })} />
              </div>
              <div>
                <Label>{t("broadcasts.schedule")}</Label>
                <Input type="datetime-local" value={form.scheduledAt} onChange={(event) => setForm({ ...form, scheduledAt: event.target.value })} />
              </div>
              <Button onClick={() => void save()} className="w-full">
                {editId ? t("common.save") : t("common.add")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-8 grid grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-5">
          <p className="text-sm text-muted-foreground">{t("broadcasts.sent")}</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">
            {broadcasts.filter((broadcast) => broadcast.status === "sent").length}
          </p>
        </div>
        <div className="glass-card rounded-xl p-5">
          <p className="text-sm text-muted-foreground">{t("broadcasts.scheduled")}</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">
            {broadcasts.filter((broadcast) => broadcast.status === "scheduled").length}
          </p>
        </div>
        <div className="glass-card rounded-xl p-5">
          <p className="text-sm text-muted-foreground">{t("broadcasts.draft")}</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">
            {broadcasts.filter((broadcast) => broadcast.status === "draft").length}
          </p>
        </div>
      </div>

      {loading && broadcasts.length === 0 ? (
        <div className="glass-card rounded-xl p-10 text-center text-sm text-muted-foreground">
          Broadcasts worden geladen...
        </div>
      ) : broadcasts.length > 0 ? (
        <div className="space-y-3">
          {broadcasts.map((broadcast, index) => {
            const PlatformIcon =
              broadcast.platform === "instagram" ? Instagram : broadcast.platform === "tiktok" ? Music2 : Radio;

            return (
              <div key={broadcast.id} className="glass-card group rounded-xl p-5" style={{ animationDelay: `${index * 60}ms` }}>
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <PlatformIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{broadcast.name}</p>
                      <Badge className={`text-[10px] ${statusColors[broadcast.status]}`}>
                        {broadcast.status === "draft"
                          ? t("broadcasts.draft")
                          : broadcast.status === "scheduled"
                            ? t("broadcasts.scheduled")
                            : t("broadcasts.sent")}
                      </Badge>
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{broadcast.message}</p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {broadcast.audience}
                      </span>
                      {broadcast.scheduledAt && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(broadcast.scheduledAt).toLocaleString(locale === "nl" ? "nl-NL" : "en-US", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    {broadcast.status !== "sent" && (
                      <Button size="sm" variant="outline" className="h-7 gap-1 text-xs" onClick={() => void sendNow(broadcast.id)}>
                        <Send className="h-3 w-3" /> {t("broadcasts.sendNow")}
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => {
                        setForm({
                          name: broadcast.name,
                          message: broadcast.message,
                          platform: broadcast.platform,
                          audience: broadcast.audience,
                          scheduledAt: broadcast.scheduledAt,
                        });
                        setEditId(broadcast.id);
                        setOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => void deleteBroadcast(broadcast.id)}>
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
          <Radio className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
          <p className="mb-1 text-sm font-medium text-foreground">{t("broadcasts.emptyTitle")}</p>
          <p className="mb-4 text-xs text-muted-foreground">{t("broadcasts.emptyBody")}</p>
          <Button variant="outline" onClick={() => setOpen(true)} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> {t("broadcasts.firstBroadcast")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Broadcasts;
