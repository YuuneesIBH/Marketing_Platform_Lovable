import { useState, useRef, useEffect } from "react";
import { MessagesSquare, Send, Hash, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  text: string;
  sender: string;
  avatar: string;
  color: string;
  timestamp: Date;
}

interface Channel {
  id: string;
  name: string;
  description: string;
  messages: ChatMessage[];
}

const teamMembers: { name: string; avatar: string; color: string }[] = [];

const currentUser = teamMembers[0];

const initialChannels: Channel[] = [
  { id: "1", name: "algemeen", description: "Algemene teamupdates en aankondigingen", messages: [] },
  { id: "2", name: "campagnes", description: "Campagne planning en strategie", messages: [] },
  { id: "3", name: "content-ideeën", description: "Brainstorm en content inspiratie", messages: [] },
  { id: "4", name: "design", description: "Design feedback en assets", messages: [] },
];

const Groepschat = () => {
  const [channels, setChannels] = useState<Channel[]>(initialChannels);
  const [selectedId, setSelectedId] = useState("1");
  const [message, setMessage] = useState("");
  const [newChannelOpen, setNewChannelOpen] = useState(false);
  const [newChannel, setNewChannel] = useState({ name: "", description: "" });
  const { toast } = useToast();
  const bottomRef = useRef<HTMLDivElement>(null);

  const selected = channels.find((c) => c.id === selectedId)!;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selected?.messages.length]);

  const handleSend = () => {
    if (!message.trim()) return;
    const newMsg: ChatMessage = {
      id: `m${Date.now()}`,
      text: message,
      sender: currentUser.name,
      avatar: currentUser.avatar,
      color: currentUser.color,
      timestamp: new Date(),
    };
    setChannels((prev) =>
      prev.map((c) => (c.id === selectedId ? { ...c, messages: [...c.messages, newMsg] } : c))
    );
    setMessage("");
  };

  const handleCreateChannel = () => {
    if (!newChannel.name.trim()) {
      toast({ title: "Geef het kanaal een naam", variant: "destructive" });
      return;
    }
    const channel: Channel = {
      id: `ch${Date.now()}`,
      name: newChannel.name.toLowerCase().replace(/\s+/g, "-"),
      description: newChannel.description || "Nieuw kanaal",
      messages: [],
    };
    setChannels((prev) => [...prev, channel]);
    setSelectedId(channel.id);
    setNewChannel({ name: "", description: "" });
    setNewChannelOpen(false);
    toast({ title: "Kanaal aangemaakt", description: `#${channel.name} is klaar voor gebruik.` });
  };

  const handleDeleteChannel = (id: string) => {
    if (channels.length <= 1) return;
    const ch = channels.find((c) => c.id === id);
    setChannels((prev) => prev.filter((c) => c.id !== id));
    if (selectedId === id) setSelectedId(channels.find((c) => c.id !== id)!.id);
    toast({ title: "Kanaal verwijderd", description: `#${ch?.name} is verwijderd.` });
  };

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });

  const formatDate = (d: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
    if (diff === 0) return "Vandaag";
    if (diff === 1) return "Gisteren";
    return d.toLocaleDateString("nl-NL", { day: "numeric", month: "long" });
  };

  // Group messages by date
  const groupedMessages: { date: string; messages: ChatMessage[] }[] = [];
  selected.messages.forEach((msg) => {
    const dateStr = formatDate(msg.timestamp);
    const last = groupedMessages[groupedMessages.length - 1];
    if (last && last.date === dateStr) {
      last.messages.push(msg);
    } else {
      groupedMessages.push({ date: dateStr, messages: [msg] });
    }
  });

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center gap-3">
          <MessagesSquare className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-semibold text-foreground">Groepschat</h1>
          <span className="text-sm text-muted-foreground">— Interne teamcommunicatie</span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Channel sidebar */}
        <aside className="w-60 border-r border-border bg-card flex flex-col shrink-0">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Kanalen</span>
            <Dialog open={newChannelOpen} onOpenChange={setNewChannelOpen}>
              <DialogTrigger asChild>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-display">Nieuw Kanaal</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-2">
                  <div>
                    <Label>Kanaal naam</Label>
                    <Input placeholder="bijv. social-media" value={newChannel.name} onChange={(e) => setNewChannel({ ...newChannel, name: e.target.value })} />
                  </div>
                  <div>
                    <Label>Beschrijving</Label>
                    <Input placeholder="Waar gaat dit kanaal over?" value={newChannel.description} onChange={(e) => setNewChannel({ ...newChannel, description: e.target.value })} />
                  </div>
                  <Button onClick={handleCreateChannel} className="w-full">Kanaal aanmaken</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-0.5">
              {channels.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setSelectedId(ch.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors group ${
                    ch.id === selectedId
                      ? "bg-secondary text-foreground font-medium"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  }`}
                >
                  <Hash className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate flex-1 text-left">{ch.name}</span>
                  {channels.length > 1 && (
                    <span
                      onClick={(e) => { e.stopPropagation(); handleDeleteChannel(ch.id); }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>
          {/* Online members */}
          <div className="p-4 border-t border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Online — {teamMembers.length}</p>
            <div className="space-y-2">
              {teamMembers.map((m) => (
                <div key={m.name} className="flex items-center gap-2">
                  <div className="relative">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className={`${m.color} text-primary-foreground text-[10px] font-semibold`}>{m.avatar}</AvatarFallback>
                    </Avatar>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-chart-2 rounded-full border-2 border-card" />
                  </div>
                  <span className="text-xs text-foreground truncate">{m.name}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {/* Channel header */}
          <div className="border-b border-border bg-card px-6 py-3 flex items-center gap-2">
            <Hash className="w-4 h-4 text-muted-foreground" />
            <span className="font-semibold text-foreground">{selected.name}</span>
            <span className="text-sm text-muted-foreground ml-2">{selected.description}</span>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-6">
            <div className="max-w-3xl mx-auto space-y-6">
              {groupedMessages.map((group) => (
                <div key={group.date}>
                  <div className="flex items-center gap-3 my-4">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs text-muted-foreground font-medium">{group.date}</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                  <div className="space-y-4">
                    {group.messages.map((msg) => (
                      <div key={msg.id} className="flex items-start gap-3 group">
                        <Avatar className="h-9 w-9 mt-0.5">
                          <AvatarFallback className={`${msg.color} text-primary-foreground text-xs font-semibold`}>{msg.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm font-semibold text-foreground">{msg.sender}</span>
                            <span className="text-[11px] text-muted-foreground">{formatTime(msg.timestamp)}</span>
                          </div>
                          <p className="text-sm text-foreground mt-0.5">{msg.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {selected.messages.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                  <MessagesSquare className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">Nog geen berichten in #{selected.name}</p>
                  <p className="text-xs mt-1">Stuur het eerste bericht!</p>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>

          {/* Message input */}
          <div className="border-t border-border bg-card p-4">
            <div className="flex gap-2 max-w-3xl mx-auto">
              <Input
                placeholder={`Bericht in #${selected.name}...`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                className="flex-1"
              />
              <Button onClick={handleSend} disabled={!message.trim()} className="gap-2">
                <Send className="w-4 h-4" />
                Verstuur
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Groepschat;
