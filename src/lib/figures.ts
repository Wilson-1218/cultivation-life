import type { Household } from "@/lib/household";

export const INK_FIGURES = [
  "/figures/ink-01.jpg",
  "/figures/ink-02.jpg",
  "/figures/ink-03.jpg",
  "/figures/ink-04.jpg",
  "/figures/ink-05.jpg",
  "/figures/ink-06.jpg",
  "/figures/ink-07.jpg",
  "/figures/ink-08.jpg",
  "/figures/ink-09.jpg",
  "/figures/ink-10.jpg",
  "/figures/ink-11.jpg",
  "/figures/ink-12.jpg",
] as const;

function hashName(name: string): number {
  let hash = 2166136261;
  for (const char of name) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return hash >>> 0;
}

function claim(map: Map<string, string>, used: Set<number>, name: string) {
  if (!name || map.has(name)) return;
  let index = hashName(name) % INK_FIGURES.length;
  if (used.size < INK_FIGURES.length) {
    let guard = 0;
    while (used.has(index) && guard < INK_FIGURES.length) {
      index = (index + 1) % INK_FIGURES.length;
      guard += 1;
    }
  }
  used.add(index);
  map.set(name, INK_FIGURES[index]!);
}

export function figureMap(life: {
  name: string;
  household: Household | null;
  companions: { name: string }[];
}): Map<string, string> {
  const map = new Map<string, string>();
  const used = new Set<number>();
  claim(map, used, life.name);
  const house = life.household;
  if (house) {
    const people = [house.father, house.mother, ...house.siblings, house.spouse, ...house.children];
    for (const kin of people) {
      if (kin.present || kin.dead || kin.away) claim(map, used, kin.name);
    }
  }
  for (const companion of life.companions) claim(map, used, companion.name);
  return map;
}
