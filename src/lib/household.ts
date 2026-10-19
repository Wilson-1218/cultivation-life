import type { AimId } from "./aims";
import { kinName, outsiderName } from "./names";
import type { OriginId, RealmId } from "./world";

export type Kin = {
  role: "father" | "mother" | "sibling" | "spouse" | "child";
  name: string;
  call: string;
  dead: boolean;
  sick: boolean;
  present: boolean;
  away: boolean;
  born: number;
  trade?: string;
};

type PlaceSlot = "field" | "river" | "mountain" | "market" | "yard" | "road" | "sect" | "garden";

export type Household = {
  hamlet: string;
  market: string;
  home: string;
  river: string;
  mountain: string;
  yard: string;
  region: string;
  father: Kin;
  mother: Kin;
  siblings: Kin[];
  spouse: Kin;
  children: Kin[];
  childInLaw: string;
  mate: string;
  job: string;
  jobPlace: string;
  jobTier: "origin" | "sect" | "cave";
  jobSince: number;
  originJob: string;
  originSlot: PlaceSlot;
  sectJob: string;
  sectSlot: PlaceSlot;
  highJob: string;
  highSlot: PlaceSlot;
  firstLoss: "father" | "mother";
  originId: OriginId;
  memories: string[];
  agenda: { id: string; age: number }[];
  seen: string[];
  jobShift: boolean;
  steady?: number;
};

export type HomeContext = {
  age: number;
  realm: RealmId;
  sect: string | null;
  mortal: boolean;
  escaped: boolean;
};

export const PLACE_POOL = [
  "柳林村", "青禾村", "鹽田村", "枯井村", "松坪村", "漁浦村", "北灣村", "蘆花村",
  "槐巷鎮", "白石鎮", "南葦鎮", "半山鎮", "茶嶺鎮", "長橋鎮", "鐵爐鎮", "藥溪鎮",
  "平湖縣", "舊渡縣", "西市縣", "塔灣縣",
  "青螺山", "斷碑嶺", "寒鴉山", "石龍澗", "楓嶺", "雲棲山",
  "白鷺河", "慢水溪", "蘆溝", "烏柏灘", "楓林渡", "清苔溪",
  "米坊", "藥坊", "魚市坊", "布坊", "鐵器坊", "茶坊", "舊書坊", "船埠坊",
  "松風院", "聽雨院", "藥王院", "外舍院", "竹影院", "歸燕院",
] as const;

export const JOB_POOL = [
  "船工", "獵戶", "藥鋪伙計", "鐵匠", "帳房", "私塾", "腳夫", "漁戶", "茶攤",
  "外門藥園", "護院", "管事", "種田", "值守", "管人", "管園", "管船",
] as const;

export const HOUSE_AFFAIRS = [
  "染風寒", "家裡缺錢", "夜談", "父母過壽", "手藝傳下來", "節日回屋",
  "吵架", "和好", "幫襯", "孩子認字", "分家", "外出不歸",
  "長輩病了", "給長輩辦喪", "孩子娶嫁",
] as const;

const QI = new Set<RealmId>(["qi-early", "qi-mid", "qi-late", "qi-peak"]);

const ORIGIN_POSTS: Record<OriginId, { job: string; slot: PlaceSlot }[]> = {
  village: [
    { job: "種田", slot: "field" },
    { job: "當船工", slot: "river" },
    { job: "當獵戶", slot: "mountain" },
    { job: "守茶攤", slot: "market" },
    { job: "當漁戶", slot: "river" },
    { job: "當腳夫", slot: "road" },
  ],
  orphan: [
    { job: "做藥鋪伙計", slot: "market" },
    { job: "當腳夫", slot: "road" },
    { job: "守茶攤", slot: "market" },
    { job: "打鐵", slot: "market" },
  ],
  rich: [
    { job: "管鋪", slot: "market" },
    { job: "收租", slot: "yard" },
    { job: "管帳", slot: "yard" },
    { job: "做東", slot: "market" },
  ],
  clan: [
    { job: "管帳", slot: "yard" },
    { job: "當管事", slot: "yard" },
    { job: "教私塾", slot: "yard" },
    { job: "做護院", slot: "yard" },
  ],
  cauldron: [
    { job: "種田", slot: "field" },
    { job: "當船工", slot: "river" },
    { job: "當漁戶", slot: "river" },
  ],
  remnant: [
    { job: "守茶攤", slot: "market" },
    { job: "教私塾", slot: "yard" },
    { job: "做藥鋪伙計", slot: "market" },
  ],
};

const SECT_POSTS: { job: string; slot: PlaceSlot }[] = [
  { job: "值守", slot: "sect" },
  { job: "照看藥草", slot: "garden" },
  { job: "做護院", slot: "sect" },
  { job: "幫著管事", slot: "sect" },
];

