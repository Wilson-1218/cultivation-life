"use client";

import { useState } from "react";
import { RealmLadder } from "@/components/realm-ladder";
import { YearGrid } from "@/components/year-grid";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CompanionLife } from "@/components/companion-life";
import { Mark, buttonMark, choiceMarks, passageMark } from "@/components/marks";
import { companionNow, type Companion, type Life } from "@/lib/engine";
import type { Household, Kin } from "@/lib/household";
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

const SPEEDS = [1, 2, 4, 8, 12, 16] as const;
type PlaySpeed = (typeof SPEEDS)[number];

export function LifeView({
  life,
  paused,
  auto,
  speed,
  onPause,
  onAuto,
  onSpeed,
  onSkip,
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
  speed: PlaySpeed;
  onPause: () => void;
  onAuto: () => void;
  onSpeed: (speed: PlaySpeed) => void;
  onSkip: () => void;
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
  const finished = life.dead || life.ending === "edge";
  const waiting = Boolean(life.pending) || finished;
  const realm = realmById(life.realm);
  const age = life.story ? life.yearAge : life.age;
  const house = life.household;
  const ties = familyTies(house);
  const record = [...life.log].reverse();
  const rootLabel = life.story && !life.revealed ? "尚未測靈" : life.mortal ? "無靈根" : ROOTS[life.root].name;
  const realmLabel = life.mortal && life.revealed ? "凡人" : realm.name;

  return (
    <div className="min-h-dvh overflow-x-hidden pb-8">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <p className="text-sm tracking-[0.16em] text-[#9c2f2a]">80億人修仙</p>
          <Button variant="ghost" className="h-10 shrink-0" onClick={() => setLeaveOpen(true)}>
            回到開場
          </Button>
        </div>
        <div
          className="mx-auto flex max-w-6xl flex-wrap gap-2 px-4 pb-3 sm:px-6"
          role="toolbar"
          aria-label="事件速度"
        >
          <Button
            variant="outline"
            className={cn("h-10 bg-card", paused && "border-foreground bg-foreground text-background hover:bg-foreground hover:text-background")}
            aria-pressed={paused}
            onClick={onPause}
          >
            <span aria-hidden className="mr-1.5 inline-flex gap-0.5">
              <span className="inline-block h-3 w-0.5 bg-current" />
              <span className="inline-block h-3 w-0.5 bg-current" />
            </span>
            暫停
          </Button>
          {SPEEDS.map((item) => (
            <Button
              key={item}
              variant="outline"
              className={cn(
                "h-10 min-w-12 bg-card px-3",
                speed === item && "border-foreground bg-foreground text-background hover:bg-foreground hover:text-background",
              )}
              aria-pressed={speed === item}
              onClick={() => onSpeed(item)}
            >
              {item}×
            </Button>
          ))}
          <Button variant="outline" className="h-10 bg-card" onClick={onSkip} disabled={finished || Boolean(life.pending)}>
            快轉到下一個抉擇 »
          </Button>
          <Button
            variant="outline"
            className={cn("h-10 bg-card", auto && "border-foreground bg-foreground text-background hover:bg-foreground hover:text-background")}
            aria-pressed={auto}
            onClick={onAuto}
          >
            自動抉擇
          </Button>
        </div>
      </header>

      <p className="mx-auto max-w-6xl px-4 pt-3 text-sm leading-6 text-muted-foreground sm:px-6">
        想看快一點可以按 4× 或 8×，遇到抉擇會停下來。
      </p>

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[16.5rem_minmax(0,1fr)_18rem] lg:gap-5">
        <section aria-label="這個人" className="min-w-0 border border-border bg-card p-4">
          <p className="text-xs tracking-[0.14em] text-muted-foreground">這個人</p>
          <h1 className="mt-2 break-words text-3xl font-semibold">{life.name}</h1>
          <dl className="mt-4 grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-2 gap-y-2 text-sm">
            <dt className="text-muted-foreground">靈根</dt>
            <dd className="break-words">{rootLabel}</dd>
            <dt className="text-muted-foreground">境界</dt>
            <dd className="flex items-center gap-1.5 break-words">
              <Mark name="realm" className="size-4 text-[#9c2f2a]" />
              {realmLabel}
            </dd>
            <dt className="text-muted-foreground">出身</dt>
            <dd className="break-words">{ORIGINS[life.originId].name}</dd>
            <dt className="text-muted-foreground">住的地方</dt>
            <dd className="break-words">{house ? `${house.region} · ${house.hamlet}` : life.region}</dd>
            <dt className="text-muted-foreground">歲數</dt>
            <dd className="num">{age}</dd>
          </dl>
          {life.mortal && life.revealed ? (
            <p className="mt-3 text-sm leading-6 text-muted-foreground">沒有靈根。這一世的日子在家裡，也在要做的事上。</p>
          ) : (
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              這一層約有 {formatPeople(realm.stock)} 人。
            </p>
          )}

          <h2 className="mt-5 text-sm text-muted-foreground">日子</h2>
          <ul className="mt-3 flex flex-col gap-3">
            <Meter label={life.mortal && life.revealed ? "壽元" : "壽元"} value={Math.round((age / Math.max(1, life.lifespan)) * 100)} text={`${age} / ${life.lifespan}`} />
            <Meter label="心境" value={life.heart} text={String(Math.round(life.heart))} />
            <Meter label="家裡的關係" value={ties.score} text={ties.detail} />
          </ul>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">靈石</p>
            <p className="num mt-1 flex items-center gap-1.5 text-2xl">
              <Mark name="stone" />
              {formatCount(life.stones)}
            </p>
          </div>
          <div className="mt-5">
            <h2 className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Mark name="realm" />
              一生停在各層的人
            </h2>
            <div className="mt-2">
              <RealmLadder current={life.mortal && life.revealed ? null : life.realm} />
            </div>
          </div>
        </section>

        <div className="min-w-0">
          <section className="border border-border bg-card p-4 sm:p-5" aria-live="polite">
            <p className="text-sm text-muted-foreground">今年的重心</p>
            {life.story ? (
              <>
                <h2 className="mt-2 text-2xl font-semibold">{age}歲</h2>
                {life.yearLines.length > 0 ? (
                  <ul className="mt-3 flex flex-col gap-3">
                    {life.yearLines.map((line, index) => (
                      <li key={`${age}-${index}`} className="break-words text-lg leading-8">
                        {line}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </>
            ) : life.log.length > 0 ? (
              <p className="mt-3 break-words text-lg leading-8">{life.log[life.log.length - 1]?.text}</p>
            ) : null}

            {choice ? (
              <div className="mt-5 border-t border-border pt-4">
                <h2 className="flex flex-wrap items-center gap-2 text-xl font-semibold">
                  {choiceMarks(choice.title, choice.body).map((name) => (
                    <Mark key={name} name={name} className="size-5" />
                  ))}
                  <span className="break-words">{choice.title}</span>
                </h2>
                <p className="mt-3 break-words text-base leading-8">{choice.body}</p>
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
                        <span className="flex min-w-0 items-start gap-2">
                          {mark ? <Mark name={mark} className="mt-1 size-4" /> : null}
                          <span className="flex min-w-0 flex-col items-start gap-1">
                            <span className="break-words text-base">{item.label}</span>
                            <span className="break-words text-sm font-normal text-muted-foreground">{item.hint}</span>
                          </span>
                        </span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {life.pending?.type === "reflect" ? (
              <div className="mt-5 border-t border-border pt-4">
                <h3 className="text-xl font-semibold">停一下</h3>
                <p className="mt-3 break-words text-base leading-8">{life.pending.prompt}</p>
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
              </div>
            ) : null}
          </section>

          <section className="mt-4">
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
                    {FOCUSES[id].name}
                  </Button>
                );
              })}
            </div>
            {life.story && !finished ? null : (
              <div className="mt-4">
                <Button className="h-12 w-full px-6 text-base md:w-auto" disabled={!finished && Boolean(life.pending)} onClick={onAdvance}>
                  {finished ? "看你落在哪一層" : "過這一段"}
                </Button>
              </div>
            )}
          </section>

          <section className="mt-4 border border-border bg-card p-4 sm:p-5">
            <h2 className="text-sm text-muted-foreground">人生紀錄</h2>
            <p className="mt-1 text-xs text-muted-foreground">最新的在前</p>
            {record.length === 0 ? (
              <p className="mt-3 text-sm leading-7 text-muted-foreground">這一歲的事還寫在上面。</p>
            ) : (
              <ul className="mt-3 flex max-h-[28rem] flex-col gap-4 overflow-y-auto">
                {record.map((entry) => (
                  <li key={entry.id} className="border-l border-border pl-3 text-sm leading-7">
                    <div className="flex items-start justify-between gap-2">
                      <p className="min-w-0 break-words">
                        {passageMark(entry.text) ? (
                          <Mark name={passageMark(entry.text)!} className="mr-1.5 align-[-0.15em]" />
                        ) : null}
                        <span className="num text-muted-foreground">{entry.age}歲 · </span>
                        {entry.text}
                      </p>
                      <Button
                        variant="ghost"
                        className="h-8 shrink-0 px-2 text-xs"
                        aria-pressed={entry.starred}
                        onClick={() => onStar(entry.id)}
                      >
                        {entry.starred ? "已記住" : "記住"}
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="flex min-w-0 flex-col gap-4">
          <section className="border border-border bg-card p-4">
            <h2 className="text-sm text-muted-foreground">家人與生活</h2>
            <p className="mt-2 break-words text-sm leading-7">{workLine(house, age)}</p>
            <ul className="mt-3 flex flex-col gap-2 text-sm leading-6">
              {kinRows(house).map((line) => (
                <li key={line} className="flex items-baseline justify-between gap-3 border-b border-border/70 pb-2">
                  <span className="min-w-0 break-words">{line}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="border border-border bg-card p-4">
            <h2 className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Mark name="companion" />
              同輩道友
            </h2>
            <ul className="mt-2 flex flex-col gap-2">
              {life.companions.map((companion) => {
                const now = companionNow(companion, age);
                return (
                  <li key={companion.name}>
                    <button
                      type="button"
                      className={cn(
                        "w-full min-w-0 rounded-sm px-0 py-1 text-left text-sm leading-6 hover:text-[#9c2f2a]",
                        !now.alive && "text-muted-foreground",
                      )}
                      onClick={() => {
                        if (auto && !paused) onPause();
                        setReading(companion);
                      }}
                    >
                      <span className="block break-words">{now.text}</span>
                      <span className="text-xs text-[#9c2f2a]">{now.alive ? "看這一生" : "已死 · 看這一生"}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="border border-border bg-card p-4">
            <h2 className="text-sm text-muted-foreground">人生地圖</h2>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">一格一年。過完的年份在這裡。</p>
            <div className="mt-3">
              <YearGrid lived={age} hearts={life.heartByAge} current={age} />
            </div>
          </section>
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

function Meter({ label, value, text }: { label: string; value: number; text: string }) {
  const width = Math.max(0, Math.min(100, value));
  return (
    <li>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span>{label}</span>
        <span className="num text-right">{text}</span>
      </div>
      <div className="mt-1 h-1.5 bg-[#e4d8c4]">
        <div className={cn("h-full", width < 25 ? "bg-[#9c2f2a]" : "bg-foreground")} style={{ width: `${width}%` }} />
      </div>
    </li>
  );
}

function familyTies(house: Household | null): { score: number; detail: string } {
  if (!house) return { score: 0, detail: "還沒有家人" };
  const people = [house.father, house.mother, ...house.siblings, house.spouse, ...house.children];
  const known = people.filter((kin) => kin.present || kin.dead || kin.away);
  const home = known.filter((kin) => kin.present && !kin.dead && !kin.away);
  const score = known.length === 0 ? 0 : Math.round((home.length / known.length) * 100);
  return { score, detail: home.length === 0 ? "屋裡沒有別的人" : `${home.length} 人還在` };
}

function kinRows(house: Household | null): string[] {
  if (!house) return ["家裡還沒寫上名字"];
  const people = [house.father, house.mother, ...house.siblings, house.spouse, ...house.children];
  const lines = people.map(kinLine).filter((line): line is string => Boolean(line));
  return lines.length > 0 ? lines : ["名字都還在，人還沒聚齊"];
}

function kinLine(kin: Kin): string | null {
  if (!kin.present && !kin.dead && !kin.away) return null;
  if (kin.dead) return `${kin.call} ${kin.name}　已經不在`;
  if (kin.away) return `${kin.call} ${kin.name}　不在這屋`;
  if (kin.sick) return `${kin.call} ${kin.name}　病著`;
  if (kin.role === "spouse") return `${kin.name}　在屋裡`;
  if (kin.role === "child") return `${kin.call} ${kin.name}　在家裡`;
  return `${kin.call} ${kin.name}　在家`;
}

function workLine(house: Household | null, age: number): string {
  if (!house) return "生計還沒寫上。";
  if (!house.seen.includes("job") && age < house.jobSince) return `你還住在${house.hamlet}，事情還沒定下來。`;
  return `你在${house.jobPlace}${house.job}。屋子在${house.hamlet}。`;
}
