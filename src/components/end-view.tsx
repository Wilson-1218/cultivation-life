"use client";

import { useState } from "react";
import { CompanionLife } from "@/components/companion-life";
import { KarmaSpend } from "@/components/karma-spend";
import { Mark } from "@/components/marks";
import { RealmLadder } from "@/components/realm-ladder";
import { YearGrid } from "@/components/year-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { heavenPoints, karmaSentence, type Companion, type Life } from "@/lib/engine";
import type { Household } from "@/lib/household";
import { ORIGINS, REALMS, ROOTS, censusTotal, formatPeople, realmById } from "@/lib/world";

export function EndView({
  life,
  onFarewell,
  onAgain,
  onSame,
  onIntro,
}: {
  life: Life;
  onFarewell: (text: string) => void;
  onAgain: () => void;
  onSame: () => void;
  onIntro: () => void;
}) {
  const existing = life.reflections.find((item) => item.id === "farewell")?.text ?? "";
  const [draft, setDraft] = useState(existing);
  const [saved, setSaved] = useState(Boolean(existing));
  const [reading, setReading] = useState<Companion | null>(null);
  const realm = realmById(life.realm);
  const root = ROOTS[life.root];
  const house = life.household;
  const place = house ? `${house.region}的${house.hamlet}` : life.region;
  const alive = life.ending === "edge";
  const share = outlivedPercent(life.age);
  const markAge = life.mortal ? life.lifespan : realm.lifespan;
  const peers = life.companions.map((companion) => `${companion.name} ${companion.finalAge}歲`);
  const calm = calmestYear(life.heartByAge);

  return (
    <main className="mx-auto w-full max-w-3xl overflow-x-hidden px-4 py-6 sm:px-6 sm:py-10">
      <article className="overflow-hidden border border-border bg-card">
        <header className="flex items-center justify-between gap-3 bg-[#9c2f2a] px-4 py-3 text-[#f7f1e4] sm:px-5">
          <p className="text-lg font-semibold tracking-wide">80億分之1</p>
          <p className="num shrink-0 text-sm">第{life.setup.seed}號</p>
        </header>

        <div className="px-4 py-5 sm:px-5">
          <p className="text-xs tracking-[0.14em] text-muted-foreground">人生紀錄</p>
          <div className="mt-3 flex items-start gap-4">
            <InkPortrait />
            <div className="min-w-0">
              <p className="text-sm text-[#3d6b62]">
                {life.mortal ? "無靈根" : root.name} · {life.mortal ? "凡人" : realm.name}
              </p>
              <h1 className="mt-1 break-words text-4xl font-semibold">{life.name}</h1>
              <p className="mt-2 text-sm leading-7">
                享年{life.age}歲{alive ? "，人還在" : ""}
              </p>
              <p className="break-words text-sm leading-7">
                {alive ? `人還在${place}` : `在${place}走完一生`}
              </p>
            </div>
          </div>

          <dl className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 min-[420px]:grid-cols-2">
            <Cell label="出身" value={ORIGINS[life.originId].name} />
            <Cell label="最後的生計" value={livelihood(house)} />
            <Cell label="住過的地方" value={placesLived(life)} />
            <Cell label="家人" value={familyCount(house)} />
            <Cell label="宗門" value={life.sect ?? "沒有進宗門"} />
            <Cell label="死因" value={life.cause || (alive ? "還活著" : "停在這裡")} prominent />
          </dl>

          <div className="mt-6 grid items-end gap-5 lg:grid-cols-[minmax(0,1fr)_16rem]">
            <div className="min-w-0">
              <p className="text-xs leading-5 text-muted-foreground">
                人生地圖 · 一格一年 · 顏色越深，這一年的心境越穩 · 粗框是
                {life.mortal ? "凡人常見能活到的歲數" : "這一境常見能活到的歲數"}
              </p>
              <div className="mt-3">
                <YearGrid lived={life.age} hearts={life.heartByAge} markAge={markAge} />
              </div>
            </div>
            <div className="min-w-0">
              <p className="num text-5xl font-semibold leading-none text-[#1c4d45] sm:text-6xl">{share}%</p>
              <p className="mt-2 text-sm leading-6">同一批裡，活得比你久的比例</p>
              <p className="mt-2 break-words text-sm leading-6">
                {life.mortal ? "凡人" : "這一境"}常見能活到 {markAge} 歲，你享年 {life.age} 歲。
                {life.age < markAge
                  ? `比常見的歲數少了 ${markAge - life.age} 年。`
                  : life.age > markAge
                    ? `比常見的歲數多了 ${life.age - markAge} 年。`
                    : "剛好走到常見的歲數。"}
                {calm != null ? `心境最穩的一年是 ${calm} 歲。` : ""}
              </p>
              <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">
                {life.mortal
                  ? `你沒有停在修途的層上。各層加起來 ${formatPeople(censusTotal())} 人。`
                  : `停在${realm.name}的約有 ${formatPeople(realm.stock)} 人。`}
              </p>
              <p className="mt-2 break-words text-sm leading-6">四位同輩分別活到 {peers.join("、")}</p>
            </div>
          </div>

          <p className="mt-8 text-lg font-semibold leading-8">下一世再入道，你要先記住誰的名字？</p>
        </div>
      </article>

      <p className="mt-6 text-sm leading-7">{karmaSentence(life)}</p>

      <section className="mt-6">
        <h2 className="flex items-center gap-1.5 text-base font-semibold">
          <Mark name="realm" />
          往上還有多少人
        </h2>
        <div className="mt-3">
          <RealmLadder current={life.mortal ? null : life.realm} />
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-base font-semibold">同輩這一生</h2>
        <ul className="mt-3 flex flex-col gap-2">
          {life.companions.map((companion) => (
            <li key={companion.name}>
              <button type="button" className="text-left text-sm leading-7" onClick={() => setReading(companion)}>
                <span className="font-semibold">{companion.name}</span>
                <span className="text-muted-foreground">
                  {" "}
                  · {companion.mortal ? "無靈根" : ROOTS[companion.root].name} · {companion.finalAge}歲
                  {companion.ending === "edge" ? "，還在" : `，${companion.cause}`}
                </span>
                <span className="mt-0.5 block text-[#9c2f2a]">看這一生</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 border-t border-border pt-6">
        <h2 className="text-lg font-semibold">對這個人說一句話</h2>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">空白不算留下。有字才會出現在這台瀏覽器的前世裡。</p>
        <label className="sr-only" htmlFor="farewell">
          對這個人說一句話
        </label>
        <Input
          id="farewell"
          value={draft}
          maxLength={80}
          placeholder="可以空白"
          className="mt-3 h-11"
          onChange={(event) => {
            setDraft(event.target.value);
            setSaved(false);
          }}
        />
        <Button
          variant="outline"
          className="mt-3 h-10"
          onClick={() => {
            if (!draft.trim()) return;
            onFarewell(draft);
            setSaved(true);
          }}
        >
          {saved ? "已留下" : "留下這句"}
        </Button>
        <p className="mt-2 text-xs text-muted-foreground">這一世的天道點數 {heavenPoints(life)}</p>
        <div className="mt-4">
          <KarmaSpend />
        </div>
      </section>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Button className="h-12 px-5" onClick={onAgain}>
          再入道一次
        </Button>
        <Button variant="outline" className="h-12 px-5" onClick={onSame}>
          同一靈根，再走一次
        </Button>
        <Button variant="ghost" className="h-12 px-5" onClick={onIntro}>
          回到開場
        </Button>
      </div>
      <CompanionLife companion={reading} onClose={() => setReading(null)} />
    </main>
  );
}

function Cell({ label, value, prominent }: { label: string; value: string; prominent?: boolean }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className={prominent ? "mt-1 break-words text-2xl font-semibold text-[#9c2f2a]" : "mt-1 break-words text-lg font-semibold leading-7"}>
        {value}
      </dd>
    </div>
  );
}

function InkPortrait() {
  return (
    <svg
      viewBox="0 0 72 88"
      className="h-24 w-20 shrink-0 text-foreground"
      aria-hidden
    >
      <rect x="1" y="1" width="70" height="86" fill="#f3eadc" stroke="currentColor" strokeWidth="1" />
      <circle cx="36" cy="32" r="14" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M24 28c2-6 8-8 12-8s10 2 12 8" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M30 32h.5M42 32h.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M33 38c2 2 4 2 6 0" fill="none" stroke="currentColor" strokeWidth="1.1" />
      <path d="M22 78c2-16 8-22 14-22s12 6 14 22" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <path d="M28 56h16" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function livelihood(house: Household | null): string {
  if (!house || !house.seen.includes("job")) return "還沒開始做事";
  return `${house.jobPlace}${house.job}`;
}

function placesLived(life: Life): string {
  const house = life.household;
  if (!house) return life.region;
  const spots = [house.hamlet, house.market, house.river, house.mountain, house.yard];
  if (life.sect) spots.push(life.sect);
  return [...new Set(spots)].join("、");
}

function familyCount(house: Household | null): string {
  if (!house) return "沒有寫上";
  const people = [house.father, house.mother, ...house.siblings, house.spouse, ...house.children];
  const known = people.filter((kin) => kin.present || kin.dead || kin.away);
  const home = known.filter((kin) => kin.present && !kin.dead && !kin.away).map((kin) => kin.name);
  if (home.length === 0) return `${known.length}人，走的時候屋裡沒有別人`;
  return `${known.length}人，走時還在的是${home.join("、")}`;
}

function calmestYear(hearts: number[]): number | null {
  let best = -1;
  let age: number | null = null;
  hearts.forEach((value, index) => {
    if (typeof value !== "number" || Number.isNaN(value)) return;
    if (value > best) {
      best = value;
      age = index;
    }
  });
  return age;
}

function outlivedPercent(age: number): number {
  const total = censusTotal();
  const longer = REALMS.filter((item) => item.lifespan > age).reduce((sum, item) => sum + item.stock, 0);
  return Math.round((longer / Math.max(1, total)) * 100);
}