const HIGH_POSTS: { job: string; slot: PlaceSlot }[] = [
  { job: "管人", slot: "sect" },
  { job: "管園", slot: "mountain" },
  { job: "管船", slot: "river" },
];

function mix(seed: number, salt: number): number {
  let x = (seed ^ Math.imul(salt, 0x9e3779b1)) >>> 0;
  x = Math.imul(x ^ (x >>> 16), 0x7feb352d) >>> 0;
  x = Math.imul(x ^ (x >>> 15), 0x846ca68b) >>> 0;
  return (x ^ (x >>> 16)) >>> 0 || 1;
}

function pickFrom<T>(list: readonly T[], seed: number, salt: number): T {
  return list[mix(seed, salt) % list.length]!;
}

function place(used: Set<number>, want: number): number {
  let age = Math.max(0, want);
  while (used.has(age)) age += 1;
  used.add(age);
  return age;
}

function blankKin(role: Kin["role"], name: string, call: string, present: boolean, born: number): Kin {
  return { role, name, call, dead: false, sick: false, present, away: false, born };
}

function locate(house: Household, ctx: HomeContext, slot: PlaceSlot): string {
  if (slot === "field") return `${house.hamlet}東頭的田裡`;
  if (slot === "river") return house.river;
  if (slot === "mountain") return house.mountain;
  if (slot === "market") return house.market;
  if (slot === "yard") return house.yard;
  if (slot === "road") return `${house.hamlet}到${house.market}的路`;
  if (slot === "garden") return ctx.sect ? `${ctx.sect}的藥園` : house.yard;
  return ctx.sect ? `${ctx.sect}裡` : house.yard;
}

function postPhrase(place: string, job: string): string {
  if (!place) return job;
  if (place.endsWith(job)) return place;
  return `${place}${job}`;
}

function desired(house: Household, ctx: HomeContext): { job: string; place: string; tier: Household["jobTier"] } {
  const high = !ctx.mortal && !QI.has(ctx.realm);
  if (high) return { job: house.highJob, place: locate(house, ctx, house.highSlot), tier: "cave" };
  if (ctx.sect && !ctx.mortal) return { job: house.sectJob, place: locate(house, ctx, house.sectSlot), tier: "sect" };
  if (house.originId === "cauldron" && !ctx.escaped) {
    return { job: "做藥鋪伙計", place: house.yard, tier: "origin" };
  }
  return { job: house.originJob, place: locate(house, ctx, house.originSlot), tier: "origin" };
}

function craftNoun(job: string): string {
  if (job.includes("船") && !job.includes("管船")) return "行船";
  if (job.includes("管船")) return "管船";
  if (job.includes("獵")) return "狩獵";
  if (job.includes("藥")) return "製藥";
  if (job.includes("鐵")) return "打鐵";
  if (job.includes("帳")) return "管帳";
  if (job.includes("塾")) return "教書";
  if (job.includes("腳")) return "趕路";
  if (job.includes("漁")) return "捕魚";
  if (job.includes("茶")) return "烹茶";
  if (job.includes("護")) return "守院";
  if (job.includes("管事")) return "管事";
  if (job.includes("田")) return "種田";
  if (job.includes("值守")) return "值守";
  return "手頭的活";
}

function remember(house: Household, line: string): void {
  if (!house.memories.includes(line)) house.memories.push(line);
}

function memoryClause(house: Household, age: number): string {
  if (house.memories.length === 0) return "";
  return `心裡記著${house.memories[age % house.memories.length]}。`;
}

