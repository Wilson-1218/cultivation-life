import { createLife, runToEnd, type Life } from "../src/lib/engine";
import {
  POPULATION,
  REALMS,
  ROOTS,
  censusTotal,
  type RealmId,
  type RootId,
  type Setup,
} from "../src/lib/world";

const ROOT_IDS = ["wei", "zhen", "tian", "bian"] as const;

function setup(seed: number): Setup {
  return { world: "now", cohort: "entrant", pace: "incense", seed };
}

function tally(lives: Life[]) {
  const realms: Record<string, number> = {};
  let age = 0;
  let foundation = 0;
  let core = 0;
  let nascent = 0;
  let sawFoundation = 0;
  let sect = 0;
  let edge = 0;
  for (const life of lives) {
    realms[life.realm] = (realms[life.realm] ?? 0) + 1;
    age += life.age;
    if (life.succeeded.foundation || ["foundation", "core", "nascent"].includes(life.realm)) {
      foundation += 1;
    }
    if (life.succeeded.core || life.realm === "core" || life.realm === "nascent") core += 1;
    if (life.succeeded.nascent || life.realm === "nascent") nascent += 1;
    if (life.attempts.foundation > 0) sawFoundation += 1;
    if (life.sect) sect += 1;
    if (life.ending === "edge") edge += 1;
  }
  const n = lives.length;
  return {
    n,
    meanAge: Math.round(age / n),
    sawFoundation: pct(sawFoundation, n),
    foundation: pct(foundation, n),
    core: pct(core, n),
    nascent: pct(nascent, n),
    sect: pct(sect, n),
    edge,
    realms,
  };
}

function pct(count: number, total: number): string {
  return `${((count / total) * 100).toFixed(2)}% (${count})`;
}

function run(root: RootId | "mix", policy: "auto" | "steady", count: number): Life[] {
  const lives: Life[] = [];
  for (let i = 0; i < count; i += 1) {
    const seed = (0x1000 + i * 17 + (root === "mix" ? 3 : root.length * 99)) >>> 0;
    const life = createLife(setup(seed || 1), {
      companions: false,
      forceRoot: root === "mix" ? undefined : root,
    });
    lives.push(runToEnd(life, policy));
  }
  return lives;
}

function estimateLiving(lives: Life[]) {
  const years: Record<RealmId, number> = {
    "qi-early": 0,
    "qi-mid": 0,
    "qi-late": 0,
    "qi-peak": 0,
    foundation: 0,
    core: 0,
    nascent: 0,
    spirit: 0,
  };
  let totalYears = 0;
  for (const life of lives) {
    for (const span of life.spans) {
      const to = span.toAge ?? life.age;
      const spanYears = Math.max(0, to - span.fromAge);
      years[span.realm] += spanYears;
      totalYears += spanYears;
    }
  }
  const meanLife = totalYears / lives.length;
  const births = POPULATION / meanLife;
  console.log(`\n平均在世 ${meanLife.toFixed(1)} 年，每年新入道約 ${Math.round(births)} 人`);
  let sum = 0;
  for (const realm of REALMS) {
    const living = Math.round((years[realm.id] / lives.length) * births);
    sum += living;
    console.log(`${realm.name}\t${living}`);
  }
  console.log(`合計 ${sum}`);
}

console.log("census", censusTotal(), "target", POPULATION);
for (const root of ROOT_IDS) {
  console.log("\n==", ROOTS[root].name, "auto ==");
  console.log(tally(run(root, "auto", 280)));
  console.log("steady", tally(run(root, "steady", 180)));
}
console.log("\n== mix auto ==");
const mixed = run("mix", "auto", 900);
console.log(tally(mixed));
estimateLiving(mixed);
