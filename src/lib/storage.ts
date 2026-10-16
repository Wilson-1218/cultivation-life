"use client";

import { useSyncExternalStore } from "react";
import type { RealmId, RootId, WorldId } from "@/lib/world";

export type PastLife = {
  id: string;
  at: number;
  name: string;
  root: RootId;
  rootName: string;
  realm: RealmId;
  realmName: string;
  age: number;
  cause: string;
  line: string;
  world: WorldId;
  worldName: string;
  ending: "dead" | "edge";
};

const KEY = "baiyi-xiuxian-past-v1";
const EVENT = "baiyi-past-change";
const SERVER = "__server__";
const MAX = 6;

function readRaw(): string {
  try {
    return window.localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}

function writeRaw(value: string) {
  try {
    window.localStorage.setItem(KEY, value);
  } catch {
    return;
  }
  window.dispatchEvent(new Event(EVENT));
}

function parse(raw: string): PastLife[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as PastLife[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item && typeof item.id === "string").slice(0, MAX);
  } catch {
    return [];
  }
}

export function upsertPast(entry: PastLife): PastLife[] {
  const next = [entry, ...parse(readRaw()).filter((item) => item.id !== entry.id)].slice(0, MAX);
  writeRaw(JSON.stringify(next));
  return next;
}

export function clearPast(): PastLife[] {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    return [];
  }
  window.dispatchEvent(new Event(EVENT));
  return [];
}

export function usePastLives(): PastLife[] | null {
  const raw = useSyncExternalStore(
    (callback) => {
      window.addEventListener(EVENT, callback);
      window.addEventListener("storage", callback);
      return () => {
        window.removeEventListener(EVENT, callback);
        window.removeEventListener("storage", callback);
      };
    },
    readRaw,
    () => SERVER,
  );
  if (raw === SERVER) return null;
  return parse(raw);
}