export function buildHousehold(input: {
  seed: number;
  name: string;
  region: string;
  originId: OriginId;
  mortal?: boolean;
}): Household {
  const seed = input.seed || 1;
  const surname = input.name.slice(0, 1) || "陳";
  const avoid = new Set<string>([input.name]);
  const hamlet = pickFrom(PLACE_POOL.filter((item) => /[村鎮]$/.test(item)), seed, 0x31);
  const river = pickFrom(PLACE_POOL.filter((item) => /[河溪溝灘渡]$/.test(item)), seed, 0x32);
  const mountain = pickFrom(PLACE_POOL.filter((item) => /[山嶺澗]$/.test(item)), seed, 0x33);
  const market = pickFrom(PLACE_POOL.filter((item) => item.endsWith("坊")), seed, 0x34);
  const yard = pickFrom(PLACE_POOL.filter((item) => item.endsWith("院")), seed, 0x35);
  const olderCall = mix(seed, 0x36) % 2 === 0 ? "哥哥" : "姐姐";
  const youngerCall = mix(seed, 0x37) % 2 === 0 ? "弟弟" : "妹妹";
  const childCall = mix(seed, 0x38) % 2 === 0 ? "兒子" : "女兒";
  const childCall2 = childCall === "兒子" ? "女兒" : "兒子";
  const originPost = pickFrom(ORIGIN_POSTS[input.originId], seed, 0x51);
  const sectPost = pickFrom(SECT_POSTS, seed, 0x52);
  const highPost = pickFrom(HIGH_POSTS, seed, 0x53);
  const father = blankKin("father", kinName(seed, 0x41, surname, "m", avoid, "elder"), "父親", true, 0);
  const mother = blankKin("mother", kinName(seed, 0x42, surname, "f", avoid, "elder"), "母親", true, 0);
  const siblings = [
    blankKin("sibling", kinName(seed, 0x43, surname, olderCall === "哥哥" ? "m" : "f", avoid), olderCall, true, 0),
    blankKin("sibling", kinName(seed, 0x44, surname, youngerCall === "弟弟" ? "m" : "f", avoid), youngerCall, false, 6),
  ];
  const spouse = blankKin("spouse", outsiderName(seed, 0x45, surname, "f", avoid), "配偶", false, 0);
  const children = [
    blankKin("child", kinName(seed, 0x46, surname, childCall === "兒子" ? "m" : "f", avoid, "child"), childCall, false, 0),
  ];
  if (mix(seed, 0x47) % 3 !== 0) {
    children.push(
      blankKin("child", kinName(seed, 0x48, surname, childCall2 === "兒子" ? "m" : "f", avoid, "child"), childCall2, false, 0),
    );
  }
  const kinTrades = ["種田", "打魚", "做護院", "看攤", "跑腿", "採藥", "幫廚", "守門", "縫補", "趕車", "寫帳", "搬貨"].filter(
    (item) => item !== originPost.job,
  );
  const tradeAt = mix(seed, 0x91) % kinTrades.length;
  [father, mother, ...siblings, spouse, ...children].forEach((person, index) => {
    person.trade = kinTrades[(tradeAt + index) % kinTrades.length];
  });
  const childInLaw = outsiderName(seed, 0x49, surname, childCall === "兒子" ? "f" : "m", avoid);
  const mate = outsiderName(seed, 0x4b, surname, "m", avoid);
  const firstLoss: "father" | "mother" = mix(seed, 0x23) % 2 === 0 ? "father" : "mother";
  const used = new Set<number>();
  const agenda: { id: string; age: number }[] = [];
  const add = (id: string, want: number) => {
    const age = place(used, want);
    agenda.push({ id, age });
    return age;
  };
  const saltOf = (id: string) => {
    let hash = 2166136261;
    for (const char of id) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
    return (hash >>> 0) || 1;
  };
  const at = (id: string, min: number, span: number) => min + (mix(seed, saltOf(id)) % span);
  add("born", 0);
  add("sibling", at("sibling", 5, 4));
  add("job", at("job", 14, 3));
  const married = add("marry", at("marry", 21, 9));
  const bornChild = add("child", married + 3 + (mix(seed, 0x12) % 6));
  if (children[1] && mix(seed, 0x67) % 2 === 0) add("child2", bornChild + 2 + (mix(seed, 0x68) % 4));
  const illAt = add(`${firstLoss}-ill`, at("ill", input.mortal ? 33 : 36, 14));
  const dieAt = add(`${firstLoss}-die`, illAt + 2 + (mix(seed, 0x24) % 4));
  const second = firstLoss === "father" ? "mother" : "father";
  const illLater = add(`${second}-ill`, dieAt + 6 + (mix(seed, 0x25) % 8));
  add(`${second}-die`, illLater + 2 + (mix(seed, 0x26) % 3));
  add("grave", dieAt + 2 + (mix(seed, 0x27) % 5));
  add("remember", illLater + 5 + (mix(seed, 0x28) % 4));
  const earlyPool = ["broke", "chill", "birthday", "story", "craft", "festival", "quarrel", "aid", "split"];
  const latePool = ["letters", "missing", "funeral", "childmarry"];
  const draw = (pool: string[], count: number, salt: number) =>
    [...pool]
      .sort((a, b) => mix(seed, saltOf(a) ^ salt) - mix(seed, saltOf(b) ^ salt))
      .slice(0, count);
  const picked = new Set([
    ...draw(earlyPool, 4 + (mix(seed, 0x6a) % 3), 0x6b),
    ...draw(latePool, 1 + (mix(seed, 0x6c) % 3), 0x6d),
  ]);
  const optional: { id: string; age: number }[] = [];
  if (picked.has("broke")) optional.push({ id: "broke", age: at("broke", 6, 16) });
  if (picked.has("chill")) optional.push({ id: "chill", age: at("chill", 7, 16) });
  if (picked.has("birthday")) optional.push({ id: "birthday", age: at("birthday", 9, 18) });
  if (picked.has("story")) optional.push({ id: "story", age: at("story", 8, 18) });
  if (picked.has("craft")) optional.push({ id: "craft", age: at("craft", 12, 18) });
  if (picked.has("festival")) optional.push({ id: "festival", age: at("festival", 10, 22) });
  if (picked.has("aid")) optional.push({ id: "aid", age: at("aid", 16, 18) });
  if (picked.has("split")) optional.push({ id: "split", age: at("split", 22, 16) });
  if (picked.has("letters")) optional.push({ id: "letters", age: bornChild + 3 + (mix(seed, saltOf("letters")) % 8) });
  if (picked.has("missing")) optional.push({ id: "missing", age: at("missing", 20, 18) });
  if (picked.has("funeral")) optional.push({ id: "funeral", age: dieAt + 1 + (mix(seed, saltOf("funeral")) % 4) });
  if (picked.has("childmarry")) optional.push({ id: "childmarry", age: bornChild + 14 + (mix(seed, saltOf("childmarry")) % 8) });
  if (picked.has("quarrel")) {
    const before = mix(seed, 0x71) % 2 === 0;
    const want = before ? at("quarrel", 15, 6) : married + 1 + (mix(seed, saltOf("quarrel")) % 6);
    optional.push({ id: "quarrel", age: want });
  }
  optional.sort((a, b) => mix(seed, saltOf(a.id) ^ 0x9e) - mix(seed, saltOf(b.id) ^ 0x9e));
  let quarrelAge = married;
  for (const item of optional) {
    const placed = add(item.id, item.age);
    if (item.id === "quarrel") quarrelAge = placed;
  }
  if (picked.has("quarrel") && mix(seed, 0x72) % 3 !== 0) add("mend", quarrelAge + 1 + (mix(seed, 0x73) % 3));
  for (const age of [15, 17, 23, 29, 35, 41, 47, 53, 59, 65, 71, 77]) add(`work-${age}`, age);
  agenda.sort((a, b) => a.age - b.age);
  const house: Household = {
    hamlet,
    market,
    home: `${hamlet}那間屋`,
    river,
    mountain,
    yard,
    region: input.region,
    father,
    mother,
    siblings,
    spouse,
    children,
    childInLaw,
    mate,
    job: originPost.job,
    jobPlace: "",
    jobTier: "origin",
    jobSince: 14,
    originJob: originPost.job,
    originSlot: originPost.slot,
    sectJob: sectPost.job,
    sectSlot: sectPost.slot,
    highJob: highPost.job,
    highSlot: highPost.slot,
    firstLoss,
    originId: input.originId,
    memories: [],
    agenda,
    seen: [],
    jobShift: false,
  };
  const opening = desired(house, { age: 0, realm: "qi-early", sect: null, mortal: true, escaped: false });
  house.job = opening.job;
  house.jobPlace = opening.place;
  return house;
}

