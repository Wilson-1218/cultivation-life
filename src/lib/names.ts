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

const GIVEN = [
  "安", "寧", "遠", "宜", "成", "和", "平", "生", "德", "明",
  "文", "慈", "善", "良", "正", "清", "華", "敏", "靜", "強",
  "磊", "軍", "洋", "勇", "杰", "濤", "超", "剛", "桂", "蘭",
  "珍", "芬", "玲", "梅", "娟", "英", "秀", "麗", "芳", "慧",
  "琳", "婷", "怡", "君", "豪", "宇", "軒", "哲", "凱", "翔",
  "誠", "毅", "恒", "修", "齊", "治", "均", "康", "泰", "福",
  "壽", "喜", "順", "發", "達", "旺", "財", "貴", "榮", "昌",
] as const;

function mix(seed: number, salt: number): number {
  let x = (seed ^ Math.imul(salt, 0x9e3779b1)) >>> 0;
  x = Math.imul(x ^ (x >>> 16), 0x7feb352d) >>> 0;
  x = Math.imul(x ^ (x >>> 15), 0x846ca68b) >>> 0;
  return (x ^ (x >>> 16)) >>> 0;
}

const MALE_GIVEN = [
  "德明", "文遠", "成安", "守業", "伯年", "景行", "承志", "嘉樹",
  "懷德", "永年", "叔平", "季良", "宗賢", "廷玉", "克勤", "世昌",
  "明遠", "彥清", "子安", "弘毅", "維周", "國梁", "正衡", "裕後",
] as const;

const FEMALE_GIVEN = [
  "秀珍", "淑芬", "慧蘭", "玉琴", "春梅", "婉清", "雅芝", "素心",
  "秋月", "麗華", "靜宜", "巧雲", "碧霞", "桂英", "瑞珠", "佩蘭",
  "雪梅", "翠屏", "鳳儀", "采薇", "清照", "若蘭", "曼卿", "書玉",
] as const;

export function kinName(
  seed: number,
  salt: number,
  surname: string,
  gender: "m" | "f",
  avoid: Set<string>,
): string {
  const pool = gender === "m" ? MALE_GIVEN : FEMALE_GIVEN;
  const start = mix(seed || 1, salt || 1);
  for (let n = 0; n < pool.length; n += 1) {
    const given = pool[(start + n) % pool.length]!;
    if (given[0] === surname) continue;
    const name = `${surname}${given}`;
    if (avoid.has(name) || name.length < 3) continue;
    avoid.add(name);
    return name;
  }
  const name = `${surname}${gender === "m" ? "德明" : "秀珍"}`;
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
  const surname = SURNAMES[n % SURNAMES.length];
  const g1 = GIVEN[(n >>> 8) % GIVEN.length];
  const twoChars = (n >>> 20) % 2 === 0;
  if (twoChars) return `${surname}${g1}`;
  let g2 = GIVEN[(n >>> 14) % GIVEN.length];
  if (g2 === g1) g2 = GIVEN[(GIVEN.indexOf(g1) + 7) % GIVEN.length];
  return `${surname}${g1}${g2}`;
}
