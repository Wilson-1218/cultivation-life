import {
  FOCUSES,
  MANUALS,
  NAMES,
  PACES,
  QI_REALMS,
  REGIONS,
  ROOTS,
  SECTS,
  TUNING,
  WORLDS,
  clamp,
  formatCount,
  formatPeople,
  gateCost,
  gateLabel,
  nextRealm,
  realmById,
  rootPopulation,
  type FocusId,
  type GateId,
  type RealmId,
  type RootId,
  type Setup,
} from "./world";

export type LogEntry = {
  id: string;
  age: number;
  kind: "chapter" | "choice" | "pause" | "system";
  text: string;
  starred: boolean;
};

export type ChoiceOption = {
  id: string;
  label: string;
  hint: string;
};

export type Pending =
  | {
      type: "choice";
      id: string;
      title: string;
      body: string;
      choices: ChoiceOption[];
    }
  | {
      type: "reflect";
      id: string;
      prompt: string;
    };

export type Span = {
  realm: RealmId;
  fromAge: number;
  toAge: number | null;
};

export type Companion = {
  name: string;
  root: RootId;
  region: string;
  spans: Span[];
  deathAge: number | null;
  ending: "dead" | "edge";
  cause: string;
  finalRealm: RealmId;
  finalAge: number;
};

export type Reflection = {
  id: string;
  prompt: string;
  text: string;
};

export type Life = {
  id: string;
  setup: Setup;
  rngState: number;
  logSeq: number;
  name: string;
  region: string;
  root: RootId;
  age: number;
  years: number;
  realm: RealmId;
  progress: number;
  lifespan: number;
  ling: number;
  heart: number;
  insight: number;
  bond: number;
  stones: number;
  focus: FocusId;
  sect: string | null;
  manual: string | null;
  pillReady: boolean;
  relative: boolean;
  senior: boolean;
  gateLockUntil: number;
  attempts: Record<GateId, number>;
  succeeded: Record<GateId, boolean>;
  breakthroughAge: number | null;
  seenEvents: string[];
  seenReflect: string[];
  pending: Pending | null;
  log: LogEntry[];
  reflections: Reflection[];
  spans: Span[];
  companions: Companion[];
  origin: string;
  dead: boolean;
  ending: "ongoing" | "dead" | "edge";
  cause: string;
};

type Rng = {
  next: () => number;
  state: () => number;
};

type StepResult = "next" | "pending" | "dead" | "edge";

const REFLECTS: { id: string; prompt: string; test: (life: Life) => boolean }[] = [
  {
    id: "y10",
    prompt: "入道第十年。這十年你把最多的光陰給了什麼？",
    test: (life) => life.years >= 10,
  },
  {
    id: "a40",
    prompt: "四十歲。若最後仍停在煉氣，你覺得這些年算不算白費？",
    test: (life) => life.age >= 40,
  },
  {
    id: "a70",
    prompt: "七十歲。壽元開始變得具體。你想記住現在的哪一件事？",
    test: (life) => life.age >= 70,
  },
  {
    id: "late",
    prompt: "剩下的壽元不到三成。你想對剛入道的自己說什麼？",
    test: (life) => life.age > 55 && life.lifespan - life.age <= life.lifespan * 0.3,
  },
  {
    id: "foundation-decade",
    prompt: "築基之後，壽元突然變長。你第一件想補上的事是什麼？",
    test: (life) =>
      life.breakthroughAge !== null &&
      life.age >= life.breakthroughAge + 10 &&
      (life.realm === "foundation" || life.realm === "core" || life.realm === "nascent"),
  },
];

export function randomSeed(): number {
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0] || 1;
  }
  return (Math.floor(Math.random() * 0xffffffff) >>> 0) || 1;
}

export function isFinished(life: Life): boolean {
  return life.dead || life.ending === "edge";
}

export function createLife(
  setup: Setup,
  options?: { companions?: boolean; forceRoot?: RootId },
): Life {
  const withCompanions = options?.companions !== false;
  const rng = makeRng(setup.seed || 1);
  const root = options?.forceRoot ?? rollRoot(rng);
  const name = pick(rng, NAMES);
  const region = pick(rng, REGIONS);
  const living = setup.cohort === "living";
  const relative = living && rng.next() < 0.22;
  const stones = rollStones(rng, living, WORLDS[setup.world].stones);
  const realm = realmById("qi-early");
  const life: Life = {
    id: (setup.seed || 1).toString(16),
    setup,
    rngState: rng.state(),
    logSeq: 1,
    name,
    region,
    root,
    age: 16,
    years: 0,
    realm: "qi-early",
    progress: Math.round(rng.next() * 10),
    lifespan: realm.lifespan,
    ling: clamp(42 + rng.next() * 18 + (root === "tian" ? 8 : root === "wei" ? -4 : 0)),
    heart: clamp(46 + rng.next() * 16),
    insight: clamp((living ? 30 : 22) + rng.next() * 12),
    bond: clamp((living ? 32 : 20) + rng.next() * 10 + (relative ? 6 : 0)),
    stones,
    focus: "cycle",
    sect: null,
    manual: null,
    pillReady: false,
    relative,
    senior: false,
    gateLockUntil: 0,
    attempts: { foundation: 0, core: 0, nascent: 0 },
    succeeded: { foundation: false, core: false, nascent: false },
    breakthroughAge: null,
    seenEvents: [],
    seenReflect: [],
    pending: null,
    log: [],
    reflections: [],
    spans: [{ realm: "qi-early", fromAge: 16, toAge: null }],
    companions: [],
    origin: "",
    dead: false,
    ending: "ongoing",
    cause: "",
  };
  life.rngState = rng.state();
  life.origin = writeOrigin(life);
  life.log.push({
    id: `${life.id}-origin`,
    age: 16,
    kind: "system",
    text: life.origin,
    starred: false,
  });

  if (withCompanions) {
    const used = new Set([life.name]);
    life.companions = [1, 2, 3].map((salt) => {
      const companionSeed = mixSeed(setup.seed || 1, salt);
      const companion = runToEnd(
        createLife({ ...setup, seed: companionSeed }, { companions: false }),
      );
      if (used.has(companion.name)) {
        companion.name = NAMES.find((item) => !used.has(item)) ?? companion.name;
      }
      used.add(companion.name);
      return summarizeCompanion(companion);
    });
  }

  return life;
}

