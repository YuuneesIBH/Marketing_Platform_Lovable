import { useEffect, useMemo, useState, type ElementType } from "react";
import { MessageCircle, Send, Instagram, Music2, Search, Plus, Link2, Unlink, CheckCircle2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { usePersistedState } from "@/lib/api";
import type { MessagesState, Platform } from "@/lib/app-types";

const platformConfig: Record<Platform, { icon: ElementType; label: string; gradient: string }> = {
  instagram: { icon: Instagram, label: "Instagram", gradient: "from-purple-500 to-pink-500" },
  tiktok: { icon: Music2, label: "TikTok", gradient: "from-gray-800 to-gray-950" },
};

const Berichten = () => {
  const { t, locale } = useLanguage();
  const { toast } = useToast();
  const { value, setValue, loading } = usePersistedState<MessagesState>("messages", {
    accounts: [],
    conversations: [],
  });
  const [selectedId, setSelectedId] = useState("");
  const [reply, setReply] = useState("");
  const [search, setSearch] = useState("");
  const [filterPlatform, setFilterPlatform] = useState<Platform | "all">("all");
  const [showAccountDialog, setShowAccountDialog] = useState(false);
  const [newAccount, setNewAccount] = useState({ platform: "instagram" as Platform, username: "", displayName: "" });

  useEffect(() => {
    if (!selectedId && value.conversations[0]) {
      setSelectedId(value.conversations[0].id);
    }
  }, [selectedId, value.conversations]);

  const selected = value.conversations.find((conversation) => conversation.id === selectedId);

  const filteredConversations = useMemo(
    () =>
      value.conversations
        .filter((conversation) => filterPlatform === "all" || conversation.platform === filterPlatform)
        .filter(
          (conversation) =>
            conversation.name.toLowerCase().includes(search.toLowerCase()) ||
            conversation.lastMessage.toLowerCase().includes(search.toLowerCase()),
        ),
    [filterPlatform, search, value.conversations],
  );

  const updateState = async (updater: (current: MessagesState) => MessagesState) => {
    await setValue(updater);
  };

  const handleSelect = async (id: string) => {
    setSelectedId(id);
    await updateState((current) => ({
      ...current,
      conversations: current.conversations.map((conversation) =>
        conversation.id === id ? { ...conversation, unread: false } : conversation,
      ),
    }));
  };

  const handleSend = async () => {
    if (!reply.trim() || !selected) return;
    const timestamp = new Date().toISOString();
    await updateState((current) => ({
      ...current,
      conversations: current.conversations.map((conversation) =>
        conversation.id === selected.id
          ? {
              ...conversation,
              lastMessage: reply.trim(),
              lastMessageTime: timestamp,
              messages: [
                ...conversation.messages,
                { id: `m-${Date.now()}`, text: reply.trim(), sender: "team", timestamp },
              ],
            }
          : conversation,
      ),
    }));
    setReply("");
    toast({ title: t("messages.messageSent") });
  };

  const handleConnectAccount = async () => {
    if (!newAccount.username.trim()) return;
    const account = {
      id: `acc-${Date.now()}`,
      platform: newAccount.platform,
      username: newAccount.username.startsWith("@") ? newAccount.username : `@${newAccount.username}`,
      displayName: newAccount.displayName || newAccount.username,
      connected: true,
      connectedAt: new Date().toISOString(),
    };
    await updateState((current) => ({ ...current, accounts: [...current.accounts, account] }));
    setNewAccount({ platform: "instagram", username: "", displayName: "" });
    setShowAccountDialog(false);
    toast({ title: t("messages.accountConnected"), description: account.username });
  };

  const handleDisconnectAccount = async (id: string) => {
    await updateState((current) => ({
      accounts: current.accounts.filter((account) => account.id !== id),
      conversations: current.conversations.filter((conversation) => conversation.accountId !== id),
    }));
    if (selected?.accountId === id) {
      setSelectedId("");
    }
    toast({ title: t("messages.accountDisconnected") });
  };

  const handleAddDemoConversation = async (accountId: string) => {
    const account = value.accounts.find((entry) => entry.id === accountId);
    if (!account) return;
    const timestamp = new Date().toISOString();
    const conversation = {
      id: `conv-${Date.now()}`,
      name: "Demo Klant",
      platform: account.platform,
      accountId: account.id,
      avatar: "DK",
      lastMessage: "Hoi! Ik heb een vraag over jullie producten 😊",
      lastMessageTime: timestamp,
      unread: true,
      messages: [{ id: `m-${Date.now()}`, text: "Hoi! Ik heb een vraag over jullie producten 😊", sender: "customer" as const, timestamp }],
    };
    await updateState((current) => ({ ...current, conversations: [...current.conversations, conversation] }));
    setSelectedId(conversation.id);
  };

  const formatTime = (value: string) => {
    const date = new Date(value);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
    if (diffDays === 0) {
      return date.toLocaleTimeString(locale === "nl" ? "nl-NL" : "en-US", { hour: "2-digit", minute: "2-digit" });
    }
    if (diffDays === 1) return t("messages.yesterday");
    return date.toLocaleDateString(locale === "nl" ? "nl-NL" : "en-US", { day: "numeric", month: "short" });
  };

  const unreadCount = value.conversations.filter((conversation) => conversation.unread).length;

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-background">
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageCircle className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-semibold text-foreground">{t("messages.title")}</h1>
            {unreadCount > 0 && <Badge className="bg-primary text-primary-foreground text-xs">{unreadCount} {t("messages.new")}</Badge>}
          </div>
          <div className="flex items-center gap-2">
            <div className="mr-2 flex gap-1.5">
              <Button size="sm" variant={filterPlatform === "all" ? "default" : "outline"} onClick={() => setFilterPlatform("all")}>
                {t("messages.all")}
              </Button>
              {(Object.keys(platformConfig) as Platform[]).map((platform) => {
                const cfg = platformConfig[platform];
                return (
                  <Button key={platform} size="sm" variant={filterPlatform === platform ? "default" : "outline"} onClick={() => setFilterPlatform(platform)} className="gap-1.5">
                    <cfg.icon className="h-3.5 w-3.5" />
                    {cfg.label}
                  </Button>
                );
              })}
            </div>
            <Dialog open={showAccountDialog} onOpenChange={setShowAccountDialog}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1.5">
                  <Plus className="h-3.5 w-3.5" /> {t("messages.connectAccount")}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("messages.connectAccountTitle")}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div>
                    <Label>{t("messages.platform")}</Label>
                    <Select value={newAccount.platform} onValueChange={(value) => setNewAccount({ ...newAccount, platform: value as Platform })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(platformConfig) as Platform[]).map((platform) => {
                          const cfg = platformConfig[platform];
                          return (
                            <SelectItem key={platform} value={platform}>
                              <span className="flex items-center gap-2">
                                <cfg.icon className="h-4 w-4" />
                                {cfg.label}
                              </span>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>{t("messages.username")}</Label>
                    <Input value={newAccount.username} onChange={(event) => setNewAccount({ ...newAccount, username: event.target.value })} />
                  </div>
                  <div>
                    <Label>{t("messages.displayName")}</Label>
                    <Input value={newAccount.displayName} onChange={(event) => setNewAccount({ ...newAccount, displayName: event.target.value })} />
                  </div>
                  <div className="flex items-start gap-2 rounded-lg bg-secondary/50 p-3">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">{t("messages.connectHint")}</p>
                  </div>
                  <Button onClick={() => void handleConnectAccount()} disabled={!newAccount.username.trim()} className="w-full gap-2">
                    <Link2 className="h-4 w-4" /> {t("messages.connectAccount")}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="flex w-80 shrink-0 flex-col border-r border-border bg-card">
          {value.accounts.length > 0 && (
            <div className="border-b border-border p-3">
              <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{t("messagesPanel.connectedAccounts")}</p>
              <div className="space-y-1.5">
                {value.accounts.map((account) => {
                  const cfg = platformConfig[account.platform];
                  return (
                    <div key={account.id} className="group flex items-center gap-2 rounded-lg bg-secondary/50 p-2">
                      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${cfg.gradient}`}>
                        <cfg.icon className="h-3 w-3 text-primary-foreground" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-foreground">{account.displayName}</p>
                        <p className="text-[10px] text-muted-foreground">{account.username}</p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => void handleAddDemoConversation(account.id)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => void handleDisconnectAccount(account.id)}>
                          <Unlink className="h-3 w-3" />
                        </Button>
                      </div>
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-500" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(event) => setSearch(event.target.value)} className="h-9 pl-9 text-sm" placeholder={t("messagesPanel.searchConversation")} />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="space-y-1 p-2">
              {loading && value.conversations.length === 0 ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">Berichten worden geladen...</div>
              ) : filteredConversations.map((conversation) => {
                const cfg = platformConfig[conversation.platform];
                return (
                  <button
                    key={conversation.id}
                    onClick={() => void handleSelect(conversation.id)}
                    className={`w-full rounded-xl p-3 text-left transition-colors ${
                      conversation.id === selectedId ? "bg-secondary" : "hover:bg-secondary/50"
                    }`}
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-[11px] font-semibold text-primary">
                          {conversation.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="truncate text-sm font-medium text-foreground">{conversation.name}</p>
                          <cfg.icon className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <p className="truncate text-xs text-muted-foreground">{conversation.lastMessage}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-muted-foreground">{formatTime(conversation.lastMessageTime)}</p>
                        {conversation.unread && <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-primary" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </aside>

        <div className="flex flex-1 flex-col">
          {selected ? (
            <>
              <div className="border-b border-border bg-card px-6 py-4">
                <h2 className="text-sm font-semibold text-foreground">{selected.name}</h2>
                <p className="text-xs text-muted-foreground">{platformConfig[selected.platform].label}</p>
              </div>
              <ScrollArea className="flex-1 px-6 py-5">
                <div className="space-y-3">
                  {selected.messages.map((message) => (
                    <div key={message.id} className={`flex ${message.sender === "team" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-xl rounded-2xl px-4 py-3 ${message.sender === "team" ? "bg-primary text-primary-foreground" : "bg-card text-foreground"}`}>
                        <p className="text-sm">{message.text}</p>
                        <p className={`mt-1 text-[11px] ${message.sender === "team" ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="border-t border-border bg-card px-6 py-4">
                <div className="flex gap-3">
                  <Input
                    value={reply}
                    onChange={(event) => setReply(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        void handleSend();
                      }
                    }}
                    placeholder={t("messages.replyPlaceholder")}
                  />
                  <Button onClick={() => void handleSend()} className="gap-1.5">
                    <Send className="h-4 w-4" /> {t("common.send")}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
              Verbind een account en maak een conversatie aan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Berichten;
