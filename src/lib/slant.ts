import { aimClause, spendOffers, type AimId, type SpendId } from "@/lib/aims";
import { noteYearRipple, shiftLivelihood, type Household, type Kin } from "@/lib/household";
import { TUNING, type FocusId, type RealmId } from "@/lib/world";

type Kind = "chapter" | "choice" | "pause" | "system" | "home";

export type SlantLife = {
  story: boolean;
  aim: AimId;
  aimTuned: AimId | null;
  focus: FocusId;
  autoSpend: SpendId | null;
  autoSpentAge: number;
  jobNote: string;
  yearAge: number;
  yearLines: string[];
  yearKinds: Kind[];
  heart: number;
  stones: number;
  bond: number;
  progress: number;
  lifespan: number;
  age: number;
  mortal: boolean;
  realm: RealmId;
  household: Household | null;
  sect: string | null;
};

const AIM_SHIFT: Record<AimId, { progress: number; bond: number; heart: number; life: number }> = {
  cultivate: { progress: 1, bond: -2, heart: -1, life: 0 },
  family: { progress: -2, bond: 4, heart: 1, life: 0 },
  work: { progress: -1, bond: 0, heart: -2, life: 0 },
  friends: { progress: -1, bond: 3, heart: 2, life: 0 },
  health: { progress: -1, bond: 0, heart: 2, life: 1 },
};

function clamp(value: number, max = 100): number {
  return Math.max(0, Math.min(max, value));
}

function livingPeople(house: Household): Kin[] {
  return [house.father, house.mother, ...house.siblings, house.spouse, ...house.children].filter(
    (kin) => kin.present && !kin.dead && !kin.away,
  );
}

function whoLabel(kin: Kin): string {
  return kin.role === "spouse" ? kin.name : `${kin.call}${kin.name}`;
}

export function touchedWho(house: Household | null, text: string): string {
  if (!house) return "家裡";
  const people = [house.father, house.mother, ...house.siblings, house.spouse, ...house.children];
  const named = people.find((kin) => kin.name && text.includes(kin.name));
  if (named) return whoLabel(named);
  const living = livingPeople(house)[0];
  return living ? whoLabel(living) : "家裡";
}

function workPhrase(house: Household | null, age: number): string {
  if (!house) return "生計還沒寫上";
  if (!house.seen.includes("job") && age < house.jobSince) return `${house.hamlet}的日子`;
  return `${house.jobPlace}${house.job}`;
}

function placePhrase(life: SlantLife): string {
  const house = life.household;
  if (!house) return "這一帶";
  return `${house.region}的${house.hamlet}`;
}

function pushLine(life: SlantLife, text: string) {
  if (life.yearLines.length < 2) {
    life.yearLines.push(text);
    life.yearKinds.push("chapter");
    return;
  }
  const last = life.yearLines.length - 1;
  life.yearLines[last] = `${life.yearLines[last]}${text}`;
}

function applyShift(life: SlantLife, aim: AimId, sign: 1 | -1) {
  const shift = AIM_SHIFT[aim];
  life.progress = clamp(life.progress + sign * shift.progress, TUNING.progressCap);
  life.bond = clamp(life.bond + sign * shift.bond);
  life.heart = clamp(life.heart + sign * shift.heart);
  if (shift.life) life.lifespan = Math.max(life.age + 1, life.lifespan + sign * shift.life);
}

export function applyAimTune(life: SlantLife) {
  if (life.aimTuned === life.aim) return;
  if (life.aimTuned) applyShift(life, life.aimTuned, -1);
  applyShift(life, life.aim, 1);
  life.aimTuned = life.aim;
}

export function rewriteAimClause(life: SlantLife) {
  const house = life.household;
  const clause = aimClause(
    life.aim,
    house ? touchedWho(house, life.yearLines.join("")) : "家裡",
    placePhrase(life),
    workPhrase(house, life.yearAge),
  );
  const index = life.yearLines.findIndex((line) => line.includes("重心落在"));
  if (index >= 0) {
    life.yearLines[index] = life.yearLines[index]!.replace(/重心落在[^。]*。/g, clause);
    return;
  }
  pushLine(life, clause);
}

export function focusForAim(aim: AimId): FocusId {
  if (aim === "family" || aim === "friends") return "ally";
  return "cycle";
}

export function retargetAim(life: SlantLife, aim: AimId) {
  life.aim = aim;
  life.focus = focusForAim(aim);
  applyAimTune(life);
  rewriteAimClause(life);
}

