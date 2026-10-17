import { AFFAIRS, type Affair } from "@/lib/affair-data";
import { bindHousehold, householdBlocks, type Household } from "@/lib/household";

export { AFFAIRS };
import { SECTS, type OriginId, type RootId } from "@/lib/world";

type Rng = { next: () => number };

export type AffairHost = {
  stones: number;
  heart: number;
  ling: number;
  insight: number;
  bond: number;
  sect: string | null;
  manual: string | null;
  owed: boolean;
  saved: boolean;
  learnedPage: boolean;
  scarred: boolean;
  hadCave: boolean;
  originId: OriginId;
  root: RootId;
  seenEvents: string[];
  household?: Household | null;
  mortal?: boolean;
};

function pick<T>(rng: Rng, items: readonly T[]): T {
  return items[Math.floor(rng.next() * items.length)]!;
}

function pickExpiring(rng: Rng, items: readonly Affair[]): Affair {
  let soonest = items[0]!.maxAge;
  for (const item of items) if (item.maxAge < soonest) soonest = item.maxAge;
  const band = items.filter((item) => item.maxAge <= soonest + 4);
  return pick(rng, band);
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export function eligibleAffairs(life: AffairHost, age: number): Affair[] {
  return AFFAIRS.filter((item) => {
    if (life.seenEvents.includes(item.id)) return false;
    if (age < item.minAge || age > item.maxAge) return false;
    if (item.origin && item.origin !== life.originId) return false;
    if (life.mortal && item.root) return false;
    if (item.root && item.root !== life.root) return false;
    if (age < 12 && (item.maxAge > 22 || item.shape === "cave" || item.shape === "page" || item.shape === "risk")) {
      return false;
    }
    const blob = `${item.title}${item.text}${item.choices.map((choice) => choice.label + choice.line).join("")}`;
    if (age > 0 && /接生|添了你/.test(blob)) return false;
    if (householdBlocks(life.household, life.mortal, blob, item.shape)) return false;
    return true;
  });
}

export function drawAffairs(
  life: AffairHost,
  rng: Rng,
  age: number,
  slots: number,
  allowChoice: boolean,
): { beats: Affair[]; choice: Affair | null } {
  const pool = eligibleAffairs(life, age);
  const beats = pool.filter((item) => item.kind === "beat");
  const choices = pool.filter((item) => item.kind === "choice");
  let choice: Affair | null = null;
  if (allowChoice && choices.length > 0) choice = pickExpiring(rng, choices);
  const need = Math.max(0, slots - (choice ? 1 : 0));
  const picked: Affair[] = [];
  let left = beats;
  while (picked.length < need && left.length > 0) {
    const beat = pickExpiring(rng, left);
    picked.push(beat);
    left = left.filter((item) => item !== beat);
  }
  return { beats: picked, choice };
}

export function applyBeat(life: AffairHost, rng: Rng, affair: Affair): string {
  if (affair.shape === "coin") life.stones += 2 + Math.round(rng.next() * 6);
  if (affair.shape === "heart") life.heart = clamp(life.heart + 2);
  if (affair.shape === "wound") {
    life.heart = clamp(life.heart - 4);
    life.scarred = true;
  }
  life.stones = Math.max(0, Math.round(life.stones));
  return bindHousehold(affair.text, life.household);
}

export function affairChoices(life: { originId: OriginId }, affair: Affair): { id: string; label: string; hint: string }[] {
  const choices = affair.choices.map((choice, index) => ({
    id: `${affair.id}:${index === 0 ? "a" : "b"}`,
    label: choice.label,
    hint:
      affair.shape === "road"
        ? index === 0
          ? "東西可以不要。人通常還在。"
          : "可能到手，人多半會傷到。"
        : index === 0
          ? "這條會留下後果。"
          : "這條通常更輕。",
  }));
  if (affair.shape === "road" && life.originId === "clan") {
    choices.push({
      id: `${affair.id}:elder`,
      label: "叫家族長輩",
      hint: "旁系的名頭有時有用。人多半還在。",
    });
  }
  return choices;
}

export function resolveAffair(
  life: AffairHost,
  rng: Rng,
  affair: Affair,
  choiceId: string,
): { line: string; die: boolean; cause: string; grudge: boolean } {
  const which = choiceId.endsWith(":elder") ? "elder" : choiceId.endsWith(":b") ? "b" : "a";
  if (affair.shape === "road") {
    const dieAt = which === "b" ? 0.42 : which === "elder" ? 0.12 : 0.08;
    if (rng.next() < dieAt) {
      const cause =
        which === "b" ? "上前爭奪，沒有回來" : which === "elder" ? "叫了長輩，還是沒有回來" : "跑的時候被波及";
      const line =
        which === "b"
          ? "你衝上去。人沒有回來。"
          : which === "elder"
            ? "長輩沒有趕上。你沒有回來。"
            : "你跑了，還是被波及。";
      return { line, die: true, cause, grudge: which !== "a" };
    }
    if (which === "b") life.scarred = true;
    if (which === "elder") {
      life.heart = clamp(life.heart - 2);
      return { line: "你叫了家族長輩。人到了，東西沒有全到手，你還在。", die: false, cause: "", grudge: false };
    }
    const chosen = affair.choices[which === "b" ? 1 : 0];
    return { line: chosen?.line ?? "這一年過去了。", die: false, cause: "", grudge: which === "b" };
  }
  const index = which === "b" ? 1 : 0;
  const chosen = affair.choices[index];
  if (index === 0) {
    if (affair.shape === "sect" && !life.sect) {
      const salt = [...(life.household?.hamlet ?? life.originId)].reduce((sum, char) => sum + char.charCodeAt(0), 0);
      life.sect = SECTS[salt % SECTS.length] ?? "青汀門";
    }
    if (affair.shape === "owe") life.owed = true;
    if (affair.shape === "page") {
      life.manual = life.manual ?? affair.title;
      life.learnedPage = true;
    }
    if (affair.shape === "help") life.saved = true;
    if (affair.shape === "cave") life.hadCave = true;
    if (affair.shape === "trade") life.stones = Math.max(0, life.stones - 8);
    if (affair.shape === "risk") life.scarred = true;
    if (affair.shape === "ask") life.insight = clamp(life.insight + 3);
  } else if (affair.shape === "help") {
    life.bond = clamp(life.bond - 2);
  }
  life.stones = Math.max(0, Math.round(life.stones));
  return { line: chosen?.line ?? affair.text, die: false, cause: "", grudge: false };
}
