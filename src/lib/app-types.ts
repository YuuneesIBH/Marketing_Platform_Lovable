export type Platform = "instagram" | "tiktok";
export type MultiPlatform = Platform | "all";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  initials: string;
  color: string;
}

export interface ContactItem {
  id: string;
  name: string;
  username: string;
  platform: Platform;
  tags: string[];
  subscribed: boolean;
  lastInteraction: string;
  source: string;
}

export interface Broadcast {
  id: string;
  name: string;
  message: string;
  platform: MultiPlatform;
  audience: string;
  status: "draft" | "scheduled" | "sent";
  scheduledAt: string;
  recipients: number;
  opened: number;
  clicked: number;
}

export interface Automation {
  id: string;
  name: string;
  trigger: string;
  platform: MultiPlatform;
  status: "active" | "paused" | "draft";
  steps: number;
  reached: number;
  converted: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  platform: string;
  time: string;
  date: string;
  color: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: string;
  avatar: string;
  color: string;
  timestamp: string;
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  messages: ChatMessage[];
}

export interface SharedAsset {
  id: string;
  name: string;
  sizeLabel: string;
  uploadedAt: string;
  downloadUrl: string;
}

export interface GroupChatState {
  channels: Channel[];
  sharedAssets: SharedAsset[];
}

export interface ConnectedAccount {
  id: string;
  platform: Platform;
  username: string;
  displayName: string;
  connected: boolean;
  connectedAt: string;
}

export interface DirectMessage {
  id: string;
  text: string;
  sender: "customer" | "team";
  timestamp: string;
}

export interface Conversation {
  id: string;
  name: string;
  platform: Platform;
  accountId: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
  messages: DirectMessage[];
}

export interface MessagesState {
  accounts: ConnectedAccount[];
  conversations: Conversation[];
}

export interface SettingsState {
  profile: {
    bedrijfsnaam: string;
    email: string;
    website: string;
  };
  notif: {
    email: boolean;
    push: boolean;
    weeklyReport: boolean;
    campagneAlerts: boolean;
  };
  branding: {
    primaryColor: string;
    logoUrl: string;
    slogan: string;
  };
  channels: {
    instagram: string;
    tiktok: string;
    facebook: string;
    youtube: string;
  };
}