export function dueHome(house: Household, age: number): string | null {
  const waiting = house.agenda.find((item) => item.age <= age && !house.seen.includes(item.id));
  if (waiting) return waiting.id;
  if (age >= 78 && age % 6 === 0 && !house.seen.includes(`late-${age}`)) return `late-${age}`;
  return null;
}

function livingKin(house: Household): Kin[] {
  const list = [house.father, house.mother, ...house.siblings, house.spouse, ...house.children];
  return list.filter((kin) => kin.present && !kin.dead && !kin.away);
}

function kinLabel(kin: Kin): string {
  if (kin.role === "spouse") return kin.name;
  return `${kin.call}${kin.name}`;
}

function atHome(house: Household): string {
  const names = livingKin(house).map(kinLabel);
  if (names.length === 0) return `${house.home}裡沒有別的人了`;
  return `${names.join("、")}還在${house.home}`;
}

function syncJob(house: Household, ctx: HomeContext): string | null {
  const next = desired(house, ctx);
  if (next.tier === house.jobTier && next.job === house.job && next.place === house.jobPlace) return null;
  const previous = house.job;
  house.job = next.job;
  house.jobPlace = next.place;
  house.jobTier = next.tier;
  return `${ctx.age}歲，你不做${previous}了，以後在${postPhrase(next.place, next.job)}。`;
}

function goneClause(house: Household): string {
  const gone = [house.father, house.mother, ...house.siblings].filter((kin) => kin.dead);
  if (gone.length === 0) return "";
  const who = gone[gone.length - 1]!;
  return `${who.call}${who.name}已經不在。`;
}

function workLine(house: Household, ctx: HomeContext): string {
  return syncJob(house, ctx) ?? "";
}

function parentOf(house: Household, who: "father" | "mother"): Kin {
  return who === "father" ? house.father : house.mother;
}

function presentSibling(house: Household, index: number): Kin {
  const kin = house.siblings[index]!;
  if (kin.present && !kin.dead && !kin.away) return kin;
  const other = house.siblings[index === 0 ? 1 : 0]!;
  if (other.present && !other.dead && !other.away) return other;
  return kin;
}

