import { Mark } from "@/components/marks";
import { Button } from "@/components/ui/button";
import { type Life } from "@/lib/engine";
import { ROOTS, formatPeople, rootPopulation } from "@/lib/world";

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
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col justify-center px-4 py-10 sm:px-6">
      <p className="text-sm tracking-[0.18em] text-[#9c2f2a]">
        {life.name} · {life.region} · 十六歲
      </p>
      <h1 className="mt-4 flex items-center gap-3 text-5xl font-semibold sm:text-6xl">
        <Mark name="root" className="size-7 text-[#9c2f2a] sm:size-8" />
        <span>{root.name}</span>
      </h1>
      <p className="num mt-4 text-4xl text-[#9c2f2a] sm:text-5xl">{formatPeople(rootPopulation(life.root))}</p>
      <p className="mt-2 text-sm text-muted-foreground">八十億人裡，與你同一檔靈根的人。</p>
      <p className="mt-6 max-w-xl text-lg leading-8">{life.origin}</p>
      <p className="mt-4 flex items-start gap-2 text-sm leading-7 text-muted-foreground">
        <Mark name="companion" className="mt-1" />
        <span>
          同一息還有 {life.companions.map((item) => item.name).join("、")}。走下去之後，可以點開看他們的一生。
        </span>
      </p>
      <Button className="mt-8 h-12 w-full px-6 text-base sm:w-auto" onClick={onStart}>
        把這一生走下去
      </Button>
    </main>
  );
}
