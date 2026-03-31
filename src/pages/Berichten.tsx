import { useState } from "react";
import { MessageCircle, Send, Instagram, Music2, Search, Circle, Plus, Trash2, Link2, Unlink, CheckCircle2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type Platform = "instagram" | "tiktok";

interface ConnectedAccount {
  id: string;
  platform: Platform;
  username: string;
  displayName: string;
  connected: boolean;
  connectedAt: Date;
}

interface Message {
  id: string;
  text: string;
  sender: "customer" | "team";
  timestamp: Date;
}

interface Conversation {
  id: string;
  name: string;
  platform: Platform;
  accountId: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unread: boolean;
  messages: Message[];
}

const platformConfig: Record<Platform, { icon: React.ElementType; label: string; color: string; gradient: string }> = {
  instagram: { icon: Instagram, label: "Instagram", color: "bg-gradient-to-br from-purple-500 to-pink-500", gradient: "from-purple-500 to-pink-500" },
  tiktok: { icon: Music2, label: "TikTok", color: "bg-foreground", gradient: "from-gray-800 to-gray-950" },
};

const Berichten = () => {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [reply, setReply] = useState("");
  const [search, setSearch] = useState("");
  const [filterPlatform, setFilterPlatform] = useState<Platform | "all">("all");
  const [showAccountDialog, setShowAccountDialog] = useState(false);
  const [newAccount, setNewAccount] = useState({ platform: "instagram" as Platform, username: "", displayName: "" });
  const { toast } = useToast();

  const selected = conversations.find((c) => c.id === selectedId);

  const filtered = conversations
    .filter((c) => filterPlatform === "all" || c.platform === filterPlatform)
    .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.lastMessage.toLowerCase().includes(search.toLowerCase()));

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, unread: false } : c)));
  };

  const handleSend = () => {
    if (!reply.trim() || !selected) return;
    const newMsg: Message = { id: `m${Date.now()}`, text: reply, sender: "team", timestamp: new Date() };
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedId ? { ...c, messages: [...c.messages, newMsg], lastMessage: reply, lastMessageTime: new Date() } : c
      )
    );
    setReply("");
    toast({ title: "Bericht verstuurd", description: `Antwoord naar ${selected.name} via ${platformConfig[selected.platform].label}` });
  };

  const handleConnectAccount = () => {
    if (!newAccount.username.trim()) return;
    const account: ConnectedAccount = {
      id: `acc-${Date.now()}`,
      platform: newAccount.platform,
      username: newAccount.username.startsWith("@") ? newAccount.username : `@${newAccount.username}`,
      displayName: newAccount.displayName || newAccount.username,
      connected: true,
      connectedAt: new Date(),
    };
    setAccounts((prev) => [...prev, account]);
    setNewAccount({ platform: "instagram", username: "", displayName: "" });
    setShowAccountDialog(false);
    toast({ title: "Account gekoppeld", description: `${platformConfig[account.platform].label} account ${account.username} is verbonden` });
  };

  const handleDisconnectAccount = (id: string) => {
    const acc = accounts.find((a) => a.id === id);
    setAccounts((prev) => prev.filter((a) => a.id !== id));
    setConversations((prev) => prev.filter((c) => c.accountId !== id));
    if (acc) toast({ title: "Account ontkoppeld", description: `${acc.username} is verwijderd` });
  };

  const handleAddDemoConversation = (accountId: string) => {
    const acc = accounts.find((a) => a.id === accountId);
    if (!acc) return;
    const conv: Conversation = {
      id: `conv-${Date.now()}`,
      name: `Demo Klant`,
      platform: acc.platform,
      accountId: acc.id,
      avatar: "DK",
      lastMessage: "Hoi! Ik heb een vraag over jullie producten 😊",
      lastMessageTime: new Date(),
      unread: true,
      messages: [
        { id: `m${Date.now()}`, text: "Hoi! Ik heb een vraag over jullie producten 😊", sender: "customer", timestamp: new Date() },
      ],
    };
    setConversations((prev) => [...prev, conv]);
    toast({ title: "Demo gesprek aangemaakt", description: `Nieuw gesprek via ${acc.username}` });
  };

  const formatTime = (d: Date) => {
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
    if (diffDays === 0) return d.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
    if (diffDays === 1) return "Gisteren";
    return d.toLocaleDateString("nl-NL", { day: "numeric", month: "short" });
  };

  const unreadCount = conversations.filter((c) => c.unread).length;

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-semibold text-foreground">Berichten</h1>
            {unreadCount > 0 && <Badge className="bg-primary text-primary-foreground text-xs">{unreadCount} nieuw</Badge>}
          </div>
          <div className="flex gap-2 items-center">
            <div className="flex gap-1.5 mr-2">
              <Button size="sm" variant={filterPlatform === "all" ? "default" : "outline"} onClick={() => setFilterPlatform("all")}>Alle</Button>
              {(Object.keys(platformConfig) as Platform[]).map((p) => {
                const cfg = platformConfig[p];
                const count = accounts.filter((a) => a.platform === p).length;
                return (
                  <Button key={p} size="sm" variant={filterPlatform === p ? "default" : "outline"} onClick={() => setFilterPlatform(p)} className="gap-1.5">
                    <cfg.icon className="w-3.5 h-3.5" />
                    {cfg.label}
                    {count > 0 && <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">{count}</Badge>}
                  </Button>
                );
              })}
            </div>
            <Dialog open={showAccountDialog} onOpenChange={setShowAccountDialog}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  Account koppelen
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Social Media Account Koppelen</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div>
                    <Label>Platform</Label>
                    <Select value={newAccount.platform} onValueChange={(v) => setNewAccount({ ...newAccount, platform: v as Platform })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {(Object.keys(platformConfig) as Platform[]).map((p) => {
                          const cfg = platformConfig[p];
                          return (
                            <SelectItem key={p} value={p}>
                              <span className="flex items-center gap-2">
                                <cfg.icon className="w-4 h-4" />
                                {cfg.label}
                              </span>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Gebruikersnaam</Label>
                    <Input placeholder="@oppaseoul" value={newAccount.username} onChange={(e) => setNewAccount({ ...newAccount, username: e.target.value })} />
                  </div>
                  <div>
                    <Label>Weergavenaam</Label>
                    <Input placeholder="Oppa Seoul Official" value={newAccount.displayName} onChange={(e) => setNewAccount({ ...newAccount, displayName: e.target.value })} />
                  </div>
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-secondary/50">
                    <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <p className="text-xs text-muted-foreground">
                      Dit koppelt de UI aan jouw account. Voor echte DM-integratie zijn API-keys nodig via de platforminstellingen.
                    </p>
                  </div>
                  <Button onClick={handleConnectAccount} disabled={!newAccount.username.trim()} className="w-full gap-2">
                    <Link2 className="w-4 h-4" />
                    Account koppelen
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: accounts + conversations */}
        <aside className="w-80 border-r border-border bg-card flex flex-col shrink-0">
          {/* Connected accounts strip */}
          {accounts.length > 0 && (
            <div className="p-3 border-b border-border">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-2">Gekoppelde accounts</p>
              <div className="space-y-1.5">
                {accounts.map((acc) => {
                  const cfg = platformConfig[acc.platform];
                  return (
                    <div key={acc.id} className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50 group">
                      <span className={`w-6 h-6 rounded-full bg-gradient-to-br ${cfg.gradient} flex items-center justify-center shrink-0`}>
                        <cfg.icon className="w-3 h-3 text-primary-foreground" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{acc.displayName}</p>
                        <p className="text-[10px] text-muted-foreground">{acc.username}</p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleAddDemoConversation(acc.id)}>
                          <Plus className="w-3 h-3" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => handleDisconnectAccount(acc.id)}>
                          <Unlink className="w-3 h-3" />
                        </Button>
                      </div>
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Search */}
          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Zoek gesprek..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
            </div>
          </div>

          <ScrollArea className="flex-1">
            {filtered.map((c) => {
              const cfg = platformConfig[c.platform];
              const acc = accounts.find((a) => a.id === c.accountId);
              const isSelected = c.id === selectedId;
              return (
                <button
                  key={c.id}
                  onClick={() => handleSelect(c.id)}
                  className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${isSelected ? "bg-secondary" : "hover:bg-secondary/50"}`}
                >
                  <div className="relative shrink-0">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-muted text-foreground text-xs font-semibold">{c.avatar}</AvatarFallback>
                    </Avatar>
                    <span className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full ${cfg.color} flex items-center justify-center`}>
                      <cfg.icon className="w-2.5 h-2.5 text-primary-foreground" />
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm truncate ${c.unread ? "font-semibold text-foreground" : "font-medium text-foreground"}`}>{c.name}</span>
                      <span className="text-[11px] text-muted-foreground shrink-0 ml-2">{formatTime(c.lastMessageTime)}</span>
                    </div>
                    <p className={`text-xs truncate mt-0.5 ${c.unread ? "text-foreground font-medium" : "text-muted-foreground"}`}>{c.lastMessage}</p>
                    {acc && <p className="text-[10px] text-muted-foreground mt-0.5">{acc.username}</p>}
                  </div>
                  {c.unread && <Circle className="w-2.5 h-2.5 fill-primary text-primary shrink-0 mt-1.5" />}
                </button>
              );
            })}
            {filtered.length === 0 && accounts.length === 0 && (
              <div className="text-center py-12 px-4">
                <Link2 className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground mb-1">Geen accounts gekoppeld</p>
                <p className="text-xs text-muted-foreground mb-4">Koppel je Instagram of TikTok account om DM's te beheren</p>
                <Button size="sm" variant="outline" onClick={() => setShowAccountDialog(true)} className="gap-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  Account koppelen
                </Button>
              </div>
            )}
            {filtered.length === 0 && accounts.length > 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">Geen gesprekken gevonden</p>
            )}
          </ScrollArea>
        </aside>

        {/* Chat panel */}
        {selected ? (
          <div className="flex-1 flex flex-col">
            <div className="border-b border-border bg-card px-6 py-3 flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-muted text-foreground text-xs font-semibold">{selected.avatar}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{selected.name}</p>
                <div className="flex items-center gap-1.5">
                  {(() => {
                    const cfg = platformConfig[selected.platform];
                    const acc = accounts.find((a) => a.id === selected.accountId);
                    return (
                      <>
                        <cfg.icon className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{cfg.label}</span>
                        {acc && <span className="text-xs text-muted-foreground">· {acc.username}</span>}
                      </>
                    );
                  })()}
                </div>
              </div>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => {
                setConversations((prev) => prev.filter((c) => c.id !== selectedId));
                setSelectedId("");
                toast({ title: "Gesprek verwijderd" });
              }}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <ScrollArea className="flex-1 p-6">
              <div className="max-w-2xl mx-auto space-y-4">
                {selected.messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === "team" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                      msg.sender === "team" ? "bg-primary text-primary-foreground rounded-br-md" : "bg-secondary text-foreground rounded-bl-md"
                    }`}>
                      <p>{msg.text}</p>
                      <p className={`text-[10px] mt-1 ${msg.sender === "team" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                        {msg.timestamp.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t border-border bg-card p-4">
              <div className="flex gap-2 max-w-2xl mx-auto">
                <Input
                  placeholder={`Antwoord via ${platformConfig[selected.platform].label}...`}
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  className="flex-1"
                />
                <Button onClick={handleSend} disabled={!reply.trim()} className="gap-2">
                  <Send className="w-4 h-4" />
                  Verstuur
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Selecteer een gesprek</p>
              <p className="text-xs mt-1">of koppel een social media account om te beginnen</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Berichten;
