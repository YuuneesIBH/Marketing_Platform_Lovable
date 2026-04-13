import { useEffect, useState } from "react";

const API_BASE = "http://127.0.0.1:3001";

type StateKey =
  | "team"
  | "contacts"
  | "broadcasts"
  | "automations"
  | "calendar"
  | "groupchat"
  | "messages"
  | "settings";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error ?? "API request failed");
  }

  return response.json() as Promise<T>;
}

export async function fetchState<T>(key: StateKey, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${API_BASE}/api/state/${key}`);
    const payload = await handleResponse<{ key: string; value: T }>(response);
    return payload.value ?? fallback;
  } catch (error) {
    console.error(`Failed to load ${key}`, error);
    return fallback;
  }
}

export async function saveState<T>(key: StateKey, value: T): Promise<T> {
  const payload = await handleResponse<{ key: string; value: T }>(
    fetch(`${API_BASE}/api/state/${key}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value }),
    }),
  );

  return payload.value;
}

export function usePersistedState<T>(key: StateKey, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    fetchState(key, fallback).then((nextValue) => {
      if (!active) return;
      setValue(nextValue);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [key]);

  const persist = async (updater: T | ((current: T) => T)) => {
    setSaving(true);
    try {
      const nextValue =
        typeof updater === "function" ? (updater as (current: T) => T)(value) : updater;
      setValue(nextValue);
      const stored = await saveState(key, nextValue);
      setValue(stored);
      return stored;
    } finally {
      setSaving(false);
    }
  };

  return { value, setValue: persist, loading, saving };
}