export function advance(life: Life, years?: number): Life {
  if (life.pending || isFinished(life)) return life;
  const draft = clone(life);
  const rng = makeRng(draft.rngState);
  const notes: string[] = [];
  const startAge = draft.age;
  const bundle = years ?? PACES[draft.setup.pace].years;
  let result: StepResult = "next";
  let stepped = 0;
  while (stepped < bundle) {
    result = stepYear(draft, rng, notes);
    stepped += 1;
    if (result !== "next") break;
  }
  draft.rngState = rng.state();
  if (stepped > 0) {
    draft.log.push({
      id: nextLogId(draft),
      age: draft.age,
      kind: "chapter",
      text: composeChapter(draft, rng, startAge, notes, result),
      starred: false,
    });
  }
  trimLog(draft);
  return draft;
}

export function applyChoice(life: Life, choiceId: string): Life {
  if (life.pending?.type !== "choice" || isFinished(life)) return life;
  const draft = clone(life);
  const rng = makeRng(draft.rngState);
  const pending = draft.pending;
  if (!pending || pending.type !== "choice") return life;
  const known = pending.choices.some((choice) => choice.id === choiceId);
  if (!known) {
    throw new Error("這個抉擇不在這一頁上");
  }
  draft.pending = null;
  resolveChoice(draft, rng, pending.id, choiceId);
  draft.rngState = rng.state();
  trimLog(draft);
  return draft;
}

export function applyReflection(life: Life, text: string): Life {
  if (life.pending?.type !== "reflect") return life;
  const draft = clone(life);
  const pending = draft.pending;
  if (!pending || pending.type !== "reflect") return life;
  const trimmed = text.trim().slice(0, 80);
  draft.seenReflect.push(pending.id);
  if (trimmed) {
    draft.reflections.push({ id: pending.id, prompt: pending.prompt, text: trimmed });
  }
  draft.log.push({
    id: nextLogId(draft),
    age: draft.age,
    kind: "pause",
    text: trimmed ? `你留下一句：「${trimmed}」` : "這一停，你沒有寫字。",
    starred: false,
  });
  draft.pending = null;
  trimLog(draft);
  return draft;
}

export function toggleStar(life: Life, logId: string): Life {
  return {
    ...life,
    log: life.log.map((entry) =>
      entry.id === logId ? { ...entry, starred: !entry.starred } : entry,
    ),
  };
}

export function autoFocus(life: Life): FocusId {
  const gate = availableGate(life);
  if (gate && life.stones < gateCost(gate) * 0.85 && life.age < life.lifespan - 6) {
    return "stone";
  }
  if (life.stones < 14) return "stone";
  if (life.heart < 34) return "ally";
  if (life.insight < 36 && life.years < 40) return "study";
  if (life.heart > 60 && life.ling > 45 && life.stones > 24) return "seclude";
  return "cycle";
}

export function autoChoiceId(life: Life): string {
  if (life.pending?.type !== "choice") {
    throw new Error("現在沒有要代選的抉擇");
  }
  const roll = mixSeed(life.rngState || 1, life.age + life.pending.choices.length) / 4294967296;
  const index = Math.min(
    life.pending.choices.length - 1,
    Math.floor(roll * life.pending.choices.length),
  );
  return life.pending.choices[index].id;
}

export function steadyChoiceId(life: Life): string {
  if (life.pending?.type !== "choice") {
    throw new Error("現在沒有要代選的抉擇");
  }
  if (life.pending.id.startsWith("gate-")) {
    const kind = life.pending.id.slice(5) as GateId;
    const cost = gateCost(kind);
    const late = life.age > life.lifespan * 0.78;
    if (life.stones >= cost && (life.heart >= 36 || late)) return `${life.pending.id}:go`;
    if (late && life.attempts[kind] === 0) return `${life.pending.id}:go`;
    if (life.attempts[kind] >= 2) return `${life.pending.id}:drop`;
    return `${life.pending.id}:wait`;
  }
  const prefer = life.pending.choices.find((choice) => choice.id.endsWith(":steady"));
  return (prefer ?? life.pending.choices[0]).id;
}

export function runToEnd(life: Life, policy: "auto" | "steady" = "auto"): Life {
  let current = life;
  let guard = 0;
  while (!isFinished(current) && guard < 6000) {
    if (current.pending?.type === "choice") {
      const choiceId = policy === "steady" ? steadyChoiceId(current) : autoChoiceId(current);
      current = applyChoice(current, choiceId);
    } else if (current.pending?.type === "reflect") {
      current = applyReflection(current, "");
    } else {
      current = advance({ ...current, focus: autoFocus(current) }, 1);
    }
    guard += 1;
  }
  if (!isFinished(current)) {
    const draft = clone(current);
    markDeath(draft, "這一世在推演裡停住了");
    draft.log.push({
      id: nextLogId(draft),
      age: draft.age,
      kind: "chapter",
      text: "這一世在推演裡停住了。",
      starred: false,
    });
    return draft;
  }
  return current;
}

export function companionNow(companion: Companion, age: number): {
  realm: RealmId;
  alive: boolean;
  text: string;
} {
  let realm = companion.spans[0]?.realm ?? "qi-early";
  for (const span of companion.spans) {
    if (span.fromAge <= age) realm = span.realm;
  }
  const alive = companion.deathAge === null || age < companion.deathAge;
  const root = ROOTS[companion.root].name;
  if (!alive) {
    return {
      realm,
      alive: false,
      text: `${companion.name} · ${root} · ${companion.deathAge}歲${companion.cause}，停在${realmById(companion.finalRealm).name}`,
    };
  }
  if (companion.ending === "edge" && age >= companion.finalAge) {
    return {
      realm,
      alive: true,
      text: `${companion.name} · ${root} · 還活著，停在化神之前`,
    };
  }
  return {
    realm,
    alive: true,
    text: `${companion.name} · ${root} · ${age}歲時在${realmById(realm).name}`,
  };
}

