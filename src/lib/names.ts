const SURNAMES = [
  "陳", "林", "黃", "張", "李", "王", "吳", "劉", "蔡", "楊",
  "許", "鄭", "謝", "郭", "洪", "曾", "邱", "廖", "徐", "周",
  "葉", "蘇", "莊", "呂", "江", "何", "羅", "高", "潘", "簡",
  "朱", "鍾", "彭", "詹", "胡", "施", "沈", "余", "盧", "顏",
  "柯", "翁", "孫", "魏", "丁", "馬", "方", "侯", "董", "程",
  "曹", "袁", "鄧", "傅", "蕭", "田", "范", "金", "陸", "汪",
  "姜", "崔", "譚", "孟", "秦", "尹", "薛", "閻", "龔", "段",
  "雷", "龍", "史", "陶", "賀", "顧", "毛", "郝", "邵", "萬",
  "錢", "嚴", "武", "戴", "莫", "孔", "向", "湯", "黎", "易",
] as const;

function mix(seed: number, salt: number): number {
  let x = (seed ^ Math.imul(salt, 0x9e3779b1)) >>> 0;
  x = Math.imul(x ^ (x >>> 16), 0x7feb352d) >>> 0;
  x = Math.imul(x ^ (x >>> 15), 0x846ca68b) >>> 0;
  return (x ^ (x >>> 16)) >>> 0;
}

const ELDER_MALE = ["伯年", "懷德", "永年", "嘉樹", "廷玉", "克勤", "世昌", "國梁", "正衡", "守業", "維周", "裕後"] as const;
const ELDER_FEMALE = ["秀珍", "淑芬", "桂英", "瑞珠", "玉琴", "春梅", "素心", "碧霞", "鳳儀", "麗華"] as const;
const PEER_MALE = ["文遠", "成安", "景行", "承志", "明遠", "彥清", "弘毅", "德明", "叔平", "季良", "宗賢", "正清"] as const;
const PEER_FEMALE = ["婉清", "雅芝", "秋月", "靜宜", "佩蘭", "采薇", "清照", "若蘭", "曼卿", "書玉", "慧蘭", "巧雲"] as const;
const CHILD_MALE = ["念祖", "思遠", "元凱", "少白", "清和", "懷真", "敬之", "子瑜", "元白", "安之"] as const;
const CHILD_FEMALE = ["念慈", "思齊", "清婉", "若溪", "書蘭", "靜姝", "明珠", "懷玉", "晚晴", "初禾"] as const;

export type NameGeneration = "elder" | "peer" | "child";

function givenPool(gender: "m" | "f", generation: NameGeneration): readonly string[] {
  if (generation === "elder") return gender === "m" ? ELDER_MALE : ELDER_FEMALE;
  if (generation === "child") return gender === "m" ? CHILD_MALE : CHILD_FEMALE;
  return gender === "m" ? PEER_MALE : PEER_FEMALE;
}

export function kinName(
  seed: number,
  salt: number,
  surname: string,
  gender: "m" | "f",
  avoid: Set<string>,
  generation: NameGeneration = "peer",
): string {
  const pool = givenPool(gender, generation);
  const start = mix(seed || 1, salt || 1);
  for (let n = 0; n < pool.length; n += 1) {
    const given = pool[(start + n) % pool.length]!;
    if (given[0] === surname) continue;
    const name = `${surname}${given}`;
    if (avoid.has(name)) continue;
    avoid.add(name);
    return name;
  }
  const fallback = pool[start % pool.length]!;
  const name = `${surname}${fallback}`;
  avoid.add(name);
  return name;
}

export function outsiderName(
  seed: number,
  salt: number,
  avoidSurname: string,
  gender: "m" | "f",
  avoid: Set<string>,
): string {
  const start = mix(seed || 1, salt || 1);
  for (let n = 0; n < SURNAMES.length; n += 1) {
    const surname = SURNAMES[(start + n) % SURNAMES.length]!;
    if (surname === avoidSurname) continue;
    const name = kinName(seed, salt + 20 + n, surname, gender, avoid);
    if (name[0] !== avoidSurname) return name;
  }
  return kinName(seed, salt + 80, "陳", gender, avoid);
}

export function humanName(seed: number, salt: number): string {
  const n = mix(seed || 1, salt || 1);
  const surname = SURNAMES[n % SURNAMES.length]!;
  const gender = (n >>> 8) % 2 === 0 ? "m" : "f";
  return kinName(seed, salt, surname, gender, new Set(), "peer");
}
