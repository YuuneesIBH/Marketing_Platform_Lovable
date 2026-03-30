import { useState } from "react";
import { MessageCircle, Send, Instagram, Music2, Facebook, Search, Circle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

type Platform = "instagram" | "tiktok" | "facebook";

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
  avatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unread: boolean;
  messages: Message[];
}

const platformConfig: Record<Platform, { icon: React.ElementType; label: string; color: string }> = {
  instagram: { icon: Instagram, label: "Instagram", color: "bg-gradient-to-br from-purple-500 to-pink-500" },
  tiktok: { icon: Music2, label: "TikTok", color: "bg-foreground" },
  facebook: { icon: Facebook, label: "Facebook", color: "bg-blue-600" },
};

const initialConversations: Conversation[] = [];

const Berichten = () => {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [selectedId, setSelectedId] = useState<string>("1");
  const [reply, setReply] = useState("");
  const [search, setSearch] = useState("");
  const [filterPlatform, setFilterPlatform] = useState<Platform | "all">("all");
  const { toast } = useToast();

  const selected = conversations.find((c) => c.id === selectedId);

  const filtered = conversations
    .filter((c) => filterPlatform === "all" || c.platform === filterPlatform)
    .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.lastMessage.toLowerCase().includes(search.toLowerCase()));

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: false } : c))
    );
  };

  const handleSend = () => {
    if (!reply.trim() || !selected) return;
    const newMsg: Message = {
      id: `m${Date.now()}`,
      text: reply,
      sender: "team",
      timestamp: new Date(),
    };
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedId
          ? { ...c, messages: [...c.messages, newMsg], lastMessage: reply, lastMessageTime: new Date() }
          : c
      )
    );
    setReply("");
    toast({ title: "Bericht verstuurd", description: `Antwoord naar ${selected.name} via ${platformConfig[selected.platform].label}` });
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
            {unreadCount > 0 && (
              <Badge className="bg-primary text-primary-foreground text-xs">{unreadCount} nieuw</Badge>
            )}
          </div>
          {/* Platform filter */}
          <div className="flex gap-2">
            <Button size="sm" variant={filterPlatform === "all" ? "default" : "outline"} onClick={() => setFilterPlatform("all")}>
              Alle
            </Button>
            {(Object.keys(platformConfig) as Platform[]).map((p) => {
              const cfg = platformConfig[p];
              return (
                <Button key={p} size="sm" variant={filterPlatform === p ? "default" : "outline"} onClick={() => setFilterPlatform(p)} className="gap-1.5">
                  <cfg.icon className="w-3.5 h-3.5" />
                  {cfg.label}
                </Button>
              );
            })}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Conversation list */}
        <aside className="w-80 border-r border-border bg-card flex flex-col shrink-0">
          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Zoek gesprek..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
            </div>
          </div>
          <ScrollArea className="flex-1">
            {filtered.map((c) => {
              const cfg = platformConfig[c.platform];
              const isSelected = c.id === selectedId;
              return (
                <button
                  key={c.id}
                  onClick={() => handleSelect(c.id)}
                  className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${
                    isSelected ? "bg-secondary" : "hover:bg-secondary/50"
                  }`}
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
                  </div>
                  {c.unread && <Circle className="w-2.5 h-2.5 fill-primary text-primary shrink-0 mt-1.5" />}
                </button>
              );
            })}
            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">Geen gesprekken gevonden</p>
            )}
          </ScrollArea>
        </aside>

        {/* Chat panel */}
        {selected ? (
          <div className="flex-1 flex flex-col">
            {/* Chat header */}
            <div className="border-b border-border bg-card px-6 py-3 flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-muted text-foreground text-xs font-semibold">{selected.avatar}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-foreground">{selected.name}</p>
                <div className="flex items-center gap-1.5">
                  {(() => {
                    const cfg = platformConfig[selected.platform];
                    return (
                      <>
                        <cfg.icon className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{cfg.label}</span>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-6">
              <div className="max-w-2xl mx-auto space-y-4">
                {selected.messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === "team" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                      msg.sender === "team"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-secondary text-foreground rounded-bl-md"
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

            {/* Reply box */}
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
            <p>Selecteer een gesprek om te beginnen</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Berichten;