function stepYear(life: Life, rng: Rng, notes: string[]): StepResult {
  if (life.age >= life.lifespan) {
    markDeath(life, "壽元耗盡");
    return "dead";
  }
  const ratio = (life.age + 1) / life.lifespan;
  if (ratio > 0.93 && rng.next() < (ratio - 0.93) * 0.55) {
    markDeath(life, "壽元將盡");
    return "dead";
  }

  applyYear(life, rng, notes);

  if (life.focus === "seclude" && life.heart < 27 && rng.next() < 0.045) {
    life.ling = clamp(life.ling - 14);
    life.heart = clamp(life.heart - 6);
    notes.push("閉關時靈氣亂了一下，你提前出關。");
    if (life.heart < 14 && rng.next() < 0.4) {
      life.age += 1;
      life.years += 1;
      markDeath(life, "走火，心境沒有撐住");
      return "dead";
    }
  }

  life.age += 1;
  life.years += 1;
  updateQi(life, notes);

  if (life.realm === "nascent" && life.progress >= TUNING.edgeAt) {
    life.ending = "edge";
    life.cause = "停在化神之前";
    closeSpan(life, life.age);
    return "edge";
  }
  if (openGate(life)) return "pending";
  if (openReflect(life)) return "pending";
  if (life.years >= 3 && rng.next() < TUNING.eventChance && openEvent(life, rng)) {
    return "pending";
  }
  return "next";
}

function applyYear(life: Life, rng: Rng, notes: string[]): void {
  const focus = FOCUSES[life.focus];
  const world = WORLDS[life.setup.world];
  const root = ROOTS[life.root];
  if (life.sect) {
    life.stones += Math.round(TUNING.sectPay * world.stones);
  }
  if (life.focus === "stone") {
    const mined =
      (4.2 + life.insight / 20 + life.bond / 34) * world.stones * (0.72 + rng.next() * 0.75);
    life.stones += mined;
  }
  life.stones = Math.max(0, life.stones + focus.stone * world.stones);
  const broke = life.stones <= 0;
  life.ling = clamp(life.ling + focus.ling - (life.age > 55 ? 0.12 : 0));
  life.heart = clamp(life.heart + focus.heart);
  life.insight = clamp(life.insight + focus.insight);
  life.bond = clamp(life.bond + focus.bond);
  const stoneFactor = 0.46 + Math.min(0.7, Math.log10(life.stones + 1) / 5.4);
  const lingFactor = 0.66 + life.ling / 190;
  const hunger = broke ? 0.62 : 1;
  const soft =
    life.realm === "nascent"
      ? 1200
      : life.realm === "core"
        ? 1000
        : life.realm === "foundation"
          ? 720
          : life.root === "wei"
            ? 115
              : life.root === "zhen"
                ? 300
                : life.root === "bian"
                  ? 420
                  : 460;
  const drag = life.progress < soft ? 1 : 1 / (1 + (life.progress - soft) / 65);
  const gain =
    root.speed *
    stoneFactor *
    lingFactor *
    focus.progress *
    world.progress *
    hunger *
    drag *
    (0.86 + rng.next() * 0.26);
  life.progress = clamp(life.progress + gain, 0, 1300);
  if (broke && !notes.includes("靈石見底，吐納發虛。")) {
    notes.push("靈石見底，吐納發虛。");
  }
  life.stones = Math.max(0, Math.round(life.stones));
}

function updateQi(life: Life, notes: string[]): void {
  if (!QI_REALMS.includes(life.realm)) return;
  let next: RealmId = "qi-early";
  if (life.progress >= TUNING.qiPeak) next = "qi-peak";
  else if (life.progress >= TUNING.qiLate) next = "qi-late";
  else if (life.progress >= TUNING.qiMid) next = "qi-mid";
  if (next === life.realm) return;
  changeRealm(life, next);
  notes.push(`境界跨到${realmById(next).name}。這個境界的壽元記到${life.lifespan}歲。`);
}

function openGate(life: Life): boolean {
  if (life.age < life.gateLockUntil) return false;
  const gate = availableGate(life);
  if (!gate) return false;
  const cost = gateCost(gate);
  const paying = life.stones >= cost;
  const prepared = gateChance(life, gate, true);
  const empty = gateChance(life, gate, false);
  const label = gateLabel(gate);
  life.pending = {
    type: "choice",
    id: `gate-${gate}`,
    title: `${label}關`,
    body: gateBody(life, label, cost, paying, prepared, empty),
    choices: [
      {
        id: `gate-${gate}:go`,
        label: paying ? `花 ${formatCount(cost)} 塊靈石去衝` : "空手去試",
        hint: paying ? "備齊了再衝，機會比較實在。" : "靈石不夠，成功率會掉下去。",
      },
      {
        id: `gate-${gate}:wait`,
        label: "再熬幾年，先去謀石",
        hint: "這一關先按下。接下來幾年以靈石為重。",
      },
      {
        id: `gate-${gate}:drop`,
        label: "這次不衝",
        hint: "把日子過穩。關口還在，只是先不撞。",
      },
    ],
  };
  return true;
}

function gateBody(
  life: Life,
  label: string,
  cost: number,
  paying: boolean,
  prepared: number,
  empty: number,
): string {
  const afford = paying
    ? `你手上有 ${formatCount(life.stones)} 塊，夠付這一回。`
    : `你手上只有 ${formatCount(life.stones)} 塊，不夠 ${formatCount(cost)}。空手去試，大約${chanceText(empty)}。`;
  return `修為頂到了${label}這扇門。門不看你坐了多少年，看靈石、心境，以及入道時就定下的靈根。備齊要 ${formatCount(cost)} 塊下品靈石，大約${chanceText(prepared)}。${afford}`;
}

function openReflect(life: Life): boolean {
  const next = REFLECTS.find(
    (item) => !life.seenReflect.includes(item.id) && item.test(life),
  );
  if (!next) return false;
  life.pending = { type: "reflect", id: next.id, prompt: next.prompt };
  return true;
}

function openEvent(life: Life, rng: Rng): boolean {
  const available = EVENTS.filter(
    (event) => !life.seenEvents.includes(event.id) && event.when(life),
  );
  if (available.length === 0) return false;
  const event = pick(rng, available);
  life.seenEvents.push(event.id);
  life.pending = event.make(life);
  return true;
}

function resolveChoice(life: Life, rng: Rng, pendingId: string, choiceId: string): void {
  if (pendingId.startsWith("gate-")) {
    resolveGate(life, rng, pendingId.slice(5) as GateId, choiceId);
    return;
  }
  const event = EVENTS.find((item) => item.id === pendingId);
  if (!event) throw new Error("找不到這段際遇");
  event.resolve(life, rng, choiceId);
}

