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
import {
  COHORTS,
  PACES,
  POPULATION,
  REALMS,
  ROOT_ORDER,
  ROOTS,
  WORLDS,
  formatPeople,
  rootPopulation,
  type CohortId,
  type PaceId,
  type WorldId,
} from "@/lib/world";
import { cn } from "@/lib/utils";

const ENTRY_RATE = 2.6;
const DEATH_RATE = 2.3;

export function IntroView({
  world,
  cohort,
  pace,
  onWorld,
  onCohort,
  onPace,
  onBegin,
}: {
  world: WorldId;
  cohort: CohortId;
  pace: PaceId;
  onWorld: (id: WorldId) => void;
  onCohort: (id: CohortId) => void;
  onPace: (id: PaceId) => void;
  onBegin: () => void;
}) {
  const past = usePastLives();
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <p className="text-sm tracking-[0.22em] text-[#9c2f2a]">80億人修仙</p>
      <h1 className="mt-3 max-w-3xl">
        <span className="block text-xl text-[#5e564c] sm:text-2xl">八十億分之</span>
        <span className="mt-1 block text-[clamp(6.25rem,24vw,11rem)] leading-[0.82] font-semibold text-[#9c2f2a]">
          一
        </span>
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-8 text-[#3a332c]">
        當世人人都踏入了修途。靈氣、名額、機緣被八十億人分薄之後，你落在哪一層，多半在入道那一刻就定了。
      </p>
      <Counters />

      <section className="mt-10 grid gap-8 border-t border-border pt-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(16rem,0.9fr)]">
        <div>
          <h2 className="text-xl font-semibold">如果你在這一息入道</h2>
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
            約{formatPeople(Math.round(ROOTS.wei.share * POPULATION))}人是偽靈根。築基大約一百四十人裡一個，八十億乘上去仍有{formatPeople(REALMS.find((realm) => realm.id === "foundation")?.stock ?? 0)}。結丹才少到可以被稱作一方人物。
          </p>
        </div>
        <aside className="border border-border bg-card p-4 sm:p-5">
          <h2 className="text-lg font-semibold">一生停在哪裡</h2>
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
        <Option
          label="哪一種世間"
          hint={WORLDS[world].note}
          value={world}
          options={(Object.keys(WORLDS) as WorldId[]).map((id) => ({
            id,
            name: WORLDS[id].name,
          }))}
          onChange={onWorld}
        />
        <Option
          label="你是哪一批"
          hint={COHORTS[cohort].note}
          value={cohort}
          options={(Object.keys(COHORTS) as CohortId[]).map((id) => ({
            id,
            name: COHORTS[id].name,
          }))}
          onChange={onCohort}
        />
        <Option
          label="這一步幅"
          hint={PACES[pace].note}
          value={pace}
          options={(Object.keys(PACES) as PaceId[]).map((id) => ({
            id,
            name: PACES[id].name,
          }))}
          onChange={onPace}
        />
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <Button className="h-12 px-6 text-base" onClick={onBegin}>
            入道
          </Button>
          <p className="text-sm text-muted-foreground">不改這些，也可以直接入道。</p>
        </div>
        <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
          會出現壽元耗盡、突破失敗、走火。只寫結果，不寫過程。選擇會改路，不會改掉已經落下的靈根。
        </p>
      </section>

      <section className="mt-10 grid gap-6 border-t border-border pt-6 sm:grid-cols-3">
        <Note
          title="同一息的人"
          body="開局會有三個人與你同時入道。他們用同一套規則走完，結果放在你旁邊。"
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
                  <p className="text-base">
                    <span className="font-semibold">{item.name}</span>
                    <span className="text-muted-foreground">
                      {" "}
                      · {item.rootName} · {item.realmName} · {item.age}歲
                    </span>
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
      <p className="flex flex-col">
        <strong className="num text-3xl font-semibold">{formatPeople(entered)}</strong>
        <span className="text-sm text-muted-foreground">打開這頁之後入道的人</span>
      </p>
      <p className="flex flex-col">
        <strong className="num text-3xl font-semibold">{formatPeople(ended)}</strong>
        <span className="text-sm text-muted-foreground">同一段時間裡壽元耗盡的人</span>
      </p>
    </div>
  );
}

function Option<T extends string>({
  label,
  hint,
  value,
  options,
  onChange,
}: {
  label: string;
  hint: string;
  value: T;
  options: { id: T; name: string }[];
  onChange: (id: T) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex w-full flex-col border border-border sm:w-fit sm:flex-row" role="group" aria-label={label}>
        {options.map((option) => {
          const on = option.id === value;
          return (
            <Button
              key={option.id}
              variant="ghost"
              aria-pressed={on}
              className={cn(
                "h-11 rounded-none px-4",
                on && "bg-foreground text-background hover:bg-foreground hover:text-background",
              )}
              onClick={() => onChange(option.id)}
            >
              {option.name}
            </Button>
          );
        })}
      </div>
      <p className="max-w-xl text-sm leading-6 text-muted-foreground">{hint}</p>
    </div>
  );
}

function Note({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="text-base font-semibold">{title}</h3>
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
            {formatPeople(rootPopulation("bian"))}。
          </p>
          <p>
            一生停在煉氣哪一層、大約多少人摸到築基，是用同一套規則反覆走之後的大致結果。偽靈根多半停在初期或中期；真靈根多半到後期；天靈根常常走到築基關前，過去的仍然是少數。
          </p>
          <p>
            結丹與元嬰少到單次抽樣不穩。這一頁把結丹寫成約 {formatPeople(96_000)}、元嬰約 480，用來表示「少到可以當一方人物」。化神只在極少的情況點到，不展開。
          </p>
          <p>打開頁面後的入道與壽盡，是按平均壽元粗算的每秒人數，從你打開這頁起算。</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
