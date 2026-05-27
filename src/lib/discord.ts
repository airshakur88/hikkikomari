export interface ActivityData {
  name: string;
  type: number;
  url?: string;
  details?: string;
  state?: string;
  timestamps?: { start?: number; end?: number };
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
}

export interface DiscordUser {
  id: string;
  username: string;
  globalName: string | null;
  avatar: string | null;
  avatarURL: string;
  bot: boolean;
  flags: number;
  badges: string[];
  presence: {
    status: "online" | "idle" | "dnd" | "offline";
    activities: ActivityData[];
  };
}

export interface NekoparaGreeting {
  character: string;
  series: string;
  message: string;
  emotion: string;
  language: string;
  animation: {
    tail_wagging: boolean;
    ears_moving: boolean;
  };
}

export interface WSMessage {
  type: "initial" | "add" | "update" | "remove" | "not-found";
  greeting?: NekoparaGreeting;
  protocol?: { ws: string };
  data: DiscordUser | DiscordUser[] | { id: string };
}

export const HEARTBEAT_TIMEOUT_CODE = 4000;
export const DISCORD_CACHE_KEY = "discord_user_cache";

export function readDiscordCache(): DiscordUser | null {
  try {
    const raw = localStorage.getItem(DISCORD_CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DiscordUser;
  } catch {
    return null;
  }
}

export function writeDiscordCache(user: DiscordUser | null) {
  try {
    if (user) {
      localStorage.setItem(DISCORD_CACHE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(DISCORD_CACHE_KEY);
    }
  } catch {}
}

export function getDiscordConfig() {
  const raw = process.env.NEXT_PUBLIC_DISCORD_WSS_URL ?? "ws://localhost:3000";
  let wsBase: string;
  if (raw.startsWith("ws")) {
    wsBase = raw;
  } else {
    wsBase = raw.replace(/^http(s?):\/\//, "ws$1://");
  }
  const userId = process.env.NEXT_PUBLIC_DISCORD_USER_ID ?? "";
  return { wsBase, userId };
}
