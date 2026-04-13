import { useEffect, useMemo, useRef, useState } from "react";
import { MessagesSquare, Send, Hash, Plus, X, Paperclip, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useTeam } from "@/contexts/TeamContext";
import { usePersistedState } from "@/lib/api";
import type { GroupChatState, Channel, SharedAsset } from "@/lib/app-types";

const Groepschat = () => {
  const { t, locale } = useLanguage();
  const { team } = useTeam();
  const { toast } = useToast();
  const defaultChannels = useMemo<Channel[]>(
    () => [
      { id: "5", name: "social-media", description: t("groupChat.channelsData.socialMedia"), messages: [] },
      { id: "6", name: "advertenties", description: t("groupChat.channelsData.ads"), messages: [] },
      { id: "7", name: "e-mail-marketing", description: t("groupChat.channelsData.emailMarketing"), messages: [] },
      { id: "8", name: "seo-website", description: t("groupChat.channelsData.seoWebsite"), messages: [] },
      { id: "9", name: "promomateriaal", description: "Uploads en downloads van promobestanden", messages: [] },
    ],
    [t],
  );
  const { value, setValue, loading } = usePersistedState<GroupChatState>("groupchat", {
    channels: defaultChannels,
    sharedAssets: [],
  });
  const channels = value.channels.length > 0 ? value.channels : defaultChannels;
  const sharedAssets = value.sharedAssets;
  const [selectedId, setSelectedId] = useState(defaultChannels[0]?.id ?? "");
  const [message, setMessage] = useState("");
  const [newChannelOpen, setNewChannelOpen] = useState(false);
  const [newChannel, setNewChannel] = useState({ name: "", description: "" });
  const bottomRef = useRef<HTMLDivElement>(null);
  const uploadRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!selectedId && channels[0]) {
      setSelectedId(channels[0].id);
    }
  }, [channels, selectedId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [channels, selectedId]);

  const currentUser = team[0] ?? {
    name: t("groupChat.you"),
    initials: "JI",
    color: "bg-primary",
  };
  const selected = channels.find((channel) => channel.id === selectedId) ?? channels[0];
  const isPromoChannel = selected?.name === "promomateriaal";

  const updateChannels = async (updater: (current: Channel[]) => Channel[]) => {
    await setValue((prev) => ({ ...prev, channels: updater(prev.channels.length > 0 ? prev.channels : defaultChannels) }));
  };

  const handleSend = async () => {
    if (!message.trim() || !selected) return;
    const nextMessage = {
      id: `m-${Date.now()}`,
      text: message.trim(),
      sender: currentUser.name,
      avatar: currentUser.initials,
      color: currentUser.color,
      timestamp: new Date().toISOString(),
    };

    await updateChannels((prev) =>
      prev.map((channel) =>
        channel.id === selected.id ? { ...channel, messages: [...channel.messages, nextMessage] } : channel,
      ),
    );
    setMessage("");
  };

  const handleCreateChannel = async () => {
    if (!newChannel.name.trim()) {
      toast({ title: t("groupChat.nameRequired"), variant: "destructive" });
      return;
    }

    const channel = {
      id: `ch-${Date.now()}`,
      name: newChannel.name.toLowerCase().replace(/\s+/g, "-"),
      description: newChannel.description || t("groupChat.defaultDescription"),
      messages: [],
    };

    await updateChannels((prev) => [...prev, channel]);
    setSelectedId(channel.id);
    setNewChannel({ name: "", description: "" });
    setNewChannelOpen(false);
    toast({ title: t("groupChat.channelCreated"), description: `#${channel.name}` });
  };

  const handleDeleteChannel = async (id: string) => {
    if (channels.length <= 1) return;
    const fallbackId = channels.find((channel) => channel.id !== id)?.id ?? "";
    await updateChannels((prev) => prev.filter((channel) => channel.id !== id));
    if (selectedId === id) setSelectedId(fallbackId);
    toast({ title: t("groupChat.channelDeleted") });
  };

  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const readAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });

  const handleUploadFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    const uploaded: SharedAsset[] = await Promise.all(
      files.map(async (file) => ({
        id: `asset-${Date.now()}-${file.name}`,
        name: file.name,
        sizeLabel: formatFileSize(file.size),
        uploadedAt: new Date().toISOString(),
        downloadUrl: await readAsDataUrl(file),
      })),
    );

    await setValue((prev) => ({ ...prev, sharedAssets: [...uploaded, ...prev.sharedAssets] }));
    event.target.value = "";
  };

  const formatTime = (value: string) =>
    new Date(value).toLocaleTimeString(locale === "nl" ? "nl-NL" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDate = (value: string) => {
    const date = new Date(value);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 86400000);
    if (diff === 0) return t("common.today");
    if (diff === 1) return t("common.yesterday");
    return date.toLocaleDateString(locale === "nl" ? "nl-NL" : "en-US", { day: "numeric", month: "long" });
  };

  const groupedMessages = selected
    ? selected.messages.reduce<{ date: string; messages: Channel["messages"] }[]>((groups, currentMessage) => {
        const date = formatDate(currentMessage.timestamp);
        const lastGroup = groups[groups.length - 1];
        if (lastGroup?.date === date) {
          lastGroup.messages.push(currentMessage);
        } else {
          groups.push({ date, messages: [currentMessage] });
        }
        return groups;
      }, [])
    : [];

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-background">
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center gap-3">
          <MessagesSquare className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-semibold text-foreground">{t("groupChat.title")}</h1>
          <span className="text-sm text-muted-foreground">- {t("groupChat.subtitle")}</span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("groupChat.channels")}</span>
            <Dialog open={newChannelOpen} onOpenChange={setNewChannelOpen}>
              <DialogTrigger asChild>
                <button className="text-muted-foreground transition-colors hover:text-foreground">
                  <Plus className="h-4 w-4" />
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-display">{t("groupChat.newChannel")}</DialogTitle>
                </DialogHeader>
                <div className="mt-2 space-y-4">
                  <div>
                    <Label>{t("groupChat.channelName")}</Label>
                    <Input value={newChannel.name} onChange={(event) => setNewChannel({ ...newChannel, name: event.target.value })} />
                  </div>
                  <div>
                    <Label>{t("groupChat.channelDescription")}</Label>
                    <Input value={newChannel.description} onChange={(event) => setNewChannel({ ...newChannel, description: event.target.value })} />
                  </div>
                  <Button onClick={() => void handleCreateChannel()} className="w-full">
                    {t("groupChat.createChannel")}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <ScrollArea className="flex-1">
            <div className="space-y-0.5 p-2">
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedId(channel.id)}
                  className={`group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                    channel.id === selectedId ? "bg-secondary font-medium text-foreground" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  }`}
                >
                  <Hash className="h-3.5 w-3.5 shrink-0" />
                  <span className="flex-1 truncate text-left">{channel.name}</span>
                  {channels.length > 1 && (
                    <span
                      onClick={(event) => {
                        event.stopPropagation();
                        void handleDeleteChannel(channel.id);
                      }}
                      className="rounded p-0.5 opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>
          <div className="border-t border-border p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("groupChat.online")} - {team.length}
            </p>
            <div className="space-y-2">
              {team.map((member) => (
                <div key={member.id} className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className={`${member.color} text-[10px] font-semibold text-primary-foreground`}>
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate text-xs text-foreground">{member.name}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex flex-1 flex-col">
          <div className="flex items-center gap-2 border-b border-border bg-card px-6 py-3">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold text-foreground">{selected?.name}</span>
            <span className="ml-2 text-sm text-muted-foreground">{selected?.description}</span>
            {isPromoChannel && (
              <>
                <input ref={uploadRef} type="file" multiple className="hidden" onChange={(event) => void handleUploadFiles(event)} />
                <Button size="sm" variant="outline" className="ml-auto gap-1.5" onClick={() => uploadRef.current?.click()}>
                  <Paperclip className="h-3.5 w-3.5" /> Upload
                </Button>
              </>
            )}
          </div>

          <ScrollArea className="flex-1 px-6 py-4">
            {loading && channels.length === 0 ? (
              <div className="text-sm text-muted-foreground">Groepschat wordt geladen...</div>
            ) : (
              <div className="space-y-6">
                {groupedMessages.map((group) => (
                  <div key={group.date}>
                    <p className="mb-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">{group.date}</p>
                    <div className="space-y-3">
                      {group.messages.map((entry) => (
                        <div key={entry.id} className="flex gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className={`${entry.color} text-xs font-semibold text-primary-foreground`}>
                              {entry.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className="max-w-xl rounded-2xl bg-card px-4 py-3 shadow-sm">
                            <div className="mb-1 flex items-center gap-2">
                              <span className="text-sm font-semibold text-foreground">{entry.sender}</span>
                              <span className="text-[11px] text-muted-foreground">{formatTime(entry.timestamp)}</span>
                            </div>
                            <p className="text-sm text-foreground">{entry.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {isPromoChannel && sharedAssets.length > 0 && (
                  <div className="glass-card rounded-xl p-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Assets</p>
                    <div className="space-y-2">
                      {sharedAssets.map((asset) => (
                        <a key={asset.id} href={asset.downloadUrl} download={asset.name} className="flex items-center justify-between rounded-lg border border-border p-3 text-sm hover:bg-secondary/40">
                          <div>
                            <p className="font-medium text-foreground">{asset.name}</p>
                            <p className="text-xs text-muted-foreground">{asset.sizeLabel}</p>
                          </div>
                          <Download className="h-4 w-4 text-muted-foreground" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            )}
          </ScrollArea>

          <div className="border-t border-border bg-card px-6 py-4">
            <div className="flex gap-3">
              <Input
                placeholder={t("groupChat.messagePlaceholder")}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    void handleSend();
                  }
                }}
              />
              <Button onClick={() => void handleSend()} className="gap-1.5">
                <Send className="h-4 w-4" /> {t("common.send")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Groepschat;
