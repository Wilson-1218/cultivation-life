import { CENSUS_STOCKS } from "./census-data";

export const POPULATION = 8_000_000_000;

export type WorldId = "past" | "now" | "future";
export type CohortId = "entrant" | "living";
export type PaceId = "breath" | "incense" | "hour";
export type FocusId = "cycle" | "stone" | "study" | "ally" | "seclude";
export type RootId = "wei" | "zhen" | "tian" | "bian";
export type RealmId =
  | "qi-early"
  | "qi-mid"
  | "qi-late"
  | "qi-peak"
  | "foundation"
  | "core"
  | "nascent"
  | "spirit";
export type GateId = "foundation" | "core" | "nascent" | "spirit";

export type Setup = {
  world: WorldId;
  cohort: CohortId;
  pace: PaceId;
  seed: number;
};

export const WORLDS: Record<
  WorldId,
  { id: WorldId; name: string; note: string; progress: number; gate: number; stones: number }
> = {
  past: {
    id: "past",
    name: "前紀",
    note: "靈氣還沒薄成當世這樣。突破與靈石都寬一點。人還是這八十億。",
    progress: 1.28,
    gate: 1.18,
    stones: 1.35,
  },
  now: {
    id: "now",
    name: "當世",
    note: "靈氣、名額、機緣按八十億人來分。這一輪的預設。",
    progress: 1,
    gate: 1,
    stones: 1,
  },
  future: {
    id: "future",
    name: "後紀",
    note: "能分到的更少，門檻更緊。人並沒有變少。",
    progress: 0.8,
    gate: 0.84,
    stones: 0.72,
  },
};

export const COHORTS: Record<CohortId, { id: CohortId; name: string; note: string }> = {
  entrant: {
    id: "entrant",
    name: "這一息才入道",
    note: "從十六歲、家底按新來的人來抽。",
  },
  living: {
    id: "living",
    name: "已在修行的八十億人",
    note: "仍從入道之年寫起，家底按活著的人裡較常見的來抽。",
  },
};

export const PACES: Record<
  PaceId,
  { id: PaceId; name: string; note: string; years: number; delay: number }
> = {
  breath: {
    id: "breath",
    name: "一息",
    note: "平常的年份併在一起，停得少。",
    years: 12,
    delay: 680,
  },
  incense: {
    id: "incense",
    name: "一炷香",
    note: "預設的步幅。抉擇仍會把年份切開。",
    years: 6,
    delay: 1050,
  },
  hour: {
    id: "hour",
    name: "一個時辰",
    note: "步幅短，同一生會停得更勤。",
    years: 3,
    delay: 1400,
  },
};

export const FOCUSES: Record<
  FocusId,
  {
    id: FocusId;
    name: string;
    hint: string;
    ling: number;
    heart: number;
    insight: number;
    bond: number;
    stone: number;
    progress: number;
  }
> = {
  cycle: {
    id: "cycle",
    name: "吐納",
    hint: "靈力與修為往上走，靈石慢慢減少。",
    ling: 1.35,
    heart: 0.3,
    insight: 0.08,
    bond: -0.08,
    stone: -1,
    progress: 1.15,
  },
  stone: {
    id: "stone",
    name: "謀石",
    hint: "靈石變多。修為幾乎停著，心境會被磨薄。",
    ling: -0.2,
    heart: -0.5,
    insight: 0.12,
    bond: 0.2,
    stone: 0,
    progress: 0.7,
  },
  study: {
    id: "study",
    name: "問道",
    hint: "見識上升。衝關時比較知道自己在做什麼。",
    ling: 0.15,
    heart: 0.1,
    insight: 1.65,
    bond: 0.3,
    stone: -1,
    progress: 0.92,
  },
  ally: {
    id: "ally",
    name: "結伴",
    hint: "人脈與心境上升，修為慢一點。",
    ling: 0.08,
    heart: 0.85,
    insight: 0.22,
    bond: 1.85,
    stone: -1,
    progress: 0.82,
  },
  seclude: {
    id: "seclude",
    name: "閉關",
    hint: "修為最快。心境與人脈往下掉，走火的風險變高。",
    ling: 2.1,
    heart: -0.8,
    insight: 0.12,
    bond: -1,
    stone: -2,
    progress: 1.38,
  },
};

export const ROOTS: Record<
  RootId,
  {
    id: RootId;
    name: string;
    share: number;
    speed: number;
    gates: Record<GateId, number>;
    exam: number;
    flavor: string;
  }
> = {
  wei: {
    id: "wei",
    name: "偽靈根",
    share: 0.816,
    speed: 1.32,
    gates: { foundation: 0.028, core: 0.006, nascent: 0.002, spirit: 0.0004 },
    exam: 0.08,
    flavor: "這種根修得最慢。每進一步，都要用年份換。",
  },
  zhen: {
    id: "zhen",
    name: "真靈根",
    share: 0.158,
    speed: 3.05,
    gates: { foundation: 0.08, core: 0.012, nascent: 0.004, spirit: 0.0012 },
    exam: 0.34,
    flavor: "不算差。真正缺的不是這點資質，是後面的丹、席位和靈脈。",
  },
  tian: {
    id: "tian",
    name: "天靈根",
    share: 0.022,
    speed: 6.1,
    gates: { foundation: 0.11, core: 0.05, nascent: 0.22, spirit: 0.24 },
    exam: 0.72,
    flavor: "測的人會多看一眼。根好，只是讓你更快走到門前面。門後的名額不會因此變多。",
  },
  bian: {
    id: "bian",
    name: "變異靈根",
    share: 0.004,
    speed: 5.05,
    gates: { foundation: 0.09, core: 0.036, nascent: 0.14, spirit: 0.16 },
    exam: 0.4,
    flavor: "坊市通用的功法多半對不上。快不快，要看路認不認你。",
  },
};

