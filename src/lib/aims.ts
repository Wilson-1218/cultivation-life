import type { RealmId } from "@/lib/world";

export type AimId = "cultivate" | "family" | "work" | "friends" | "health";
export type SpendId = "home" | "pill" | "peer" | "job" | "propose" | "part" | "manual";

export type AimOption = {
  id: AimId;
  name: string;
  up: string;
  down: string;
};

export function aimOptions(age: number, highRealm: boolean): AimOption[] {
  const young = age < 12;
  return [
    {
      id: "cultivate",
      name: young ? "跟著練" : highRealm ? "閉關修煉" : "修煉",
      up: "修為↑",
      down: "家裡或生計↓",
    },
    {
      id: "family",
      name: young ? "幫家裡" : "養家",
      up: "家人↑",
      down: "修為↓",
    },
    {
      id: "work",
      name: young ? "學著做" : "做事",
      up: "生計↑",
      down: "修為少一點",
    },
    {
      id: "friends",
      name: young ? "找同輩" : "結交",
      up: "同輩↑",
      down: "修為少一點",
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
      cost: pillIsLife ? 240 : 480,
      effect: pillIsLife ? "壽元上升" : "修為上升",
      record: pillIsLife ? "你服了一顆養身的丹，壽元往上墊了一截。" : "你服了一顆對境的丹，修為往上走了一截。",
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