export function commitHome(house: Household, id: string, ctx: HomeContext): string {
  house.seen.push(id);
  const older = house.siblings[0]!;
  const younger = house.siblings[1]!;
  const child = house.children[0]!;
  const child2 = house.children[1];
  if (id === "born") {
    return `${ctx.age}歲，你生在${house.region}的${house.hamlet}。母親${house.mother.name}把你抱進門，父親${house.father.name}在${house.home}裡等著。${older.call}${older.name}已經會走路。`;
  }
  if (id === "father") {
    if (house.father.dead) return "";
    return `${ctx.age}歲，你跟著父親${house.father.name}出去做事，天黑兩人才回家。`;
  }
  if (id === "sibling") {
    younger.present = true;
    return `${ctx.age}歲，母親${house.mother.name}生了${younger.call}${younger.name}。${older.call}${older.name}把小床讓出一角。${house.home}多了一個人。`;
  }
  if (id === "broke") {
    remember(house, `${house.home}缺過錢`);
    return `${ctx.age}歲，${house.home}缺錢。母親${house.mother.name}把米缸刮過，父親${house.father.name}坐到很晚。`;
  }
  if (id === "hand") {
    return `${ctx.age}歲，你給${older.call}${older.name}搭手。${house.hamlet}的日子就是這些，還沒有人談靈根。`;
  }
  if (id === "chill") {
    const who = presentSibling(house, 1);
    remember(house, `${who.call}${who.name}染過風寒`);
    return `${ctx.age}歲，${who.call}${who.name}染了風寒，躺了十天。母親${house.mother.name}守著，人後來起來了。`;
  }
  if (id === "birthday") {
    remember(house, `給父親${house.father.name}做過壽`);
    return `${ctx.age}歲，父親${house.father.name}過壽。母親${house.mother.name}和${older.call}${older.name}都在${house.home}。`;
  }
  if (id === "story") {
    remember(house, `聽過父親${house.father.name}講${house.river}的舊事`);
    return `${ctx.age}歲，夜裡父親${house.father.name}講起${house.river}邊的舊事。母親${house.mother.name}在旁邊補衣服。`;
  }
  if (id === "job") {
    house.jobSince = ctx.age;
    syncJob(house, ctx);
    return `${ctx.age}歲，從這一年起，你在${postPhrase(house.jobPlace, house.job)}。`;
  }
  if (id === "craft") {
    const craft = craftNoun(house.job);
    remember(house, `父親${house.father.name}傳過${craft}`);
    if (house.father.dead) return `${ctx.age}歲，你把${craft}又練了一遍。父親${house.father.name}已經不在，這是他留下的。`;
    return `${ctx.age}歲，父親${house.father.name}把${craft}傳給你，你當面做了一遍。`;
  }
  if (id === "festival") {
    remember(house, `節日回過家`);
    const here = [house.father, house.mother].filter((kin) => kin.present && !kin.dead);
    const who = here.length > 0 ? `${here.map((kin) => `${kin.call}${kin.name}`).join("和")}都在。` : "";
    return `${ctx.age}歲，${house.market}過節，你回了家。${who}`;
  }
  if (id === "aging") {
    const father = house.father.dead ? `父親${house.father.name}已經不在` : `父親${house.father.name}的背彎了`;
    const mother = house.mother.dead ? `母親${house.mother.name}已經不在` : `母親${house.mother.name}的頭髮白了`;
    return `${ctx.age}歲，${father}，${mother}。`;
  }
  if (id === "marry") {
    if (house.spouse.present) {
      return `${ctx.age}歲，你和${house.spouse.name}把親事定下來。人已經在${house.home}，${house.hamlet}的屋子還是原來那間。`;
    }
    house.spouse.present = true;
    house.spouse.born = ctx.age;
    return `${ctx.age}歲，${house.spouse.name}進門。你們在${house.home}成了家，${house.market}的人來坐了一坐。`;
  }
  if (id === "quarrel") {
    const who = house.spouse.present ? house.spouse.name : older.name;
    const call = house.spouse.present ? "" : older.call;
    remember(house, `和${call}${who}吵過一架`);
    return `${ctx.age}歲，你和${call}${who}吵了一架。那一晚，${house.home}沒有人說話。`;
  }
  if (id === "mend") {
    const who = house.spouse.present ? house.spouse.name : older.name;
    const call = house.spouse.present ? "" : older.call;
    remember(house, `和${call}${who}和好了`);
    return `${ctx.age}歲，你和${call}${who}和好了。${house.home}重新一起吃飯。`;
  }
  if (id === "settle") {
    return `${ctx.age}歲，${house.spouse.name}把屋子收拾過。你回來的時候，飯還是熱的。`;
  }
  if (id === "aid") {
    const who = presentSibling(house, 0);
    remember(house, `幫過${who.call}${who.name}`);
    return `${ctx.age}歲，你把這陣子的工錢分給${who.call}${who.name}。${who.name}說先用著，人還在${house.hamlet}。`;
  }
  if (id === "child" || id === "child2") {
    const born = id === "child" ? child : child2;
    if (!born) return workLine(house, ctx);
    born.present = true;
    born.born = ctx.age;
    const mate = house.spouse.present ? house.spouse.name : house.mother.name;
    return `${ctx.age}歲，${mate}生了${born.call}${born.name}。${house.home}要養的人又多了一個。`;
  }
  if (id === "letters") {
    remember(house, `${child.call}${child.name}認過字`);
    return `${ctx.age}歲，${child.call}${child.name}在${house.yard}認字，一筆一筆寫自己的名字。你在旁邊看著。`;
  }
  if (id === "grow") {
    return `${ctx.age}歲，${child.call}${child.name}長大了，會自己走到${house.hamlet}口。`;
  }
  if (id === "split") {
    const who = presentSibling(house, 0);
    who.away = true;
    remember(house, `${who.call}${who.name}分出去住了`);
    return `${ctx.age}歲，${who.call}${who.name}要分家，搬到${house.hamlet}外。人還在，${house.home}少了一張床。`;
  }
  if (id === "missing") {
    const who = presentSibling(house, 1);
    who.away = true;
    remember(house, `${who.call}${who.name}外出沒有回來`);
    return `${ctx.age}歲，${who.call}${who.name}說去${house.river}看船，船翻了，人沒有再上岸。`;
  }
  if (id === "childwork") {
    const years = Math.max(0, ctx.age - child.born);
    if (years < 16) return `${ctx.age}歲，${child.call}${child.name}還小，還沒獨立做事。`;
    return `${ctx.age}歲，${child.call}${child.name}開始自己找活做。`;
  }
  if (id === "childmarry") {
    const verb = child.call === "兒子" ? "娶了" : "嫁給";
    remember(house, `${child.call}${child.name}自己成了家`);
    return `${ctx.age}歲，${child.call}${child.name}${verb}${house.childInLaw}。人還會回${house.home}。`;
  }
  if (id.endsWith("-ill") || id.endsWith("-die")) {
    const who = id.startsWith("father") ? parentOf(house, "father") : parentOf(house, "mother");
    if (id.endsWith("-ill")) {
      who.sick = true;
      remember(house, `${who.call}${who.name}病過`);
      return `${ctx.age}歲，${who.call}${who.name}病了。你趕回家，人還認得出你。`;
    }
    if ((house.steady ?? 0) > 0) {
      house.steady = (house.steady ?? 1) - 1;
      who.sick = false;
      return `${ctx.age}歲，${who.call}${who.name}病得重。家裡人輪著守，人撐過來了。`;
    }
    who.dead = true;
    who.sick = false;
    return `${ctx.age}歲，${who.call}${who.name}沒有醒來。人走了。之後的年份，${house.home}還會想起這個名字。`;
  }
  if (id === "funeral") {
    const who = parentOf(house, house.firstLoss);
    remember(house, `給${who.call}${who.name}辦過喪`);
    return `${ctx.age}歲，你給${who.call}${who.name}辦了喪。還在的人都站在${house.hamlet}的墳邊。`;
  }
  if (id === "grave") {
    const who = parentOf(house, house.firstLoss);
    return `${ctx.age}歲，你到${house.hamlet}的墳上看${who.call}${who.name}。人走了，名字還記得。${memoryClause(house, ctx.age)}`;
  }
  if (id === "remember") {
    const extra = house.memories.slice(0, 2).join("，");
    return `${ctx.age}歲，父親${house.father.name}和母親${house.mother.name}都不在了。你在${house.home}還記得他們。${extra ? `也還記得${extra}。` : ""}`;
  }
  if (id.startsWith("work-")) return workLine(house, ctx);
  return "";
}

