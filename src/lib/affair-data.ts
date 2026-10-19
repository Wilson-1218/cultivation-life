import type { OriginId, RootId } from "./world";

export type AffairShape =
  | "flavor"
  | "coin"
  | "heart"
  | "wound"
  | "trade"
  | "road"
  | "help"
  | "ask"
  | "risk"
  | "sect"
  | "owe"
  | "page"
  | "cave";

export type AffairChoice = { label: string; line: string };

export type Affair = {
  id: string;
  kind: "beat" | "choice";
  minAge: number;
  maxAge: number;
  shape: AffairShape;
  origin: OriginId | null;
  root: RootId | null;
  title: string;
  text: string;
  choices: AffairChoice[];
};

export const PRIOR_EVENT_COUNT = 24;

export const AFFAIRS: readonly Affair[] = [
  {
    "id": "a001",
    "kind": "beat",
    "minAge": 0,
    "maxAge": 6,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "家裡添了你",
    "text": "接生的人把你托給母親。屋裡只點了一盞油燈，沒有人談靈根。",
    "choices": []
  },
  {
    "id": "a002",
    "kind": "beat",
    "minAge": 0,
    "maxAge": 6,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "夜裡哭不停",
    "text": "你整夜哭。父親走到院裡站了一陣，回來仍不會哄。",
    "choices": []
  },
  {
    "id": "a003",
    "kind": "beat",
    "minAge": 1,
    "maxAge": 6,
    "shape": "coin",
    "origin": null,
    "root": null,
    "title": "鄰家送了一碗粥",
    "text": "隔壁端來一碗薄粥。家裡記下這份情，口袋仍是空的。",
    "choices": []
  },
  {
    "id": "a004",
    "kind": "beat",
    "minAge": 1,
    "maxAge": 7,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "你發了一場熱",
    "text": "你燒了三天。母親不敢睡，熱退之後你瘦了一圈。",
    "choices": []
  },
  {
    "id": "a005",
    "kind": "beat",
    "minAge": 2,
    "maxAge": 7,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "學會叫人",
    "text": "你會叫爹娘了。村子裡的人開始把你算成一口人。",
    "choices": []
  },
  {
    "id": "a006",
    "kind": "beat",
    "minAge": 2,
    "maxAge": 8,
    "shape": "coin",
    "origin": null,
    "root": null,
    "title": "集上有人塞糖",
    "text": "趕集的人塞給你一小塊糖。你不含，捏在手心化掉。",
    "choices": []
  },
  {
    "id": "a007",
    "kind": "beat",
    "minAge": 3,
    "maxAge": 8,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "狗把你嚇倒",
    "text": "巷口的狗衝出來。你跌倒，膝蓋破了，以後看見狗就繞。",
    "choices": []
  },
  {
    "id": "a008",
    "kind": "beat",
    "minAge": 3,
    "maxAge": 8,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你跟在姐姐後面",
    "text": "姐姐去井邊打水，你非要跟。水桶比你高，你只摸到繩子。",
    "choices": []
  },
  {
    "id": "a009",
    "kind": "beat",
    "minAge": 4,
    "maxAge": 9,
    "shape": "coin",
    "origin": null,
    "root": null,
    "title": "撿到一枚銅錢",
    "text": "門檻縫裡有一枚銅錢。父親說不是你家的，你還是攥著。",
    "choices": []
  },
  {
    "id": "a010",
    "kind": "beat",
    "minAge": 4,
    "maxAge": 9,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "第一次獨自過街",
    "text": "母親讓你自己走到對街。你走得很慢，中間停了兩次。",
    "choices": []
  },
  {
    "id": "a011",
    "kind": "beat",
    "minAge": 0,
    "maxAge": 8,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "冬天炭不夠",
    "text": "炭只夠燒半晚。你和弟弟擠一條被子，腳還是冰的。",
    "choices": []
  },
  {
    "id": "a012",
    "kind": "beat",
    "minAge": 1,
    "maxAge": 8,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "屋頂漏雨",
    "text": "雨從瓦縫滴到你臉上。父親用盆接著，一夜沒有睡實。",
    "choices": []
  },
  {
    "id": "a013",
    "kind": "beat",
    "minAge": 2,
    "maxAge": 9,
    "shape": "coin",
    "origin": null,
    "root": null,
    "title": "幫人看了一下午攤",
    "text": "你坐在人家攤邊看秤。攤主給了兩個銅板，叫你別亂碰。",
    "choices": []
  },
  {
    "id": "a014",
    "kind": "beat",
    "minAge": 3,
    "maxAge": 9,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "被說成多餘的一口",
    "text": "親戚算口糧時看了你一眼。母親把你攬過去，沒有爭辯。",
    "choices": []
  },
  {
    "id": "a015",
    "kind": "beat",
    "minAge": 4,
    "maxAge": 10,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你記住了回家的路",
    "text": "你跟丟過一次。天黑前自己摸回巷口，從此認得那棵槐。",
    "choices": []
  },
  {
    "id": "a016",
    "kind": "beat",
    "minAge": 5,
    "maxAge": 10,
    "shape": "coin",
    "origin": null,
    "root": null,
    "title": "替人傳了一句話",
    "text": "巷裡的人叫你跑一趟腿。你說清楚了，換來一把炒豆。",
    "choices": []
  },
  {
    "id": "a017",
    "kind": "beat",
    "minAge": 0,
    "maxAge": 7,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "母親病了十天",
    "text": "母親起不來。你自己把冷飯吃完，沒有人教你吐納。",
    "choices": []
  },
  {
    "id": "a018",
    "kind": "beat",
    "minAge": 2,
    "maxAge": 8,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你問天上的光是什麼",
    "text": "你指著夜空問。父親說那是星星，不是給你們這種人家抓的。",
    "choices": []
  },
  {
    "id": "a019",
    "kind": "beat",
    "minAge": 5,
    "maxAge": 11,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "和小夥伴打了一架",
    "text": "你為一顆彈珠打起來。鼻子出血，兩邊的家長都沒有來。",
    "choices": []
  },
  {
    "id": "a020",
    "kind": "beat",
    "minAge": 6,
    "maxAge": 12,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你開始做家裡的零活",
    "text": "掃地、餵雞、把乾菜收進簍。沒有人把這叫做修行。",
    "choices": []
  },
  {
    "id": "a021",
    "kind": "choice",
    "minAge": 4,
    "maxAge": 10,
    "shape": "help",
    "origin": null,
    "root": null,
    "title": "弟弟掉進溝裡",
    "text": "弟弟追球滑進淺溝。你在溝邊上，手夠得到。",
    "choices": [
      {
        "label": "幫他爬上來",
        "line": "你下去拉。衣服濕了，人沒有出事。"
      },
      {
        "label": "站在上面喊",
        "line": "你只喊人。有路人把他拽上來，他後來不太理你。"
      }
    ]
  },
  {
    "id": "a022",
    "kind": "choice",
    "minAge": 5,
    "maxAge": 11,
    "shape": "ask",
    "origin": null,
    "root": null,
    "title": "有人要收你做學徒",
    "text": "鐵鋪的人說你手穩，可以來拉風箱。不談靈根，只談飯。",
    "choices": [
      {
        "label": "去拉風箱",
        "line": "你去了幾個月。手臂粗了，識字仍少。"
      },
      {
        "label": "留在家裡",
        "line": "你沒去。鐵鋪的人以後見你也不打招呼。"
      }
    ]
  },
  {
    "id": "a023",
    "kind": "choice",
    "minAge": 6,
    "maxAge": 12,
    "shape": "trade",
    "origin": null,
    "root": null,
    "title": "貨郎挑了一擔舊書",
    "text": "貨郎說這些書不值幾個錢。你只認得封面，不認得裡面。",
    "choices": [
      {
        "label": "用積蓄換一本",
        "line": "你把私藏的銅錢換走一本殘書。字認不全，你還是藏著。"
      },
      {
        "label": "讓貨郎走",
        "line": "你搖頭。貨郎走後，那本書再沒出現。"
      }
    ]
  },
  {
    "id": "a024",
    "kind": "beat",
    "minAge": 6,
    "maxAge": 12,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "祠堂不讓孩子進",
    "text": "祭祖那天你被擋在門外。裡面的名字你一個都不認識。",
    "choices": []
  },
  {
    "id": "a025",
    "kind": "beat",
    "minAge": 7,
    "maxAge": 12,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你第一次看見修士",
    "text": "村口落下一個穿灰衣的人。他沒看你，你看了他很久。",
    "choices": []
  },
  {
    "id": "a026",
    "kind": "beat",
    "minAge": 3,
    "maxAge": 9,
    "shape": "coin",
    "origin": null,
    "root": null,
    "title": "牛踩壞了菜畦",
    "text": "家裡的菜被牛踩了。你幫忙重種，秋天少收了一筐。",
    "choices": []
  },
  {
    "id": "a027",
    "kind": "beat",
    "minAge": 4,
    "maxAge": 10,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "你把碗摔了",
    "text": "你端湯摔倒。碗碎了，母親嘆一聲，沒有打你。",
    "choices": []
  },
  {
    "id": "a028",
    "kind": "beat",
    "minAge": 8,
    "maxAge": 12,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "私塾先生看了你一眼",
    "text": "先生問你識不識字。你搖頭。他沒有收你，也沒有罵你。",
    "choices": []
  },
  {
    "id": "a029",
    "kind": "beat",
    "minAge": 1,
    "maxAge": 6,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "搖籃邊有人吵架",
    "text": "大人為了田界吵架。你在搖籃裡睡著，一句也沒聽懂。",
    "choices": []
  },
  {
    "id": "a030",
    "kind": "beat",
    "minAge": 8,
    "maxAge": 13,
    "shape": "coin",
    "origin": null,
    "root": null,
    "title": "你幫人數過雞蛋",
    "text": "攤主叫你數雞蛋。你數對了，他多給你一個裂殼的。",
    "choices": []
  },
  {
    "id": "a031",
    "kind": "beat",
    "minAge": 2,
    "maxAge": 8,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "你走失在集上",
    "text": "人潮把你擠散。你在布攤底下蹲到母親找來，聲音都啞了。",
    "choices": []
  },
  {
    "id": "a032",
    "kind": "beat",
    "minAge": 9,
    "maxAge": 13,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你學會不隨便跟人走",
    "text": "有陌生人說帶你看熱鬧。你站住不走，那人自己走了。",
    "choices": []
  },
  {
    "id": "a033",
    "kind": "beat",
    "minAge": 5,
    "maxAge": 11,
    "shape": "coin",
    "origin": null,
    "root": null,
    "title": "田裡撿到一把麥",
    "text": "收割後的田裡還有遺穗。你撿了一把，被管家瞪，還是拿回了家。",
    "choices": []
  },
  {
    "id": "a034",
    "kind": "beat",
    "minAge": 7,
    "maxAge": 12,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "你看見別人家辦喜事",
    "text": "對街吹打了一整天。你家沒有被請，你在門縫裡看完。",
    "choices": []
  },
  {
    "id": "a035",
    "kind": "beat",
    "minAge": 4,
    "maxAge": 9,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "井繩磨破你的手",
    "text": "你非要幫著打水。繩子磨破手心，水只打上來半桶。",
    "choices": []
  },
  {
    "id": "a036",
    "kind": "beat",
    "minAge": 10,
    "maxAge": 14,
    "shape": "coin",
    "origin": null,
    "root": null,
    "title": "你把撿到的錢還了",
    "text": "路上有一個紙包。你交給里正，對方沒有謝，只點了點頭。",
    "choices": []
  },
  {
    "id": "a037",
    "kind": "beat",
    "minAge": 6,
    "maxAge": 11,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "夜裡有人拍門討債",
    "text": "債主拍門。父親出去說好話，你在被窩裡把名字聽了半截。",
    "choices": []
  },
  {
    "id": "a038",
    "kind": "beat",
    "minAge": 9,
    "maxAge": 14,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你第一次走夜路",
    "text": "你去給病人家送藥渣。路上沒有燈，你跟著狗叫的方向回來。",
    "choices": []
  },
  {
    "id": "a039",
    "kind": "choice",
    "minAge": 8,
    "maxAge": 13,
    "shape": "road",
    "origin": null,
    "root": null,
    "title": "村口有人搶孩子的籃子",
    "text": "兩個半大的人搶一個孩子的菜籃。你站在十步外。",
    "choices": [
      {
        "label": "立刻跑路",
        "line": "你拉著那個孩子繞進巷子。籃子丟了，人沒有被打到。"
      },
      {
        "label": "上前爭奪",
        "line": "你衝上去。拳頭落在你肩上，籃子也沒保住。"
      }
    ]
  },
  {
    "id": "a040",
    "kind": "choice",
    "minAge": 7,
    "maxAge": 12,
    "shape": "help",
    "origin": null,
    "root": null,
    "title": "老人倒在田埂",
    "text": "挑擔的老人滑倒，擔子壓住腿。田裡一時沒有別人。",
    "choices": [
      {
        "label": "把擔子搬開",
        "line": "你把擔子抬開。老人記住你家的方向。"
      },
      {
        "label": "裝作沒看見",
        "line": "你繞過去。晚上家裡聽說這事，沒有人誇你。"
      }
    ]
  },
  {
    "id": "a041",
    "kind": "beat",
    "minAge": 11,
    "maxAge": 16,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你的聲音開始變",
    "text": "說話時嗓子劈了。沒有人當回事，你自己覺得尷尬。",
    "choices": []
  },
  {
    "id": "a042",
    "kind": "beat",
    "minAge": 10,
    "maxAge": 15,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "同伴不肯再帶你玩",
    "text": "昨天還一起翻牆的人，今天說你礙事。你在牆根坐到天黑。",
    "choices": []
  },
  {
    "id": "a043",
    "kind": "beat",
    "minAge": 12,
    "maxAge": 16,
    "shape": "coin",
    "origin": null,
    "root": null,
    "title": "你第一次自己賺到飯錢",
    "text": "你幫船家捲繩。船家給了一頓飯，不給錢。你還是吃完了。",
    "choices": []
  },
  {
    "id": "a044",
    "kind": "beat",
    "minAge": 13,
    "maxAge": 17,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你開始會隱瞞",
    "text": "你打碎了鄰居的碗，先說不是你。後來還是承認了。",
    "choices": []
  },
  {
    "id": "a045",
    "kind": "choice",
    "minAge": 12,
    "maxAge": 17,
    "shape": "ask",
    "origin": null,
    "root": null,
    "title": "城裡來了識字的人",
    "text": "那人在祠堂前教人認字，要一袋米才讓你坐近。",
    "choices": [
      {
        "label": "把米送去",
        "line": "家裡咬牙給了一袋。你認得了自己的名字，也認得了「靈」。"
      },
      {
        "label": "不去",
        "line": "你站在圈外聽。有些字聽會了，坐進去的人仍不讓你問。"
      }
    ]
  },
  {
    "id": "a046",
    "kind": "choice",
    "minAge": 11,
    "maxAge": 16,
    "shape": "trade",
    "origin": null,
    "root": null,
    "title": "有人賣辟邪的紅繩",
    "text": "攤上說紅繩能擋髒東西。你看不出真假，價錢卻不高。",
    "choices": [
      {
        "label": "買一條",
        "line": "你買了。戴了幾天，什麼也沒擋，繩子自己斷了。"
      },
      {
        "label": "不買",
        "line": "你把錢留著。晚上仍睡得著。"
      }
    ]
  },
  {
    "id": "a047",
    "kind": "beat",
    "minAge": 14,
    "maxAge": 18,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "你被人當面說窮",
    "text": "井邊有人笑你家的衣服。你沒有回嘴，水打滿了才走。",
    "choices": []
  },
  {
    "id": "a048",
    "kind": "beat",
    "minAge": 13,
    "maxAge": 18,
    "shape": "coin",
    "origin": null,
    "root": null,
    "title": "你幫人寫錯了一個字",
    "text": "你剛認得的字寫錯在借條上。對方沒有怪你，把那張紙撕了。",
    "choices": []
  },
  {
    "id": "a049",
    "kind": "beat",
    "minAge": 15,
    "maxAge": 19,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你一個人走到鄰村",
    "text": "為了還一把鋤頭，你走了一個時辰。回來時腳上起了泡。",
    "choices": []
  },
  {
    "id": "a050",
    "kind": "choice",
    "minAge": 14,
    "maxAge": 18,
    "shape": "sect",
    "origin": null,
    "root": null,
    "title": "小廟收雜役",
    "text": "廟裡缺一個掃地的。不保證教你吐納，只保證有粥。",
    "choices": [
      {
        "label": "留下做雜役",
        "line": "你留下。廟裡的規矩比家裡多，粥是熱的。"
      },
      {
        "label": "回家",
        "line": "你回家。廟門以後對你只開一半。"
      }
    ]
  },
  {
    "id": "a051",
    "kind": "choice",
    "minAge": 15,
    "maxAge": 20,
    "shape": "owe",
    "origin": null,
    "root": null,
    "title": "同村的人找你借糧",
    "text": "他家孩子病了，開口借半袋糧。還不還，他沒有說死。",
    "choices": [
      {
        "label": "借出",
        "line": "你把半袋糧送去。家裡的鍋淡了幾天，對方記下了。"
      },
      {
        "label": "拒絕",
        "line": "你說沒有餘糧。對方走的時候沒有罵，也沒有再來。"
      }
    ]
  },
  {
    "id": "a052",
    "kind": "beat",
    "minAge": 16,
    "maxAge": 22,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "你第一次被人問有沒有靈根",
    "text": "路人隨口問。你答不上來。對方笑一聲，繼續走路。",
    "choices": []
  },
  {
    "id": "a053",
    "kind": "beat",
    "minAge": 16,
    "maxAge": 24,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你把頭髮自己扎上",
    "text": "沒有人幫你梳頭。你扎得歪，還是扎上了，算自己的事。",
    "choices": []
  },
  {
    "id": "a054",
    "kind": "beat",
    "minAge": 17,
    "maxAge": 26,
    "shape": "coin",
    "origin": null,
    "root": null,
    "title": "渡口有人多找了錢",
    "text": "你幫人看行李，對方多給了幾文。你追上去還了。",
    "choices": []
  },
  {
    "id": "a055",
    "kind": "beat",
    "minAge": 18,
    "maxAge": 28,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "你看著同齡人離開村子",
    "text": "一起長大的人跟商隊走了。你站在村口，直到塵土落下。",
    "choices": []
  },
  {
    "id": "a056",
    "kind": "choice",
    "minAge": 16,
    "maxAge": 24,
    "shape": "road",
    "origin": null,
    "root": null,
    "title": "山道上有人攔路要買路錢",
    "text": "兩個人用木棍擋路，說借一點盤纏。你身上東西不多。",
    "choices": [
      {
        "label": "立刻跑路",
        "line": "你棄了包裹從坡上滑下去。人還在，東西少了一半。"
      },
      {
        "label": "上前爭奪",
        "line": "你和他們搶棍子。肩上挨了一下，錢也沒保住。"
      }
    ]
  },
  {
    "id": "a057",
    "kind": "choice",
    "minAge": 17,
    "maxAge": 26,
    "shape": "help",
    "origin": null,
    "root": null,
    "title": "落水的人抓不住岸",
    "text": "河灣裡有人扒著柳根。水流不急，你的腳還夠得到底。",
    "choices": [
      {
        "label": "伸手",
        "line": "你把他拉上來。他報了一個名字，說以後會還。"
      },
      {
        "label": "丟一根樹枝",
        "line": "你丟了樹枝就走。人是自己爬上來的，沒有來謝你。"
      }
    ]
  },
  {
    "id": "a058",
    "kind": "choice",
    "minAge": 18,
    "maxAge": 28,
    "shape": "trade",
    "origin": null,
    "root": null,
    "title": "藥鋪學徒私賣止血散",
    "text": "學徒說這包散能止血，不要舖裡的價。你看包裝是舊的。",
    "choices": [
      {
        "label": "買下",
        "line": "你買了。後來真用上一次，血是止住了，味道很衝。"
      },
      {
        "label": "不買",
        "line": "你離開。學徒把那包又塞回櫃底。"
      }
    ]
  },
  {
    "id": "a059",
    "kind": "choice",
    "minAge": 19,
    "maxAge": 30,
    "shape": "ask",
    "origin": null,
    "root": null,
    "title": "有人邀你一起夜獵",
    "text": "夜裡山裡有東西偷雞。他們要你拿火把，分不到肉也得去。",
    "choices": [
      {
        "label": "拿火把去",
        "line": "你去了。火把照見的只是野狗，你還是被分到一條腿。"
      },
      {
        "label": "不去",
        "line": "你留在家裡。第二天他們說你膽小，雞的事不再找你。"
      }
    ]
  },
  {
    "id": "a060",
    "kind": "beat",
    "minAge": 20,
    "maxAge": 32,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你把名字寫端正了",
    "text": "你在沙地上寫了十遍自己的姓名。最後一遍，旁人認得出來。",
    "choices": []
  },
  {
    "id": "a061",
    "kind": "beat",
    "minAge": 21,
    "maxAge": 34,
    "shape": "coin",
    "origin": null,
    "root": null,
    "title": "你替人守了半夜倉",
    "text": "倉主怕老鼠。你守到天亮，拿到一小把穀，眼是紅的。",
    "choices": []
  },
  {
    "id": "a062",
    "kind": "beat",
    "minAge": 22,
    "maxAge": 36,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "舊友回來時不認得你",
    "text": "離開村子的人回來了。他問你是誰家的，你報了名，他才想起來。",
    "choices": []
  },
  {
    "id": "a063",
    "kind": "beat",
    "minAge": 23,
    "maxAge": 38,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你開始記帳",
    "text": "家裡的進出你用炭筆記在門背後。數字對得上，人才讓你繼續記。",
    "choices": []
  },
  {
    "id": "a064",
    "kind": "choice",
    "minAge": 20,
    "maxAge": 34,
    "shape": "sect",
    "origin": null,
    "root": null,
    "title": "外門貼出掃地的名額",
    "text": "牆上海報只寫掃地、挑水，不寫收徒。名額比人少。",
    "choices": [
      {
        "label": "去排隊",
        "line": "你排到了。掃了一年地，才有人願意告訴你氣從哪裡走。"
      },
      {
        "label": "撕掉念頭",
        "line": "你沒有去。牆邊的人後來有的留下，有的被趕走。"
      }
    ]
  },
  {
    "id": "a065",
    "kind": "choice",
    "minAge": 22,
    "maxAge": 36,
    "shape": "page",
    "origin": null,
    "root": null,
    "title": "殘頁從窗口飄出來",
    "text": "樓裡有人把一頁功法當廢紙扔出。字跡斷了，還能讀半段。",
    "choices": [
      {
        "label": "撿起來藏好",
        "line": "你撿了。這半頁和你的呼吸不太合，你還是照著試。"
      },
      {
        "label": "讓風吹走",
        "line": "你看著那頁飛過河。沒有追。"
      }
    ]
  },
  {
    "id": "a066",
    "kind": "choice",
    "minAge": 24,
    "maxAge": 40,
    "shape": "trade",
    "origin": null,
    "root": null,
    "title": "坊市有人收舊銅鏡",
    "text": "他說銅鏡能照見氣。價錢開得像在收廢銅。",
    "choices": [
      {
        "label": "賣給他",
        "line": "你沒有鏡子，他把你的銅扣收走了。什麼也沒照見。"
      },
      {
        "label": "不賣",
        "line": "你把扣子留著。那人換下一家，不再看你。"
      }
    ]
  },
  {
    "id": "a067",
    "kind": "choice",
    "minAge": 26,
    "maxAge": 42,
    "shape": "risk",
    "origin": null,
    "root": null,
    "title": "有人教你憋氣衝關",
    "text": "茶館裡的人說把氣憋到眼前發黑就能破境。你不知道他破過沒有。",
    "choices": [
      {
        "label": "照做一次",
        "line": "你試了。眼前確實黑了，境沒有破，胸口痛了兩天。"
      },
      {
        "label": "當他說胡話",
        "line": "你喝茶離開。那人又抓著下一個說同樣的話。"
      }
    ]
  },
  {
    "id": "a068",
    "kind": "beat",
    "minAge": 25,
    "maxAge": 45,
    "shape": "coin",
    "origin": null,
    "root": null,
    "title": "你學會還價",
    "text": "同一塊布你問了三家。最後一家少了兩文，你才買。",
    "choices": []
  },
  {
    "id": "a069",
    "kind": "beat",
    "minAge": 28,
    "maxAge": 48,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "你把一次失敗說給別人聽",
    "text": "你把走岔的呼吸講出來。聽的人沒有笑，只說他也這樣過。",
    "choices": []
  },
  {
    "id": "a070",
    "kind": "beat",
    "minAge": 30,
    "maxAge": 50,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你獨自過了一個生辰",
    "text": "沒有人記得。你給自己煮了一碗麵，把歲數在心裡加了一歲。",
    "choices": []
  },
  {
    "id": "a071",
    "kind": "choice",
    "minAge": 27,
    "maxAge": 46,
    "shape": "road",
    "origin": null,
    "root": null,
    "title": "礦坑口有人搶鎬",
    "text": "兩個礦工為一把鎬打起來，鎬頭飛到你腳邊。",
    "choices": [
      {
        "label": "立刻跑路",
        "line": "你退到坑外。鎬沒有砸到你，裡面後來抬出來一個人。"
      },
      {
        "label": "上前爭奪",
        "line": "你去拉架。鎬柄磕到你的手臂，人是被你拉開了。"
      }
    ]
  },
  {
    "id": "a072",
    "kind": "choice",
    "minAge": 29,
    "maxAge": 50,
    "shape": "help",
    "origin": null,
    "root": null,
    "title": "被趕出師門的人坐在路邊",
    "text": "他說自己沒有錯，只求一晚住的地方。你看他的手在抖。",
    "choices": [
      {
        "label": "讓他住一晚",
        "line": "你讓出半張床。天亮他留下一個名字就走了。"
      },
      {
        "label": "請他繼續走",
        "line": "你指了指村外。他走了，沒有回頭罵。"
      }
    ]
  },
  {
    "id": "a073",
    "kind": "choice",
    "minAge": 31,
    "maxAge": 52,
    "shape": "owe",
    "origin": null,
    "root": null,
    "title": "舊識來討三年前的債",
    "text": "他拿出一張你簽過的字。數字不大，你確實欠過。",
    "choices": [
      {
        "label": "還上",
        "line": "你把靈石數給他。字據燒了，兩個人都鬆了一口氣。"
      },
      {
        "label": "賴著",
        "line": "你說記不清。他收起紙，說下次不會再講情面。"
      }
    ]
  },
  {
    "id": "a074",
    "kind": "beat",
    "minAge": 32,
    "maxAge": 55,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "你在雨裡等一個不來的人",
    "text": "約好的人沒有出現。你等到衣裳濕透，才承認今天沒有這件事。",
    "choices": []
  },
  {
    "id": "a075",
    "kind": "beat",
    "minAge": 34,
    "maxAge": 58,
    "shape": "coin",
    "origin": null,
    "root": null,
    "title": "你把一門手藝教給別人",
    "text": "你教人怎麼辨礦。對方學會後開了自己的攤，沒有分你。",
    "choices": []
  },
  {
    "id": "a076",
    "kind": "beat",
    "minAge": 36,
    "maxAge": 60,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你開始會拒絕白工",
    "text": "有人又要你免費守夜。你說不了。對方愣了一下，改找別人。",
    "choices": []
  },
  {
    "id": "a077",
    "kind": "choice",
    "minAge": 33,
    "maxAge": 56,
    "shape": "ask",
    "origin": null,
    "root": null,
    "title": "城裡辦一場不要錢的問診",
    "text": "郎中只看前二十個人。你的舊傷還在，隊已經排到巷尾。",
    "choices": [
      {
        "label": "去排",
        "line": "你排到了。郎中說這傷養得活，卻不會自己消失。"
      },
      {
        "label": "不去",
        "line": "你把位置讓給後面的孩子。自己的傷仍舊陰天就響。"
      }
    ]
  },
  {
    "id": "a078",
    "kind": "choice",
    "minAge": 35,
    "maxAge": 60,
    "shape": "trade",
    "origin": null,
    "root": null,
    "title": "有人用靈石換你的舊筆記",
    "text": "你把這些年試過的呼吸記在本子上。對方出的價比紙貴。",
    "choices": [
      {
        "label": "換給他",
        "line": "你換了。口袋厚了一點，有些失敗你自己也快忘了。"
      },
      {
        "label": "不換",
        "line": "你把本子收好。那些失敗以後還用得上。"
      }
    ]
  },
  {
    "id": "a079",
    "kind": "choice",
    "minAge": 38,
    "maxAge": 64,
    "shape": "risk",
    "origin": null,
    "root": null,
    "title": "洞裡傳來不該有的回聲",
    "text": "你探路時聽見自己的聲音晚了半拍回來。同行的人說裡面有東西。",
    "choices": [
      {
        "label": "退出來",
        "line": "你退到洞口。回聲停了，人還在。"
      },
      {
        "label": "再往裡十步",
        "line": "你多走了十步。氣血翻了一下，什麼也沒看見，腿軟了。"
      }
    ]
  },
  {
    "id": "a080",
    "kind": "beat",
    "minAge": 40,
    "maxAge": 70,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "你把年輕時的路認錯了",
    "text": "你回到舊地，巷子不是記憶裡的樣子。問人，才知道那戶早搬了。",
    "choices": []
  },
  {
    "id": "a081",
    "kind": "beat",
    "minAge": 42,
    "maxAge": 72,
    "shape": "coin",
    "origin": null,
    "root": null,
    "title": "你借出的東西自己回來了",
    "text": "多年前借出的工具出現在門口。沒有条子，人是還了。",
    "choices": []
  },
  {
    "id": "a082",
    "kind": "beat",
    "minAge": 44,
    "maxAge": 75,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你開始早睡",
    "text": "你不再跟年輕人熬夜。天不亮就醒，醒了也不覺得自己老。",
    "choices": []
  },
  {
    "id": "a083",
    "kind": "choice",
    "minAge": 40,
    "maxAge": 68,
    "shape": "road",
    "origin": null,
    "root": null,
    "title": "稅吏帶人封你的小爐",
    "text": "他們說私煉要補稅。爐裡其實只有藥渣和一點碎石。",
    "choices": [
      {
        "label": "立刻跑路",
        "line": "你從後門走了。爐被封，人沒有被帶走。"
      },
      {
        "label": "上前爭奪",
        "line": "你上前說這是藥爐。推搡裡手被門夾了，爐還是封了。"
      }
    ]
  },
  {
    "id": "a084",
    "kind": "choice",
    "minAge": 43,
    "maxAge": 72,
    "shape": "sect",
    "origin": null,
    "root": null,
    "title": "散修要拉一支互保的隊",
    "text": "他們不收門派的名帖，只要求出事時你得出人。",
    "choices": [
      {
        "label": "加入",
        "line": "你入了隊。以後有人會在你被圍時喊一聲，你也得去喊。"
      },
      {
        "label": "獨行",
        "line": "你沒有加入。隊伍走遠時，你知道自己仍是一個人。"
      }
    ]
  },
  {
    "id": "a085",
    "kind": "choice",
    "minAge": 46,
    "maxAge": 76,
    "shape": "page",
    "origin": null,
    "root": null,
    "title": "墓裡挖出半卷沒有名字的功法",
    "text": "挖土的人不敢拿。卷子上的路子和你現在走的不完全一樣。",
    "choices": [
      {
        "label": "抄下來",
        "line": "你抄了能看懂的部分。有一句你用了，經脈熱得不舒服。"
      },
      {
        "label": "就地埋回",
        "line": "你把卷子蓋上土。夜裡沒有再夢到它。"
      }
    ]
  },
  {
    "id": "a086",
    "kind": "choice",
    "minAge": 48,
    "maxAge": 80,
    "shape": "help",
    "origin": null,
    "root": null,
    "title": "仇家的孩子來求藥",
    "text": "你認得那張臉像誰。孩子只說家裡的人吐血，藥鋪不肯賒。",
    "choices": [
      {
        "label": "給藥",
        "line": "你把藥給了。孩子跪下，你叫他起來，這筆不算還情。"
      },
      {
        "label": "不給",
        "line": "你搖頭。孩子跑了。你當天晚上沒有睡好。"
      }
    ]
  },
  {
    "id": "a087",
    "kind": "beat",
    "minAge": 50,
    "maxAge": 85,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "你聽見有人用你的舊名字",
    "text": "遠方的人提起你以前的稱呼。你沒有走過去，那名字已經不像你。",
    "choices": []
  },
  {
    "id": "a088",
    "kind": "beat",
    "minAge": 52,
    "maxAge": 88,
    "shape": "coin",
    "origin": null,
    "root": null,
    "title": "你把積蓄分成三處",
    "text": "你不再把靈石放在一個罐子裡。其中一處後來真的被偷，另外兩處還在。",
    "choices": []
  },
  {
    "id": "a089",
    "kind": "beat",
    "minAge": 55,
    "maxAge": 90,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你教一個陌生人怎麼止血",
    "text": "路上有人受傷。你按住，告訴他鬆開的時間。人活了，沒有留下名。",
    "choices": []
  },
  {
    "id": "a090",
    "kind": "choice",
    "minAge": 50,
    "maxAge": 82,
    "shape": "owe",
    "origin": null,
    "root": null,
    "title": "族裡的旁支拿你的名字去貸",
    "text": "你是旁系。他們說貸的是族裡的額度，還的時候卻寫著你。",
    "choices": [
      {
        "label": "認下慢慢還",
        "line": "你認了。每個月少一截靈石，名字從契上被你自己擦掉。"
      },
      {
        "label": "撕掉那張契",
        "line": "你當眾撕了。族裡的人冷下來，貸是沒有了。"
      }
    ]
  },
  {
    "id": "a091",
    "kind": "choice",
    "minAge": 54,
    "maxAge": 86,
    "shape": "risk",
    "origin": null,
    "root": null,
    "title": "有人說你的根配不上這門功法",
    "text": "對方不是罵你，是看過你行功。他建議你換一條慢路。",
    "choices": [
      {
        "label": "換",
        "line": "你停了原來的路。慢是慢，經脈不再每晚發燙。"
      },
      {
        "label": "不換",
        "line": "你繼續硬走。修為還在，半夜會醒。"
      }
    ]
  },
  {
    "id": "a092",
    "kind": "choice",
    "minAge": 58,
    "maxAge": 92,
    "shape": "trade",
    "origin": null,
    "root": null,
    "title": "黑市賣延壽的丸",
    "text": "丸子沒有舖號。賣的人說吃一顆多五年，你聞見糖漿的味道。",
    "choices": [
      {
        "label": "買一顆",
        "line": "你買了。吃完沒有多五年，胃卻痛了一整夜。"
      },
      {
        "label": "走路",
        "line": "你離開黑市。壽元還是原來那個數。"
      }
    ]
  },
  {
    "id": "a093",
    "kind": "choice",
    "minAge": 60,
    "maxAge": 96,
    "shape": "ask",
    "origin": null,
    "root": null,
    "title": "後輩請你看他的岔氣",
    "text": "他走火在即，卻只信任你這一個老人。你自己的氣也不穩。",
    "choices": [
      {
        "label": "看",
        "line": "你幫他收住。你的心境薄了一層，他活下來了。"
      },
      {
        "label": "讓他找別人",
        "line": "你說自己不管了。後來聽說他找別人，人是保住了。"
      }
    ]
  },
  {
    "id": "a094",
    "kind": "beat",
    "minAge": 62,
    "maxAge": 100,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "你把想說的話寫下來又燒了",
    "text": "有些事你不想進下一世。紙燒完，灰是白的，話沒有留下。",
    "choices": []
  },
  {
    "id": "a095",
    "kind": "beat",
    "minAge": 64,
    "maxAge": 104,
    "shape": "coin",
    "origin": null,
    "root": null,
    "title": "你替人擔保，自己貼了一筆",
    "text": "你擔保的人跑了。你把那筆補上，以後不再替人畫押。",
    "choices": []
  },
  {
    "id": "a096",
    "kind": "beat",
    "minAge": 66,
    "maxAge": 110,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你走路開始拄杖",
    "text": "不是修為退了，是膝蓋不行。杖是你自己削的。",
    "choices": []
  },
  {
    "id": "a097",
    "kind": "choice",
    "minAge": 63,
    "maxAge": 108,
    "shape": "road",
    "origin": null,
    "root": null,
    "title": "有人在你的藥田裡埋了髒東西",
    "text": "你發現田裡被埋了腐肉，顯然是要搞臭你的收成。腳印還新。",
    "choices": [
      {
        "label": "立刻跑路",
        "line": "你沒有追。把那一片土挖走，田保住一半。"
      },
      {
        "label": "上前爭奪",
        "line": "你順著腳印追到人。打了一架，田還是臭了，你的臉也腫了。"
      }
    ]
  },
  {
    "id": "a098",
    "kind": "choice",
    "minAge": 68,
    "maxAge": 120,
    "shape": "cave",
    "origin": null,
    "root": null,
    "title": "你看中的洞有人先住",
    "text": "洞口掛著別人的袋子。位置卻是你量過、打算用來閉關的。",
    "choices": [
      {
        "label": "讓出來",
        "line": "你換了一處更淺的洞。人沒有衝突。"
      },
      {
        "label": "叫他搬走",
        "line": "你請他走。他走的時候把你的水囊踩漏，洞是你的了。"
      }
    ]
  },
  {
    "id": "a099",
    "kind": "choice",
    "minAge": 70,
    "maxAge": 130,
    "shape": "help",
    "origin": null,
    "root": null,
    "title": "一個孩子把你認成他的祖父",
    "text": "孩子抓著你的袖子不放。他祖父的名字和你完全不同。",
    "choices": [
      {
        "label": "送到他家門口",
        "line": "你問清地址，把他送回。家裡的人謝了你。"
      },
      {
        "label": "甩開",
        "line": "你抽回袖子。孩子站在原地哭，有別的路人過去。"
      }
    ]
  },
  {
    "id": "a100",
    "kind": "beat",
    "minAge": 72,
    "maxAge": 140,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "你夢到自己還沒有測靈",
    "text": "夢裡你還是個孩子，牌還沒有翻。醒來歲數還在，牌早翻過了。",
    "choices": []
  },
  {
    "id": "a101",
    "kind": "beat",
    "minAge": 75,
    "maxAge": 150,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你把一生的路講給燈聽",
    "text": "沒有聽眾。你還是把岔路、還錢、跑掉的那些事說完了。",
    "choices": []
  },
  {
    "id": "a102",
    "kind": "beat",
    "minAge": 78,
    "maxAge": 160,
    "shape": "coin",
    "origin": null,
    "root": null,
    "title": "你最後一次跟人還價",
    "text": "你為一把舊鋤頭還價。對方看你的歲數，直接照你的價給了。",
    "choices": []
  },
  {
    "id": "a103",
    "kind": "choice",
    "minAge": 80,
    "maxAge": 170,
    "shape": "risk",
    "origin": null,
    "root": null,
    "title": "壽元所剩不多時有人勸你衝",
    "text": "他說再衝一次，成了就能把壽元拉長。你算得清自己的底。",
    "choices": [
      {
        "label": "不衝",
        "line": "你把這次按下。日子繼續走，門還在，人還在。"
      },
      {
        "label": "再試一次",
        "line": "你試了。氣血翻湧，境沒有動，你在床上躺了七天。"
      }
    ]
  },
  {
    "id": "a104",
    "kind": "beat",
    "minAge": 16,
    "maxAge": 40,
    "shape": "flavor",
    "origin": "village",
    "root": null,
    "title": "村裡的祠堂要你出份錢",
    "text": "不是修仙的稅，是修屋頂。你出了一小份，名字被寫在紅紙角落。",
    "choices": []
  },
  {
    "id": "a105",
    "kind": "beat",
    "minAge": 18,
    "maxAge": 44,
    "shape": "heart",
    "origin": "village",
    "root": null,
    "title": "你被派去守青苗",
    "text": "夜裡你在田邊打盹。野豬沒有來，你還是被記了一功。",
    "choices": []
  },
  {
    "id": "a106",
    "kind": "beat",
    "minAge": 22,
    "maxAge": 50,
    "shape": "coin",
    "origin": "orphan",
    "root": null,
    "title": "你在義塚邊搭了一夜",
    "text": "沒有家可以回。你靠著土堆睡，天亮有人給你一碗水。",
    "choices": []
  },
  {
    "id": "a107",
    "kind": "beat",
    "minAge": 24,
    "maxAge": 55,
    "shape": "heart",
    "origin": "orphan",
    "root": null,
    "title": "有人問你父母的名字",
    "text": "你說得出姓，說不全名。問的人就不再問了。",
    "choices": []
  },
  {
    "id": "a108",
    "kind": "beat",
    "minAge": 20,
    "maxAge": 48,
    "shape": "coin",
    "origin": "clan",
    "root": null,
    "title": "族裡把你的月例減了",
    "text": "旁系的月例本來就薄。減了之後，你開始自己找活。",
    "choices": []
  },
  {
    "id": "a109",
    "kind": "beat",
    "minAge": 26,
    "maxAge": 60,
    "shape": "flavor",
    "origin": "clan",
    "root": null,
    "title": "族譜裡你的名字在角落",
    "text": "你翻到自己。字很小，前面沒有官職，也沒有境界。",
    "choices": []
  },
  {
    "id": "a110",
    "kind": "beat",
    "minAge": 14,
    "maxAge": 36,
    "shape": "heart",
    "origin": "cauldron",
    "root": null,
    "title": "你身上的舊疤在下雨天發緊",
    "text": "那不是打架留下的。你問過，沒有人告訴你是誰割的。",
    "choices": []
  },
  {
    "id": "a111",
    "kind": "beat",
    "minAge": 16,
    "maxAge": 30,
    "shape": "flavor",
    "origin": "cauldron",
    "root": null,
    "title": "看管你的人換了一班",
    "text": "新來的人點名時念錯你的姓。你沒有糾正，他也沒有再問。",
    "choices": []
  },
  {
    "id": "a112",
    "kind": "beat",
    "minAge": 18,
    "maxAge": 46,
    "shape": "heart",
    "origin": "remnant",
    "root": null,
    "title": "你夢到一條不屬於這一生的巷",
    "text": "巷子裡的門你推得開。醒來手心是汗，這一生沒有這條巷。",
    "choices": []
  },
  {
    "id": "a113",
    "kind": "beat",
    "minAge": 28,
    "maxAge": 70,
    "shape": "coin",
    "origin": "remnant",
    "root": null,
    "title": "殘憶幫你避開了一次錯路",
    "text": "你本來要走左邊的橋。忽然覺得那裡塌過，你改走右邊，橋果然在修。",
    "choices": []
  },
  {
    "id": "a114",
    "kind": "beat",
    "minAge": 20,
    "maxAge": 50,
    "shape": "heart",
    "origin": null,
    "root": "wei",
    "title": "有人當面說你的根太慢",
    "text": "不是咒你，是算給你聽。你聽完，還是按自己的日子走。",
    "choices": []
  },
  {
    "id": "a115",
    "kind": "beat",
    "minAge": 30,
    "maxAge": 80,
    "shape": "flavor",
    "origin": null,
    "root": "wei",
    "title": "你把慢寫成一種活法",
    "text": "同齡人衝關的時候你在熬藥。你沒有覺得自己走錯，只是走得久。",
    "choices": []
  },
  {
    "id": "a116",
    "kind": "beat",
    "minAge": 22,
    "maxAge": 60,
    "shape": "coin",
    "origin": null,
    "root": "tian",
    "title": "有人想買你的名字去掛靠",
    "text": "他們出靈石，要你在名帖上寫真靈根以外的好根。你聽懂了他們要什麼。",
    "choices": []
  },
  {
    "id": "a117",
    "kind": "beat",
    "minAge": 24,
    "maxAge": 55,
    "shape": "heart",
    "origin": null,
    "root": "bian",
    "title": "通行的口訣使你作嘔",
    "text": "你照著大家的口訣坐了一晚。天亮時你決定這條路不能再照抄。",
    "choices": []
  },
  {
    "id": "a118",
    "kind": "beat",
    "minAge": 40,
    "maxAge": 90,
    "shape": "flavor",
    "origin": null,
    "root": "zhen",
    "title": "你既不被人追著要，也不被人抬",
    "text": "真靈根在這八十億裡不算故事。你把自己的帳記清楚就夠了。",
    "choices": []
  },
  {
    "id": "a119",
    "kind": "choice",
    "minAge": 18,
    "maxAge": 40,
    "shape": "road",
    "origin": null,
    "root": null,
    "title": "茶棚外有人動刀",
    "text": "兩個客商為一箱貨動了短刀。血已經滴到你的凳子邊。",
    "choices": [
      {
        "label": "立刻跑路",
        "line": "你從棚後離開。刀沒有追出來，茶錢你沒有付。"
      },
      {
        "label": "上前爭奪",
        "line": "你掀桌子去擋。手臂被劃了一道，箱子你沒有搶到。"
      }
    ]
  },
  {
    "id": "a120",
    "kind": "choice",
    "minAge": 21,
    "maxAge": 44,
    "shape": "road",
    "origin": null,
    "root": null,
    "title": "夜航的船要你幫著把人扔下",
    "text": "船家說那個人沒給錢。那個人抱著桅杆，看著你。",
    "choices": [
      {
        "label": "立刻跑路",
        "line": "你不上那艘船。船離了岸，你不知道後來怎樣。"
      },
      {
        "label": "上前爭奪",
        "line": "你抓住船家的手腕。人沒有被扔下，你被推到了岸上。"
      }
    ]
  },
  {
    "id": "a121",
    "kind": "choice",
    "minAge": 19,
    "maxAge": 42,
    "shape": "help",
    "origin": null,
    "root": null,
    "title": "產房外的人請你去請穩婆",
    "text": "半夜敲門。你認得路，穩婆住在村那頭。",
    "choices": [
      {
        "label": "跑去請",
        "line": "你跑過去。孩子第二天天亮落地，人家給你留了蛋。"
      },
      {
        "label": "說自己不認得路",
        "line": "你關上窗。後來聽說穩婆還是被人請到了。"
      }
    ]
  },
  {
    "id": "a122",
    "kind": "choice",
    "minAge": 23,
    "maxAge": 48,
    "shape": "ask",
    "origin": null,
    "root": null,
    "title": "師兄要你替他頂一次責",
    "text": "他打破了公用法器，想讓你說是你碰的。你沒有碰。",
    "choices": [
      {
        "label": "不頂",
        "line": "你說不是你。師兄被罰去挑水，以後見你只點頭。"
      },
      {
        "label": "替他說",
        "line": "你認了。罰落在你身上，他私下塞給你一點靈石。"
      }
    ]
  },
  {
    "id": "a123",
    "kind": "choice",
    "minAge": 27,
    "maxAge": 52,
    "shape": "trade",
    "origin": null,
    "root": null,
    "title": "有人用一門消息換你的靈石",
    "text": "他說城西今晚有人清倉賣碎丹。你去了才知道真假。",
    "choices": [
      {
        "label": "換",
        "line": "你給了靈石。清倉是真的，碎丹也是碎的，你還是撿到兩塊能用的。"
      },
      {
        "label": "不換",
        "line": "你留著靈石。第二天聽說那裡確實便宜，已經沒有了。"
      }
    ]
  },
  {
    "id": "a124",
    "kind": "choice",
    "minAge": 33,
    "maxAge": 62,
    "shape": "sect",
    "origin": null,
    "root": null,
    "title": "小派收記名，不給月例",
    "text": "記名之後你可以進藏書的外間。沒有人保證教你。",
    "choices": [
      {
        "label": "記名",
        "line": "你寫上名字。外間的書多半是地圖，你還是抄了兩張。"
      },
      {
        "label": "不寫",
        "line": "你沒有留下名字。門房以後見你要問來意。"
      }
    ]
  },
  {
    "id": "a125",
    "kind": "choice",
    "minAge": 36,
    "maxAge": 66,
    "shape": "owe",
    "origin": null,
    "root": null,
    "title": "你幫人擔保一船貨",
    "text": "船若沉了，你要賠。船主是舊識，河水這季看著穩。",
    "choices": [
      {
        "label": "擔保",
        "line": "船到了。你沒有賠，舊識分了你一小箱。"
      },
      {
        "label": "不保",
        "line": "你拒絕。船後來確實到了，舊識沒有再來找你。"
      }
    ]
  },
  {
    "id": "a126",
    "kind": "choice",
    "minAge": 41,
    "maxAge": 74,
    "shape": "page",
    "origin": null,
    "root": null,
    "title": "你在廢樓裡踢到一塊石板",
    "text": "石板背面刻著行氣的順序，和你師門教的相反。",
    "choices": [
      {
        "label": "照著試三天",
        "line": "你試了。有一天特別順，另外兩天胸悶。你把石板留在樓裡。"
      },
      {
        "label": "記下來就走",
        "line": "你只抄了順序。沒有照做，抄本放在包袱底。"
      }
    ]
  },
  {
    "id": "a127",
    "kind": "choice",
    "minAge": 45,
    "maxAge": 78,
    "shape": "cave",
    "origin": null,
    "root": null,
    "title": "你挖開一處被土封住的洞",
    "text": "裡面有別人的睡榻和冷掉的爐灰。東西還在，人不在。",
    "choices": [
      {
        "label": "住進去",
        "line": "你住了幾天。主人回來時你已經離開，爐灰是你添的。"
      },
      {
        "label": "封回去",
        "line": "你把土推回去。這處洞當沒有存在過。"
      }
    ]
  },
  {
    "id": "a128",
    "kind": "choice",
    "minAge": 52,
    "maxAge": 88,
    "shape": "risk",
    "origin": null,
    "root": null,
    "title": "你的心口突然空了一拍",
    "text": "行功到一半，心跳漏了一下。你可以停下，也可以把那一拍補回去。",
    "choices": [
      {
        "label": "停下",
        "line": "你收功。空拍沒有再來，今天的進度沒有了。"
      },
      {
        "label": "補回去",
        "line": "你把氣補上。心跳猛地趕回來，眼前發黑，人還坐著。"
      }
    ]
  },
  {
    "id": "a129",
    "kind": "choice",
    "minAge": 57,
    "maxAge": 96,
    "shape": "help",
    "origin": null,
    "root": null,
    "title": "流民裡有人認得你的姓",
    "text": "他說他父親受過你的幫忙。你想不起這張臉。",
    "choices": [
      {
        "label": "給他一點乾糧",
        "line": "你分了乾糧。他沒有再跟著你。"
      },
      {
        "label": "說認錯人",
        "line": "你搖頭。他也沒有堅持，隊伍繼續往前。"
      }
    ]
  },
  {
    "id": "a130",
    "kind": "beat",
    "minAge": 12,
    "maxAge": 20,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你把鞋帶系緊再走路",
    "text": "你開始在出門前檢查自己，不等人提醒。",
    "choices": []
  },
  {
    "id": "a131",
    "kind": "beat",
    "minAge": 15,
    "maxAge": 28,
    "shape": "coin",
    "origin": null,
    "root": null,
    "title": "你在河灘上撈到一把鐵釘",
    "text": "釘是舊的。你賣給鐵鋪，換了兩天的鹽。",
    "choices": []
  },
  {
    "id": "a132",
    "kind": "beat",
    "minAge": 19,
    "maxAge": 36,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "你被誤認成偷雞的人",
    "text": "雞丟了，有人指你。後來雞自己回來，指你的人沒有道歉。",
    "choices": []
  },
  {
    "id": "a133",
    "kind": "beat",
    "minAge": 29,
    "maxAge": 54,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你學會在吵鬧裡坐下",
    "text": "坊市再吵，你也能把呼吸數完。這不算境界，算你還坐得住。",
    "choices": []
  },
  {
    "id": "a134",
    "kind": "beat",
    "minAge": 37,
    "maxAge": 68,
    "shape": "coin",
    "origin": null,
    "root": null,
    "title": "你幫人看風水，只收了一頓飯",
    "text": "你不會看。你照實說了。對方還是留你吃飯，說謝謝你不騙。",
    "choices": []
  },
  {
    "id": "a135",
    "kind": "beat",
    "minAge": 47,
    "maxAge": 84,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "你把一件虧心事做完就停",
    "text": "你多收了別人一成。做完你把多的退回，以後價錢寫在明處。",
    "choices": []
  },
  {
    "id": "a136",
    "kind": "beat",
    "minAge": 61,
    "maxAge": 110,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你開始把藥分成早晚",
    "text": "不是衝關。是你的身體要你這樣，你聽了。",
    "choices": []
  },
  {
    "id": "a137",
    "kind": "beat",
    "minAge": 8,
    "maxAge": 16,
    "shape": "coin",
    "origin": null,
    "root": null,
    "title": "你替人放了一下午牛",
    "text": "牛沒有跑。主人給你一個燒餅，你分了一半給跟來的弟弟。",
    "choices": []
  },
  {
    "id": "a138",
    "kind": "beat",
    "minAge": 9,
    "maxAge": 18,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "你被老師傅轟出廚房",
    "text": "你把鹽放多了。師傅沒打你，只叫你出去，明天不要再來。",
    "choices": []
  },
  {
    "id": "a139",
    "kind": "beat",
    "minAge": 11,
    "maxAge": 22,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你第一次自己縫扣子",
    "text": "線打結。扣子縫上了，衣服能穿，樣子不好看。",
    "choices": []
  },
  {
    "id": "a140",
    "kind": "beat",
    "minAge": 13,
    "maxAge": 26,
    "shape": "coin",
    "origin": null,
    "root": null,
    "title": "你在雪地裡撿柴",
    "text": "手凍裂了。柴夠燒兩晚，你沒有告訴家裡手的事。",
    "choices": []
  },
  {
    "id": "a141",
    "kind": "beat",
    "minAge": 17,
    "maxAge": 34,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "你把秘密說給一個不該聽的人",
    "text": "你說了家裡欠債。第二天整條巷都知道。你學會閉嘴。",
    "choices": []
  },
  {
    "id": "a142",
    "kind": "beat",
    "minAge": 39,
    "maxAge": 72,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你在橋上站了很久沒有跳",
    "text": "你只是看水。看完你回家，把濕掉的袖口擰乾。",
    "choices": []
  },
  {
    "id": "a143",
    "kind": "beat",
    "minAge": 49,
    "maxAge": 90,
    "shape": "coin",
    "origin": null,
    "root": null,
    "title": "你收到一封沒有署名的謝禮",
    "text": "裡面是一小袋靈石。你想不起自己做過什麼，還是收了。",
    "choices": []
  },
  {
    "id": "a144",
    "kind": "beat",
    "minAge": 69,
    "maxAge": 130,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "你忘記一個人的臉，記得他的忙",
    "text": "名字模糊了。你記得自己曾經拉過他，這就夠你晚上睡。",
    "choices": []
  },
  {
    "id": "a145",
    "kind": "choice",
    "minAge": 10,
    "maxAge": 18,
    "shape": "ask",
    "origin": null,
    "root": null,
    "title": "里正叫你去認一具無名的屍",
    "text": "不是讓你認親人，是讓你做個見證，證明村裡的人看過。",
    "choices": [
      {
        "label": "去",
        "line": "你去了。你不認識那個人，你照實說了。"
      },
      {
        "label": "不去",
        "line": "你說害怕。里正換了別人，沒有再叫你。"
      }
    ]
  },
  {
    "id": "a146",
    "kind": "choice",
    "minAge": 25,
    "maxAge": 46,
    "shape": "trade",
    "origin": null,
    "root": null,
    "title": "船家用過期的地圖換你的乾糧",
    "text": "他說地圖上有一處沒人去的灣。圖角已經潮爛。",
    "choices": [
      {
        "label": "換",
        "line": "你換了。灣是有的，裡面沒有東西，你白跑一趟。"
      },
      {
        "label": "不換",
        "line": "你留著乾糧。船家找下一個換。"
      }
    ]
  },
  {
    "id": "a147",
    "kind": "choice",
    "minAge": 44,
    "maxAge": 80,
    "shape": "sect",
    "origin": null,
    "root": null,
    "title": "曾經趕你走的廟現在請你回去",
    "text": "他們缺一個懂草藥的人。你還記得被轟出來的那天。",
    "choices": [
      {
        "label": "回去",
        "line": "你回去幫了一季。離開時他們沒有再趕，也沒有留。"
      },
      {
        "label": "不回",
        "line": "你寫了封信把藥方寄去。人沒有踏進那扇門。"
      }
    ]
  },
  {
    "id": "a148",
    "kind": "choice",
    "minAge": 65,
    "maxAge": 120,
    "shape": "help",
    "origin": null,
    "root": null,
    "title": "你年輕時救過的人，他的孫女來找你",
    "text": "她沒有要錢。她說祖父交代過，若你還在，來看一眼。",
    "choices": [
      {
        "label": "見她",
        "line": "你見了。她留下一雙鞋，你把舊事說了一半。"
      },
      {
        "label": "不見",
        "line": "你請人回話說不在。鞋子沒有留下，舊事也沒有再被提起。"
      }
    ]
  },
  {
    "id": "a149",
    "kind": "beat",
    "minAge": 6,
    "maxAge": 14,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你學會自己洗臉",
    "text": "水是冷的。你洗完，臉是乾淨的，這是你這天做成的事。",
    "choices": []
  },
  {
    "id": "a150",
    "kind": "beat",
    "minAge": 28,
    "maxAge": 58,
    "shape": "coin",
    "origin": null,
    "root": null,
    "title": "你把多出來的靈石埋進牆縫",
    "text": "不是前世的瓶子。是你怕自己一時手鬆。後來你自己挖出來用了。",
    "choices": []
  },
  {
    "id": "a151",
    "kind": "beat",
    "minAge": 53,
    "maxAge": 96,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "你在別人的突破日離開",
    "text": "鼓樂響起時你走出院子。你不是嫉妒，是不想在那個聲音裡坐著。",
    "choices": []
  },
  {
    "id": "a152",
    "kind": "beat",
    "minAge": 77,
    "maxAge": 150,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你把杖靠在門邊，人還走得動",
    "text": "這一年你還能自己去井邊。你知道這樣的年份不多了。",
    "choices": []
  },
  {
    "id": "a153",
    "kind": "choice",
    "minAge": 32,
    "maxAge": 60,
    "shape": "road",
    "origin": null,
    "root": null,
    "title": "市集上有人假借查驗搶袋子",
    "text": "他穿得像管事，手卻先按住你的袋子。四周的人在看。",
    "choices": [
      {
        "label": "立刻跑路",
        "line": "你抽回袋子就跑。他沒有追，假查驗換了下一個。"
      },
      {
        "label": "上前爭奪",
        "line": "你抓住他的手腕大喊。袋子保住了，你的手腕被扭青。"
      }
    ]
  },
  {
    "id": "a154",
    "kind": "choice",
    "minAge": 56,
    "maxAge": 100,
    "shape": "risk",
    "origin": null,
    "root": null,
    "title": "你行功時看見自己的臉老了十歲",
    "text": "不是鏡子，是氣海裡的一個影子。你可以停，也可以看完。",
    "choices": [
      {
        "label": "停",
        "line": "你收功。影子散了，你的臉還是現在這張。"
      },
      {
        "label": "看完",
        "line": "你看完。心口發涼，修為沒有掉，你一夜沒有再坐。"
      }
    ]
  },
  {
    "id": "a155",
    "kind": "beat",
    "minAge": 4,
    "maxAge": 12,
    "shape": "coin",
    "origin": null,
    "root": null,
    "title": "你把掉在泥裡的餅洗乾淨吃了",
    "text": "餅還能吃。你沒有告訴別人這就是今天的點心。",
    "choices": []
  },
  {
    "id": "a156",
    "kind": "beat",
    "minAge": 35,
    "maxAge": 64,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你幫一對吵架的人把話聽完",
    "text": "你沒有勸。他們吵完自己停了，謝你沒有插嘴。",
    "choices": []
  },
  {
    "id": "a157",
    "kind": "beat",
    "minAge": 67,
    "maxAge": 124,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "你把房門的鑰匙交給一個可靠的人",
    "text": "你怕自己有一天回不來。鑰匙給了，人還在，你只是先辦了。",
    "choices": []
  },
  {
    "id": "a158",
    "kind": "choice",
    "minAge": 42,
    "maxAge": 76,
    "shape": "ask",
    "origin": null,
    "root": null,
    "title": "官府來量你的田，要你在冊子上按手印",
    "text": "田是你家的。冊子上的數字你看得懂，比實際少了一截。",
    "choices": [
      {
        "label": "按",
        "line": "你按了。少的那截以後不再是你的。"
      },
      {
        "label": "不按",
        "line": "你拒絕。量田的人記下你的名字，田暫時還在。"
      }
    ]
  },
  {
    "id": "a159",
    "kind": "choice",
    "minAge": 74,
    "maxAge": 140,
    "shape": "trade",
    "origin": null,
    "root": null,
    "title": "有人出高價買你的壽元說辭",
    "text": "他在寫書，想把你的算法寫成自己的。你這些年怎麼活的，他要一句話。",
    "choices": [
      {
        "label": "賣一句",
        "line": "你說了「不要硬衝」。他付了靈石，書後來沒有寫你的名字。"
      },
      {
        "label": "不賣",
        "line": "你說這不是拿來賣的。他去找下一個老人。"
      }
    ]
  },
  {
    "id": "a160",
    "kind": "beat",
    "minAge": 81,
    "maxAge": 180,
    "shape": "coin",
    "origin": null,
    "root": null,
    "title": "你把用不到的鼎賣了",
    "text": "鼎占地方。賣的錢你買了藥和炭，冬天過得去。",
    "choices": []
  },
  {
    "id": "a161",
    "kind": "beat",
    "minAge": 90,
    "maxAge": 220,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你還能自己把今天的事說清楚",
    "text": "歲數很大。你說得出自己是誰、住在哪、今天吃了什麼。",
    "choices": []
  },
  {
    "id": "a162",
    "kind": "choice",
    "minAge": 86,
    "maxAge": 200,
    "shape": "help",
    "origin": null,
    "root": null,
    "title": "一個後生跪著求你收他",
    "text": "他沒有根可以給你看，只說肯做事。你已經不想再帶人。",
    "choices": [
      {
        "label": "讓他留下做事",
        "line": "你不收徒。你讓他挑水，他做得很穩。"
      },
      {
        "label": "請他另尋",
        "line": "你說自己教不了。他磕了頭走了，沒有怨。"
      }
    ]
  },
  {
    "id": "a163",
    "kind": "beat",
    "minAge": 100,
    "maxAge": 260,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "你醒來時先數自己的手指",
    "text": "這不是修煉。是你要確認人還在。十根都在，你才起身。",
    "choices": []
  },
  {
    "id": "a164",
    "kind": "beat",
    "minAge": 120,
    "maxAge": 320,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你把洞門打開一條縫透氣",
    "text": "閉關太久。你沒有出關，只是讓風進來，再把縫關小。",
    "choices": []
  },
  {
    "id": "a165",
    "kind": "choice",
    "minAge": 110,
    "maxAge": 280,
    "shape": "risk",
    "origin": null,
    "root": null,
    "title": "化神之前的氣在你身體裡打架",
    "text": "兩股氣不屬於同一條路。你可以壓住一股，也可以讓它們自己碰。",
    "choices": [
      {
        "label": "壓住",
        "line": "你壓住後來的那股。人穩了，進度停了一天。"
      },
      {
        "label": "讓它們碰",
        "line": "你放手。碰撞很響，你吐了一口血，兩股暫時安靜下來。"
      }
    ]
  },
  {
    "id": "a166",
    "kind": "beat",
    "minAge": 140,
    "maxAge": 360,
    "shape": "coin",
    "origin": null,
    "root": null,
    "title": "你用靈石換了一冬的安靜",
    "text": "你把洞府附近的獵戶請走一季。貴，這一季沒有人來敲門。",
    "choices": []
  },
  {
    "id": "a167",
    "kind": "beat",
    "minAge": 160,
    "maxAge": 400,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "你想起第一個教你止血的人",
    "text": "不是同門。是一個普通郎中。你沒有辦法再去謝他。",
    "choices": []
  },
  {
    "id": "a168",
    "kind": "choice",
    "minAge": 150,
    "maxAge": 380,
    "shape": "cave",
    "origin": null,
    "root": null,
    "title": "你留下的記號被人擦掉",
    "text": "洞外的石壁被刮平。有人想讓這地方看起來沒有主人。",
    "choices": [
      {
        "label": "重新刻上",
        "line": "你刻回去。第二天還在，人沒有再來。"
      },
      {
        "label": "換一個洞",
        "line": "你不爭這面牆。你搬到更深的一處，記號不再留給別人看。"
      }
    ]
  },
  {
    "id": "a169",
    "kind": "beat",
    "minAge": 180,
    "maxAge": 480,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你在長壽裡仍然會餓",
    "text": "境界沒有把飯取消。你還是要吃，吃完還是要收碗。",
    "choices": []
  },
  {
    "id": "a170",
    "kind": "beat",
    "minAge": 200,
    "maxAge": 560,
    "shape": "coin",
    "origin": null,
    "root": null,
    "title": "你把多餘的靈石埋進自己找得到的地方",
    "text": "不是給下一世的瓶子。是給這個冬天的你。你做了記號。",
    "choices": []
  },
  {
    "id": "a171",
    "kind": "choice",
    "minAge": 190,
    "maxAge": 520,
    "shape": "page",
    "origin": null,
    "root": null,
    "title": "你寫了一頁給以後的自己",
    "text": "字寫的是哪裡不能硬來。你可以把這頁留下，也可以燒了。",
    "choices": [
      {
        "label": "留在洞裡",
        "line": "你壓在石下。這一生若再回來，還看得到。"
      },
      {
        "label": "燒掉",
        "line": "你燒了。灰揚掉，這一句只留在你今天的記憶裡。"
      }
    ]
  },
  {
    "id": "a172",
    "kind": "beat",
    "minAge": 220,
    "maxAge": 640,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "你看著一個後輩走過你失敗過的那一關",
    "text": "他過了。你沒有酸，你只是坐久了一點。",
    "choices": []
  },
  {
    "id": "a173",
    "kind": "beat",
    "minAge": 240,
    "maxAge": 700,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你的名字在附近還有人識得",
    "text": "不是傳說。是藥鋪的人知道你要哪一種葉。",
    "choices": []
  },
  {
    "id": "a174",
    "kind": "choice",
    "minAge": 230,
    "maxAge": 680,
    "shape": "road",
    "origin": null,
    "root": null,
    "title": "有人帶著器械來量你的洞",
    "text": "他們說是官家的勘察。器械對著你住的地方。",
    "choices": [
      {
        "label": "立刻跑路",
        "line": "你從後洞離開。勘察的人沒有追進深處。"
      },
      {
        "label": "上前爭奪",
        "line": "你拦住他們。推搡之後器械砸了，你也被登記了一筆。"
      }
    ]
  },
  {
    "id": "a175",
    "kind": "beat",
    "minAge": 260,
    "maxAge": 760,
    "shape": "coin",
    "origin": null,
    "root": null,
    "title": "你收了一筆看病的錢又退回去一半",
    "text": "你發現自己看錯了症。退了一半，對方沒有再罵。",
    "choices": []
  },
  {
    "id": "a176",
    "kind": "beat",
    "minAge": 280,
    "maxAge": 820,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "你在很長的壽元裡仍然會做夢",
    "text": "夢沒有境界。你夢到自己在趕集，醒來洞是涼的。",
    "choices": []
  },
  {
    "id": "a177",
    "kind": "beat",
    "minAge": 300,
    "maxAge": 900,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你把今日和昨日分開記",
    "text": "日子太像。你在牆上畫一道，才知道自己又過了一天。",
    "choices": []
  },
  {
    "id": "a178",
    "kind": "choice",
    "minAge": 270,
    "maxAge": 860,
    "shape": "ask",
    "origin": null,
    "root": null,
    "title": "一個門派請你去當供奉，只要你的名字",
    "text": "他們不需要你出手。他們要把你的名字寫在門上。",
    "choices": [
      {
        "label": "不去",
        "line": "你拒絕。名字沒有掛上去，你繼續過自己的日子。"
      },
      {
        "label": "去坐一天",
        "line": "你去坐了。他們掛了名字，你當天就回來，沒有再去。"
      }
    ]
  },
  {
    "id": "a179",
    "kind": "beat",
    "minAge": 320,
    "maxAge": 980,
    "shape": "coin",
    "origin": null,
    "root": null,
    "title": "你買了一口好棺又覺得早",
    "text": "賣棺的人沒有笑你。棺寄在他家，你還活著。",
    "choices": []
  },
  {
    "id": "a180",
    "kind": "beat",
    "minAge": 340,
    "maxAge": 1100,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "你把後悔說成一句很短的話",
    "text": "你說「那一次該跑」。沒有下文。說完你去喝水。",
    "choices": []
  },
  {
    "id": "a181",
    "kind": "beat",
    "minAge": 360,
    "maxAge": 1200,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你還肯把窗戶紙糊上",
    "text": "洞不是家，你還是把漏風的地方補了。人在，就會做這種事。",
    "choices": []
  },
  {
    "id": "a182",
    "kind": "choice",
    "minAge": 330,
    "maxAge": 1080,
    "shape": "help",
    "origin": null,
    "root": null,
    "title": "遠路來的人說他是你救過的人的後人",
    "text": "他拿出一塊舊布，布角的針腳你認得。",
    "choices": [
      {
        "label": "認",
        "line": "你認了。你給他一頓飯，沒有給他修行。"
      },
      {
        "label": "不認",
        "line": "你說針腳誰都會。他收起布，沒有鬧。"
      }
    ]
  },
  {
    "id": "a183",
    "kind": "beat",
    "minAge": 400,
    "maxAge": 1400,
    "shape": "coin",
    "origin": null,
    "root": null,
    "title": "你用靈石請人幫你磨一年的藥",
    "text": "你的手不穩了。藥還是要吃，你把這件事交出去。",
    "choices": []
  },
  {
    "id": "a184",
    "kind": "beat",
    "minAge": 460,
    "maxAge": 1600,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "你在安靜裡聽見自己的心跳",
    "text": "沒有走火。你只是忽然聽見它，然後它繼續跳。",
    "choices": []
  },
  {
    "id": "a185",
    "kind": "beat",
    "minAge": 520,
    "maxAge": 1800,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你把洞口的草拔掉，好讓光進來",
    "text": "你還想看見白天。這和境界無關。",
    "choices": []
  },
  {
    "id": "a186",
    "kind": "choice",
    "minAge": 480,
    "maxAge": 1700,
    "shape": "risk",
    "origin": null,
    "root": null,
    "title": "有人說可以把你的壽元分一半給他",
    "text": "他病得很重，開口很直。你聽得懂他在求什麼。",
    "choices": [
      {
        "label": "不分",
        "line": "你拒絕。他沒有罵你。你當天把洞門關上。"
      },
      {
        "label": "分一點靈石代替",
        "line": "你沒有分壽元。你給了靈石讓他去買藥，人後來沒有再來。"
      }
    ]
  },
  {
    "id": "a187",
    "kind": "beat",
    "minAge": 600,
    "maxAge": 2000,
    "shape": "coin",
    "origin": null,
    "root": null,
    "title": "你檢查埋著的靈石還在不在",
    "text": "還在。你沒有全部挖出來，只確認自己沒有記錯地方。",
    "choices": []
  },
  {
    "id": "a188",
    "kind": "beat",
    "minAge": 700,
    "maxAge": 2400,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "你想起自己零歲時沒有人問你靈根",
    "text": "那時候你只是一個會哭的人。你覺得這樣開始並沒有錯。",
    "choices": []
  },
  {
    "id": "a189",
    "kind": "beat",
    "minAge": 800,
    "maxAge": 2600,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你還活著，今天的事只有一件",
    "text": "你把藥吃了。沒有第二件事。這也算過完了一年。",
    "choices": []
  },
  {
    "id": "a190",
    "kind": "choice",
    "minAge": 640,
    "maxAge": 2200,
    "shape": "cave",
    "origin": null,
    "root": null,
    "title": "後來的人在你洞外建了屋",
    "text": "屋子擋住光。建屋的人說不知道裡面住著誰。",
    "choices": [
      {
        "label": "請他們把窗讓出來",
        "line": "你出去說話。他們改了窗，光回來了。"
      },
      {
        "label": "你往更裡搬",
        "line": "你不爭光。你把鋪蓋挪深，耳朵清靜了。"
      }
    ]
  },
  {
    "id": "a191",
    "kind": "beat",
    "minAge": 900,
    "maxAge": 3000,
    "shape": "coin",
    "origin": null,
    "root": null,
    "title": "你給自己留了一筆喪事的錢",
    "text": "放在一個你信任的人那裡。你還沒有用到。",
    "choices": []
  },
  {
    "id": "a192",
    "kind": "beat",
    "minAge": 1100,
    "maxAge": 3200,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "你不再跟人比誰走得遠",
    "text": "比無可比。你只在意今天的氣順不順。",
    "choices": []
  },
  {
    "id": "a193",
    "kind": "beat",
    "minAge": 1400,
    "maxAge": 3400,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你在很長的壽元盡頭仍然會口渴",
    "text": "你喝水。水是涼的。你把杯子放下，人還在。",
    "choices": []
  },
  {
    "id": "a194",
    "kind": "choice",
    "minAge": 24,
    "maxAge": 44,
    "shape": "road",
    "origin": "orphan",
    "root": null,
    "title": "有人說孤兒的東西拿走也不算搶",
    "text": "三個人圍住你的包袱，語氣像在講規矩。",
    "choices": [
      {
        "label": "立刻跑路",
        "line": "你抱著包袱從人縫裡擠出去。肩膀被推了一下，東西還在。"
      },
      {
        "label": "上前爭奪",
        "line": "你罵回去。包袱被撕開，你鼻血流了，人還站著。"
      }
    ]
  },
  {
    "id": "a195",
    "kind": "choice",
    "minAge": 30,
    "maxAge": 55,
    "shape": "road",
    "origin": "clan",
    "root": null,
    "title": "族裡的管事要你把旁系的份子交上去",
    "text": "他說這是規矩。數字比你這個月能活的還多。",
    "choices": [
      {
        "label": "立刻跑路",
        "line": "你離開族地。份子沒交，名分也薄了，人還在。"
      },
      {
        "label": "上前爭奪",
        "line": "你當眾頂他。份子沒有交成，你被停了一季的月例。"
      }
    ]
  },
  {
    "id": "a196",
    "kind": "choice",
    "minAge": 16,
    "maxAge": 34,
    "shape": "help",
    "origin": "village",
    "root": null,
    "title": "村裡失火，有人還在屋裡喊",
    "text": "火不大，門卻卡住。你在門外聽得見人。",
    "choices": [
      {
        "label": "去頂門",
        "line": "你把門頂開。人出來了，你的眉毛焦了一點。"
      },
      {
        "label": "去喊人",
        "line": "你跑去喊。等人到了，屋裡的人已經自己爬出來。"
      }
    ]
  },
  {
    "id": "a197",
    "kind": "choice",
    "minAge": 26,
    "maxAge": 48,
    "shape": "ask",
    "origin": "remnant",
    "root": null,
    "title": "殘憶叫你走一條這一生沒有的橋",
    "text": "你記得橋會塌，這一生的人卻說那橋是好的。",
    "choices": [
      {
        "label": "信這一生",
        "line": "你走大家走的路。橋沒有塌，殘憶安靜了一天。"
      },
      {
        "label": "信殘憶",
        "line": "你繞路。多走了兩個時辰，人是安全的，沒有人懂你為什麼繞。"
      }
    ]
  },
  {
    "id": "a198",
    "kind": "choice",
    "minAge": 34,
    "maxAge": 60,
    "shape": "trade",
    "origin": null,
    "root": "wei",
    "title": "有人賣「專門給慢根的丹」",
    "text": "瓶子上沒有舖號。他說吃了就能追上別人。",
    "choices": [
      {
        "label": "不買",
        "line": "你沒有買。你的慢還在，口袋也還在。"
      },
      {
        "label": "買來試",
        "line": "你買了。一天裡氣血發燙，根沒有變，錢沒了。"
      }
    ]
  },
  {
    "id": "a199",
    "kind": "choice",
    "minAge": 28,
    "maxAge": 52,
    "shape": "page",
    "origin": null,
    "root": "bian",
    "title": "你撿到一本寫給變異靈根的殘冊",
    "text": "冊子警告不要用通行口訣。你正被通行口訣弄得不舒服。",
    "choices": [
      {
        "label": "照冊子換路",
        "line": "你停了通行的。三天後胸口的悶輕了。"
      },
      {
        "label": "繼續照大家的",
        "line": "你沒有換。悶還在，你至少和別人走得一樣。"
      }
    ]
  },
  {
    "id": "a200",
    "kind": "choice",
    "minAge": 40,
    "maxAge": 70,
    "shape": "sect",
    "origin": null,
    "root": "tian",
    "title": "大派的人來問你願不願意掛名",
    "text": "他們看中的是根，不是你這個人。掛名有月例，人得聽調。",
    "choices": [
      {
        "label": "不掛",
        "line": "你拒絕。月例沒有，沒有人來叫你去送死。"
      },
      {
        "label": "掛名領月例",
        "line": "你掛了。月例是真的，第一個月就有人叫你去站崗。"
      }
    ]
  },
  {
    "id": "a201",
    "kind": "choice",
    "minAge": 48,
    "maxAge": 84,
    "shape": "owe",
    "origin": "orphan",
    "root": null,
    "title": "當年給你一碗水的人來討一份回報",
    "text": "他老了。他沒有要很多，只要你在他病的時候留一夜。",
    "choices": [
      {
        "label": "留下",
        "line": "你留了。水的事你還記得，這一夜算你還了。"
      },
      {
        "label": "給靈石代替",
        "line": "你留下靈石就走。他收了，沒有強留你。"
      }
    ]
  },
  {
    "id": "a202",
    "kind": "choice",
    "minAge": 22,
    "maxAge": 40,
    "shape": "cave",
    "origin": "clan",
    "root": null,
    "title": "族裡分洞，把最差的一間寫成你的",
    "text": "洞裡有水。管事說旁系不該挑。",
    "choices": [
      {
        "label": "住下",
        "line": "你住了。水你自己引走，洞慢慢能用。"
      },
      {
        "label": "不要",
        "line": "你放棄這間。族裡說你不識抬舉，你去外面另找。"
      }
    ]
  },
  {
    "id": "a203",
    "kind": "beat",
    "minAge": 15,
    "maxAge": 30,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你把被人叫錯的姓訂正了一次",
    "text": "對方改口了。你發現自己在意這個，然後繼續走路。",
    "choices": []
  },
  {
    "id": "a204",
    "kind": "beat",
    "minAge": 45,
    "maxAge": 80,
    "shape": "coin",
    "origin": null,
    "root": null,
    "title": "你賣了一次手藝，沒有賣面子",
    "text": "價錢寫在前頭。做成了，沒有人欠你一句好話，你也不需要。",
    "choices": []
  },
  {
    "id": "a205",
    "kind": "beat",
    "minAge": 85,
    "maxAge": 160,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "你允許自己這一天什麼都不修",
    "text": "你睡覺、吃飯、看天。修為沒有掉一截，人輕了一點。",
    "choices": []
  },
  {
    "id": "a206",
    "kind": "choice",
    "minAge": 95,
    "maxAge": 190,
    "shape": "road",
    "origin": null,
    "root": null,
    "title": "有人在你門前擺靈位，寫的不是你",
    "text": "靈位上的名字你不認識。擺的人說借你的門口擋災。",
    "choices": [
      {
        "label": "立刻跑路",
        "line": "你沒有理論。你出了門，等他們撤了再回來。"
      },
      {
        "label": "上前爭奪",
        "line": "你請他們拿走。爭執裡靈位倒了，你幫著扶起來，人還是請走了。"
      }
    ]
  },
  {
    "id": "a207",
    "kind": "beat",
    "minAge": 130,
    "maxAge": 300,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你把一年裡值得記得的事收成兩句",
    "text": "一句是人還在。另一句是你沒有欠新的債。",
    "choices": []
  },
  {
    "id": "a208",
    "kind": "beat",
    "minAge": 210,
    "maxAge": 500,
    "shape": "coin",
    "origin": null,
    "root": null,
    "title": "你請人把洞裡的濕氣治了",
    "text": "不是用功法。是用石灰和一扇新門。你付了錢。",
    "choices": []
  },
  {
    "id": "a209",
    "kind": "beat",
    "minAge": 380,
    "maxAge": 900,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "你跟一個同樣很老的人下棋下到睡著",
    "text": "沒有人贏。你們都醒來，棋還在，人還在。",
    "choices": []
  },
  {
    "id": "a210",
    "kind": "choice",
    "minAge": 55,
    "maxAge": 90,
    "shape": "help",
    "origin": null,
    "root": null,
    "title": "你看見有人把病患丟在你熟悉的路口",
    "text": "病人還有氣。丟他的人已經走遠。",
    "choices": [
      {
        "label": "拖到藥鋪",
        "line": "你把他拖去。藥鋪收了，你的腰酸了三天。"
      },
      {
        "label": "站著等人",
        "line": "你喊來巡夜的。病人被抬走，你沒有再跟。"
      }
    ]
  },
  {
    "id": "a211",
    "kind": "beat",
    "minAge": 0,
    "maxAge": 4,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "你出過一場疹",
    "text": "疹子退了之後你不怕光。家裡說這孩子算是留住了。",
    "choices": []
  },
  {
    "id": "a212",
    "kind": "beat",
    "minAge": 2,
    "maxAge": 8,
    "shape": "coin",
    "origin": null,
    "root": null,
    "title": "有人把你的小鞋補好放在門口",
    "text": "沒有留名。你穿上，鞋不再進水。",
    "choices": []
  },
  {
    "id": "a213",
    "kind": "beat",
    "minAge": 14,
    "maxAge": 24,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你第一次把怒氣忍到人走了才發作",
    "text": "你沒有當街罵。回去砸了一個自己的碗，然後把碎片掃掉。",
    "choices": []
  },
  {
    "id": "a214",
    "kind": "beat",
    "minAge": 88,
    "maxAge": 170,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你把年輕時的債據翻出來燒了",
    "text": "債早還清。燒的是那張紙，不是再賴一次。",
    "choices": []
  },
  {
    "id": "a215",
    "kind": "choice",
    "minAge": 105,
    "maxAge": 240,
    "shape": "ask",
    "origin": null,
    "root": null,
    "title": "有人請你為一場決鬥做見證",
    "text": "他們不要你出手。只要你在場，以後有人問得起來。",
    "choices": [
      {
        "label": "做見證",
        "line": "你站到完。沒有人死，你在紙上按了手印。"
      },
      {
        "label": "拒絕",
        "line": "你說自己不看這個。決鬥另找了人。"
      }
    ]
  },
  {
    "id": "a216",
    "kind": "beat",
    "minAge": 170,
    "maxAge": 420,
    "shape": "coin",
    "origin": null,
    "root": null,
    "title": "你把一處泉眼讓給下面的村子",
    "text": "你不是用不到水。你是發現他們更缺。你改接雨水。",
    "choices": []
  },
  {
    "id": "a217",
    "kind": "beat",
    "minAge": 250,
    "maxAge": 640,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "你在長壽裡學會把話說短",
    "text": "你不再解釋一生。問你的人得到一句，就夠用了。",
    "choices": []
  },
  {
    "id": "a218",
    "kind": "choice",
    "minAge": 300,
    "maxAge": 800,
    "shape": "trade",
    "origin": null,
    "root": null,
    "title": "有人要用一門秘法換你的安靜",
    "text": "他說秘法能讓你再進一步。條件是你得收他住進洞的外室。",
    "choices": [
      {
        "label": "不換",
        "line": "你留著安靜。他走了，進步的事你沒有再聽。"
      },
      {
        "label": "讓他住十天",
        "line": "你讓了十天。秘法你聽了，用不上，第十天你請他走。"
      }
    ]
  },
  {
    "id": "a219",
    "kind": "beat",
    "minAge": 420,
    "maxAge": 1200,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你仍然會因為一封信心情變一下",
    "text": "信很短。你讀完，把今天的藥照舊吃了。",
    "choices": []
  },
  {
    "id": "a220",
    "kind": "beat",
    "minAge": 6,
    "maxAge": 15,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "你被罰跪，後來沒有再跪",
    "text": "你跪完。你記得膝蓋的痛，也記得自己決定下次先把事情說清。",
    "choices": []
  },
  {
    "id": "a221",
    "kind": "beat",
    "minAge": 51,
    "maxAge": 86,
    "shape": "coin",
    "origin": null,
    "root": null,
    "title": "你找回被偷的鋤頭",
    "text": "不是用修為。你在當鋪認出來，把當票買了回來。",
    "choices": []
  },
  {
    "id": "a222",
    "kind": "beat",
    "minAge": 93,
    "maxAge": 180,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你給自己做了一雙合腳的鞋",
    "text": "買的鞋總是不合。你做完，走路不再磨腳。",
    "choices": []
  },
  {
    "id": "a223",
    "kind": "choice",
    "minAge": 125,
    "maxAge": 260,
    "shape": "page",
    "origin": null,
    "root": null,
    "title": "你年輕時抄的殘頁被老鼠啃了",
    "text": "還剩半頁。你能重抄，也能當它丟了。",
    "choices": [
      {
        "label": "重抄",
        "line": "你憑記憶補上。有一句你不確定，你在旁邊標了問號。"
      },
      {
        "label": "丟了",
        "line": "你把碎紙掃走。那條路你決定不再靠紙。"
      }
    ]
  },
  {
    "id": "a224",
    "kind": "beat",
    "minAge": 155,
    "maxAge": 360,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "你把洞裡多餘的位子讓出來給受傷的人",
    "text": "他住了三天就走。你的位子還在，血你洗掉了。",
    "choices": []
  },
  {
    "id": "a225",
    "kind": "beat",
    "minAge": 205,
    "maxAge": 480,
    "shape": "coin",
    "origin": null,
    "root": null,
    "title": "你賣了一次忠告，價錢事前說好",
    "text": "你告訴他不要走那條溪。他付了你說好的數目，溪邊後來果然出事。",
    "choices": []
  },
  {
    "id": "a226",
    "kind": "choice",
    "minAge": 175,
    "maxAge": 400,
    "shape": "sect",
    "origin": null,
    "root": null,
    "title": "舊派的人來尋你，說名冊上還有你",
    "text": "你早就不掃他們的地了。名冊卻沒有把你劃掉。",
    "choices": [
      {
        "label": "請他們劃掉",
        "line": "你看著他們劃掉。你不是他們的人，這一下算數。"
      },
      {
        "label": "留著不管",
        "line": "你說隨便。名冊還在，沒有人再來叫你。"
      }
    ]
  },
  {
    "id": "a227",
    "kind": "beat",
    "minAge": 275,
    "maxAge": 700,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你在雨天把洞外的溝清過",
    "text": "水不倒灌。你的鞋是乾的。這就是今天的事。",
    "choices": []
  },
  {
    "id": "a228",
    "kind": "beat",
    "minAge": 355,
    "maxAge": 980,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "你原諒一個沒有來道歉的人",
    "text": "不是說給他聽。是你自己把那件事從每天的念頭裡拿掉。",
    "choices": []
  },
  {
    "id": "a229",
    "kind": "choice",
    "minAge": 225,
    "maxAge": 560,
    "shape": "risk",
    "origin": null,
    "root": null,
    "title": "你的丹田忽然發涼",
    "text": "涼不是進境。你可以把今天的功停了，也可以硬坐完。",
    "choices": [
      {
        "label": "停",
        "line": "你停了。涼意退了，人沒有出事。"
      },
      {
        "label": "坐完",
        "line": "你坐完。涼意變成痛，你躺了半天，境界沒有動。"
      }
    ]
  },
  {
    "id": "a230",
    "kind": "beat",
    "minAge": 455,
    "maxAge": 1400,
    "shape": "coin",
    "origin": null,
    "root": null,
    "title": "你請附近的人在你倒下時先確認你還有沒有氣",
    "text": "你把這句話說在前頭。他們答應了，沒有當成笑話。",
    "choices": []
  },
  {
    "id": "a231",
    "kind": "beat",
    "minAge": 515,
    "maxAge": 1600,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你還能自己把碗洗了",
    "text": "壽元很長。碗還是要洗。你洗完，手是乾的。",
    "choices": []
  },
  {
    "id": "a232",
    "kind": "choice",
    "minAge": 75,
    "maxAge": 130,
    "shape": "help",
    "origin": null,
    "root": null,
    "title": "一個被你拒絕過的人又來求救",
    "text": "上次你沒有幫他。這次他帶著孩子，事情比上次更急。",
    "choices": [
      {
        "label": "這次幫",
        "line": "你幫了。你沒有解釋上次，他把孩子抱走時鞠了躬。"
      },
      {
        "label": "再拒絕",
        "line": "你仍拒絕。他沒有罵，你看著他們走遠。"
      }
    ]
  },
  {
    "id": "a233",
    "kind": "beat",
    "minAge": 135,
    "maxAge": 280,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "你把一處錯路用石頭標出來",
    "text": "以後的人不必再踩進去。你沒有留名。",
    "choices": []
  },
  {
    "id": "a234",
    "kind": "beat",
    "minAge": 185,
    "maxAge": 440,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你在長壽裡第一次感到無聊",
    "text": "不是走火。是日子太長，你出去走了一圈，無聊就散了。",
    "choices": []
  },
  {
    "id": "a235",
    "kind": "beat",
    "minAge": 245,
    "maxAge": 600,
    "shape": "coin",
    "origin": null,
    "root": null,
    "title": "你把不用的兵器熔了做農具",
    "text": "你已經不靠那個吃飯。農具第二年還在用。",
    "choices": []
  },
  {
    "id": "a236",
    "kind": "choice",
    "minAge": 265,
    "maxAge": 640,
    "shape": "ask",
    "origin": null,
    "root": null,
    "title": "地方上請你為一場瘟疫說一句",
    "text": "他們想要一句「不會傳」。你看過病人，你沒有把握。",
    "choices": [
      {
        "label": "照實說",
        "line": "你說會傳，要隔開。他們照做了，罵你的人後來少了。"
      },
      {
        "label": "不開口",
        "line": "你說自己不是郎中。他們另找人，那個人說了不會傳。"
      }
    ]
  },
  {
    "id": "a237",
    "kind": "beat",
    "minAge": 315,
    "maxAge": 860,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "你把洞裡的燈芯剪短省油",
    "text": "你還在計較這些，說明你還打算活過這個月。",
    "choices": []
  },
  {
    "id": "a238",
    "kind": "beat",
    "minAge": 395,
    "maxAge": 1100,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你聽得見洞外有人唱歌",
    "text": "你沒有出去。歌聽完，你的日子和昨天一樣，只是不那麼靜。",
    "choices": []
  },
  {
    "id": "a239",
    "kind": "beat",
    "minAge": 12,
    "maxAge": 22,
    "shape": "coin",
    "origin": null,
    "root": null,
    "title": "你把撿來的布洗了做成包袱",
    "text": "布不是新的。包袱能用，你把自己的東西第一次裝整齊。",
    "choices": []
  },
  {
    "id": "a240",
    "kind": "beat",
    "minAge": 58,
    "maxAge": 100,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "你在別人的喜宴上坐到自己該走的時候",
    "text": "你沒有多喝。你離開時主人還在忙，你不需要被送。",
    "choices": []
  },
  {
    "id": "a241",
    "kind": "beat",
    "minAge": 118,
    "maxAge": 240,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你把一年的藥方背下來",
    "text": "不是為了炫耀。是藥鋪太遠，你得自己記得劑量。",
    "choices": []
  },
  {
    "id": "a242",
    "kind": "choice",
    "minAge": 145,
    "maxAge": 320,
    "shape": "road",
    "origin": null,
    "root": null,
    "title": "勘測的人要把你的泉眼算進他們的圖",
    "text": "圖一旦畫上，水就不全是你的。他們的筆已經沾了墨。",
    "choices": [
      {
        "label": "立刻跑路",
        "line": "你沒有搶筆。你連夜把水引到另一處，圖上的眼後來是乾的。"
      },
      {
        "label": "上前爭奪",
        "line": "你按住他們的圖。爭執之後圖撕了，你也被記了一筆阻撓。"
      }
    ]
  },
  {
    "id": "a243",
    "kind": "beat",
    "minAge": 195,
    "maxAge": 460,
    "shape": "coin",
    "origin": null,
    "root": null,
    "title": "你出錢修了一段誰都要走的石階",
    "text": "石階不寫你的名字。你自己走的時候不再摔。",
    "choices": []
  },
  {
    "id": "a244",
    "kind": "beat",
    "minAge": 235,
    "maxAge": 580,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "你把舊傷在陰天會響這件事告訴了郎中",
    "text": "郎中說養。你聽了，沒有再找人賭它會好。",
    "choices": []
  },
  {
    "id": "a245",
    "kind": "beat",
    "minAge": 295,
    "maxAge": 760,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你還會因為春天開門",
    "text": "洞裡沒有春。你還是在某一天把封著的門開一條縫。",
    "choices": []
  },
  {
    "id": "a246",
    "kind": "choice",
    "minAge": 165,
    "maxAge": 380,
    "shape": "trade",
    "origin": null,
    "root": null,
    "title": "有人賣一種能讓人忘記舊傷的香",
    "text": "香很貴。你聞過樣品，頭輕了一下，傷還在。",
    "choices": [
      {
        "label": "不買",
        "line": "你留著舊傷和清醒。香沒有進門。"
      },
      {
        "label": "買一盒",
        "line": "你買了。睡得很沉，醒來傷還在，錢少了一截。"
      }
    ]
  },
  {
    "id": "a247",
    "kind": "beat",
    "minAge": 215,
    "maxAge": 520,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "你寫下自己希望怎麼被找到",
    "text": "若你倒在路上，你希望被人確認過再下葬。你把這張紙放在衣袋裡。",
    "choices": []
  },
  {
    "id": "a248",
    "kind": "beat",
    "minAge": 255,
    "maxAge": 640,
    "shape": "coin",
    "origin": null,
    "root": null,
    "title": "你把多餘的被子送給過冬的人",
    "text": "你還有一條。送出去的那天，洞裡並沒有更冷。",
    "choices": []
  },
  {
    "id": "a249",
    "kind": "beat",
    "minAge": 335,
    "maxAge": 920,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你在極長的日子裡保住了自己的名字",
    "text": "沒有人把你叫成別的誰。你應一聲，事情就繼續。",
    "choices": []
  },
  {
    "id": "a250",
    "kind": "choice",
    "minAge": 205,
    "maxAge": 480,
    "shape": "help",
    "origin": null,
    "root": null,
    "title": "礦難後有人在洞口喊你的姓",
    "text": "不是你的礦。他們只是知道你懂怎麼把人拖出來。",
    "choices": [
      {
        "label": "去",
        "line": "你去了。你拖出一個人，自己的手磨破了。"
      },
      {
        "label": "不去",
        "line": "你說自己老了。後來聽說有別的人去了。"
      }
    ]
  },
  {
    "id": "a251",
    "kind": "beat",
    "minAge": 375,
    "maxAge": 1080,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "你把一生裡跑掉的那幾次想了一遍",
    "text": "跑掉的那些，人還在。你沒有覺得丟臉。",
    "choices": []
  },
  {
    "id": "a252",
    "kind": "beat",
    "minAge": 435,
    "maxAge": 1280,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你仍然把碗裡的飯吃完",
    "text": "沒有人監督。你只是不浪費，這件事從很小就這樣。",
    "choices": []
  },
  {
    "id": "a253",
    "kind": "choice",
    "minAge": 285,
    "maxAge": 720,
    "shape": "page",
    "origin": null,
    "root": null,
    "title": "你發現自己年輕時抄錯了一句口訣",
    "text": "你照著錯的活了很久。現在你看出錯在哪。",
    "choices": [
      {
        "label": "改過來",
        "line": "你改了。行功的感覺變了一點，人沒有垮。"
      },
      {
        "label": "留著錯的",
        "line": "你沒有改。你既然活到這裡，這一句就先這樣。"
      }
    ]
  },
  {
    "id": "a254",
    "kind": "beat",
    "minAge": 405,
    "maxAge": 1200,
    "shape": "coin",
    "origin": null,
    "root": null,
    "title": "你付了錢，讓人在你死後把洞封好",
    "text": "你不想洞變成別人的陷阱。錢付了，人還活著。",
    "choices": []
  },
  {
    "id": "a255",
    "kind": "beat",
    "minAge": 485,
    "maxAge": 1500,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "你對一個陌生人說了謝謝，對方愣住",
    "text": "你謝他讓路。他不習慣。你還是說了。",
    "choices": []
  },
  {
    "id": "a256",
    "kind": "beat",
    "minAge": 545,
    "maxAge": 1700,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你在壽元的深處仍然會笑一下",
    "text": "不是悟。是你看見一隻鳥把洞口的草弄歪了。",
    "choices": []
  },
  {
    "id": "a257",
    "kind": "choice",
    "minAge": 365,
    "maxAge": 1000,
    "shape": "cave",
    "origin": null,
    "root": null,
    "title": "雨水把你洞口的石階沖垮",
    "text": "階是你修的。下面的人說他們可以出錢重修，但要在階上刻他們的名。",
    "choices": [
      {
        "label": "自己重修",
        "line": "你自己補。階上沒有別人的名字，腳下是穩的。"
      },
      {
        "label": "讓他們刻",
        "line": "你讓了。階很快修好，你每次下去都看見那兩個字。"
      }
    ]
  },
  {
    "id": "a258",
    "kind": "beat",
    "minAge": 625,
    "maxAge": 2000,
    "shape": "coin",
    "origin": null,
    "root": null,
    "title": "你把今年用不到的炭分給洞外的人",
    "text": "你算過自己的冬天。多的那些，你不堆著。",
    "choices": []
  },
  {
    "id": "a259",
    "kind": "beat",
    "minAge": 705,
    "maxAge": 2200,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "你記得自己是從零歲長起來的",
    "text": "不是從十六歲才開始做人。你把這一點想得很清楚。",
    "choices": []
  },
  {
    "id": "a260",
    "kind": "beat",
    "minAge": 805,
    "maxAge": 2600,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你還把今天叫做今天",
    "text": "日子再長，你也不把一百年說成一個早晨。",
    "choices": []
  },
  {
    "id": "a261",
    "kind": "choice",
    "minAge": 455,
    "maxAge": 1400,
    "shape": "risk",
    "origin": null,
    "root": null,
    "title": "有人請你把一生的氣分一點給他治病",
    "text": "他跪得很直。你看得出這不是搶，是求。",
    "choices": [
      {
        "label": "拒絕",
        "line": "你拒絕。他起來走了。你的氣還是你的。"
      },
      {
        "label": "給藥不給氣",
        "line": "你給了他藥和路費。氣沒有分，他沒有再跪。"
      }
    ]
  },
  {
    "id": "a262",
    "kind": "beat",
    "minAge": 905,
    "maxAge": 2800,
    "shape": "coin",
    "origin": null,
    "root": null,
    "title": "你檢查自己還認不認得出靈石的成色",
    "text": "認得出。手還穩。你把這件事當成今天的練習。",
    "choices": []
  },
  {
    "id": "a263",
    "kind": "beat",
    "minAge": 1005,
    "maxAge": 3000,
    "shape": "heart",
    "origin": null,
    "root": null,
    "title": "你沒有把長壽過成一場空轉",
    "text": "你今天修了門、吃了飯、跟一個人說了話。這不是空的。",
    "choices": []
  },
  {
    "id": "a264",
    "kind": "beat",
    "minAge": 1205,
    "maxAge": 3300,
    "shape": "flavor",
    "origin": null,
    "root": null,
    "title": "你在這一輪的盡頭附近仍然把鞋子放正",
    "text": "你還在把自己的東西放好。人在這裡。",
    "choices": []
  }
];
