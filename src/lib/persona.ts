import type { RootId } from "./world";

export type SectRank = "outer" | "watch" | "inner" | "steward" | "elder" | "expelled";

export const SHALLOW_MANUALS = [
  "青禾吐納訣",
  "厚土納氣功",
  "晨露養元篇",
  "井華吐納訣",
  "畦間養氣篇",
  "村燈守一訣",
  "薄霧引氣篇",
  "石階吐納功",
  "朝露歸元訣",
  "野火溫養篇",
] as const;
export const MID_MANUALS = [
  "松風歸元篇",
  "白石煉氣訣",
  "玄水養氣經",
  "赤霞煉氣篇",
  "庚金鍛氣訣",
  "離火煉氣經",
  "坎水歸元篇",
  "巽風吐納經",
  "鎮岳煉氣功",
  "流雲養元訣",
] as const;
export const DEEP_MANUALS = [
  "寒鴉觀想法",
  "斷碑心經",
  "雲棲真解篇",
  "紫府問心經",
  "太虛納元功",
  "九轉歸真訣",
  "玄冥觀想篇",
  "天星照魄經",
  "龍脈鎮元功",
  "無相心法篇",
] as const;

export function startingManual(seed: number): string {
  return SHALLOW_MANUALS[Math.abs(seed) % SHALLOW_MANUALS.length]!;
}

export function heritageManual(seed: number): string {
  return MID_MANUALS[Math.abs(seed) % MID_MANUALS.length]!;
}

export function rankLabel(rank: SectRank | null): string {
  if (rank === "inner") return "內門";
  if (rank === "steward") return "管事";
  if (rank === "elder") return "長老候選";
  if (rank === "watch") return "值守";
  if (rank === "expelled") return "已經離開";
  return "外門";
}

const RANK_LADDER: SectRank[] = ["outer", "inner", "steward", "elder"];

export function nextSectRank(rank: SectRank | null): SectRank | null {
  const current = rank === "watch" ? "outer" : rank;
  const index = RANK_LADDER.indexOf(current ?? "outer");
  if (index < 0 || index >= RANK_LADDER.length - 1) return null;
  return RANK_LADDER[index + 1] ?? null;
}

export function insightGate(name: string): number {
  if ((DEEP_MANUALS as readonly string[]).includes(name)) return 72;
  if ((MID_MANUALS as readonly string[]).includes(name)) return 48;
  return 18;
}

export function deepestUnread(insight: number, learned: readonly string[], seed: number): string {
  const pool = insight >= 72 ? DEEP_MANUALS : MID_MANUALS;
  const fresh = pool.filter((name) => !learned.includes(name));
  const list = fresh.length > 0 ? fresh : [...pool];
  return list[Math.abs(seed) % list.length]!;
}

export function progressGain(life: { progress: number; root: RootId; fortune: number }, raw: number): number {
  const scale = life.root === "wei" ? 0.55 : life.root === "zhen" ? 0.75 : life.root === "bian" ? 0.85 : 1;
  const drag = life.progress < 180 ? 1 : life.progress < 400 ? 0.55 : 0.3;
  const luck = 0.75 + Math.max(0, Math.min(100, life.fortune)) / 200;
  return Math.max(12, Math.round(raw * scale * drag * luck));
}

export function progressLine(_kind: string, moved: { crossed: boolean; realmName: string }): string {
  if (moved.crossed) return `修為過了這道坎，人到了${moved.realmName}。`;
  return `修為往前走了一截，人還在${moved.realmName}。`;
}

export function sectStanding(life: { sect: string | null; sectRank: SectRank | null; leftSect?: string | null }): string {
  if (!life.sect || !life.sectRank || life.sectRank === "expelled") {
    if (life.leftSect) return `離開了${life.leftSect}`;
    if (life.sectRank === "expelled") return "已經被打發走";
    return "尚未入門";
  }
  const role = rankLabel(life.sectRank);
  if (life.sect.endsWith(role)) return `${life.sect} · 弟子`;
  return `${life.sect} · ${role}`;
}

export type SectGain =
  | "mission"
  | "lecture"
  | "night"
  | "punish"
  | "merit"
  | "contest"
  | "bully"
  | "library"
  | "trial"
  | "keep"
  | "dismiss"
  | "teach"
  | "pill"
  | "page"
  | "switch"
  | "raise"
  | "leave";

export type SectAffair = {
  id: string;
  title: string;
  text: string;
  gain: SectGain;
  choices?: { id: string; label: string; hint: string }[];
};

