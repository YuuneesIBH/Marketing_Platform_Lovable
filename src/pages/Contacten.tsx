import { useMemo, useState } from "react";
import { Contact, Plus, Search, Trash2, Pencil, Instagram, Music2, Tag, Filter } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";
import { usePersistedState } from "@/lib/api";
import type { ContactItem } from "@/lib/app-types";

const Contacten = () => {
  const { t } = useLanguage();
  const { value: contacts, setValue: setContacts, loading } = usePersistedState<ContactItem[]>("contacts", []);
  const [search, setSearch] = useState("");
  const [filterTag, setFilterTag] = useState("all");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    username: "",
    platform: "instagram" as "instagram" | "tiktok",
    tags: "",
    source: "",
  });

  const resetForm = () => {
    setForm({ name: "", username: "", platform: "instagram", tags: "", source: "" });
    setEditId(null);
  };

  const allTags = useMemo(() => [...new Set(contacts.flatMap((contact) => contact.tags))], [contacts]);

  const filtered = contacts
    .filter(
      (contact) =>
        contact.name.toLowerCase().includes(search.toLowerCase()) ||
        contact.username.toLowerCase().includes(search.toLowerCase()),
    )
    .filter((contact) => filterTag === "all" || contact.tags.includes(filterTag));

  const save = async () => {
    if (!form.name.trim() || !form.username.trim()) return;
    const tags = form.tags.split(",").map((value) => value.trim()).filter(Boolean);

    if (editId) {
      await setContacts((prev) =>
        prev.map((contact) =>
          contact.id === editId
            ? {
                ...contact,
                name: form.name,
                username: form.username.startsWith("@") ? form.username : `@${form.username}`,
                platform: form.platform,
                tags,
                source: form.source,
              }
            : contact,
        ),
      );
      toast({ title: t("contacts.updated") });
    } else {
      await setContacts((prev) => [
        ...prev,
        {
          id: `c-${Date.now()}`,
          name: form.name,
          username: form.username.startsWith("@") ? form.username : `@${form.username}`,
          platform: form.platform,
          tags,
          subscribed: true,
          lastInteraction: new Date().toISOString(),
          source: form.source || t("contacts.manual"),
        },
      ]);
      toast({ title: t("contacts.created") });
    }

    resetForm();
    setOpen(false);
  };

  const deleteContact = async (id: string) => {
    const name = contacts.find((contact) => contact.id === id)?.name ?? "";
    await setContacts((prev) => prev.filter((contact) => contact.id !== id));
    toast({ title: t("contacts.deleted"), description: name });
  };

  const PlatformIcon = ({ platform }: { platform: string }) => {
    const Icon = platform === "instagram" ? Instagram : Music2;
    return <Icon className="h-3.5 w-3.5" />;
  };

  return (
    <div className="flex-1 overflow-auto p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-foreground">{t("contacts.title")}</h1>
          <p className="mt-1 text-muted-foreground">{t("contacts.subtitle")}</p>
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
              <Plus className="h-4 w-4" /> {t("contacts.addContact")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">
                {editId ? t("contacts.editContact") : t("contacts.addContact")}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-2 space-y-4">
              <div>
                <Label>{t("team.name")}</Label>
                <Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
              </div>
              <div>
                <Label>{t("messages.username")}</Label>
                <Input value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} />
              </div>
              <div>
                <Label>{t("contacts.platform")}</Label>
                <Select
                  value={form.platform}
                  onValueChange={(value) => setForm({ ...form, platform: value as "instagram" | "tiktok" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{t("contacts.tags")}</Label>
                <Input
                  placeholder="vip, creator, lead"
                  value={form.tags}
                  onChange={(event) => setForm({ ...form, tags: event.target.value })}
                />
              </div>
              <div>
                <Label>{t("contacts.source")}</Label>
                <Input
                  placeholder={t("contacts.manual")}
                  value={form.source}
                  onChange={(event) => setForm({ ...form, source: event.target.value })}
                />
              </div>
              <Button onClick={() => void save()} className="w-full">
                {editId ? t("common.save") : t("common.add")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6 flex gap-3">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("contacts.searchPlaceholder")}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
          />
        </div>
        {allTags.length > 0 && (
          <Select value={filterTag} onValueChange={setFilterTag}>
            <SelectTrigger className="w-44">
              <Filter className="mr-1.5 h-3.5 w-3.5" />
              <SelectValue placeholder={t("contacts.filterByTag")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("contacts.allTags")}</SelectItem>
              {allTags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {loading && contacts.length === 0 ? (
        <div className="glass-card rounded-xl p-10 text-center text-sm text-muted-foreground">
          Contacten worden geladen...
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered.map((contact, index) => (
            <div
              key={contact.id}
              className="glass-card group flex items-center gap-4 rounded-xl p-4"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                  {contact.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{contact.name}</p>
                  <PlatformIcon platform={contact.platform} />
                </div>
                <p className="text-xs text-muted-foreground">
                  {contact.username} · {contact.source}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                {contact.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[10px]">
                    <Tag className="mr-0.5 h-2.5 w-2.5" />
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => {
                    setForm({
                      name: contact.name,
                      username: contact.username,
                      platform: contact.platform,
                      tags: contact.tags.join(", "),
                      source: contact.source,
                    });
                    setEditId(contact.id);
                    setOpen(true);
                  }}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-destructive"
                  onClick={() => void deleteContact(contact.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-xl p-12 text-center">
          <Contact className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
          <p className="mb-1 text-sm font-medium text-foreground">{t("contacts.noContacts")}</p>
          <p className="mb-4 text-xs text-muted-foreground">{t("contacts.noContactsBody")}</p>
          <Button variant="outline" onClick={() => setOpen(true)} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> {t("contacts.addContact")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Contacten;