const REALM_ROWS: readonly { id: RealmId; name: string; lifespan: number }[] = [
  { id: "qi-early", name: "煉氣初期", lifespan: 100 },
  { id: "qi-mid", name: "煉氣中期", lifespan: 118 },
  { id: "qi-late", name: "煉氣後期", lifespan: 136 },
  { id: "qi-peak", name: "煉氣圓滿", lifespan: 156 },
  { id: "foundation", name: "築基", lifespan: 286 },
  { id: "core", name: "結丹", lifespan: 640 },
  { id: "nascent", name: "元嬰", lifespan: 1480 },
  { id: "spirit", name: "化神", lifespan: 3400 },
];

export const REALMS: readonly {
  id: RealmId;
  name: string;
  stock: number;
  lifespan: number;
}[] = REALM_ROWS.map((realm) => ({
  ...realm,
  stock: CENSUS_STOCKS[realm.id],
}));

export const TUNING = {
  eventChance: 0.105,
  qiMid: 88,
  qiLate: 190,
  qiPeak: 330,
  foundationAt: 358,
  coreAt: 820,
  nascentAt: 1040,
  spiritAt: 1160,
  spiritDone: 2280,
  progressCap: 2800,
  foundationCost: 170,
  coreCost: 920,
  nascentCost: 4200,
  spiritCost: 8600,
  spiritUpkeep: 5,
  spiritUpkeepStable: 2,
  spiritSoft: 1680,
  sectPay: 16,
};

export const NAMES = [
  "青禾",
  "晚潮",
  "石戶",
  "薄霜",
  "井生",
  "枯枝",
  "小滿",
  "北燭",
  "鹽生",
  "阿芒",
  "白渠",
  "遲禾",
  "嶺下",
  "霧生",
  "簡石",
  "秋緯",
  "沈燈",
  "谷雨",
  "半盞",
  "木禾",
  "江蘆",
  "細泉",
  "石橋",
  "慢火",
] as const;

export const REGIONS = [
  "東澤",
  "霜嶺外",
  "鹽市",
  "枯井原",
  "青汀",
  "白石埠",
  "南葦",
  "細沙洲",
  "舊渡",
  "墨池縣",
] as const;

export const SECTS = ["青汀門", "白石谷", "鹽市外門", "霜嶺小派", "東澤學堂"] as const;

export const MANUALS = ["薄霧吐納", "井華訣", "枯榮殘頁", "慢火訣"] as const;

export const ROOT_ORDER: RootId[] = ["wei", "zhen", "tian", "bian"];
export const FOCUS_ORDER: FocusId[] = ["cycle", "stone", "study", "ally", "seclude"];
export const QI_REALMS: RealmId[] = ["qi-early", "qi-mid", "qi-late", "qi-peak"];

export function clamp(n: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, n));
}

export function realmById(id: RealmId) {
  const found = REALMS.find((realm) => realm.id === id);
  if (!found) {
    throw new Error(`未知境界 ${id}`);
  }
  return found;
}

export function rootPopulation(id: RootId): number {
  return Math.round(ROOTS[id].share * POPULATION);
}

export function formatPeople(n: number): string {
  const value = Math.max(0, Math.round(n));
  if (value >= 100_000_000) {
    const yi = value / 100_000_000;
    const digits = yi >= 10 ? 1 : 2;
    return `${trimNumber(yi, digits)}億`;
  }
  if (value >= 10_000) {
    const wan = value / 10_000;
    const digits = wan >= 100 ? 0 : 1;
    return `${trimNumber(wan, digits)}萬`;
  }
  return new Intl.NumberFormat("zh-Hant").format(value);
}

export function formatCount(n: number): string {
  return new Intl.NumberFormat("zh-Hant").format(Math.max(0, Math.round(n)));
}

function trimNumber(n: number, digits: number): string {
  const text = n.toFixed(digits);
  if (!text.includes(".")) return text;
  return text.replace(/0+$/, "").replace(/\.$/, "");
}

export function gateCost(kind: GateId): number {
  if (kind === "foundation") return TUNING.foundationCost;
  if (kind === "core") return TUNING.coreCost;
  if (kind === "nascent") return TUNING.nascentCost;
  return TUNING.spiritCost;
}

export function gateLabel(kind: GateId): string {
  if (kind === "foundation") return "築基";
  if (kind === "core") return "結丹";
  if (kind === "nascent") return "元嬰";
  return "化神";
}

export function nextRealm(kind: GateId): RealmId {
  if (kind === "foundation") return "foundation";
  if (kind === "core") return "core";
  if (kind === "nascent") return "nascent";
  return "spirit";
}

export function stockAbove(id: RealmId): number {
  const index = REALMS.findIndex((realm) => realm.id === id);
  return REALMS.slice(index + 1).reduce((sum, realm) => sum + realm.stock, 0);
}

export function censusTotal(): number {
  return REALMS.reduce((sum, realm) => sum + realm.stock, 0);
}
