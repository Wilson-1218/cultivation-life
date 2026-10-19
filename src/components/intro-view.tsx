"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { clearPast, usePastLives } from "@/lib/storage";
import { CENSUS_HITS, CENSUS_META } from "@/lib/census-data";
import {
  POPULATION,
  REALMS,
  ROOT_ORDER,
  ROOTS,
  censusTotal,
  formatCount,
  formatPeople,
  rootPopulation,
  type RealmId,
} from "@/lib/world";
import { KarmaSpend } from "@/components/karma-spend";
import { Mark, WithMark, type MarkName } from "@/components/marks";

const ENTRY_RATE = 2.6;
const DEATH_RATE = 2.3;

export function IntroView({ onBegin }: { onBegin: () => void }) {
  const past = usePastLives();
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <p className="text-sm tracking-[0.22em] text-[#9c2f2a]">80億人修仙</p>
      <h1 className="mt-6 max-w-xl text-lg font-normal leading-8 text-[#3a332c]">八十億分之一</h1>
      <p className="mt-4 max-w-xl text-lg font-normal leading-8 text-[#3a332c]">
        當世人人都踏入了修途。靈氣、名額、機緣被八十億人分薄之後，你落在哪一層，多半在入道那一刻就定了。
      </p>
      <Counters />

      <section className="mt-10 grid gap-8 border-t border-border pt-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(16rem,0.9fr)]">
        <div>
          <h2 className="flex items-start gap-2 text-xl font-semibold">
            <Mark name="root" className="mt-1" />
            <span>如果你在這一息入道</span>
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-7 text-muted-foreground">
            靈根先落下。偽靈根最慢，人也最多。天靈根與變異靈根聽起來稀少，乘上八十億，仍是一整片要搶名額的人。
          </p>
          <ul className="mt-5 flex flex-col gap-3">
            {ROOT_ORDER.map((id) => {
              const root = ROOTS[id];
              return (
                <li key={id} className="grid grid-cols-[5.5rem_minmax(0,1fr)_4.5rem] items-center gap-3 text-sm">
                  <span>{root.name}</span>
                  <span className="h-2 bg-[#e4d8c4]">
                    <span
                      className="block h-full bg-[#1c1612]"
                      style={{ width: `${Math.max(root.share * 100, 0.6)}%` }}
                    />
                  </span>
                  <span className="num text-right text-muted-foreground">
                    {(root.share * 100).toFixed(1)}%
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            約{formatPeople(Math.round(ROOTS.wei.share * POPULATION))}人是偽靈根。築基是{peoplePer(realmStock("foundation"))}，結丹是{peoplePer(realmStock("core"))}，元嬰是{peoplePer(realmStock("nascent"))}，化神是{peoplePer(realmStock("spirit"))}。越往上，壽元和靈石把人卡得越死。
          </p>
        </div>
        <aside className="border border-border bg-card p-4 sm:p-5">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Mark name="realm" />
            一生停在哪裡
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            這是把同一套規則走很多遍之後，人最後停住的地方。不是此刻街上同時站著的人數。
          </p>
          <ol className="mt-4 flex flex-col gap-2">
            {REALMS.map((realm) => (
              <li key={realm.id} className="flex items-baseline justify-between gap-3 text-sm">
                <span>{realm.name}</span>
                <span className="num">{formatPeople(realm.stock)}</span>
              </li>
            ))}
          </ol>
        </aside>
      </section>

      <section className="mt-10 flex flex-col gap-6 border-t border-border pt-8">
        <KarmaSpend />
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <Button className="h-12 px-6 text-base" onClick={onBegin}>
            入道
          </Button>
          <p className="text-sm text-muted-foreground">出身和靈根一起落下。</p>
        </div>
        <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
          會出現壽元耗盡、突破失敗、走火。只寫結果，不寫過程。選擇會改路，不會改掉已經落下的靈根。
        </p>
      </section>

      <section className="mt-10 grid gap-6 border-t border-border pt-6 sm:grid-cols-3">
        <Note
          mark="companion"
          title="同一息的人"
          body="開局會有四位同歲的人與你同時入道。你推進時，他們也在突破、受傷或死去。點開仍是短的一生。"
        />
        <Note
          title="會停下來的地方"
          body="第十年、四十歲、七十歲，以及壽元剩得不多的時候。願意就留一行，不寫也可以。"
        />
        <Note
          title="自動抉擇"
          body="開啟之後，遇到分岔會隨便選一個，你可以在旁邊看。想自己走，把它關掉。"
        />
      </section>

      <section className="mt-10 border-t border-border pt-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-lg font-semibold">前世</h2>
          <NumbersDialog />
        </div>
        {past === null ? (
          <p className="mt-3 text-sm text-muted-foreground">前世那一頁還在翻。</p>
        ) : past.length === 0 ? (
          <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
            還沒有走完的一生。入道之後，這裡才會留下一行。只存在這台瀏覽器裡。
          </p>
        ) : (
          <>
            <ul className="mt-4 divide-y divide-border border-y border-border">
              {past.map((item) => (
                <li key={item.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between">
                  <p className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-base">
                    <span className="font-semibold">{item.name}</span>
                    <WithMark name="root" className="text-sm text-muted-foreground">
                      {item.rootName}
                    </WithMark>
                    <WithMark name="realm" className="text-sm text-muted-foreground">
                      {item.realmName}
                    </WithMark>
                    <WithMark name="life" className="text-sm text-muted-foreground">
                      {item.age}歲
                    </WithMark>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.worldName}
                    {item.line ? ` · 「${item.line}」` : ""}
                  </p>
                </li>
              ))}
            </ul>
            <Button
              variant="ghost"
              className="mt-3 h-9 px-2 text-muted-foreground"
              onClick={() => clearPast()}
            >
              清掉這些紀錄
            </Button>
          </>
        )}
      </section>

      <footer className="mt-12 border-t border-border pt-4 text-sm leading-7 text-muted-foreground">
        80億人修仙。境界、靈根、壽元與資源是凡人流修仙的類型骨架，句子與人數是為這一輪寫的，不是某一本小說的原文。
      </footer>
    </main>
  );
}

function Counters() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const started = Date.now();
    const timer = window.setInterval(() => {
      setSeconds((Date.now() - started) / 1000);
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);
  const entered = Math.floor(seconds * ENTRY_RATE);
  const ended = Math.floor(seconds * DEATH_RATE);
  return (
    <div className="mt-8 flex flex-wrap gap-8">
      <p className="flex min-w-0 max-w-full flex-col">
        <strong className="num text-3xl font-semibold">{formatPeople(entered)}</strong>
        <span className="text-sm text-muted-foreground">打開這頁之後入道的人</span>
      </p>
      <p className="flex min-w-0 max-w-full flex-col">
        <strong className="num text-3xl font-semibold">{formatPeople(ended)}</strong>
        <span className="flex items-start gap-1 text-sm text-muted-foreground">
          <Mark name="life" className="mt-0.5" />
          <span>同一段時間裡壽元耗盡的人</span>
        </span>
      </p>
    </div>
  );
}

function realmStock(id: RealmId): number {
  return REALMS.find((realm) => realm.id === id)?.stock ?? 0;
}

function peoplePer(stock: number): string {
  if (stock <= 0) return "這次抽樣裡沒有";
  const ratio = Math.max(1, Math.round(POPULATION / stock));
  return `${formatCount(ratio)}人裡一個`;
}

function Note({ title, body, mark }: { title: string; body: string; mark?: MarkName }) {
  return (
    <div>
      <h3 className="flex items-center gap-1.5 text-base font-semibold">
        {mark ? <Mark name={mark} /> : null}
        {title}
      </h3>
      <p className="mt-2 text-sm leading-7 text-muted-foreground">{body}</p>
    </div>
  );
}

function NumbersDialog() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" className="h-9" />}>
        這些數字從哪來
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>這些數字從哪來</DialogTitle>
          <DialogDescription>這一頁的推演，不是現實統計，也不是小說設定摘錄。</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 text-sm leading-7">
          <p>
            靈根比例是這頁先定的：偽靈根 {formatPeople(rootPopulation("wei"))}，真靈根{" "}
            {formatPeople(rootPopulation("zhen"))}，天靈根 {formatPeople(rootPopulation("tian"))}，變異靈根{" "}
            {formatPeople(rootPopulation("bian"))}。境界人數不是另外填的。
          </p>
          <p>
            算法：世間用當世，人都從這一息才入道起算。四種靈根分開走，因為高境界幾乎不出在偽靈根。偽靈根{" "}
            {formatCount(CENSUS_META.perRoot.wei)} 世，真靈根 {formatCount(CENSUS_META.perRoot.zhen)} 世，天靈根{" "}
            {formatCount(CENSUS_META.perRoot.tian)} 世，變異靈根 {formatCount(CENSUS_META.perRoot.bian)} 世。每一世用頁面上的自動抉擇走完：分岔就在當下的選項裡隨機挑一個，重心按當時的靈石、心境、見識來選。一年走一步，直到壽元盡，或化神走到這一輪寫到的盡頭。
          </p>
          <p>
            只記最後停在哪一層。每檔除以自己的樣本數，再乘上這種靈根在八十億人裡的比例，四檔加總。小數用最大餘數法收成整數，八層加起來是{" "}
            {formatPeople(censusTotal())}。
          </p>
          <p>
            這次樣本裡，天靈根停在結丹 {formatCount(CENSUS_HITS.tian.core)} 世、元嬰 {formatCount(CENSUS_HITS.tian.nascent)}{" "}
            世、化神 {formatCount(CENSUS_HITS.tian.spirit)} 世。換成全體之後，結丹 {formatPeople(realmStock("core"))}，元嬰{" "}
            {formatPeople(realmStock("nascent"))}，化神 {formatPeople(realmStock("spirit"))}。偽靈根的樣本停在煉氣初期{" "}
            {formatCount(CENSUS_HITS.wei["qi-early"])} 世、中期 {formatCount(CENSUS_HITS.wei["qi-mid"])} 世。
          </p>
          <p>打開頁面後的入道與壽盡，是按平均壽元粗算的每秒人數，從你打開這頁起算。跟上面的一生落點不是同一筆帳。</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
