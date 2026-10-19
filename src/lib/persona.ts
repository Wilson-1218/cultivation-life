import type { RootId } from "./world";

export type SectRank = "outer" | "watch" | "inner" | "expelled";

export const SHALLOW_MANUALS = ["青禾吐納", "厚土納氣", "溪行十二息"] as const;
export const MID_MANUALS = ["松風歸元篇", "白石煉氣訣", "慢水養氣篇"] as const;
export const DEEP_MANUALS = ["寒鴉觀想法", "斷碑心法", "雲棲真解"] as const;

export function startingManual(seed: number): string {
  return SHALLOW_MANUALS[Math.abs(seed) % SHALLOW_MANUALS.length]!;
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

export function sectStanding(life: { sect: string | null; sectRank: SectRank | null }): string {
  if (life.sectRank === "expelled") return "已經被打發走";
  if (!life.sect || !life.sectRank) return "尚未入門";
  const role = life.sectRank === "inner" ? "內門" : life.sectRank === "watch" ? "值守" : "外門";
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
  | "switch";

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
    text: "執事要把你的名字從名冊上劃掉，說外門用不上你。",
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
  let fresh = SECT_AFFAIRS.filter((item) => !seen.includes(item.id));
  if (learnedCount < 2) fresh = fresh.filter((item) => item.gain !== "switch");
  if (age < 40) fresh = fresh.filter((item) => item.gain !== "dismiss");
  if (fresh.length === 0) return null;
  return fresh[Math.abs(salt) % fresh.length]!;
}