function resolveGate(life: Life, rng: Rng, kind: GateId, choiceId: string): void {
  const label = gateLabel(kind);
  if (choiceId.endsWith(":wait")) {
    life.gateLockUntil = life.age + 4;
    life.focus = "stone";
    pushLog(life, "choice", "你把這一關按下。接下來幾年先去謀石。");
    return;
  }
  if (choiceId.endsWith(":drop")) {
    life.gateLockUntil = life.age + 12;
    life.heart = clamp(life.heart + 3);
    pushLog(life, "choice", `你這次不衝${label}。壽元還在走，門也還在。`);
    return;
  }
  const cost = gateCost(kind);
  const paying = life.stones >= cost;
  const paid = paying ? cost : life.stones;
  const chance = gateChance(life, kind, paying);
  life.stones = Math.max(0, life.stones - paid);
  life.attempts[kind] += 1;
  if (kind === "foundation") life.pillReady = false;
  const success = rng.next() < chance;
  if (success) {
    life.progress = progressAfter(kind);
    changeRealm(life, nextRealm(kind));
    life.succeeded[kind] = true;
    if (kind === "foundation" && life.breakthroughAge === null) {
      life.breakthroughAge = life.age;
    }
    life.ling = clamp(life.ling - 12);
    life.heart = clamp(life.heart - 6);
    life.gateLockUntil = life.age + 3;
    pushLog(
      life,
      "choice",
      `${label}成了。花了 ${formatCount(paid)} 塊靈石。壽元改記成 ${life.lifespan} 歲。靈力被抽空一截，人還在。`,
    );
    return;
  }
  life.progress = Math.max(80, life.progress - 42);
  syncQiToProgress(life);
  life.ling = clamp(life.ling - 18);
  life.heart = clamp(life.heart - 10);
  life.lifespan = Math.max(life.age + 2, life.lifespan - 6);
  life.gateLockUntil = life.age + 5;
  const fatal = rng.next() < (life.heart < 28 ? 0.16 : 0.07);
  if (fatal) {
    markDeath(life, "突破失敗，靈力潰散");
    pushLog(
      life,
      "choice",
      `${label}失敗，靈力沒有收回來。花掉的 ${formatCount(paid)} 塊靈石也不在了。你停在這裡。`,
    );
    return;
  }
  pushLog(
    life,
    "choice",
    `${label}沒有成。花了 ${formatCount(paid)} 塊靈石，壽元短了六年，修為被打回一截。人還在。`,
  );
}

function gateChance(life: Life, kind: GateId, paying: boolean): number {
  const root = ROOTS[life.root];
  let chance = root.gates[kind];
  chance *= paying ? 1 : 0.24;
  chance *= 0.76 + Math.min(life.insight, 72) / 155;
  if (life.heart < 30) chance *= 0.6;
  else if (life.heart > 70) chance *= 1.08;
  if (life.sect) chance *= 1.16;
  if (life.pillReady && kind === "foundation") chance *= 1.32;
  if (life.senior) chance *= 1.12;
  if (life.ling < 25) chance *= 0.72;
  chance *= WORLDS[life.setup.world].gate;
  return clamp(chance, 0.004, 0.74);
}

function availableGate(life: Life): GateId | null {
  if (
    QI_REALMS.includes(life.realm) &&
    life.progress >= TUNING.foundationAt &&
    life.attempts.foundation < 3 &&
    !life.succeeded.foundation
  ) {
    return "foundation";
  }
  if (
    life.realm === "foundation" &&
    life.progress >= TUNING.coreAt &&
    life.attempts.core < 2 &&
    !life.succeeded.core
  ) {
    return "core";
  }
  if (
    life.realm === "core" &&
    life.progress >= TUNING.nascentAt &&
    life.attempts.nascent < 1 &&
    !life.succeeded.nascent
  ) {
    return "nascent";
  }
  return null;
}

function syncQiToProgress(life: Life): void {
  if (!QI_REALMS.includes(life.realm)) return;
  let next: RealmId = "qi-early";
  if (life.progress >= TUNING.qiPeak) next = "qi-peak";
  else if (life.progress >= TUNING.qiLate) next = "qi-late";
  else if (life.progress >= TUNING.qiMid) next = "qi-mid";
  if (next !== life.realm) changeRealm(life, next);
}

function changeRealm(life: Life, realm: RealmId): void {
  if (life.realm === realm) return;
  closeSpan(life, life.age);
  life.realm = realm;
  life.spans.push({ realm, fromAge: life.age, toAge: null });
  const cap = realmById(realm).lifespan;
  if (life.lifespan < cap) life.lifespan = cap;
}

function closeSpan(life: Life, age: number): void {
  const span = life.spans[life.spans.length - 1];
  if (span && span.toAge === null) span.toAge = age;
}

function markDeath(life: Life, cause: string): void {
  life.dead = true;
  life.ending = "dead";
  life.cause = cause;
  closeSpan(life, life.age);
}

function progressAfter(kind: GateId): number {
  if (kind === "foundation") return 530;
  if (kind === "core") return 790;
  return 970;
}

function composeChapter(
  life: Life,
  rng: Rng,
  startAge: number,
  notes: string[],
  result: StepResult,
): string {
  if (result === "dead" && life.age === startAge) {
    return `${life.age}歲。${life.cause}。你停在${realmById(life.realm).name}。`;
  }
  const span =
    startAge === life.age ? `${life.age}歲這一年。` : `${startAge}歲到${life.age}歲。`;
  const focusLine = pick(rng, FOCUS_LINES[life.focus]);
  const extra = notes.join("");
  if (result === "dead") {
    return `${span}${focusLine}${extra}${life.cause}。你停在${realmById(life.realm).name}。`;
  }
  if (result === "edge") {
    return `${span}${focusLine}${extra}你還活著，修為停在化神之前。再往上，這一輪不寫。`;
  }
  return `${span}${focusLine}${extra}`;
}

const FOCUS_LINES: Record<FocusId, readonly string[]> = {
  cycle: [
    "你把這些年份用在吐納上。靈氣稀，丹田裡只積下一點點。",
    "吐納佔去白天。旁人看你坐著，你知道那點靈氣進得有多慢。",
    "這幾年幾乎沒有別的事，就是吸氣、吐氣。口袋輕了，胸口那點熱還在。",
  ],
  stone: [
    "你在坊市與山腳之間找靈石。修為幾乎沒動，袋子裡總算有了聲音。",
    "這幾年以謀石為主。換到的多半是碎屑，碎屑也比空口袋強。",
    "你先把修煉放下，去跟人換、去採、去守夜。心境被磨薄了一層。",
  ],
  study: [
    "你拿這些時間問功法。聽得懂的不多，盲衝的念頭少了。",
    "殘頁、閒話、別人失敗的例子，你都記了一點。見識比修為漲得快。",
    "這幾年沒有閉死在洞裡。你比較知道自己的根吃哪一種路。",
  ],
  ally: [
    "你把時間分給同行的人。修為慢，可是有人會在你缺丹時提一句。",
    "結伴的日子吵過，也一起挨過。人脈厚了一點，心境沒那麼緊。",
    "你不再一個人守著那點靈氣。慢是慢，夜裡沒那麼空。",
  ],
  seclude: [
    "你閉關。名額與價錢先不管，只把靈氣往裡壓。",
    "洞門關著的這幾年，是修為走得比較快的一段。人脈淡了。",
    "出關時丹田熱，心裡乾。這種換法不能連續太久。",
  ],
};

