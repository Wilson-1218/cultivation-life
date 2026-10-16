import { useEffect, useRef, useState } from "react";
import { Mark } from "@/components/marks";
import { Button } from "@/components/ui/button";
import { type Life } from "@/lib/engine";
import { ORIGINS, ROOTS, formatPeople, rootPopulation } from "@/lib/world";

export function DrawingView() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <div className="grid size-16 place-items-center border-2 border-[#9c2f2a] text-lg text-[#9c2f2a]">修</div>
      <p className="mt-6 text-lg">測靈牌還扣著。</p>
    </main>
  );
}

export function RevealView({ life, onStart }: { life: Life; onStart: () => void }) {
  const root = ROOTS[life.root];
  const origin = ORIGINS[life.originId];
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col justify-center px-4 py-10 sm:px-6">
      <p className="text-sm tracking-[0.18em] text-[#9c2f2a]">
        {life.name} · {life.region} · 十六歲
      </p>
      <h1 className="mt-4 flex items-center gap-3 text-5xl font-semibold sm:text-6xl">
        <Mark name="root" className="size-7 text-[#9c2f2a] sm:size-8" />
        <span>{life.mortal ? "無靈根" : root.name}</span>
      </h1>
      {life.mortal ? (
        <p className="mt-4 max-w-xl text-lg leading-8">這一息沒有測出靈根。修途那八層，這一生不進去。</p>
      ) : (
        <>
          <p className="num mt-4 text-4xl text-[#9c2f2a] sm:text-5xl">{formatPeople(rootPopulation(life.root))}</p>
          <p className="mt-2 text-sm text-muted-foreground">八十億人裡，與你同一檔靈根的人。</p>
        </>
      )}
      <p className="mt-4 text-lg">出身 · {origin.name}</p>
      <p className="mt-6 max-w-xl text-lg leading-8">{life.origin}</p>
      <p className="mt-4 flex items-start gap-2 text-sm leading-7 text-muted-foreground">
        <Mark name="companion" className="mt-1" />
        <span>
          同歲、同一息還有 {life.companions.map((item) => item.name).join("、")}。走下去之後，可以點開看他們的一生。
        </span>
      </p>
      <Button className="mt-8 h-12 w-full px-6 text-base sm:w-auto" onClick={onStart}>
        {life.mortal ? "看這一生怎麼過去" : "把這一生走下去"}
      </Button>
    </main>
  );
}

export function FlashView({ lines, onDone }: { lines: string[]; onDone: () => void }) {
  const done = useRef(onDone);
  const fired = useRef(false);
  const [shown, setShown] = useState(1);
  useEffect(() => {
    done.current = onDone;
  }, [onDone]);
  const finish = () => {
    if (fired.current) return;
    fired.current = true;
    done.current();
  };
  useEffect(() => {
    if (shown < lines.length) {
      const timer = window.setTimeout(() => setShown((count) => count + 1), 650);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setTimeout(() => finish(), 700);
    return () => window.clearTimeout(timer);
  }, [shown, lines.length]);
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col justify-center px-4 py-10 sm:px-6">
      <p className="text-sm tracking-[0.18em] text-[#9c2f2a]">無靈根</p>
      <ul className="mt-6 flex flex-col gap-4">
        {lines.slice(0, shown).map((line) => (
          <li key={line} className="text-lg leading-8">
            {line}
          </li>
        ))}
      </ul>
      <Button variant="outline" className="mt-8 h-11 w-fit" onClick={finish}>
        跳過
      </Button>
    </main>
  );
}
