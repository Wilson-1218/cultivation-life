import type { RealmId } from "@/lib/world";

export type AimId = "cultivate" | "family" | "work" | "friends" | "health";
export type SpendId = "home" | "pill" | "peer" | "job" | "propose" | "part";

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
      down: "心境或修為↓",
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

export function aimClause(aim: AimId, who: string, place: string, work: string): string {
  if (aim === "cultivate") {
    return `重心落在修煉：人在${place}，修為往上，${who}和${work}這一年被鬆下。`;
  }
  if (aim === "family") {
    return `重心落在養家：人在${place}，${who}被你顧著，家裡的關係往上，修為慢了一點。`;
  }
  if (aim === "work") {
    return `重心落在做事：人在${place}，生計守著${work}，心境少了一點，修為也慢。`;
  }
  if (aim === "friends") {
    return `重心落在結交：人在${place}，同輩那邊往上，修為少走一點。`;
  }
  return `重心落在養身：人在${place}，壽元往上墊了一點，修為慢下來。`;
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
}): SpendOffer[] {
  const pillIsLife = input.mortal || QI.has(input.realm);
  const offers: SpendOffer[] = [
    {
      id: "home",
      name: "給家裡",
      detail: "把靈石留在屋裡。",
      cost: 12,
      effect: "家人關係上升",
      record: "你給家裡留了一筆靈石，屋裡的關係暖了。",
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
      effect: "心境上升",
      record: "你請同輩坐了一坐，心境鬆開一點。",
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
      effect: "家人關係上升，配偶進門",
      record: "你提了親，人進了屋。",
    });
  }
  if (input.spouse === "here") {
    offers.push({
      id: "part",
      name: "分開",
      detail: "配偶還在這屋。分開之後人還在，只是不住一起。",
      cost: 6,
      effect: "家人關係下降",
      record: "你和配偶分開住。人還在，屋子少了一個人。",
    });
  }
  return offers;
}