type LifeEvent = {
  id: string;
  when: (life: Life) => boolean;
  make: (life: Life) => Pending;
  resolve: (life: Life, rng: Rng, choiceId: string) => void;
};

const EVENTS: LifeEvent[] = [
  {
    id: "pill-shop",
    when: (life) => life.years >= 6 && life.years <= 36,
    make: () => ({
      type: "choice",
      id: "pill-shop",
      title: "坊市的續氣丹",
      body: "攤上有一小瓶續氣丹，開口要 40 塊下品靈石。賣的人說衝關前服下，靈力會穩一點。這種話你聽過很多次。",
      choices: [
        { id: "pill-shop:buy", label: "買下", hint: "花 40 塊。若真有用，下一次築基用得上。" },
        { id: "pill-shop:steady", label: "把靈石留著", hint: "不買。口袋維持現狀。" },
      ],
    }),
    resolve: (life, _rng, choiceId) => {
      if (!choiceId.endsWith(":buy")) {
        pushLog(life, "choice", "你沒有買那瓶丹。靈石還在，心裡也還是沒底。");
        return;
      }
      if (life.stones < 40) {
        life.heart = clamp(life.heart - 3);
        pushLog(life, "choice", "你把口袋翻開，不夠 40 塊。攤子已經收了。");
        return;
      }
      life.stones -= 40;
      life.pillReady = true;
      life.ling = clamp(life.ling + 6);
      pushLog(life, "choice", "你買了。瓶子很小，靈力卻穩了一陣。下一次衝築基用得上。");
    },
  },
  {
    id: "sect-exam",
    when: (life) => !life.sect && life.years >= 4 && life.years <= 30,
    make: (life) => ({
      type: "choice",
      id: "sect-exam",
      title: "外門招錄",
      body: `${pickStable(life, SECTS)}在附近招外門。名額不多，人從坡下排到橋邊。去考要耗掉這一年，考上了才有每年一點靈石和一部能看的功法。`,
      choices: [
        { id: "sect-exam:go", label: "去應考", hint: "這一年修為幾乎停住。錄不錄得上，看根，也看見識。" },
        { id: "sect-exam:steady", label: "繼續散修", hint: "不排隊。名額讓給別人。" },
      ],
    }),
    resolve: (life, rng, choiceId) => {
      if (!choiceId.endsWith(":go")) {
        pushLog(life, "choice", "你沒有去排隊。散修的日子照舊，名額與你無關。");
        return;
      }
      life.progress = Math.max(0, life.progress - 8);
      const sect = pickStable(life, SECTS);
      let chance = ROOTS[life.root].exam * (0.68 + life.insight / 145);
      chance *= WORLDS[life.setup.world].gate;
      if (life.relative) chance += 0.12;
      chance = clamp(chance, 0.03, 0.88);
      if (rng.next() < chance) {
        life.sect = sect;
        life.bond = clamp(life.bond + 12);
        life.insight = clamp(life.insight + 8);
        life.stones += 24;
        life.manual = life.manual ?? pickStable(life, MANUALS);
        pushLog(
          life,
          "choice",
          `你進了${sect}外門。每年有一點靈石，也有一部${life.manual}可以看。修為這一年幾乎沒動。`,
        );
        return;
      }
      life.heart = clamp(life.heart - 7);
      pushLog(life, "choice", `榜上沒有你。${sect}的名額滿了。你回到原來的地方，心境沉了一截。`);
    },
  },
  {
    id: "borrow",
    when: (life) => life.bond >= 42 && life.stones >= 24 && life.years >= 8,
    make: () => ({
      type: "choice",
      id: "borrow",
      title: "同修開口借靈石",
      body: "跟你一起吐納過的人缺 20 塊靈石買藥。對方說以後秘境的出產對半分。這種約定，還回來的少。",
      choices: [
        { id: "borrow:give", label: "借出 20 塊", hint: "人脈會暖。口袋會空。還不還，沒有把握。" },
        { id: "borrow:steady", label: "拒絕", hint: "靈石留下。這段關係會冷。" },
      ],
    }),
    resolve: (life, _rng, choiceId) => {
      if (!choiceId.endsWith(":give")) {
        life.bond = clamp(life.bond - 8);
        life.heart = clamp(life.heart - 2);
        pushLog(life, "choice", "你拒絕了。對方沒有吵，以後坊市裡少跟你說話。");
        return;
      }
      life.stones = Math.max(0, life.stones - 20);
      life.bond = clamp(life.bond + 10);
      life.heart = clamp(life.heart + 2);
      pushLog(life, "choice", "你借了 20 塊。人脈暖了一點。至於還不還，你沒有把握。");
    },
  },
  {
    id: "rift",
    when: (life) => life.years >= 14 && life.years <= 90,
    make: () => ({
      type: "choice",
      id: "rift",
      title: "秘境裂開一條縫",
      body: "附近的秘境提前開了一線。能進去的位置很少，外面已經有人打架。進去可能拿到靈石或殘頁，也可能靈力受傷。",
      choices: [
        { id: "rift:enter", label: "擠進去", hint: "有收穫，也有回不來的可能。" },
        { id: "rift:steady", label: "站遠一點", hint: "看完就走。這次機緣不拿。" },
      ],
    }),
    resolve: (life, rng, choiceId) => {
      if (!choiceId.endsWith(":enter")) {
        life.heart = clamp(life.heart + 2);
        pushLog(life, "choice", "你看完了。有人進去，有人沒有再出來。你還站在外面。");
        return;
      }
      const roll = rng.next();
      if (roll < 0.46) {
        const found = 36 + Math.floor(rng.next() * 150);
        life.stones += found;
        life.insight = clamp(life.insight + 10);
        if (!life.manual) life.manual = pick(rng, MANUALS);
        pushLog(
          life,
          "choice",
          `你擠了進去，又擠了出來。靈石多了 ${formatCount(found)} 塊，還記下一點路。`,
        );
        return;
      }
      if (roll < 0.92) {
        life.ling = clamp(life.ling - 16);
        life.heart = clamp(life.heart - 6);
        life.stones += 8;
        pushLog(life, "choice", "你被擠出來。靈力散了一大截，口袋裡只剩幾塊碎石。");
        return;
      }
      life.ling = clamp(life.ling - 20);
      markDeath(life, "秘境裡沒有走出來");
      pushLog(life, "choice", "縫口合上的時候，你不在外面。這一世停在秘境裡。");
    },
  },
  {
    id: "page",
    when: (life) => life.years >= 8 && life.years <= 70,
    make: () => ({
      type: "choice",
      id: "page",
      title: "一頁對不上的功法",
      body: "有人賣一頁手抄功法，要 30 塊靈石。字跡舊，跟坊市通行的口訣不是同一路。",
      choices: [
        { id: "page:buy", label: "買下這頁", hint: "花 30 塊。跟你的根合不合，買了才知道。" },
        { id: "page:steady", label: "不買", hint: "靈石留下。" },
      ],
    }),
    resolve: (life, rng, choiceId) => {
      if (!choiceId.endsWith(":buy")) {
        pushLog(life, "choice", "你沒有買。那頁功法被下一個來的人拿走。");
        return;
      }
      if (life.stones < 30) {
        pushLog(life, "choice", "你想買，口袋不夠 30 塊。頁子沒有留下。");
        return;
      }
      life.stones -= 30;
      life.insight = clamp(life.insight + (life.root === "bian" ? 12 : 6));
      if (life.root === "bian" || life.root === "tian") {
        life.progress += 18;
      }
      life.manual = life.manual ?? pick(rng, MANUALS);
      const fit =
        life.root === "bian"
          ? "這頁跟你的變異靈根居然對得上，修為實實在在動了一截。"
          : "你看得懂一部分。不算白花，也沒有立刻改命。";
      pushLog(life, "choice", `你買下那頁${life.manual}。${fit}`);
    },
  },
  {
    id: "vein",
    when: (life) => life.setup.world !== "past" && life.years >= 18 && life.years <= 100,
    make: () => ({
      type: "choice",
      id: "vein",
      title: "附近的靈脈又薄了",
      body: "你常去的那條靈脈，今年出氣少了一截。不是你一個人這樣說。八十億人一起吸，山不會變大。",
      choices: [
        { id: "vein:move", label: "換一處地方吐納", hint: "要花時間找。找到了也不見得更厚。" },
        { id: "vein:steady", label: "就地省著用", hint: "少跑，少耗。修為會更慢。" },
      ],
    }),
    resolve: (life, _rng, choiceId) => {
      if (choiceId.endsWith(":move")) {
        life.insight = clamp(life.insight + 3);
        life.heart = clamp(life.heart - 2);
        life.stones = Math.max(0, life.stones - 6);
        pushLog(life, "choice", "你換了一處山坳。靈氣沒有厚多少，至少不是原來那條快被吸乾的。");
        return;
      }
      life.ling = clamp(life.ling - 3);
      life.heart = clamp(life.heart + 3);
      life.progress = Math.max(0, life.progress - 6);
      pushLog(life, "choice", "你就地省著用。修為更慢了，人沒有再為一條薄脈奔波。");
    },
  },
  {
    id: "unrest",
    when: (life) => life.heart < 38 && life.years > 12,
    make: () => ({
      type: "choice",
      id: "unrest",
      title: "心境發浮",
      body: "吐納到一半，靈氣在經脈裡亂撞。還沒到走火，可是你聽得見自己的脈不對。",
      choices: [
        { id: "unrest:steady", label: "停下來，先養心", hint: "修為先放慢。心境拉回來。" },
        { id: "unrest:push", label: "硬壓下去", hint: "可能多擠出一點修為，也可能直接傷到。" },
      ],
    }),
    resolve: (life, rng, choiceId) => {
      if (choiceId.endsWith(":steady")) {
        life.heart = clamp(life.heart + 14);
        life.progress = Math.max(0, life.progress - 8);
        life.ling = clamp(life.ling + 2);
        pushLog(life, "choice", "你停了。這幾年的修為幾乎白放。脈慢慢穩回來。");
        return;
      }
      life.ling = clamp(life.ling + 4);
      life.heart = clamp(life.heart - 8);
      life.progress += 10;
      if (rng.next() < 0.18) {
        if (rng.next() < 0.28) {
          markDeath(life, "走火，心境沒有撐住");
          pushLog(life, "choice", "你硬壓。靈氣沒有回頭。這一世停在走火裡。");
          return;
        }
        life.ling = clamp(life.ling - 20);
        life.lifespan = Math.max(life.age + 2, life.lifespan - 5);
        pushLog(life, "choice", "你硬壓過去了，但經脈傷了一截，壽元短了五年。");
        return;
      }
      pushLog(life, "choice", "你硬壓過去了。修為多了一點，心境更薄。");
    },
  },
  {
    id: "chore",
    when: (life) => Boolean(life.sect) && life.years > 6,
    make: (life) => ({
      type: "choice",
      id: "chore",
      title: "宗門的差事",
      body: `${life.sect}要人去守一季靈田。沒有功法，有靈石。推掉也行，管事的會記住。`,
      choices: [
        { id: "chore:go", label: "去守", hint: "拿到靈石，這一年修為慢。" },
        { id: "chore:steady", label: "推掉", hint: "修煉照舊。外門對你會冷一點。" },
      ],
    }),
    resolve: (life, _rng, choiceId) => {
      if (choiceId.endsWith(":go")) {
        life.stones += 36;
        life.bond = clamp(life.bond + 4);
        life.progress = Math.max(0, life.progress - 6);
        life.heart = clamp(life.heart - 2);
        pushLog(life, "choice", `你替${life.sect}守了一季靈田，換回 36 塊靈石。修為這季幾乎沒長。`);
        return;
      }
      life.bond = clamp(life.bond - 6);
      life.heart = clamp(life.heart + 1);
      pushLog(life, "choice", "你推掉了。洞府還是你的，管事的下次少叫你。");
    },
  },
  {
    id: "band",
    when: (life) => !life.sect && life.bond < 48 && life.years >= 8 && life.years <= 55,
    make: () => ({
      type: "choice",
      id: "band",
      title: "有人約你結隊",
      body: "三個散修約你一起租一個破洞府，均攤靈石，夜裡輪流守。人多，嘴也雜。",
      choices: [
        { id: "band:join", label: "加入", hint: "人脈與心境會好一點，要攤靈石。" },
        { id: "band:steady", label: "獨行", hint: "不攤。也不欠誰。" },
      ],
    }),
    resolve: (life, _rng, choiceId) => {
      if (!choiceId.endsWith(":join")) {
        life.heart = clamp(life.heart - 1);
        life.insight = clamp(life.insight + 2);
        pushLog(life, "choice", "你沒有加入。洞還是一個人的，夜也是。");
        return;
      }
      life.bond = clamp(life.bond + 14);
      life.heart = clamp(life.heart + 6);
      life.stones = Math.max(0, life.stones - 8);
      pushLog(life, "choice", "你搬進那個破洞府。靈石攤掉 8 塊，夜裡總算有人換班。");
    },
  },
  {
    id: "life-pill",
    when: (life) => life.age > life.lifespan * 0.72 && life.years > 20,
    make: (life) => ({
      type: "choice",
      id: "life-pill",
      title: "延壽丹的傳聞",
      body: `有人說城南能買到延壽丹，要你積蓄的大半。真的話，壽元能多十二年。你現在有 ${formatCount(life.stones)} 塊靈石。`,
      choices: [
        { id: "life-pill:buy", label: "拿大半積蓄去買", hint: "可能是真的，也可能只剩一個更空的口袋。" },
        { id: "life-pill:steady", label: "當沒聽見", hint: "不賭這一下。" },
      ],
    }),
    resolve: (life, rng, choiceId) => {
      if (!choiceId.endsWith(":buy")) {
        pushLog(life, "choice", "你當沒聽見。壽元還是原來那個數字。");
        return;
      }
      const cost = Math.max(30, Math.floor(life.stones * 0.7));
      if (life.stones < 30) {
        pushLog(life, "choice", "你想賭，口袋裡連 30 塊都湊不出。傳聞與你無關。");
        return;
      }
      life.stones -= cost;
      if (rng.next() < 0.42) {
        life.lifespan += 12;
        pushLog(life, "choice", `丹是真的。花了 ${formatCount(cost)} 塊，壽元多了十二年。`);
        return;
      }
      life.heart = clamp(life.heart - 8);
      pushLog(life, "choice", `丹是假的。${formatCount(cost)} 塊靈石沒有了，壽元一個月都沒有多。`);
    },
  },
  {
    id: "mismatch",
    when: (life) => life.root === "bian" && life.years >= 5 && life.years <= 36,
    make: () => ({
      type: "choice",
      id: "mismatch",
      title: "功法不認你的根",
      body: "你借來的通行功法，轉到第二層就發澀。變異靈根不是不能修，是很多現成的路不讓你走。",
      choices: [
        { id: "mismatch:steady", label: "丟掉，自己摸一條慢路", hint: "眼前會慢。路若對上，後面才走得動。" },
        { id: "mismatch:force", label: "硬用通行功法", hint: "能動一點，經脈會不舒服。" },
      ],
    }),
    resolve: (life, _rng, choiceId) => {
      if (choiceId.endsWith(":steady")) {
        life.insight = clamp(life.insight + 8);
        life.progress += 16;
        life.heart = clamp(life.heart + 4);
        pushLog(life, "choice", "你放下那本通行功法，自己摸。慢，可是靈氣終於肯停在丹田裡。");
        return;
      }
      life.progress += 5;
      life.ling = clamp(life.ling - 8);
      life.heart = clamp(life.heart - 4);
      pushLog(life, "choice", "你硬用。修為動了一點，經脈發澀，像穿了一件不合身的衣服。");
    },
  },
  {
    id: "eyed",
    when: (life) =>
      (life.root === "tian" || life.root === "bian") && life.stones >= 180 && !life.sect,
    make: (life) => ({
      type: "choice",
      id: "eyed",
      title: "有人盯上你的靈石",
      body: `你的根不差，口袋也不像新手。已經有人在坊市問你住哪。可以分出一半靈石，大約 ${formatCount(Math.floor(life.stones / 2))} 塊，換這幾年沒人來找。`,
      choices: [
        { id: "eyed:steady", label: "分出一半", hint: "破財。這幾年會安靜些。" },
        { id: "eyed:hold", label: "守住", hint: "不一定有人來。來了就會傷到口袋。" },
      ],
    }),
    resolve: (life, rng, choiceId) => {
      if (choiceId.endsWith(":steady")) {
        const paid = Math.floor(life.stones / 2);
        life.stones -= paid;
        life.heart = clamp(life.heart + 5);
        pushLog(life, "choice", `你分出 ${formatCount(paid)} 塊。坊市裡那幾個眼神淡了。`);
        return;
      }
      if (rng.next() < 0.34) {
        const lost = Math.floor(life.stones * 0.4);
        life.stones -= lost;
        life.ling = clamp(life.ling - 8);
        life.heart = clamp(life.heart - 6);
        pushLog(life, "choice", `還是有人來過。靈石少了 ${formatCount(lost)} 塊，人沒有留下傷。`);
        return;
      }
      life.heart = clamp(life.heart - 2);
      pushLog(life, "choice", "你守住了。這一次沒有人來。");
    },
  },
  {
    id: "shortcut",
    when: (life) => life.root === "wei" && life.years >= 4 && life.years <= 22,
    make: () => ({
      type: "choice",
      id: "shortcut",
      title: "速成的藥",
      body: "偽靈根最常被拿來賣的就是速成藥。賣的人說三個月抵別人三年。你認識的人裡，有的漲了一截，有的傷了經脈。",
      choices: [
        { id: "shortcut:try", label: "買來試", hint: "花 25 塊。可能有效，也可能傷壽元。" },
        { id: "shortcut:steady", label: "不試，繼續慢", hint: "藥推回去。脈還是穩的。" },
      ],
    }),
    resolve: (life, rng, choiceId) => {
      if (!choiceId.endsWith(":try")) {
        life.heart = clamp(life.heart + 6);
        pushLog(life, "choice", "你把藥推回去。慢還是慢，脈是穩的。");
        return;
      }
      if (life.stones < 25) {
        pushLog(life, "choice", "你想試，靈石不夠。藥沒有到手上。");
        return;
      }
      life.stones -= 25;
      if (rng.next() < 0.52) {
        life.progress += 30;
        life.ling = clamp(life.ling + 4);
        pushLog(life, "choice", "藥有效。修為漲了一截，像偷來的。你不知道下一瓶還會不會這樣。");
        return;
      }
      life.ling = clamp(life.ling - 16);
      life.heart = clamp(life.heart - 8);
      life.lifespan = Math.max(life.age + 2, life.lifespan - 4);
      pushLog(life, "choice", "藥傷了經脈。修為沒有快起來，壽元短了四年。");
    },
  },
  {
    id: "senior",
    when: (life) => life.attempts.foundation > 0 && !life.succeeded.foundation && life.bond >= 18,
    make: () => ({
      type: "choice",
      id: "senior",
      title: "築基失敗之後",
      body: "你已經撞過築基。坊市裡有一位築基修士肯見你一面，條件是 60 塊靈石，只讓你看一次他怎麼穩靈力。",
      choices: [
        { id: "senior:ask", label: "花 60 塊去求見", hint: "見識會厚一截。下一次衝關稍微穩。" },
        { id: "senior:steady", label: "自己再熬", hint: "不求人。靈石留下。" },
      ],
    }),
    resolve: (life, _rng, choiceId) => {
      if (!choiceId.endsWith(":ask")) {
        life.heart = clamp(life.heart + 2);
        pushLog(life, "choice", "你沒有去求見。失敗還是你自己的，靈石也還是你的。");
        return;
      }
      if (life.stones < 60) {
        pushLog(life, "choice", "你湊不出 60 塊。那位築基修士沒有見你。");
        return;
      }
      life.stones -= 60;
      life.insight = clamp(life.insight + 14);
      life.heart = clamp(life.heart + 4);
      life.senior = true;
      pushLog(life, "choice", "你看了一次別人怎麼把靈力壓穩。懂了一點。下一次衝關，手不會那麼慌。");
    },
  },
];

