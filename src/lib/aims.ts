import type { RealmId } from "@/lib/world";

export type AimId = "cultivate" | "family" | "work" | "friends" | "health";
export type SpendId = "home" | "pill" | "peer" | "job" | "propose" | "part" | "manual" | "merit" | "deepen" | "hire";

export type AimOption = {
  id: AimId;
  name: string;
  up: string;
  down: string;
};

export function aimOptions(age: number, _highRealm: boolean): AimOption[] {
  const young = age < 12;
  return [
    {
      id: "cultivate",
      name: young ? "跟著練" : "閉關修煉",
      up: "修為↑",
      down: "看悟性",
    },
    {
      id: "family",
      name: young ? "幫家裡" : "養家",
      up: "家裡穩",
      down: "人脈↑",
    },
    {
      id: "work",
      name: young ? "學著做" : "做事",
      up: "靈石↑",
      down: "看氣運",
    },
    {
      id: "friends",
      name: young ? "找同輩" : "結交",
      up: "人脈↑",
      down: "常有人幫",
    },
    {
      id: "health",
      name: "養身",
      up: "壽元↑",
      down: "修為↓",
    },
  ];
}

export type SpendOffer = {
  id: SpendId;
  name: string;
  detail: string;
  cost: number;
  effect: string;
  record: string;
};

const QI = new Set<RealmId>(["qi-early", "qi-mid", "qi-late", "qi-peak"]);

export function spendOffers(input: {
  age: number;
  mortal: boolean;
  realm: RealmId;
  spouse: "none" | "here" | "apart";
  learned?: string[];
  manual?: string | null;
  sect?: string | null;
  insight?: number;
}): SpendOffer[] {
  const pillIsLife = input.mortal || QI.has(input.realm);
  const offers: SpendOffer[] = [
    {
      id: "home",
      name: "給家裡",
      detail: "把靈石留在屋裡。",
      cost: 12,
      effect: "人脈上升",
      record: "你給家裡留了一筆靈石，人脈暖了一點。",
    },
    {
      id: "pill",
      name: pillIsLife ? "買一顆養身的丹" : "買一顆對境的丹",
      detail: pillIsLife ? "身子還在煉氣或凡人的日子裡，這顆丹墊壽元。" : "境界已經上去，這顆丹推修為。",
      cost: pillIsLife ? 180 : 360,
      effect: pillIsLife ? "壽元大增" : "修為大增",
      record: pillIsLife ? "你服了一顆養身的丹，壽元墊上十二年。" : "你服了一顆對境的丹，修為往前走了一大截。",
    },
    {
      id: "peer",
      name: "請同輩",
      detail: "請同一歲的人坐一坐。",
      cost: 4,
      effect: "人脈上升，心境留給地圖",
      record: "你請同輩坐了一坐，人脈暖了一點。",
    },
    {
      id: "job",
      name: "尋一份別的生計",
      detail: "明年可能換成另一種活。原來的村子和屋子還在。",
      cost: 16,
      effect: "明年生計可能更換",
      record: "你尋了一份別的生計。明年可能換一種活，原來的地方還在。",
    },
  ];
  if (input.age >= 16 && input.spouse === "none") {
    offers.push({
      id: "propose",
      name: "提親",
      detail: "到了能成家的年紀，家裡還沒有配偶。",
      cost: 18,
      effect: "人脈上升，配偶進門",
      record: "你提了親，人進了屋。",
    });
  }
  const other = (input.learned ?? []).find((name) => name && name !== input.manual);
  if (other && input.manual) {
    offers.push({
      id: "manual",
      name: "改主修",
      detail: `現在主修${input.manual}。花靈石，改成已經學過的${other}。`,
      cost: 16,
      effect: "主修功法換一部",
      record: `你把主修改成${other}。`,
    });
  }
  if (input.sect) {
    offers.push({
      id: "merit",
      name: "捐貢獻換身份",
      detail: `把靈石捐進${input.sect}的名冊，換上一檔身份。`,
      cost: 260,
      effect: "宗門身份上升",
      record: "你捐了貢獻，名冊上的身份改了一檔。",
    });
  }
  offers.push({
    id: "deepen",
    name: "買一部更深的功法",
    detail: `悟性${Math.round(input.insight ?? 0)}。夠了才練得進，不夠就學不會。`,
    cost: 300,
    effect: "學會更深的一部，或學不會",
    record: "你去買更深的功法。",
  });
  offers.push({
    id: "hire",
    name: "請人出手",
    detail: "先把人脈買熱。下次出事，有人會擋。",
    cost: 150,
    effect: "人脈大增，下次有人幫",
    record: "你請了人。人脈熱起來，下次有人會出手。",
  });
  if (input.spouse === "here") {
    offers.push({
      id: "part",
      name: "分開",
      detail: "配偶還在這屋。分開之後人還在，只是不住一起。",
      cost: 6,
      effect: "人脈下降",
      record: "你和配偶分開住。人還在，屋子少了一個人。",
    });
  }
  return offers;
}
