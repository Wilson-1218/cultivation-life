import { spendOffers, type AimId, type SpendId } from "@/lib/aims";
import { noteYearRipple, shiftLivelihood, type Household } from "@/lib/household";
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
  learned?: string[];
  manual?: string | null;
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
  const cleaned = life.yearLines
    .map((line) => line.replace(/重心落在[^。]*。/g, "").replace(/這一筆碰到[^。]*。/g, "").trim())
    .filter(Boolean);
  life.yearKinds = life.yearKinds.slice(0, cleaned.length);
  life.yearLines = cleaned;
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
    learned: life.learned,
    manual: life.manual,
  }).find((item) => item.id === id);
}

function applySpendEffect(life: SlantLife, id: SpendId) {
  const house = life.household;
  if (id === "home") {
    life.bond = clamp(life.bond + 6);
    if (house) noteYearRipple(house, life.yearAge, "留過靈石在屋裡");
  } else if (id === "pill") {
    if (life.mortal || life.realm.startsWith("qi-")) life.lifespan += 3;
    else life.progress = clamp(life.progress + 6, TUNING.progressCap);
  } else if (id === "peer") {
    life.heart = clamp(life.heart + 5);
    life.bond = clamp(life.bond + 2);
  } else if (id === "job") {
    if (house) house.jobShift = true;
  } else if (id === "manual" && life.learned && life.manual) {
    const next = life.learned.find((name) => name !== life.manual);
    if (next) life.manual = next;
  } else if (id === "propose" && house && !house.spouse.present) {
    house.spouse.present = true;
    house.spouse.born = life.yearAge;
    life.bond = clamp(life.bond + 4);
    noteYearRipple(house, life.yearAge, `和${house.spouse.name}成了家`);
  } else if (id === "part" && house && house.spouse.present) {
    house.spouse.away = true;
    life.bond = clamp(life.bond - 4);
    noteYearRipple(house, life.yearAge, `和${house.spouse.name}分開住`);
  }
}

function homePerson(life: SlantLife): string {
  const house = life.household;
  if (!house) return "家裡";
  if (house.mother.present && !house.mother.dead) return `母親${house.mother.name}`;
  if (house.father.present && !house.father.dead) return `父親${house.father.name}`;
  return "家裡";
}

function spendSentence(life: SlantLife, id: SpendId, cost: number, again: boolean): string {
  const house = life.household;
  const home = house?.home ?? "屋裡";
  const hamlet = house?.hamlet ?? "這裡";
  const who = homePerson(life);
  const turn = life.yearAge % 3;
  if (id === "home") {
    if (turn === 0) return `${who}問這個月過不過得去。你把${cost}塊靈石放在${home}的桌上。`;
    if (turn === 1) return again ? `你又把${cost}塊靈石交到${who}手裡。` : `收工以後，你把${cost}塊靈石交到${who}手裡。`;
    return `你把${cost}塊靈石留在${home}。${who}收著，沒有多問。`;
  }
  if (id === "pill") {
    const body = life.mortal || life.realm.startsWith("qi-");
    if (body) return `你在${hamlet}買了一顆養身的丹，回到${home}服下，人緩過來一點。`;
    return `你買了一顆對這境的丹，服完，吐納順了一些。`;
  }
  if (id === "peer") {
    if (turn === 1) return `同歲的人來找你。你在${hamlet}請他們坐了一坐，話比功法多。`;
    return `你請同歲的人在${house?.market ?? hamlet}坐到天黑，花了${cost}塊靈石。`;
  }
  if (id === "job") return `你去問了一份別的活。明年也許不在原來的地方做，${hamlet}的屋子還留著。`;
  if (id === "manual") return `你花了${cost}塊靈石，把主修改成${life.manual ?? "另一部"}。`;
  if (id === "propose" && house) return `你托人去提親。${house.spouse.name}後來進了${home}。`;
  if (id === "part" && house) return `你和${house.spouse.name}分開住。人還在${hamlet}，只是不回同一張桌。`;
  return `你花了${cost}塊靈石，把這件事辦了。`;
}

function stopSentence(life: SlantLife, id: SpendId): string {
  const house = life.household;
  const who = homePerson(life);
  if (id === "home") return `你本想再留一筆給${who}，摸了摸口袋，靈石不夠，今年做不成。`;
  if (id === "peer") return `你本想再請同輩坐坐，靈石不夠，人就自己回了${house?.home ?? "屋裡"}。`;
  if (id === "pill") return `你在鋪子前站了一會，靈石不夠買那顆丹，空手回了${house?.home ?? "屋裡"}。`;
  if (id === "job") return `你想換一份活，靈石不夠打點，這事先放下。`;
  if (id === "propose") return `你想提親，靈石不夠，這門親事今年提不成。`;
  return `你想辦的那件事，靈石不夠，今年就停了。`;
}

export function spendStone(life: SlantLife, id: SpendId): boolean {
  const offer = offerFor(life, id);
  if (!offer || life.stones < offer.cost) return false;
  life.stones = Math.max(0, Math.round(life.stones - offer.cost));
  applySpendEffect(life, id);
  pushLine(life, spendSentence(life, id, offer.cost, false));
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

export function finishYearSlant(life: SlantLife, _before: { heart: number; stones: number }) {
  if (life.jobNote) {
    if (life.yearLines.length === 0) pushLine(life, life.jobNote);
    else life.yearLines[0] = `${life.jobNote}${life.yearLines[0]}`;
    life.jobNote = "";
  }
  if (life.autoSpend && life.autoSpentAge !== life.yearAge) {
    const offer = offerFor(life, life.autoSpend);
    if (!offer || life.stones < offer.cost) {
      pushLine(life, stopSentence(life, life.autoSpend));
      life.autoSpend = null;
    } else {
      life.stones = Math.max(0, Math.round(life.stones - offer.cost));
      applySpendEffect(life, life.autoSpend);
      pushLine(life, spendSentence(life, life.autoSpend, offer.cost, true));
      life.autoSpentAge = life.yearAge;
    }
  }
  applyAimTune(life);
}
