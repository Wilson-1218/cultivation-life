"use client";

import { useState } from "react";
import { RealmLadder } from "@/components/realm-ladder";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CompanionLife } from "@/components/companion-life";
import { Mark, WithMark, buttonMark, choiceMarks, passageMark } from "@/components/marks";
import { companionNow, type Companion, type Life } from "@/lib/engine";
import {
  FOCUS_ORDER,
  FOCUSES,
  ORIGINS,
  ROOTS,
  formatCount,
  formatPeople,
  realmById,
  type FocusId,
} from "@/lib/world";
import { cn } from "@/lib/utils";

export function LifeView({
  life,
  paused,
  auto,
  onPause,
  onAuto,
  onFocus,
  onAdvance,
  onChoice,
  onReflect,
  onStar,
  onAbandon,
}: {
  life: Life;
  paused: boolean;
  auto: boolean;
  onPause: () => void;
  onAuto: () => void;
  onFocus: (focus: FocusId) => void;
  onAdvance: () => void;
  onChoice: (id: string) => void;
  onReflect: (text: string) => void;
  onStar: (id: string) => void;
  onAbandon: () => void;
}) {
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [reading, setReading] = useState<Companion | null>(null);
  const reflectId = life.pending?.type === "reflect" ? life.pending.id : "";
  const [draftState, setDraftState] = useState({ id: "", text: "" });
  const draft = draftState.id === reflectId ? draftState.text : "";

  const choice = life.pending?.type === "choice" ? life.pending : null;
  const latest = life.log[life.log.length - 1];
  const older = life.log.slice(0, -1).slice(-6).reverse();
  const finished = life.dead || life.ending === "edge";
  const waiting = Boolean(life.pending) || finished;
  const realm = realmById(life.realm);

  return (
    <div className="min-h-dvh pb-8 md:pb-10">
      <header className="sticky top-0 z-20 border-b border-border bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <p className="text-sm tracking-[0.16em] text-[#9c2f2a]">80億人修仙</p>
          <div className="hidden items-center gap-2 md:flex">
            <Tools
              paused={paused}
              auto={auto}
              onPause={onPause}
              onAuto={onAuto}
              onAbandon={() => setLeaveOpen(true)}
            />
          </div>
          <Sheet>
            <SheetTrigger
              className="md:hidden"
              render={<Button variant="outline" className="h-10 px-3 md:hidden" />}
            >
              更多
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>這一世</SheetTitle>
                <SheetDescription>暫停，或把抉擇交給自動。</SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-4 px-4 pb-6">
                <Tools
                  paused={paused}
                  auto={auto}
                  onPause={onPause}
                  onAuto={onAuto}
                  onAbandon={() => setLeaveOpen(true)}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="order-1 min-w-0">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span>
              {life.name} · {life.region}
            </span>
            <WithMark name="life">{(life.story ? life.yearAge : life.age)}歲</WithMark>
            <WithMark name="root">
              {life.story && !life.revealed ? "尚未測靈" : life.mortal ? "無靈根" : ROOTS[life.root].name}
            </WithMark>
            <span>{ORIGINS[life.originId].name}</span>
            <span>{life.sect ? life.sect : "散修"}</span>
          </p>
          <h1 className="mt-2 flex items-center gap-2 text-4xl font-semibold sm:gap-3 sm:text-5xl">
            <Mark name="realm" className="size-6 text-[#9c2f2a] sm:size-7" />
            <span>{realm.name}</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
            八十億人裡，約有 {formatPeople(realm.stock)} 人把一生停在{realm.name}。你現在在這一層。
          </p>
          <FriendStrip
            life={life}
            className="mt-4 lg:hidden"
            onOpen={(companion) => {
              if (auto && !paused) onPause();
              setReading(companion);
            }}
          />

          {life.story ? (
            <section className="mt-8 border-t border-border pt-6" aria-live="polite">
              <h2 className="text-xl font-semibold">{life.yearAge}歲</h2>
              {life.yearLines.length > 0 ? (
                <ul className="mt-3 flex flex-col gap-3">
                  {life.yearLines.map((line, index) => (
                    <li key={`${life.yearAge}-${index}`} className="text-lg leading-8">
                      {line}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ) : latest ? (
            <article className="mt-8 border-t border-border pt-6" aria-live="polite">
              <div className="flex items-start justify-between gap-3">
                <p className="text-lg leading-8">
                  {passageMark(latest.text) ? (
                    <Mark name={passageMark(latest.text)!} className="mr-1.5 align-[-0.15em]" />
                  ) : null}
                  {latest.text}
                </p>
                <Button
                  variant="ghost"
                  className="h-9 shrink-0 px-2 text-sm"
                  aria-pressed={latest.starred}
                  onClick={() => onStar(latest.id)}
                >
                  {latest.starred ? "已記住" : "記住"}
                </Button>
              </div>
            </article>
          ) : null}

          {choice ? (
            <section className="mt-6 border border-border bg-card p-4 sm:p-5">
              <h2 className="flex flex-wrap items-center gap-2 text-xl font-semibold">
                {choiceMarks(choice.title, choice.body).map((name) => (
                  <Mark key={name} name={name} className="size-5" />
                ))}
                <span>{choice.title}</span>
              </h2>
              <p className="mt-3 text-base leading-8">{choice.body}</p>
              <div className="mt-4 flex flex-col gap-2">
                {choice.choices.map((item) => {
                  const mark = buttonMark(choice.title, choice.body, item.label);
                  return (
                    <Button
                      key={item.id}
                      variant="outline"
                      className="h-auto min-h-12 w-full items-start justify-start px-4 py-3 text-left whitespace-normal"
                      onClick={() => onChoice(item.id)}
                    >
                      <span className="flex items-start gap-2">
                        {mark ? <Mark name={mark} className="mt-1 size-4" /> : null}
                        <span className="flex flex-col items-start gap-1">
                          <span className="text-base">{item.label}</span>
                          <span className="text-sm font-normal text-muted-foreground">{item.hint}</span>
                        </span>
                      </span>
                    </Button>
                  );
                })}
              </div>
            </section>
          ) : null}

          {life.pending?.type === "reflect" ? (
            <section className="mt-6 border border-border bg-card p-4 sm:p-5">
              <h2 className="text-xl font-semibold">停一下</h2>
              <p className="mt-3 text-base leading-8">{life.pending.prompt}</p>
              <label className="mt-4 block text-sm text-muted-foreground" htmlFor="reflect">
                留一行，或什麼都不寫
              </label>
              <Input
                id="reflect"
                value={draft}
                maxLength={80}
                placeholder="可以空白"
                className="mt-2 h-11"
                onChange={(event) => setDraftState({ id: reflectId, text: event.target.value })}
              />
              <Button className="mt-3 h-11 px-4" onClick={() => onReflect(draft)}>
                繼續
              </Button>
            </section>
          ) : null}

          <section className="mt-8">
            <h2 className="text-sm text-muted-foreground">這一段的重心</h2>
            <div className="mt-2 grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-5" role="group" aria-label="這一段的重心">
              {FOCUS_ORDER.map((id) => {
                const on = life.focus === id;
                return (
                  <Button
                    key={id}
                    variant="ghost"
                    disabled={waiting}
                    aria-pressed={on}
                    className={cn(
                      "h-11 rounded-none bg-card max-sm:last:col-span-2",
                      on && "bg-foreground text-background hover:bg-foreground hover:text-background",
                    )}
                    onClick={() => onFocus(id)}
                  >
                    {id === "stone" || id === "ally" ? (
                      <Mark name={id === "stone" ? "stone" : "companion"} className="size-4" />
                    ) : null}
                    {FOCUSES[id].name}
                  </Button>
                );
              })}
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{FOCUSES[life.focus].hint}</p>
            {life.story && !finished ? null : (
              <div className="mt-4">
                <Button
                  className="h-12 w-full px-6 text-base md:w-auto"
                  disabled={(!finished && Boolean(life.pending)) || (auto && !paused && !finished)}
                  onClick={onAdvance}
                >
                  {finished ? "看你落在哪一層" : auto && !paused ? "自動走著" : "過這一段"}
                </Button>
              </div>
            )}
          </section>

          {older.length > 0 ? (
            <section className="mt-8">
              <h2 className="text-sm text-muted-foreground">先前</h2>
              <ul className="mt-3 flex flex-col gap-4">
                {older.map((entry) => (
                  <li key={entry.id} className="border-l border-border pl-3 text-sm leading-7 text-[#3a332c]">
                    <span className="num text-muted-foreground">{entry.age}歲 · </span>
                    {entry.text}
                    {entry.starred ? <span className="text-[#9c2f2a]"> · 記住了</span> : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <aside className="order-2 min-w-0 lg:sticky lg:top-20 lg:self-start">
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-muted-foreground">靈石</dt>
              <dd className="num flex items-center gap-1.5 text-xl">
                <Mark name="stone" />
                {formatCount(life.stones)}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">壽元</dt>
              <dd className="num flex items-center gap-1.5 text-xl">
                <Mark name="life" />
                <span>
                  {life.story ? life.yearAge : life.age}
                  <span className="text-base text-muted-foreground"> / {life.lifespan}</span>
                </span>
              </dd>
            </div>
          </dl>
          <ul className="mt-4 flex flex-col gap-3">
            {(
              [
                ["靈力", life.ling],
                ["心境", life.heart],
                ["見識", life.insight],
                ["人脈", life.bond],
              ] as const
            ).map(([label, value]) => (
              <li key={label}>
                <div className="flex items-baseline justify-between text-sm">
                  <span>{label}</span>
                  <span className="num">{Math.round(value)}</span>
                </div>
                <div className="mt-1 h-1.5 bg-[#e4d8c4]">
                  <div
                    className={cn("h-full", value < 25 ? "bg-[#9c2f2a]" : "bg-foreground")}
                    style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <StatsDialog />
          <div className="mt-6">
            <h2 className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Mark name="realm" />
              一生停在各層的人
            </h2>
            <div className="mt-2">
              <RealmLadder current={life.realm} />
            </div>
          </div>
          <FriendStrip
            life={life}
            onOpen={(companion) => {
              if (auto && !paused) onPause();
              setReading(companion);
            }}
            className="mt-6 hidden lg:block"
          />
        </aside>
      </div>

      <CompanionLife companion={reading} onClose={() => setReading(null)} />

      <Dialog open={leaveOpen} onOpenChange={setLeaveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>回到開場？</DialogTitle>
            <DialogDescription>這一世還沒走完，回去就不會留下。</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" className="h-10" onClick={() => setLeaveOpen(false)}>
              留下
            </Button>
            <Button
              className="h-10"
              onClick={() => {
                setLeaveOpen(false);
                onAbandon();
              }}
            >
              回去
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Tools({
  paused,
  auto,
  onPause,
  onAuto,
  onAbandon,
}: {
  paused: boolean;
  auto: boolean;
  onPause: () => void;
  onAuto: () => void;
  onAbandon: () => void;
}) {
  return (
    <>
      <Button variant="outline" className="h-10" aria-pressed={paused} onClick={onPause}>
        {paused ? "繼續走" : "暫停"}
      </Button>
      <Button variant={auto ? "default" : "outline"} className="h-10" aria-pressed={auto} onClick={onAuto}>
        自動抉擇
      </Button>
      <Button variant="ghost" className="h-10" onClick={onAbandon}>
        回到開場
      </Button>
    </>
  );
}

function FriendStrip({
  life,
  onOpen,
  className,
}: {
  life: Life;
  onOpen: (companion: Companion) => void;
  className?: string;
}) {
  return (
    <section className={className}>
      <h2 className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Mark name="companion" />
        同歲的四位
      </h2>
      <ul className="mt-2 grid grid-cols-2 gap-2 lg:grid-cols-1">
        {life.companions.map((companion) => {
          const now = companionNow(companion, life.age);
          return (
            <li key={companion.name}>
              <button
                type="button"
                className={cn(
                  "w-full min-w-0 rounded-sm border border-border px-2 py-2 text-left text-sm leading-6 hover:text-[#9c2f2a] lg:border-0 lg:px-0 lg:py-0",
                  !now.alive && "text-muted-foreground opacity-60",
                )}
                onClick={() => onOpen(companion)}
              >
                <span className="block break-words">{now.text}</span>
                <span className="mt-0.5 inline-flex items-center gap-1 text-xs text-[#9c2f2a]">
                  <Mark name="companion" />
                  {now.alive ? "看這一生" : "已死 · 看這一生"}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function StatsDialog() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="ghost" className="mt-2 h-8 px-0 text-sm text-muted-foreground" />}>
        這四條是什麼
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>狀態，0 到 100</DialogTitle>
          <DialogDescription>高只提高可能性，不決定這一年的結果。</DialogDescription>
        </DialogHeader>
        <ul className="flex flex-col gap-3 text-sm leading-7">
          <li>
            <strong>靈力</strong> 影響修為快慢。太低的時候，空手衝關更危險。
          </li>
          <li>
            <strong>心境</strong> 影響走火，也影響衝關穩不穩。閉關與謀石會磨它。
          </li>
          <li>
            <strong>見識</strong> 影響功法與衝關。到了七十上下，再高也差不了多少。
          </li>
          <li>
            <strong>人脈</strong> 影響有沒有人肯告訴你名額、肯見你一面。
          </li>
        </ul>
      </DialogContent>
    </Dialog>
  );
}