export const SECT_AFFAIRS: SectAffair[] = [
  {
    id: "sect-mission",
    title: "領任務",
    text: "執事把一張任務單拍在你面前。山門外有人欠宗門的貨，要人去催。",
    gain: "mission",
  },
  {
    id: "sect-lecture",
    title: "講道",
    text: "內門有人下山講道。外門的人坐在廊下，能聽多少算多少。",
    gain: "lecture",
  },
  {
    id: "sect-night",
    title: "值夜",
    text: "今晚輪到你值夜。門沒關嚴，風從山道上灌進來。",
    gain: "night",
  },
  {
    id: "sect-punish",
    title: "受罰",
    text: "執事說你誤了時辰，要扣這個月的例錢。廊下站著一排人。",
    gain: "punish",
  },
  {
    id: "sect-merit",
    title: "交功",
    text: "你把這個月的功交上去。名冊攤在桌上，筆還沒落下。",
    gain: "merit",
  },
  {
    id: "sect-contest",
    title: "爭貢獻",
    text: "一筆貢獻掛在名冊上，外門的人都看著。去爭，就要當眾開口。",
    gain: "contest",
    choices: [
      { id: "sect-contest:a", label: "去爭", hint: "爭到了，靈石和名字都在冊上。" },
      { id: "sect-contest:b", label: "讓給別人", hint: "名冊還是原來的樣子。" },
    ],
  },
  {
    id: "sect-bully",
    title: "師兄找麻煩",
    text: "廊外有人堵住你，說你的袋子該借他用用。",
    gain: "bully",
  },
  {
    id: "sect-library",
    title: "藏經閣",
    text: "藏經閣今晚沒鎖嚴。你在架子前站了一會。",
    gain: "library",
  },
  {
    id: "sect-trial",
    title: "外門比試",
    text: "外門比試排到你。場邊站滿了人，執事拿著名冊。",
    gain: "trial",
  },
  {
    id: "sect-keep",
    title: "被留下",
    text: "執事說門裡缺一個值守，問你留不留下。",
    gain: "keep",
    choices: [
      { id: "sect-keep:a", label: "留下值守", hint: "身份改成值守。" },
      { id: "sect-keep:b", label: "還是回去", hint: "外門的日子照舊。" },
    ],
  },
  {
    id: "sect-dismiss",
    title: "被打發",
    text: "你連續誤了三次差事，貢獻又墊在名冊最末。執事要把你的名字劃掉。",
    gain: "dismiss",
    choices: [
      { id: "sect-dismiss:a", label: "請人說情", hint: "人脈夠的話，也許留得下。" },
      { id: "sect-dismiss:b", label: "自己走", hint: "名冊上沒有你。" },
    ],
  },
  {
    id: "sect-teach",
    title: "師兄傳功",
    text: "師兄把一部更深的功法攤開，問你看不看得懂。",
    gain: "teach",
  },
  {
    id: "sect-teach-hall",
    title: "講經傳功",
    text: "大殿裡有人講一部功法，點名讓外門的人跟上。",
    gain: "teach",
  },
  {
    id: "sect-teach-night",
    title: "夜裡傳功",
    text: "值夜的師兄把口訣低聲說給你聽，只說這一遍。",
    gain: "teach",
  },
  {
    id: "sect-raise",
    title: "名冊要改",
    text: "執事把名冊攤開，說你的差事夠了，上一檔有個空位。",
    gain: "raise",
  },
  {
    id: "sect-leave",
    title: "別的山門來請",
    text: "另一座山門捎信來，說你的差事他們用得上。走了，這裡的名冊就劃掉。",
    gain: "leave",
    choices: [
      { id: "sect-leave:a", label: "離開", hint: "名冊劃掉。以後還能去別的門。" },
      { id: "sect-leave:b", label: "留下", hint: "信退回去。" },
    ],
  },
  {
    id: "sect-pill",
    title: "宗門發丹",
    text: "庫房發丹。輪到你的時候，瓶子還剩幾顆。",
    gain: "pill",
  },
  {
    id: "sect-page",
    title: "秘境殘頁",
    text: "有人從秘境帶回來一頁殘紙，傳到你手上。",
    gain: "page",
  },
  {
    id: "sect-switch",
    title: "改主修",
    text: "你已經學了不只一部。今晚可以決定，從明天起主修哪一部。",
    gain: "switch",
    choices: [
      { id: "sect-switch:a", label: "改主修", hint: "悟性夠才換得過去。" },
      { id: "sect-switch:b", label: "仍練原來的", hint: "主修不動。" },
    ],
  },
];

export function pickSectAffair(seen: readonly string[], salt: number, learnedCount: number, age = 0): SectAffair | null {
  let fresh = SECT_AFFAIRS.filter((item) => !seen.includes(item.id) && item.gain !== "dismiss");
  if (learnedCount < 2) fresh = fresh.filter((item) => item.gain !== "switch");
  if (age < 26) fresh = fresh.filter((item) => item.gain !== "leave");
  if (fresh.length === 0) return null;
  const teach = fresh.filter((item) => item.gain === "teach" || item.gain === "lecture" || item.gain === "pill");
  const raise = fresh.find((item) => item.gain === "raise");
  const leave = fresh.find((item) => item.gain === "leave");
  if (leave && age >= 28 && salt % 2 === 0) return leave;
  if (raise && age >= 22 && salt % 3 !== 1) return raise;
  if (teach.length > 0 && salt % 2 === 1) return teach[salt % teach.length]!;
  return fresh[Math.abs(salt) % fresh.length]!;
}

export function rareDismiss(seen: readonly string[], age: number, fortune: number, bond: number, roll: number): SectAffair | null {
  if (seen.includes("sect-dismiss") || age < 52 || fortune >= 38 || bond >= 22 || roll > 0.08) return null;
  return SECT_AFFAIRS.find((item) => item.id === "sect-dismiss") ?? null;
}