function spouseState(house: Household | null): "none" | "here" | "apart" {
  if (!house || !house.spouse.present || house.spouse.dead) return "none";
  if (house.spouse.away) return "apart";
  return "here";
}

export function offerFor(life: SlantLife, id: SpendId) {
  return spendOffers({
    age: life.yearAge,
    mortal: life.mortal,
    realm: life.realm,
    spouse: spouseState(life.household),
  }).find((item) => item.id === id);
}

function applySpendEffect(life: SlantLife, id: SpendId) {
  const house = life.household;
  if (id === "home") {
    life.bond = clamp(life.bond + 6);
    if (house) noteYearRipple(house, life.yearAge, "家裡的人");
  } else if (id === "pill") {
    if (life.mortal || life.realm.startsWith("qi-")) life.lifespan += 3;
    else life.progress = clamp(life.progress + 6, TUNING.progressCap);
  } else if (id === "peer") {
    life.heart = clamp(life.heart + 5);
    life.bond = clamp(life.bond + 2);
  } else if (id === "job") {
    if (house) house.jobShift = true;
  } else if (id === "propose" && house && !house.spouse.present) {
    house.spouse.present = true;
    house.spouse.born = life.yearAge;
    life.bond = clamp(life.bond + 4);
    noteYearRipple(house, life.yearAge, house.spouse.name);
  } else if (id === "part" && house && house.spouse.present) {
    house.spouse.away = true;
    life.bond = clamp(life.bond - 4);
    noteYearRipple(house, life.yearAge, house.spouse.name);
  }
}

export function spendStone(life: SlantLife, id: SpendId): boolean {
  const offer = offerFor(life, id);
  if (!offer || life.stones < offer.cost) return false;
  life.stones = Math.max(0, Math.round(life.stones - offer.cost));
  applySpendEffect(life, id);
  pushLine(life, `${offer.record}靈石少了${offer.cost}塊，還剩${Math.round(life.stones)}塊。`);
  return true;
}

export function toggleAutoSpend(life: SlantLife, id: SpendId) {
  life.autoSpend = life.autoSpend === id ? null : id;
  life.autoSpentAge = life.yearAge;
}

export function beginYearSlant(life: SlantLife) {
  life.aimTuned = null;
  if (life.household?.jobShift) {
    life.jobNote = shiftLivelihood(life.household);
    life.household.jobShift = false;
  }
}

export function finishYearSlant(life: SlantLife, before: { heart: number; stones: number }) {
  const house = life.household;
  if (life.jobNote) {
    if (life.yearLines.length === 0) pushLine(life, life.jobNote);
    else life.yearLines[0] = `${life.jobNote}${life.yearLines[0]}`;
    life.jobNote = "";
  }
  if (life.autoSpend && life.autoSpentAge !== life.yearAge) {
    const offer = offerFor(life, life.autoSpend);
    if (!offer || life.stones < offer.cost) {
      const name = offer?.name ?? "那一件";
      pushLine(life, `靈石不夠，${name}的自動停下。`);
      life.autoSpend = null;
    } else {
      life.stones = Math.max(0, Math.round(life.stones - offer.cost));
      applySpendEffect(life, life.autoSpend);
      pushLine(life, `自動做了${offer.name}。${offer.record}靈石少了${offer.cost}塊，還剩${Math.round(life.stones)}塊。`);
      life.autoSpentAge = life.yearAge;
    }
  }
  applyAimTune(life);
  const who = touchedWho(house, life.yearLines.join(""));
  const work = workPhrase(house, life.yearAge);
  const heartDelta = Math.round(life.heart) - before.heart;
  const stoneDelta = Math.round(life.stones) - before.stones;
  const heartText = heartDelta > 1 ? "心境鬆了一點" : heartDelta < -1 ? "心境沉了一截" : "心境沒有大動";
  const stoneText = stoneDelta > 0 ? `靈石多了${stoneDelta}塊` : stoneDelta < 0 ? `靈石少了${-stoneDelta}塊` : "靈石沒有動";
  const tail = `這一筆碰到${who}，生計是${work}，${heartText}，${stoneText}。`;
  if (!life.yearLines.some((line) => line.includes("這一筆碰到"))) {
    pushLine(life, tail);
  }
  if (house) noteYearRipple(house, life.yearAge, who);
  rewriteAimClause(life);
}