function writeOrigin(life: Life): string {
  const root = ROOTS[life.root];
  const world = WORLDS[life.setup.world];
  const count = formatPeople(rootPopulation(life.root));
  const cohort =
    life.setup.cohort === "entrant"
      ? "你是這一息才入道的人，家底按新來的抽。"
      : "你是已經活在這八十億裡的人。這一輪仍從入道之年寫起，家底按活人裡較常見的來抽。";
  const relative = life.relative ? "家裡有人在外門做過雜役，名字用不上，路算聽過。" : "";
  return [
    `你是${life.name}，人在${life.region}。入道這年十六歲。`,
    cohort,
    `${world.name}。${world.note}`,
    `靈根是${root.name}。八十億人裡，這一檔大約有${count}人。${root.flavor}`,
    relative,
    `起步時有 ${formatCount(life.stones)} 塊下品靈石。`,
  ]
    .filter(Boolean)
    .join("");
}

function rollRoot(rng: Rng): RootId {
  const roll = rng.next();
  let cursor = 0;
  for (const id of ["wei", "zhen", "tian", "bian"] as const) {
    cursor += ROOTS[id].share;
    if (roll < cursor) return id;
  }
  return "wei";
}

function rollStones(rng: Rng, living: boolean, worldStones: number): number {
  const roll = rng.next();
  let base: number;
  const poorCut = living ? 0.34 : 0.5;
  const thinCut = living ? 0.72 : 0.82;
  const midCut = living ? 0.92 : 0.96;
  if (roll < poorCut) base = rng.next() * 16;
  else if (roll < thinCut) base = 16 + rng.next() * 70;
  else if (roll < midCut) base = 90 + rng.next() * 260;
  else if (roll < 0.99) base = 380 + rng.next() * 1400;
  else base = 1800 + rng.next() * 6000;
  const cohort = living ? 1.2 : 0.72;
  return Math.max(0, Math.round(base * cohort * worldStones));
}