function livingCall(house: Household, call: string): boolean {
  return house.siblings.some((kin) => kin.call === call && kin.present && !kin.dead && !kin.away);
}

export function householdBlocks(
  house: Household | null | undefined,
  mortal: boolean | undefined,
  blob: string,
  shape: string,
): boolean {
  if (mortal && (shape === "sect" || shape === "page" || shape === "cave" || shape === "risk")) return true;
  if (!house) return false;
  if (/父親|爹/.test(blob) && house.father.dead) return true;
  if (/母親|娘/.test(blob) && house.mother.dead) return true;
  if (/弟弟/.test(blob) && !livingCall(house, "弟弟")) return true;
  if (/妹妹/.test(blob) && !livingCall(house, "妹妹")) return true;
  if (/哥哥/.test(blob) && !livingCall(house, "哥哥")) return true;
  if (/姐姐/.test(blob) && !livingCall(house, "姐姐")) return true;
  return false;
}

function tilt(house: Household, age: number, aim: string): number {
  let hash = age * 17 + house.hamlet.charCodeAt(0);
  for (const char of `${aim}${house.originId}`) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return hash >>> 0;
}

function working(house: Household, age: number): boolean {
  return house.seen.includes("job") || age >= house.jobSince;
}

export function yearMatter(house: Household | null, age: number, region: string, aim: AimId = "cultivate"): string {
  if (!house) return `${age}歲，人在${region}過這一年。`;
  const options = yearScenes(house, age, aim);
  const start = tilt(house, age, aim) % options.length;
  for (let step = 0; step < options.length; step += 1) {
    const text = options[(start + step) % options.length]!();
    if (text) return text;
  }
  return `人在${house.home}。`;
}

