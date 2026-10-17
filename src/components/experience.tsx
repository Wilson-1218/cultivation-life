"use client";

import { useEffect, useState } from "react";
import { EndView } from "@/components/end-view";
import { IntroView } from "@/components/intro-view";
import { LifeView } from "@/components/life-view";
import { DrawingView, FlashView, RevealView } from "@/components/reveal-view";
import { Button } from "@/components/ui/button";
import {
  advance,
  applyChoice,
  applyReflection,
  autoChoiceId,
  burialOf,
  carryFoe,
  carryHaunt,
  carryThread,
  createLife,
  playStoryYear,
  finishMortal,
  heavenPoints,
  isFinished,
  randomSeed,
  toggleStar,
  type Life,
} from "@/lib/engine";
import { clearBuried, clearFoe, clearHaunt, clearThread, consumeKarma, grantKarma, upsertPast, type PastLife } from "@/lib/storage";
import { ROOTS, WORLDS, realmById, type FocusId, type Setup } from "@/lib/world";

type Phase = "intro" | "drawing" | "reveal" | "flash" | "life" | "end";

const INITIAL: Setup = {
  world: "now",
  cohort: "entrant",
  pace: "incense",
  seed: 1,
};

export function Experience() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [setup, setSetup] = useState<Setup>(INITIAL);
  const [life, setLife] = useState<Life | null>(null);
  const [paused, setPaused] = useState(false);
  const [auto, setAuto] = useState(false);
  const [fault, setFault] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [phase]);

  useEffect(() => {
    if (phase !== "drawing") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => setPhase("life"), reduce ? 0 : 650);
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "life" || paused || !life || fault) return;
    if (isFinished(life)) return;
    if (life.pending) {
      if (!auto) return;
      const timer = window.setTimeout(() => {
        setLife((current) => {
          if (!current || isFinished(current) || !current.pending) return current;
          try {
            if (current.pending.type === "choice") {
              const choiceId = autoChoiceId(current);
              settleCarry(choiceId);
              return applyChoice(current, choiceId);
            }
            if (current.pending.type === "reflect") return applyReflection(current, "");
          } catch {
            setFault("推演進行到一半斷了。");
          }
          return current;
        });
      }, 780);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setTimeout(() => {
      setLife((current) => {
        if (!current || current.pending || isFinished(current)) return current;
        try {
          return playStoryYear(current);
        } catch {
          setFault("推演進行到一半斷了。");
          return current;
        }
      });
    }, 850);
    return () => window.clearTimeout(timer);
  }, [phase, auto, paused, life, fault]);

  function remember(current: Life) {
    const line = current.reflections.find((item) => item.id === "farewell")?.text ?? "";
    upsertPast(toPast(current, line));
    grantKarma({
      id: current.id,
      points: heavenPoints(current),
      bury: burialOf(current),
      foe: carryFoe(current),
      haunt: carryHaunt(current),
      thread: carryThread(current),
    });
  }

  function begin(nextSetup: Setup) {
    setFault(null);
    setAuto(false);
    setPaused(false);
    try {
      setLife(createLife(nextSetup, { story: true }));
      setSetup(nextSetup);
      setPhase("drawing");
    } catch {
      setLife(null);
      setFault("這一世沒有抽成。");
    }
  }

  function startNext(seed: number) {
    const carried = consumeKarma();
    begin({
      ...setup,
      seed,
      boost: carried.boost,
      buried: carried.buried,
      foe: carried.foe,
      haunt: carried.haunt,
      thread: carried.thread,
    });
  }

  function finishFlash() {
    if (!life) return;
    const done = life.mortal && !life.dead ? finishMortal(life) : life;
    setLife(done);
    remember(done);
    setAuto(false);
    setPhase("end");
  }

  function run(work: (current: Life) => Life) {
    setLife((current) => {
      if (!current) return current;
      try {
        return work(current);
      } catch {
        setFault("這一步沒有走成。");
        return current;
      }
    });
  }

  if (fault) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-6">
        <h1 className="text-3xl font-semibold">這一世沒有推演完</h1>
        <p className="mt-3 leading-8 text-muted-foreground">{fault}</p>
        <Button
          className="mt-6 h-11 w-fit"
          onClick={() => {
            setFault(null);
            setLife(null);
            setPhase("intro");
          }}
        >
          回到開場
        </Button>
      </main>
    );
  }

  if (phase === "intro") {
    return (
      <IntroView onBegin={() => startNext(randomSeed())} />
    );
  }

  if (phase === "drawing" || !life) return <DrawingView />;
  if (phase === "reveal") {
    return <RevealView life={life} onStart={() => setPhase(life.mortal ? "flash" : "life")} />;
  }
  if (phase === "flash") {
    return <FlashView lines={life.flash.length > 0 ? life.flash : ["沒有靈根。"]} onDone={finishFlash} />;
  }

  if (phase === "end") {
    return (
      <EndView
        life={life}
        onFarewell={(text) => {
          const trimmed = text.trim().slice(0, 80);
          setLife((current) => {
            if (!current) return current;
            const reflections = current.reflections.filter((item) => item.id !== "farewell");
            if (trimmed) {
              reflections.push({ id: "farewell", prompt: "對這個人說一句話", text: trimmed });
            }
            const next = { ...current, reflections };
            remember(next);
            return next;
          });
        }}
        onAgain={() => startNext(randomSeed())}
        onSame={() => begin(setup)}
        onIntro={() => setPhase("intro")}
      />
    );
  }

  return (
    <LifeView
      life={life}
      paused={paused}
      auto={auto}
      onPause={() => setPaused((value) => !value)}
      onAuto={() => setAuto((value) => !value)}
      onFocus={(focus: FocusId) => setLife((current) => (current ? { ...current, focus } : current))}
      onAdvance={() => {
        if (isFinished(life)) {
          remember(life);
          setPhase("end");
          return;
        }
        run((current) => (current.story ? current : advance(current, 1)));
      }}
      onChoice={(id) => {
        settleCarry(id);
        run((current) => applyChoice(current, id));
      }}
      onReflect={(text) => run((current) => applyReflection(current, text))}
      onStar={(id) => setLife((current) => (current ? toggleStar(current, id) : current))}
      onAbandon={() => {
        setAuto(false);
        setPaused(false);
        setPhase("intro");
      }}
    />
  );
}

function settleCarry(id: string) {
  if (id.startsWith("dig-past:dig")) clearBuried();
  if (id.startsWith("grudge:")) clearFoe();
  if (id.startsWith("haunt-voice:")) clearHaunt();
  if (id.startsWith("thread-")) clearThread();
}

function toPast(life: Life, line: string): PastLife {
  return {
    id: `${life.setup.seed}-${life.setup.world}-${life.setup.cohort}`,
    at: Date.now(),
    name: life.name,
    root: life.root,
    rootName: life.mortal ? "無靈根" : ROOTS[life.root].name,
    realm: life.realm,
    realmName: realmById(life.realm).name,
    age: life.age,
    cause: life.cause || (life.ending === "edge" ? "化神這一層走到頭了" : ""),
    line,
    world: life.setup.world,
    worldName: WORLDS[life.setup.world].name,
    ending: life.ending === "edge" ? "edge" : "dead",
  };
}
