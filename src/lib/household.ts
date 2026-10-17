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
  { job: "照料外門藥園", slot: "garden" },
  { job: "做護院", slot: "sect" },
  { job: "當管事", slot: "sect" },
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
  if (slot === "garden") return ctx.sect ? `${ctx.sect}藥園` : house.yard;
  return ctx.sect ? `${ctx.sect}外院` : house.yard;
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
  const hamlet = pickFrom(PLACE_POOL.filter((item) => /[村鎮縣]$/.test(item)), seed, 0x31);
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
  const father = blankKin("father", kinName(seed, 0x41, surname, "m", avoid), "父親", true, 0);
  const mother = blankKin("mother", kinName(seed, 0x42, surname, "f", avoid), "母親", true, 0);
  const siblings = [
    blankKin("sibling", kinName(seed, 0x43, surname, olderCall === "哥哥" ? "m" : "f", avoid), olderCall, true, 0),
    blankKin("sibling", kinName(seed, 0x44, surname, youngerCall === "弟弟" ? "m" : "f", avoid), youngerCall, false, 6),
  ];
  const spouse = blankKin("spouse", outsiderName(seed, 0x45, surname, "f", avoid), "配偶", false, 0);
  const children = [
    blankKin("child", kinName(seed, 0x46, surname, childCall === "兒子" ? "m" : "f", avoid), childCall, false, 0),
  ];
  if (mix(seed, 0x47) % 3 !== 0) {
    children.push(
      blankKin("child", kinName(seed, 0x48, surname, childCall2 === "兒子" ? "m" : "f", avoid), childCall2, false, 0),
    );
  }
  const childInLaw = outsiderName(seed, 0x49, surname, childCall === "兒子" ? "f" : "m", avoid);
  const mate = outsiderName(seed, 0x4b, surname, "m", avoid);
  const firstLoss: "father" | "mother" = mix(seed, 0x23) % 2 === 0 ? "father" : "mother";
  const early = input.mortal ? 36 + (mix(seed, 0x21) % 10) : 40 + (mix(seed, 0x21) % 12);
  const late = input.mortal ? 50 + (mix(seed, 0x22) % 10) : 56 + (mix(seed, 0x22) % 14);
  const marryAt = 22 + (mix(seed, 0x11) % 6);
  const birth = marryAt + 4 + (mix(seed, 0x12) % 3);
  const used = new Set<number>();
  const agenda: { id: string; age: number }[] = [];
  const add = (id: string, want: number) => agenda.push({ id, age: place(used, want) });
  add("born", 0);
  add("father", 3);
  add("sibling", 6);
  add("broke", 8);
  add("hand", 9);
  add("chill", 10);
  add("birthday", 12);
  add("story", 13);
  add("job", 14);
  add("craft", 16);
  add("festival", 18);
  add("aging", 20);
  add("marry", marryAt);
  add("quarrel", marryAt + 1);
  add("mend", marryAt + 2);
  add("settle", marryAt + 3);
  add("aid", marryAt + 4);
  add("child", birth);
  add("letters", birth + 6);
  add("grow", birth + 8);
  add("split", 32);
  add("missing", 36);
  add("childwork", birth + 16);
  add("childmarry", birth + 18);
  add(`${firstLoss}-ill`, early - 3);
  add(`${firstLoss}-die`, early);
  add("funeral", early + 2);
  add("grave", early + 6);
  const second = firstLoss === "father" ? "mother" : "father";
  add(`${second}-ill`, late - 3);
  add(`${second}-die`, late);
  add("remember", late + 4);
  if (children[1]) add("child2", birth + 5);
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
  return `${ctx.age}歲，你不再天天${previous}，改去${next.place}${next.job}。${house.hamlet}的屋子還在。${atHome(house)}。`;
}

function goneClause(house: Household): string {
  const gone = [house.father, house.mother, ...house.siblings].filter((kin) => kin.dead);
  if (gone.length === 0) return "";
  const who = gone[gone.length - 1]!;
  return `${who.call}${who.name}已經不在。`;
}

