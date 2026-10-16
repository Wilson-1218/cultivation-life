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
