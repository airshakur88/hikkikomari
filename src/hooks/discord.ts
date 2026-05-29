"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  type DiscordUser,
  getDiscordConfig,
  HEARTBEAT_TIMEOUT_CODE,
  type NekoparaGreeting,
  readDiscordCache,
  type WSMessage,
  writeDiscordCache,
} from "@/lib/discord";

const MAX_RECONNECT_ATTEMPTS = 10;
const MAX_RECONNECT_DELAY = 30000;
const LOADING_TIMEOUT = 5000;

export function useDiscordUser() {
  const { wsBase, userId } = getDiscordConfig();
  const [user, setUser] = useState<DiscordUser | null>(() => readDiscordCache());
  const [greeting, setGreeting] = useState<NekoparaGreeting | null>(null);
  const [protocol, setProtocol] = useState<{ ws: string } | null>(null);
  const [loading, setLoading] = useState(() => !readDiscordCache());
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!loading) return;
    timeoutRef.current = setTimeout(() => setLoading(false), LOADING_TIMEOUT);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [loading]);

  const connect = useCallback(() => {
    if (!userId) return;

    if (reconnectRef.current) {
      clearTimeout(reconnectRef.current);
      reconnectRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    const ws = new WebSocket(`${wsBase}/users/${userId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      reconnectAttemptRef.current = 0;
    };

    ws.onmessage = (event) => {
      try {
        const msg: WSMessage = JSON.parse(event.data);

        switch (msg.type) {
          case "initial": {
            if (msg.protocol) setProtocol(msg.protocol);
            if (msg.greeting) setGreeting(msg.greeting);
            const userData = msg.data as DiscordUser;
            setUser(userData);
            writeDiscordCache(userData);
            setLoading(false);
            break;
          }
          case "not-found": {
            if (msg.protocol) setProtocol(msg.protocol);
            setUser(null);
            writeDiscordCache(null);
            setLoading(false);
            break;
          }
          case "add":
          case "update": {
            const userData = msg.data as DiscordUser;
            setUser(userData);
            writeDiscordCache(userData);
            break;
          }
          case "remove": {
            setUser(null);
            writeDiscordCache(null);
            break;
          }
        }
      } catch {}
    };

    ws.onclose = (event) => {
      if (reconnectRef.current) {
        clearTimeout(reconnectRef.current);
        reconnectRef.current = null;
      }

      if (event.code === HEARTBEAT_TIMEOUT_CODE) {
        reconnectAttemptRef.current = 0;
        reconnectRef.current = setTimeout(connect, 1000);
        return;
      }

      if (reconnectAttemptRef.current >= MAX_RECONNECT_ATTEMPTS) return;

      const delay = Math.min(
        1000 * 2 ** reconnectAttemptRef.current,
        MAX_RECONNECT_DELAY,
      );
      reconnectAttemptRef.current++;
      reconnectRef.current = setTimeout(connect, delay);
    };

    ws.onerror = () => {
      ws.close();
    };
  }, [wsBase, userId]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [connect]);

  const refresh = useCallback(() => {
    if (reconnectRef.current) clearTimeout(reconnectRef.current);
    if (wsRef.current) wsRef.current.close();
    reconnectAttemptRef.current = 0;
    connect();
  }, [connect]);

  return { user, greeting, protocol, loading, refresh };
}