function chanceText(chance: number): string {
  if (chance < 0.03) return "一百次裡未必有一次";
  if (chance < 0.08) return "二三十次裡有一次";
  if (chance < 0.18) return "十次裡有一次";
  if (chance < 0.32) return "四五次裡有一次";
  if (chance < 0.5) return "三次裡有一次";
  if (chance < 0.68) return "兩次裡有一次";
  return "機會不小，仍可能失敗";
}

function summarizeCompanion(life: Life): Companion {
  return {
    name: life.name,
    root: life.root,
    region: life.region,
    spans: life.spans.map((span) => ({ ...span })),
    deathAge: life.dead ? life.age : null,
    ending: life.ending === "edge" ? "edge" : "dead",
    cause: life.cause,
    finalRealm: life.realm,
    finalAge: life.age,
  };
}

function pushLog(life: Life, kind: LogEntry["kind"], text: string): void {
  life.log.push({
    id: nextLogId(life),
    age: life.age,
    kind,
    text,
    starred: false,
  });
}

function nextLogId(life: Life): string {
  life.logSeq += 1;
  return `${life.id}-${life.logSeq}`;
}

function trimLog(life: Life): void {
  if (life.log.length <= 32) return;
  const starred = life.log.filter((entry) => entry.starred);
  const recent = life.log.slice(-24);
  const merged = [...life.log];
  const keep = new Set([...starred, ...recent].map((entry) => entry.id));
  life.log = merged.filter((entry) => keep.has(entry.id)).slice(-40);
}

function pick<T>(rng: Rng, items: readonly T[]): T {
  return items[Math.floor(rng.next() * items.length)] as T;
}

function pickStable<T extends string>(life: Life, items: readonly T[]): T {
  const index = mixSeed(life.rngState || 1, items.length + life.years) % items.length;
  return items[index] as T;
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

function makeRng(seed: number): Rng {
  let state = seed >>> 0 || 1;
  return {
    next() {
      state = (state + 0x6d2b79f5) >>> 0;
      let t = Math.imul(state ^ (state >>> 15), 1 | state);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    },
    state() {
      return state >>> 0;
    },
  };
}

function mixSeed(seed: number, salt: number): number {
  let x = (seed ^ Math.imul(salt, 0x9e3779b1)) >>> 0;
  x = Math.imul(x ^ (x >>> 16), 0x7feb352d) >>> 0;
  x = Math.imul(x ^ (x >>> 15), 0x846ca68b) >>> 0;
  x = (x ^ (x >>> 16)) >>> 0;
  return x || 1;
}
