"use client";

import { Button } from "@/components/ui/button";
import { GIFT_COST, spendKarma, useKarma } from "@/lib/storage";
import type { KarmaGift, ThreadKind } from "@/lib/world";

function threadLabel(kind: ThreadKind): string {
  if (kind === "kin") return "前世同門";
  if (kind === "debt") return "債主";
  if (kind === "page") return "功法殘頁";
  if (kind === "heir") return "救過的人的後代";
  if (kind === "cave") return "被佔的洞府";
  return "死法留下的舊傷";
}

const OFFERS: { id: KarmaGift; label: string }[] = [
  { id: "root", label: "花 1 點，靈根往上偏一檔" },
  { id: "origin", label: "花 1 點，出身偏到家族旁系" },
  { id: "ease", label: "花 2 點，下一世修為容易突破" },
  { id: "stones", label: "花 1 點，下一世起步多一筆靈石" },
  { id: "span", label: "花 2 點，下一世壽元寬一截" },
];

export function KarmaSpend() {
  const karma = useKarma();
  if (!karma) {
    return <p className="text-sm text-muted-foreground">天道點數還在翻。</p>;
  }
  return (
    <div className="flex min-w-0 flex-col gap-3">
      <p className="text-sm leading-7">
        天道點數 <span className="num">{karma.points}</span>
        。花得起的都能買，只作用在下一世。這一世開始之後，沒花掉的就清掉，不往後疊。
      </p>
      {karma.buried ? (
        <p className="text-sm leading-7 text-muted-foreground">
          土裡還留著{karma.buried.by ? `${karma.buried.by}埋的` : "上一世埋的"}
          {karma.buried.item}，在{karma.buried.region}一帶。下一世有機會挖到，也可能沒有。
        </p>
      ) : null}
      {karma.foe ? (
        <p className="text-sm leading-7 text-muted-foreground">
          下一世會遇上{karma.foe.name}。{karma.foe.from}那一世爭過，對方還活著。這一遇之後就清掉。
        </p>
      ) : null}
      {karma.thread ? (
        <p className="text-sm leading-7 text-muted-foreground">
          下一世還帶著一筆別的舊帳：{threadLabel(karma.thread.kind)}，跟{karma.thread.name}有關。碰見之後就清，不往後疊。
        </p>
      ) : null}
      {karma.haunt ? (
        <p className="text-sm leading-7 text-muted-foreground">
          下一世早段，腦子裡會有{karma.haunt.name}開口。聽可以得到一截靈石，後面還有一次奪舍。壓下去就沒有。
        </p>
      ) : null}
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap">
        {OFFERS.map((offer) => {
          const owned = karma.gifts.includes(offer.id);
          const short = karma.points < GIFT_COST[offer.id];
          return (
            <Button
              key={offer.id}
              variant="outline"
              className="h-auto w-full whitespace-normal px-3 py-2 text-left sm:w-auto"
              disabled={owned || short}
              onClick={() => spendKarma(offer.id)}
            >
              {owned ? `已設下 · ${offer.label}` : offer.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