function yearScenes(house: Household, age: number, aim: AimId): Array<() => string | null> {
  const home = house.home;
  const hamlet = house.hamlet;
  const job = working(house, age) ? `${house.jobPlace}${house.job}` : "";
  const mother = !house.mother.dead && house.mother.present ? `母親${house.mother.name}` : "";
  const father = !house.father.dead && house.father.present ? `父親${house.father.name}` : "";
  const people = [house.father, house.mother, ...house.siblings, house.spouse, ...house.children];
  const sick = people.find((kin) => kin.present && kin.sick && !kin.dead);
  const child = house.children.find((kin) => kin.present && !kin.dead && !kin.away);
  const spouse = house.spouse.present && !house.spouse.dead && !house.spouse.away ? house.spouse.name : "";
  const older = house.siblings.find((kin) => kin.present && !kin.dead && !kin.away);
  const near = sick ? kinLabel(sick) : child ? `${child.call}${child.name}` : spouse || older ? (older ? `${older.call}${older.name}` : spouse) : mother || father || "家裡的人";
  if (aim === "family") {
    return [
      () => (sick ? `${kinLabel(sick)}病著，你守在${home}，功法合上了。` : null),
      () => (child ? `${child.call}${child.name}還小，你留在${home}看著，${job || hamlet}那邊的事放一放。` : null),
      () => (job ? `從${job}回來，你先去看${near}。今晚沒有打坐。` : `${near}在${home}，你今天沒有出門練功。`),
      () => (mother ? `${mother}在灶前咳了兩聲。你把水遞過去，吐納推到以後。` : null),
      () => `${near}說想你在家。你就留在${hamlet}，墊子上落了一層灰。`,
    ];
  }
  if (aim === "work") {
    return [
      () => (job ? `${job}從早做到天黑。回到${home}，${near}把飯熱過一遍。` : null),
      () => (job ? `這一年靠${job}那份工。工錢交到${home}，打坐的位子空著。` : null),
      () => (father && !job ? `你跟著${father}在${hamlet}學做事。功法只在睡前看了兩眼。` : null),
      () => (job ? `${house.jobPlace}缺人，你留下把班頂完。${hamlet}的燈，你總是後一批才看見。` : `你在${hamlet}幫著做事，${home}的門到晚上才關。`),
      () => (spouse ? `${spouse}問你累不累。你說${job || "今天的活"}還沒完。` : null),
    ];
  }
  if (aim === "friends") {
    return [
      () => `你在${hamlet}口跟同歲的人坐到天黑。${mother || near}在${home}留了飯。`,
      () => (job ? `${job}的班你今天沒去滿。人在${house.market}跟同輩說話，功法落在${home}。` : null),
      () => (father ? `同歲的人來${home}找你。說到${father}咳了一聲，才散。` : `有人在${house.river}邊等你。你去了，家裡的活是${near}做的。`),
      () => `${house.market}今天人多。你沒有回${home}練功，跟同輩繞著${hamlet}走了一圈。`,
    ];
  }
  if (aim === "health") {
    return [
      () => (mother ? `你這一年睡得早。${mother}說這樣也好，吐納只在天亮前一小會。` : null),
      () => (sick ? `${kinLabel(sick)}病著，你自己也沒有硬練，人在${home}歇著。` : `身子發沉，你沒有硬練。${near}在${home}給你熱了湯。`),
      () => `你把打坐改成走路，從${hamlet}慢慢走到${house.river}邊，再走回來。`,
    ];
  }
  return [
    () => (sick ? `你仍想練功，可${kinLabel(sick)}病著，人只在${home}裡打坐，門沒出。` : null),
    () => (!job && father ? `天沒亮你就在${home}後面坐下。${father}出門，從你身邊走過，沒有叫你。` : null),
    () => (job ? `下工以後的時辰你都給了吐納。${near}叫你吃飯，叫了兩次。` : null),
    () => (mother ? `${hamlet}有人喊你，你應了一聲，人還在打坐。${mother}看了你一眼，沒再喊。` : null),
    () => (older ? `功法翻到舊的那一頁。${older.call}${older.name}在門外說話，你沒有出去。` : `你在${home}坐到窗紙發白。${hamlet}的人聲起來了，你才起身。`),
  ];
}

