import { useState } from "react";
import { Contact, Plus, Search, Trash2, Pencil, Instagram, Music2, Tag, Filter } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";

interface ContactItem {
  id: string;
  name: string;
  username: string;
  platform: "instagram" | "tiktok";
  tags: string[];
  subscribed: boolean;
  lastInteraction: string;
  source: string;
}

const Contacten = () => {
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [search, setSearch] = useState("");
  const [filterTag, setFilterTag] = useState("all");
  const [open, setOpen] = useState(false);
  const [editIdx, setEditIdx] = useState(-1);
  const [form, setForm] = useState({
    name: "",
    username: "",
    platform: "instagram" as "instagram" | "tiktok",
    tags: "",
    source: "",
  });

  const allTags = [...new Set(contacts.flatMap((c) => c.tags))];

  const filtered = contacts
    .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.username.toLowerCase().includes(search.toLowerCase()))
    .filter((c) => filterTag === "all" || c.tags.includes(filterTag));

  const save = () => {
    if (!form.name.trim() || !form.username.trim()) return;
    const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
    if (editIdx >= 0) {
      setContacts((prev) =>
        prev.map((c, i) =>
          i === editIdx ? { ...c, name: form.name, username: form.username, platform: form.platform, tags, source: form.source } : c
        )
      );
      toast({ title: "Contact bijgewerkt" });
    } else {
      const newContact: ContactItem = {
        id: `c-${Date.now()}`,
        name: form.name,
        username: form.username.startsWith("@") ? form.username : `@${form.username}`,
        platform: form.platform,
        tags,
        subscribed: true,
        lastInteraction: "Zojuist",
        source: form.source || "Handmatig",
      };
      setContacts((prev) => [...prev, newContact]);
      toast({ title: "Contact toegevoegd" });
    }
    setForm({ name: "", username: "", platform: "instagram", tags: "", source: "" });
    setEditIdx(-1);
    setOpen(false);
  };

  const deleteContact = (idx: number) => {
    const name = contacts[idx].name;
    setContacts((prev) => prev.filter((_, i) => i !== idx));
    toast({ title: "Contact verwijderd", description: `${name} is verwijderd.` });
  };

  const PlatformIcon = ({ platform }: { platform: string }) => {
    const Icon = platform === "instagram" ? Instagram : Music2;
    return <Icon className="w-3.5 h-3.5" />;
  };

  return (
    <div className="flex-1 p-8 overflow-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-semibold text-foreground">Contacten</h1>
          <p className="text-muted-foreground mt-1">Beheer je subscribers en contacten van social media.</p>
        </div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setEditIdx(-1); setForm({ name: "", username: "", platform: "instagram", tags: "", source: "" }); } }}>
          <DialogTrigger asChild>
            <Button className="gap-1.5"><Plus className="w-4 h-4" /> Contact Toevoegen</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">{editIdx >= 0 ? "Contact Bewerken" : "Nieuw Contact"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div><Label>Naam</Label><Input placeholder="Bijv. Anna de Vries" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>Gebruikersnaam</Label><Input placeholder="@gebruiker" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} /></div>
              <div>
                <Label>Platform</Label>
                <Select value={form.platform} onValueChange={(v) => setForm({ ...form, platform: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Tags (komma-gescheiden)</Label><Input placeholder="klant, VIP, lead" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} /></div>
              <div><Label>Bron</Label><Input placeholder="Bijv. DM Keyword, Story Reply" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} /></div>
              <Button onClick={save} className="w-full">{editIdx >= 0 ? "Opslaan" : "Toevoegen"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="glass-card rounded-xl p-4">
          <p className="text-xs text-muted-foreground">Totaal Contacten</p>
          <p className="text-xl font-semibold text-foreground mt-1">{contacts.length}</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-xs text-muted-foreground">Instagram</p>
          <p className="text-xl font-semibold text-foreground mt-1">{contacts.filter((c) => c.platform === "instagram").length}</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-xs text-muted-foreground">TikTok</p>
          <p className="text-xl font-semibold text-foreground mt-1">{contacts.filter((c) => c.platform === "tiktok").length}</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-xs text-muted-foreground">Tags</p>
          <p className="text-xl font-semibold text-foreground mt-1">{allTags.length}</p>
        </div>
      </div>

      {/* Search & filter */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Zoek contact..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        {allTags.length > 0 && (
          <Select value={filterTag} onValueChange={setFilterTag}>
            <SelectTrigger className="w-40">
              <Filter className="w-3.5 h-3.5 mr-1.5" />
              <SelectValue placeholder="Filter op tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle tags</SelectItem>
              {allTags.map((tag) => (
                <SelectItem key={tag} value={tag}>{tag}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered.map((contact, i) => (
            <div key={contact.id} className="glass-card rounded-xl p-4 flex items-center gap-4 animate-fade-in group" style={{ animationDelay: `${i * 40}ms` }}>
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                  {contact.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{contact.name}</p>
                  <PlatformIcon platform={contact.platform} />
                </div>
                <p className="text-xs text-muted-foreground">{contact.username} · {contact.source}</p>
              </div>
              <div className="flex items-center gap-1.5">
                {contact.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[10px]">
                    <Tag className="w-2.5 h-2.5 mr-0.5" />{tag}
                  </Badge>
                ))}
              </div>
              <span className="text-xs text-muted-foreground shrink-0">{contact.lastInteraction}</span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => {
                  setForm({ name: contact.name, username: contact.username, platform: contact.platform, tags: contact.tags.join(", "), source: contact.source });
                  setEditIdx(i);
                  setOpen(true);
                }}><Pencil className="w-3.5 h-3.5" /></Button>
                <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => deleteContact(i)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-xl p-12 text-center">
          <Contact className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground mb-1">Geen contacten</p>
          <p className="text-xs text-muted-foreground mb-4">Voeg contacten toe of ze worden automatisch aangemaakt via je automation flows.</p>
          <Button variant="outline" onClick={() => setOpen(true)} className="gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Contact Toevoegen
          </Button>
        </div>
      )}
    </div>
  );
};

export default Contacten;
