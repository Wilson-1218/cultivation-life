"use client";

import { useSyncExternalStore } from "react";
import type { BuriedRelic, KarmaGift, LifeThread, NamedPerson, RealmId, RootId, ThreadKind, WorldId } from "@/lib/world";

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

export const GIFT_COST: Record<KarmaGift, number> = {
  root: 1,
  origin: 1,
  ease: 2,
  stones: 1,
  span: 2,
};

const GIFTS: KarmaGift[] = ["root", "origin", "ease", "stones", "span"];

export type KarmaState = {
  points: number;
  gifts: KarmaGift[];
  buried: BuriedRelic | null;
  foe: NamedPerson | null;
  haunt: NamedPerson | null;
  thread: LifeThread | null;
  grantedId: string;
};

const KARMA_KEY = "baiyi-xiuxian-karma-v1";
const KARMA_EVENT = "baiyi-karma-change";

const EMPTY_KARMA: KarmaState = {
  points: 0,
  gifts: [],
  buried: null,
  foe: null,
  haunt: null,
  thread: null,
  grantedId: "",
};

const THREADS: ThreadKind[] = ["kin", "debt", "page", "heir", "cave", "scar"];

function parseThread(value: unknown): LifeThread | null {
  if (!value || typeof value !== "object") return null;
  const thread = value as Partial<LifeThread>;
  if (!THREADS.includes(thread.kind as ThreadKind)) return null;
  if (typeof thread.name !== "string" || !thread.name.trim()) return null;
  return {
    kind: thread.kind as ThreadKind,
    name: thread.name.trim().slice(0, 24),
    from: typeof thread.from === "string" ? thread.from.trim().slice(0, 48) : "",
  };
}

function parsePerson(value: unknown): NamedPerson | null {
  if (!value || typeof value !== "object") return null;
  const person = value as Partial<NamedPerson>;
  if (typeof person.name !== "string" || !person.name.trim()) return null;
  return {
    name: person.name.trim().slice(0, 24),
    from: typeof person.from === "string" ? person.from.trim().slice(0, 48) : "",
  };
}

function readKarmaRaw(): string {
  try {
    return window.localStorage.getItem(KARMA_KEY) ?? "";
  } catch {
    return "";
  }
}

function writeKarma(next: KarmaState) {
  try {
    window.localStorage.setItem(KARMA_KEY, JSON.stringify(next));
  } catch {
    return;
  }
  window.dispatchEvent(new Event(KARMA_EVENT));
}

function parseGifts(parsed: Partial<KarmaState> & { boost?: string }): KarmaGift[] {
  const found = new Set<KarmaGift>();
  if (Array.isArray(parsed.gifts)) {
    for (const gift of parsed.gifts) {
      if (GIFTS.includes(gift)) found.add(gift);
    }
  }
  if (parsed.boost === "root" || parsed.boost === "origin") found.add(parsed.boost);
  return GIFTS.filter((gift) => found.has(gift));
}

function parseKarma(raw: string): KarmaState {
  if (!raw || raw === SERVER) return EMPTY_KARMA;
  try {
    const parsed = JSON.parse(raw) as Partial<KarmaState> & { boost?: string };
    return {
      points: typeof parsed.points === "number" ? Math.max(0, Math.floor(parsed.points)) : 0,
      gifts: parseGifts(parsed),
      buried:
        parsed.buried && typeof parsed.buried.item === "string" && typeof parsed.buried.region === "string"
          ? {
              region: parsed.buried.region,
              item: parsed.buried.item,
              by: typeof parsed.buried.by === "string" ? parsed.buried.by : "",
            }
          : null,
      foe: parsePerson(parsed.foe),
      haunt: parsePerson(parsed.haunt),
      thread: parseThread(parsed.thread),
      grantedId: typeof parsed.grantedId === "string" ? parsed.grantedId : "",
    };
  } catch {
    return EMPTY_KARMA;
  }
}

export function readKarma(): KarmaState {
  return parseKarma(readKarmaRaw());
}

export function grantKarma(input: {
  id: string;
  points: number;
  bury: BuriedRelic | null;
  foe: NamedPerson | null;
  haunt: NamedPerson | null;
  thread: LifeThread | null;
}): KarmaState {
  const current = readKarma();
  if (current.grantedId === input.id) return current;
  const next: KarmaState = {
    points: Math.max(0, Math.floor(input.points)),
    gifts: [],
    buried: input.bury ?? current.buried,
    foe: input.foe,
    haunt: input.haunt,
    thread: input.thread,
    grantedId: input.id,
  };
  writeKarma(next);
  return next;
}

export function spendKarma(gift: KarmaGift): boolean {
  const current = readKarma();
  const cost = GIFT_COST[gift];
  if (current.gifts.includes(gift) || current.points < cost) return false;
  writeKarma({ ...current, points: current.points - cost, gifts: [...current.gifts, gift] });
  return true;
}

export function consumeKarma(): {
  gifts: KarmaGift[];
  buried: BuriedRelic | null;
  foe: NamedPerson | null;
  haunt: NamedPerson | null;
  thread: LifeThread | null;
} {
  const current = readKarma();
  writeKarma({
    points: 0,
    gifts: [],
    buried: current.buried,
    foe: current.foe,
    haunt: current.haunt,
    thread: current.thread,
    grantedId: "",
  });
  return {
    gifts: current.gifts,
    buried: current.buried,
    foe: current.foe,
    haunt: current.haunt,
    thread: current.thread,
  };
}

export function clearBuried(): void {
  const current = readKarma();
  if (!current.buried) return;
  writeKarma({ ...current, buried: null });
}

export function clearFoe(): void {
  const current = readKarma();
  if (!current.foe) return;
  writeKarma({ ...current, foe: null });
}

export function clearHaunt(): void {
  const current = readKarma();
  if (!current.haunt) return;
  writeKarma({ ...current, haunt: null });
}

export function clearThread(): void {
  const current = readKarma();
  if (!current.thread) return;
  writeKarma({ ...current, thread: null });
}

export function useKarma(): KarmaState | null {
  const raw = useSyncExternalStore(
    (callback) => {
      window.addEventListener(KARMA_EVENT, callback);
      window.addEventListener("storage", callback);
      return () => {
        window.removeEventListener(KARMA_EVENT, callback);
        window.removeEventListener("storage", callback);
      };
    },
    readKarmaRaw,
    () => SERVER,
  );
  if (raw === SERVER) return null;
  return parseKarma(raw);
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
