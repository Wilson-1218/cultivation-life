import { humanName } from "./names";
import type { OriginId, RealmId } from "./world";

export type Kin = {
  role: "father" | "mother" | "sibling" | "spouse" | "child";
  name: string;
  call: string;
  dead: boolean;
  sick: boolean;
  present: boolean;
  born: number;
};

export type Household = {
  hamlet: string;
  market: string;
  home: string;
  region: string;
  father: Kin;
  mother: Kin;
  siblings: Kin[];
  spouse: Kin;
  children: Kin[];
  mate: string;
  job: string;
  jobPlace: string;
  jobTier: "origin" | "sect" | "cave";
  jobSince: number;
  sectDuty: string;
  caveDuty: string;
  firstLoss: "father" | "mother";
  originId: OriginId;
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

const HAMLETS = ["柳林", "槐巷", "石埠", "井邊", "河灣"] as const;
const QI = new Set<RealmId>(["qi-early", "qi-mid", "qi-late", "qi-peak"]);

function mix(seed: number, salt: number): number {
  let x = (seed ^ Math.imul(salt, 0x9e3779b1)) >>> 0;
  x = Math.imul(x ^ (x >>> 16), 0x7feb352d) >>> 0;
  x = Math.imul(x ^ (x >>> 15), 0x846ca68b) >>> 0;
  return (x ^ (x >>> 16)) >>> 0 || 1;
}

function familyName(seed: number, salt: number, surname: string, avoid: Set<string>): string {
  for (let n = 0; n < 12; n += 1) {
    const given = humanName(seed, salt + n * 13).slice(1) || "生";
    const name = `${surname}${given}`;
    if (!avoid.has(name)) {
      avoid.add(name);
      return name;
    }
  }
  const name = `${surname}生`;
  avoid.add(name);
  return name;
}

function otherName(seed: number, salt: number, surname: string, avoid: Set<string>): string {
  for (let n = 0; n < 12; n += 1) {
    const name = humanName(seed, salt + n * 13);
    if (name[0] !== surname && !avoid.has(name)) {
      avoid.add(name);
      return name;
    }
  }
  const name = humanName(seed, salt + 99);
  avoid.add(name);
  return name;
}

function place(used: Set<number>, want: number): number {
  let age = Math.max(0, want);
  while (used.has(age)) age += 1;
  used.add(age);
  return age;
}

function originPost(origin: OriginId, hamlet: string, escaped: boolean): { job: string; place: string } {
  if (origin === "orphan") return { job: "做短工", place: `${hamlet}坊` };
  if (origin === "clan") return { job: "管帳", place: "家族帳房" };
  if (origin === "cauldron" && !escaped) return { job: "打雜", place: "藥廬" };
  if (origin === "remnant") return { job: "看舖", place: `${hamlet}舊舖` };
  return { job: "種田", place: `${hamlet}東頭的田裡` };
}

function jobPhrase(job: string): string {
  if (job === "外門雜役") return "做外門雜役";
  return job;
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
  const hamlet = HAMLETS[mix(seed, 0x31) % HAMLETS.length]!;
  const olderCall = mix(seed, 0x32) % 2 === 0 ? "哥哥" : "姐姐";
  const youngerCall = mix(seed, 0x33) % 2 === 0 ? "弟弟" : "妹妹";
  const childCall = mix(seed, 0x34) % 2 === 0 ? "兒子" : "女兒";
  const childCall2 = childCall === "兒子" ? "女兒" : "兒子";
  const post = originPost(input.originId, hamlet, false);
  const father: Kin = {
    role: "father",
    name: familyName(seed, 0x41, surname, avoid),
    call: "父親",
    dead: false,
    sick: false,
    present: true,
    born: 0,
  };
  const mother: Kin = {
    role: "mother",
    name: familyName(seed, 0x42, surname, avoid),
    call: "母親",
    dead: false,
    sick: false,
    present: true,
    born: 0,
  };
  const siblings: Kin[] = [
    {
      role: "sibling",
      name: familyName(seed, 0x43, surname, avoid),
      call: olderCall,
      dead: false,
      sick: false,
      present: true,
      born: 0,
    },
    {
      role: "sibling",
      name: familyName(seed, 0x44, surname, avoid),
      call: youngerCall,
      dead: false,
      sick: false,
      present: false,
      born: 6,
    },
  ];
  const spouse: Kin = {
    role: "spouse",
    name: otherName(seed, 0x45, surname, avoid),
    call: "配偶",
    dead: false,
    sick: false,
    present: false,
    born: 0,
  };
  const children: Kin[] = [
    {
      role: "child",
      name: familyName(seed, 0x46, surname, avoid),
      call: childCall,
      dead: false,
      sick: false,
      present: false,
      born: 0,
    },
  ];
  if (mix(seed, 0x47) % 3 !== 0) {
    children.push({
      role: "child",
      name: familyName(seed, 0x48, surname, avoid),
      call: childCall2,
      dead: false,
      sick: false,
      present: false,
      born: 0,
    });
  }
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
  add("hand", 9);
  add("job", 14);
  add("aging", 20);
  add("marry", marryAt);
  add("settle", marryAt + 2);
  add("child", birth);
  add("grow", birth + 8);
  add("childwork", birth + 16);
  add(`${firstLoss}-ill`, early - 3);
  add(`${firstLoss}-die`, early);
  add("grave", early + 6);
  const second = firstLoss === "father" ? "mother" : "father";
  add(`${second}-ill`, late - 3);
  add(`${second}-die`, late);
  add("remember", late + 4);
  if (children[1]) add("child2", birth + 5);
  if (mix(seed, 0x49) % 2 === 0) add("sibling-die", 34 + (mix(seed, 0x4a) % 8));
  for (const age of [15, 17, 23, 29, 35, 41, 47, 53, 59, 65, 71, 77]) add(`work-${age}`, age);
  agenda.sort((a, b) => a.age - b.age);
  return {
    hamlet,
    market: `${hamlet}坊`,
    home: `${hamlet}那間屋`,
    region: input.region,
    father,
    mother,
    siblings,
    spouse,
    children,
    mate: otherName(seed, 0x4b, surname, avoid),
    job: post.job,
    jobPlace: post.place,
    jobTier: "origin",
    jobSince: 14,
    sectDuty: mix(seed, 0x4c) % 2 === 0 ? "值守" : "外門雜役",
    caveDuty: mix(seed, 0x4d) % 2 === 0 ? "管洞府" : "帶人",
    firstLoss,
    originId: input.originId,
    agenda,
    seen: [],
  };
}

export function dueHome(house: Household, age: number): string | null {
  const waiting = house.agenda.find((item) => item.age <= age && !house.seen.includes(item.id));
  if (waiting) return waiting.id;
  if (age >= 78 && age % 6 === 0 && !house.seen.includes(`late-${age}`)) return `late-${age}`;
  return null;
}

function livingKin(house: Household): Kin[] {
  const list = [house.father, house.mother, ...house.siblings, house.spouse, ...house.children];
  return list.filter((kin) => kin.present && !kin.dead);
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

function desired(house: Household, ctx: HomeContext): { job: string; place: string; tier: Household["jobTier"] } {
  const high = !ctx.mortal && !QI.has(ctx.realm);
  if (high) return { job: house.caveDuty, place: `${house.hamlet}外的洞府`, tier: "cave" };
  if (ctx.sect && !ctx.mortal) return { job: house.sectDuty, place: `${ctx.sect}外院`, tier: "sect" };
  const post = originPost(house.originId, house.hamlet, ctx.escaped);
  return { job: post.job, place: post.place, tier: "origin" };
}

function syncJob(house: Household, ctx: HomeContext): string | null {
  const next = desired(house, ctx);
  if (next.tier === house.jobTier && next.job === house.job && next.place === house.jobPlace) return null;
  const previous = jobPhrase(house.job);
  house.job = next.job;
  house.jobPlace = next.place;
  house.jobTier = next.tier;
  return `${ctx.age}歲，你不再天天${previous}，改去${next.place}${jobPhrase(next.job)}。${house.hamlet}的屋子還在。${atHome(house)}。`;
}

function goneClause(house: Household): string {
  const gone = [house.father, house.mother, ...house.siblings].filter((kin) => kin.dead);
  if (gone.length === 0) return "";
  const who = gone[gone.length - 1]!;
  return `${who.call}${who.name}已經不在。`;
}

function workLine(house: Household, ctx: HomeContext): string {
  const changed = syncJob(house, ctx);
  if (changed) return `${changed}${goneClause(house)}`;
  const spouse = house.spouse.present && !house.spouse.dead ? `${house.spouse.name}在屋裡。` : "";
  const child = house.children.find((kin) => kin.present && !kin.dead);
  const childText = child ? `${child.call}${child.name}也在。` : "";
  return `${ctx.age}歲，你仍在${house.jobPlace}${jobPhrase(house.job)}。${house.mate}跟你收工，回到${house.home}。${spouse}${childText}${goneClause(house)}`;
}

function parentOf(house: Household, who: "father" | "mother"): Kin {
  return who === "father" ? house.father : house.mother;
}

export function commitHome(house: Household, id: string, ctx: HomeContext): string {
  house.seen.push(id);
  const older = house.siblings[0]!;
  const younger = house.siblings[1]!;
  const child = house.children[0]!;
  const child2 = house.children[1];
  if (id === "born") {
    return `${ctx.age}歲，你生在${house.region}${house.hamlet}。母親${house.mother.name}把你抱進門，父親${house.father.name}在${house.home}裡等著。${older.call}${older.name}已經會走路。`;
  }
  if (id === "father") {
    return `${ctx.age}歲，父親${house.father.name}在${house.jobPlace}做事。你跟著走到${house.hamlet}口，晚上還是回${house.home}。`;
  }
  if (id === "sibling") {
    younger.present = true;
    return `${ctx.age}歲，母親${house.mother.name}生了${younger.call}${younger.name}。${older.call}${older.name}把小床讓出一角。${house.home}多了一個人。`;
  }
  if (id === "hand") {
    return `${ctx.age}歲，你給${older.call}${older.name}搭手。${house.hamlet}的日子就是這些，還沒有人談靈根。`;
  }
  if (id === "job") {
    house.jobSince = ctx.age;
    syncJob(house, ctx);
    return `${ctx.age}歲，從這一年起，你在${house.jobPlace}${jobPhrase(house.job)}。${house.hamlet}的屋子還在，${atHome(house)}。`;
  }
  if (id === "aging") {
    const father = house.father.dead ? `父親${house.father.name}已經不在` : `父親${house.father.name}的背彎了`;
    const mother = house.mother.dead ? `母親${house.mother.name}已經不在` : `母親${house.mother.name}的頭髮白了`;
    return `${ctx.age}歲，${father}，${mother}。你仍在${house.jobPlace}${jobPhrase(house.job)}。`;
  }
  if (id === "marry") {
    house.spouse.present = true;
    house.spouse.born = ctx.age;
    return `${ctx.age}歲，${house.spouse.name}進門。你們在${house.home}成了家，${house.market}的人來坐了一坐。`;
  }
  if (id === "settle") {
    return `${ctx.age}歲，${house.spouse.name}把${house.home}收過。你白天仍去${house.jobPlace}${jobPhrase(house.job)}。屋子還在。`;
  }
  if (id === "child" || id === "child2") {
    const born = id === "child" ? child : child2;
    if (!born) return workLine(house, ctx);
    born.present = true;
    born.born = ctx.age;
    const mate = house.spouse.present ? house.spouse.name : house.mother.name;
    return `${ctx.age}歲，${mate}生了${born.call}${born.name}。${house.home}要養的人又多了一個。`;
  }
  if (id === "grow") {
    return `${ctx.age}歲，${child.call}${child.name}長大了，會自己走到${house.hamlet}口。你還在${house.jobPlace}${jobPhrase(house.job)}。`;
  }
  if (id === "childwork") {
    return `${ctx.age}歲，${child.call}${child.name}也開始做事。你仍在${house.jobPlace}${jobPhrase(house.job)}，屋子裡要養的人換了一輪。`;
  }
  if (id === "sibling-die") {
    const who = younger.present && !younger.dead ? younger : older;
    who.dead = true;
    who.sick = false;
    return `${ctx.age}歲，${who.call}${who.name}先走了，沒有醒來。${house.hamlet}的墳上多了這個名字。`;
  }
  if (id.endsWith("-ill") || id.endsWith("-die")) {
    const who = id.startsWith("father") ? parentOf(house, "father") : parentOf(house, "mother");
    if (id.endsWith("-ill")) {
      who.sick = true;
      return `${ctx.age}歲，${who.call}${who.name}病了。你從${house.jobPlace}趕回到${house.home}，人還認得出你。`;
    }
    who.dead = true;
    who.sick = false;
    return `${ctx.age}歲，${who.call}${who.name}沒有醒來。人走了。之後的年份，${house.home}還會想起這個名字。`;
  }
  if (id === "grave") {
    const who = parentOf(house, house.firstLoss);
    return `${ctx.age}歲，你到${house.hamlet}的墳上看${who.call}${who.name}。人走了，名字還記得。`;
  }
  if (id === "remember") {
    return `${ctx.age}歲，父親${house.father.name}和母親${house.mother.name}都不在了。你在${house.home}還記得他們。`;
  }
  if (id.startsWith("work-")) return workLine(house, ctx);
  const gone = [house.father, house.mother].filter((kin) => kin.dead).map((kin) => `${kin.call}${kin.name}`).join("、");
  const memory = gone ? `${gone}已經不在，名字還在。` : "";
  const duty = `${house.jobPlace}${jobPhrase(house.job)}`;
  if (ctx.age % 3 === 1) {
    return `${ctx.age}歲，${house.mate}還是在${duty}等你收工。回到${house.home}，${atHome(house)}。${memory}`;
  }
  if (ctx.age % 3 === 2) {
    return `${ctx.age}歲，${duty}這一天做完，人還是回${house.home}。${memory}${house.hamlet}沒有換成別的地方。`;
  }
  return `${ctx.age}歲，你還在${duty}。${atHome(house)}。${memory}`;
}

function livingCall(house: Household, call: string): boolean {
  return house.siblings.some((kin) => kin.call === call && kin.present && !kin.dead);
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
    const kin = house.siblings.find((item) => item.call === call && item.present && !item.dead);
    if (!kin) continue;
    out = out.replace(new RegExp(`(?<![他她])${call}`, "g"), `${call}${kin.name}`);
  }
  out = out.replaceAll("坊市", house.market);
  out = out.replaceAll("村口", `${house.hamlet}口`);
  return out;
}