export function describeWork(house: Household | null, age: number): string {
  if (!house) return "生計還沒寫上";
  if (!house.seen.includes("job") && age < house.jobSince) return "還沒獨立做事";
  return house.job;
}

function grownKin(kin: Kin, age: number): boolean {
  if (kin.role === "father" || kin.role === "mother" || kin.role === "spouse") return true;
  if (kin.role === "sibling" && kin.born <= 0) return true;
  return age - kin.born >= 16;
}

export function kinTrade(kin: Kin, house: Household, age: number): string {
  if (kin.dead) {
    if (kin.trade && grownKin(kin, age)) return `生前做${kin.trade}`;
    return "已經不在";
  }
  if (!grownKin(kin, age)) return "還沒獨立做事";
  return kin.trade || "種田";
}

export function kinDoing(kin: Kin, house: Household, age: number): string {
  const about = house.memories.filter((item) => item.includes(kin.name));
  const last = about[about.length - 1] ?? "";
  if (kin.dead) return about.length > 0 ? "已經不在，家裡還記得" : "已經不在";
  if (kin.away) return `人在${house.hamlet}外面，一時回不了${house.home}`;
  if (kin.sick || /病/.test(last)) return `病著，人還在${house.home}`;
  if (/吵/.test(last) && !/和好/.test(last)) return "剛吵過，話還沒說開";
  if (/和好/.test(last)) return "架吵過，已經一起吃飯";
  if (/認字|認過字/.test(last)) return "在認字";
  if (kin.role === "child") {
    const years = Math.max(0, age - kin.born);
    if (years < 6) return `${years}歲，還小，在${house.home}`;
    return `${years}歲，會自己走到${house.hamlet}口`;
  }
  if (kin.role === "sibling" && kin.born > 0) {
    return `${Math.max(0, age - kin.born)}歲，在${house.home}`;
  }
  if (kin.role === "spouse") return `在${house.home}裡`;
  if (house.seen.includes("job")) return `人在${house.home}`;
  return `在${house.home}裡`;
}

export function noteYearRipple(house: Household, _age: number, phrase: string): void {
  if (!phrase || house.memories.includes(phrase)) return;
  house.memories.push(phrase);
}

export function shiftLivelihood(house: Household): string {
  const previous = `${house.jobPlace}${house.job}`;
  const calm: HomeContext = { age: 0, realm: "qi-early", sect: null, mortal: true, escaped: true };
  if (house.jobTier === "cave") {
    const posts = HIGH_POSTS.filter((item) => item.job !== house.highJob);
    const next = posts[0] ?? HIGH_POSTS[0]!;
    house.highJob = next.job;
    house.highSlot = next.slot;
    house.job = next.job;
    house.jobPlace = locate(house, { ...calm, mortal: false, realm: "foundation" }, next.slot);
  } else if (house.jobTier === "sect") {
    const posts = SECT_POSTS.filter((item) => item.job !== house.sectJob);
    const next = posts[0] ?? SECT_POSTS[0]!;
    house.sectJob = next.job;
    house.sectSlot = next.slot;
    house.job = next.job;
    house.jobPlace = locate(house, { ...calm, mortal: false, sect: null }, next.slot);
  } else {
    const posts = ORIGIN_POSTS[house.originId].filter((item) => item.job !== house.originJob);
    const next = posts[house.memories.length % Math.max(1, posts.length)] ?? ORIGIN_POSTS[house.originId][0]!;
    house.originJob = next.job;
    house.originSlot = next.slot;
    house.job = next.job;
    house.jobTier = "origin";
    house.jobPlace = locate(house, calm, next.slot);
  }
  if (!house.seen.includes("job")) house.seen.push("job");
  return `你不做${previous}了，改做${house.job}。`;
}

export function bindHousehold(text: string, house: Household | null | undefined): string {
  if (!house || !text) return text;
  let out = text.replaceAll("爹娘", `父親${house.father.name}、母親${house.mother.name}`);
  const stamp = (role: string, name: string) => {
    if (!name) return;
    out = out.replace(new RegExp(`(?<![他她])${role}(?!${name})`, "g"), `${role}${name}`);
  };
  stamp("父親", house.father.name);
  stamp("母親", house.mother.name);
  for (const call of ["弟弟", "妹妹", "哥哥", "姐姐"] as const) {
    const kin = house.siblings.find((item) => item.call === call && item.present && !item.dead && !item.away);
    if (!kin) continue;
    stamp(call, kin.name);
  }
  if (!out.includes(house.market)) out = out.replaceAll("坊市", house.market);
  const stem = house.hamlet.slice(0, -1).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  out = out.replace(new RegExp(`(?<!${stem})村口`, "g"), `${house.hamlet}口`);
  return out;
}
