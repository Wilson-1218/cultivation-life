import { AFFAIRS, type Affair } from "@/lib/affair-data";
import { bindHousehold, householdBlocks, type Household } from "@/lib/household";

export { AFFAIRS };
import { deepestUnread, insightGate } from "@/lib/persona";
import { SECTS, type OriginId, type RootId } from "@/lib/world";

type Rng = { next: () => number };

export type AffairHost = {
  stones: number;
  heart: number;
  ling: number;
  insight: number;
  bond: number;
  fortune?: number;
  sect: string | null;
  sectRank?: "outer" | "watch" | "inner" | "expelled" | null;
  manual: string | null;
  learned?: string[];
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
  const fortune = life.fortune ?? 50;
  const good = beats.filter((item) => item.shape === "coin" || item.shape === "heart");
  const preferGood = fortune >= 58 && good.length > 0 && rng.next() < 0.2 + (fortune - 50) / 80;
  let left = preferGood ? good : beats;
  while (picked.length < need && left.length > 0) {
    const beat = pickExpiring(rng, left);
    picked.push(beat);
    left = left.filter((item) => item !== beat);
  }
  return { beats: picked, choice };
}

export function applyBeat(life: AffairHost, rng: Rng, affair: Affair): string {
  const fortune = life.fortune ?? 50;
  if (affair.shape === "coin") life.stones += 18 + Math.round(rng.next() * 36) + (fortune >= 60 ? 14 : 0);
  if (affair.shape === "heart") life.heart = clamp(life.heart + 6);
  if (affair.shape === "wound") {
    life.heart = clamp(life.heart - 4);
    life.scarred = true;
  }
  life.stones = Math.max(0, Math.round(life.stones));
  const text = bindHousehold(affair.text, life.household);
  if (affair.shape === "coin" && fortune >= 62) return `${text}你運氣好，這回比旁人多拿了一截。`;
  return text;
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

const ROAD_DEATH: Record<string, { run: string; fight: string; elder: string }> = {
  a039: {
    run: "村口兩個半大的人搶菜籃，你拉著孩子跑，肩上還是挨了一拳。",
    fight: "村口兩個半大的人搶菜籃，你衝上去，拳頭落在身上，人沒有再起來。",
    elder: "村口兩個半大的人搶菜籃，你叫了家族長輩，人沒趕到，你留在巷口。",
  },
  a056: {
    run: "山道上兩個人用木棍攔路要買路錢，你往坡下跑，棍子還是砸到背上。",
    fight: "山道上兩個人用木棍攔路要買路錢，你去搶棍子，人倒在坡上。",
    elder: "山道上兩個人用木棍攔路要買路錢，你叫了家族長輩，人沒趕到，你留在坡上。",
  },
  a071: {
    run: "礦坑口兩個礦工搶一把鎬，鎬頭飛出來，你往外跑還是被砸中。",
    fight: "礦坑口兩個礦工搶一把鎬，你去拉架，鎬頭砸在你身上。",
    elder: "礦坑口兩個礦工搶一把鎬，你叫了家族長輩，人沒趕到，鎬頭砸中了你。",
  },
  a083: {
    run: "稅吏帶人來封你的小藥爐，你從後門跑，還是被堵在巷口。",
    fight: "稅吏帶人來封你的小藥爐，你上前爭爐，推搡裡沒有走出那道門。",
    elder: "稅吏帶人來封你的小藥爐，你叫了家族長輩，人沒趕到，你被堵在爐前。",
  },
  a097: {
    run: "有人在你藥田裡埋腐肉，你沒有追，人從田埂上撲下來。",
    fight: "有人在你藥田裡埋腐肉，你順著腳印追上去，架沒有打完。",
    elder: "有人在你藥田裡埋腐肉，你叫了家族長輩，人沒趕到，你留在田埂上。",
  },
  a119: {
    run: "茶棚外兩個客商為一箱貨動刀，你從棚後跑，刀還是掃到背上。",
    fight: "茶棚外兩個客商為一箱貨動刀，你掀桌子去擋，人留在血邊。",
    elder: "茶棚外兩個客商為一箱貨動刀，你叫了家族長輩，人沒趕到，刀掃到了你。",
  },
  a120: {
    run: "夜船上船家要你幫忙把沒給錢的人扔下，你往岸上退，還是被推進江裡。",
    fight: "夜船上船家要扔下沒給錢的人，你抓住他的手腕，人被推進了江裡。",
    elder: "夜船上船家要扔下沒給錢的人，你叫了家族長輩，人沒趕到，你被推進江裡。",
  },
  a153: {
    run: "市集上有人扮管事按住你的袋子，你抽袋子就跑，還是被按倒。",
    fight: "市集上有人扮管事搶袋子，你抓住他的手腕大喊，人沒有再站起來。",
    elder: "市集上有人扮管事搶袋子，你叫了家族長輩，人沒趕到，你被按在攤前。",
  },
  a174: {
    run: "勘察的人帶器械來量你的洞，你從後洞跑，洞口的器械還是砸下來。",
    fight: "勘察的人帶器械來量你的洞，你攔住他們，推搡裡沒有出洞。",
    elder: "勘察的人帶器械來量你的洞，你叫了家族長輩，人沒趕到，你留在洞口。",
  },
  a194: {
    run: "三個人圍住你的包袱，說孤兒的東西拿走也不算搶，你從人縫裡擠，還是被按住。",
    fight: "三個人圍住你的包袱，說孤兒的東西拿走也不算搶，你罵回去，人倒在包袱旁邊。",
    elder: "三個人圍住你的包袱，說孤兒的東西不算搶，你叫了家族長輩，人沒趕到，你被按住。",
  },
  a195: {
    run: "族裡管事來收旁系的份子，你離開族地，追出來的人在祠堂門口把你砍倒。",
    fight: "族裡管事來收旁系的份子，你當眾頂他，人沒有走出祠堂。",
    elder: "族裡管事來收旁系的份子，你叫了家族長輩，人沒趕到，你留在祠堂門口。",
  },
  a206: {
    run: "有人在你門前擺別人的靈位說借門口擋災，你出門避開，還是被扯倒在門檻上。",
    fight: "有人在你門前擺靈位說借門口擋災，你請他們拿走，爭執裡人倒在門檻上。",
    elder: "有人在你門前擺靈位說借門口擋災，你叫了家族長輩，人沒趕到，你被扯倒在門檻上。",
  },
  a242: {
    run: "勘測的人要把你的泉眼畫進圖，你連夜去引水，還是被人追上。",
    fight: "勘測的人要把你的泉眼畫進圖，你按住他們的圖，人沒有離開泉邊。",
    elder: "勘測的人要把你的泉眼畫進圖，你叫了家族長輩，人沒趕到，你留在泉邊。",
  },
};

function helpedLine(life: AffairHost, affair: Affair): string {
  const scene = affair.text.replace(/。$/, "");
  if (life.sect) return `${scene}。師兄擋了一下，這一擊沒有全落在你身上，人還站著。`;
  const father = life.household?.father;
  if (father && !father.dead) return `${scene}。父親${father.name}出來說了情，事情輕了一截，人還在。`;
  return `${scene}。同輩拉了你一把，人還站著。`;
}

function roadDeath(affair: Affair, which: "a" | "b" | "elder"): string {
  const written = ROAD_DEATH[affair.id];
  if (written) return which === "b" ? written.fight : which === "elder" ? written.elder : written.run;
  const scene = affair.text.replace(/。$/, "");
  if (which === "b") return `${scene}，你衝上去，人沒有再起來。`;
  if (which === "elder") return `${scene}，你叫了家族長輩，人沒趕到，你留在那裡。`;
  return `${scene}，你轉身就跑，還是倒在當場。`;
}

export function resolveAffair(
  life: AffairHost,
  rng: Rng,
  affair: Affair,
  choiceId: string,
): { line: string; die: boolean; cause: string; grudge: boolean } {
  const which = choiceId.endsWith(":elder") ? "elder" : choiceId.endsWith(":b") ? "b" : "a";
  if (affair.shape === "road") {
    const fortune = life.fortune ?? 50;
    const dieAt = (which === "b" ? 0.42 : which === "elder" ? 0.12 : 0.08) * (1.2 - fortune / 100);
    if ((life.bond ?? 0) >= 46 && rng.next() < (life.bond - 30) / 90) {
      if (which === "b") life.scarred = true;
      return { line: helpedLine(life, affair), die: false, cause: "", grudge: false };
    }
    if (rng.next() < dieAt) {
      const line = roadDeath(affair, which);
      return { line, die: true, cause: line, grudge: which !== "a" };
    }
    if (which === "b") life.scarred = true;
    if (which === "elder") {
      life.heart = clamp(life.heart - 2);
      return {
        line: `${affair.text.replace(/。$/, "")}。你叫了家族長輩，人到了，東西沒有全到手，你還在。`,
        die: false,
        cause: "",
        grudge: false,
      };
    }
    const chosen = affair.choices[which === "b" ? 1 : 0];
    return { line: chosen?.line ?? "這一年過去了。", die: false, cause: "", grudge: which === "b" };
  }
  const index = which === "b" ? 1 : 0;
  const chosen = affair.choices[index];
  if (index === 0) {
    if (affair.shape === "sect" && !life.sect && /寫上名字|你掛了|排到了|掃了一年/.test(chosen?.line ?? "")) {
      const salt = [...(life.household?.hamlet ?? life.originId)].reduce((sum, char) => sum + char.charCodeAt(0), 0);
      life.sect = SECTS[salt % SECTS.length] ?? "青汀門";
      life.sectRank = life.sectRank ?? "outer";
    }
    if (affair.shape === "owe") life.owed = true;
    if (affair.shape === "page") {
      life.learnedPage = true;
      const learned = life.learned ?? [];
      const salt = [...(life.manual ?? affair.id)].reduce((sum, char) => sum + char.charCodeAt(0), 0);
      const offered = deepestUnread(life.insight, learned, salt);
      const current = life.manual ?? "原來那一部";
      if (life.insight < insightGate(offered)) {
        return {
          line: `你把《${offered}》拿在手裡。悟性還不到，一句也練不進去。主修仍是${current}。`,
          die: false,
          cause: "",
          grudge: false,
        };
      }
      if (!life.learned) life.learned = [];
      if (!life.learned.includes(offered)) life.learned.push(offered);
      if (!life.manual) life.manual = offered;
      return {
        line: `你把《${offered}》看懂了，先記在旁邊。主修仍是${life.manual}。`,
        die: false,
        cause: "",
        grudge: false,
      };
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
