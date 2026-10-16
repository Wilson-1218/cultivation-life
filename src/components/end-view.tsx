"use client";

import { useState } from "react";
import { RealmLadder } from "@/components/realm-ladder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type Life } from "@/lib/engine";
import {
  ROOTS,
  WORLDS,
  formatPeople,
  realmById,
  rootPopulation,
} from "@/lib/world";

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
  const realm = realmById(life.realm);
  const root = ROOTS[life.root];
  const starred = life.log.filter((entry) => entry.starred);
  const notes = life.reflections.filter((item) => item.id !== "farewell" && item.text);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <p className="text-sm tracking-[0.18em] text-[#9c2f2a]">八十億分之一</p>
      <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">
        {life.ending === "edge" ? `${life.name}還活著` : `${life.name}，${life.age}歲`}
      </h1>
      <p className="mt-4 text-lg leading-8">
        {life.ending === "edge"
          ? `修為停在化神之前。再往上，這一輪不寫。靈根從入道起就是${root.name}。`
          : `${life.cause}。最後停在${realm.name}。靈根從入道起就是${root.name}，選擇沒有改過它。`}
      </p>

      <p className="mt-8 text-sm text-muted-foreground">把一生停在{realm.name}的人</p>
      <p className="num mt-1 text-5xl font-semibold text-[#9c2f2a] sm:text-6xl">{formatPeople(realm.stock)}</p>
      <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
        你的靈根是{root.name}，這一檔約有 {formatPeople(rootPopulation(life.root))} 人。世間是
        {WORLDS[life.setup.world].name}
        {life.sect ? `，你進過${life.sect}` : "，你沒有進宗門"}。
      </p>

      <section className="mt-8">
        <h2 className="text-base font-semibold">往上還有多少人</h2>
        <div className="mt-3">
          <RealmLadder current={life.realm} />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-base font-semibold">同一息入道的三個人</h2>
        <ul className="mt-3 flex flex-col gap-3">
          {life.companions.map((companion) => (
            <li key={companion.name} className="border-b border-border pb-3 text-sm leading-7">
              <span className="font-semibold">{companion.name}</span>
              <span className="text-muted-foreground">
                {" "}
                · {ROOTS[companion.root].name} · {companion.region} ·{" "}
                {companion.ending === "edge"
                  ? `還活著，${companion.finalAge}歲，停在化神之前`
                  : `${companion.finalAge}歲${companion.cause}，停在${realmById(companion.finalRealm).name}`}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {notes.length > 0 || starred.length > 0 ? (
        <section className="mt-8">
          <h2 className="text-base font-semibold">留下的句子</h2>
          <ul className="mt-3 flex flex-col gap-3">
            {notes.map((item) => (
              <li key={item.id} className="text-sm leading-7">
                <span className="text-muted-foreground">{item.prompt}</span>
                <span className="mt-1 block">「{item.text}」</span>
              </li>
            ))}
            {starred.map((item) => (
              <li key={item.id} className="text-sm leading-7">
                <span className="num text-muted-foreground">{item.age}歲記住的</span>
                <span className="mt-1 block">{item.text}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-8 border-t border-border pt-6">
        <h2 className="text-lg font-semibold">對這個人說一句話</h2>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">不寫也算數。寫了就留在這台瀏覽器的前世裡。</p>
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
            onFarewell(draft);
            setSaved(true);
          }}
        >
          {saved ? "已留下" : "留下這句"}
        </Button>
      </section>

      <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
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
      <p className="mt-6 text-xs text-muted-foreground">命籤 {life.id}</p>
    </main>
  );
}