function workLine(house: Household, ctx: HomeContext): string {
  const changed = syncJob(house, ctx);
  if (changed) return `${changed}${goneClause(house)}${memoryClause(house, ctx.age)}`;
  const spouse = house.spouse.present && !house.spouse.dead ? `${house.spouse.name}在屋裡。` : "";
  const child = house.children.find((kin) => kin.present && !kin.dead);
  const childText = child ? `${child.call}${child.name}也在。` : "";
  return `${ctx.age}歲，你仍在${house.jobPlace}${house.job}。${house.mate}跟你收工，回到${house.home}。${spouse}${childText}${goneClause(house)}${memoryClause(house, ctx.age)}`;
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
    return `${ctx.age}歲，父親${house.father.name}在${house.jobPlace}${house.job}。你跟著走到${house.hamlet}口，晚上還是回${house.home}。`;
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
    return `${ctx.age}歲，從這一年起，你在${house.jobPlace}${house.job}。${house.hamlet}的屋子還在，${atHome(house)}。`;
  }
  if (id === "craft") {
    remember(house, `父親${house.father.name}傳過${craftNoun(house.job)}`);
    return `${ctx.age}歲，父親${house.father.name}把${craftNoun(house.job)}傳給你。你在${house.jobPlace}照著做了一遍。`;
  }
  if (id === "festival") {
    remember(house, `節日回過${house.home}`);
    return `${ctx.age}歲，節日你從${house.jobPlace}回到${house.home}。父親${house.father.name}、母親${house.mother.name}都在，${house.market}也歇了。`;
  }
  if (id === "aging") {
    const father = house.father.dead ? `父親${house.father.name}已經不在` : `父親${house.father.name}的背彎了`;
    const mother = house.mother.dead ? `母親${house.mother.name}已經不在` : `母親${house.mother.name}的頭髮白了`;
    return `${ctx.age}歲，${father}，${mother}。你仍在${house.jobPlace}${house.job}。${memoryClause(house, ctx.age)}`;
  }
  if (id === "marry") {
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
    return `${ctx.age}歲，${house.spouse.name}把${house.home}收過。你白天仍去${house.jobPlace}${house.job}。屋子還在。`;
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
    return `${ctx.age}歲，${child.call}${child.name}長大了，會自己走到${house.hamlet}口。你還在${house.jobPlace}${house.job}。`;
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
    return `${ctx.age}歲，${who.call}${who.name}說去${house.river}看看，到了夜裡沒有回來。`;
  }
  if (id === "childwork") {
    return `${ctx.age}歲，${child.call}${child.name}也開始做事。你仍在${house.jobPlace}${house.job}，屋子裡要養的人換了一輪。${memoryClause(house, ctx.age)}`;
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
      return `${ctx.age}歲，${who.call}${who.name}病了。你從${house.jobPlace}趕回到${house.home}，人還認得出你。`;
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
  const gone = [house.father, house.mother].filter((kin) => kin.dead).map((kin) => `${kin.call}${kin.name}`).join("、");
  const memory = gone ? `${gone}已經不在，名字還在。` : "";
  const duty = `${house.jobPlace}${house.job}`;
  if (ctx.age % 3 === 1) {
    return `${ctx.age}歲，${house.mate}還是在${duty}等你收工。回到${house.home}，${atHome(house)}。${memory}${memoryClause(house, ctx.age)}`;
  }
  if (ctx.age % 3 === 2) {
    return `${ctx.age}歲，${duty}這一天做完，人還是回${house.home}。${memory}${house.hamlet}沒有換成別的地方。${memoryClause(house, ctx.age)}`;
  }
  return `${ctx.age}歲，你還在${duty}。${atHome(house)}。${memory}${memoryClause(house, ctx.age)}`;
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

export function bindHousehold(text: string, house: Household | null | undefined): string {
  if (!house || !text) return text;
  let out = text.replaceAll("爹娘", `父親${house.father.name}、母親${house.mother.name}`);
  out = out.replace(/(?<![他她])父親/g, `父親${house.father.name}`);
  out = out.replace(/(?<![他她])母親/g, `母親${house.mother.name}`);
  for (const call of ["弟弟", "妹妹", "哥哥", "姐姐"] as const) {
    const kin = house.siblings.find((item) => item.call === call && item.present && !item.dead && !item.away);
    if (!kin) continue;
    out = out.replace(new RegExp(`(?<![他她])${call}`, "g"), `${call}${kin.name}`);
  }
  out = out.replaceAll("坊市", house.market);
  out = out.replaceAll("村口", `${house.hamlet}口`);
  return out;
}
