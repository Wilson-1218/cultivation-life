"use client";

import { Button } from "@/components/ui/button";
import { spendKarma, useKarma } from "@/lib/storage";

export function KarmaSpend() {
  const karma = useKarma();
  if (!karma) {
    return <p className="text-sm text-muted-foreground">天道點數還在翻。</p>;
  }
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm leading-7">
        天道點數 <span className="num">{karma.points}</span>
        。只夠下一世用。這一世開始之後，沒花掉的就清掉，不往後疊。
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
      {karma.haunt ? (
        <p className="text-sm leading-7 text-muted-foreground">
          下一世早段，腦子裡會有{karma.haunt.name}開口。聽可以得到一截靈石，後面還有一次奪舍。壓下去就沒有。
        </p>
      ) : null}
      {karma.boost ? (
        <p className="text-sm leading-7">
          下一世會用上：{karma.boost === "root" ? "靈根往上偏一檔。" : "出身落在修仙家族旁系。"}
        </p>
      ) : (
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Button
            variant="outline"
            className="h-10"
            disabled={karma.points < 1}
            onClick={() => spendKarma("root")}
          >
            花 1 點，靈根往上偏一檔
          </Button>
          <Button
            variant="outline"
            className="h-10"
            disabled={karma.points < 1}
            onClick={() => spendKarma("origin")}
          >
            花 1 點，出身偏到家族旁系
          </Button>
        </div>
      )}
    </div>
  );
}
