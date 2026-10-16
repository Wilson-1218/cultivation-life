"use client";

import { useEffect, useState } from "react";
import { EndView } from "@/components/end-view";
import { IntroView } from "@/components/intro-view";
import { LifeView } from "@/components/life-view";
import { DrawingView, RevealView } from "@/components/reveal-view";
import { Button } from "@/components/ui/button";
import {
  advance,
  applyChoice,
  applyReflection,
  autoChoiceId,
  autoFocus,
  createLife,
  isFinished,
  randomSeed,
  toggleStar,
  type Life,
} from "@/lib/engine";
import { upsertPast, type PastLife } from "@/lib/storage";
import {
  PACES,
  ROOTS,
  WORLDS,
  realmById,
  type CohortId,
  type FocusId,
  type PaceId,
  type Setup,
  type WorldId,
} from "@/lib/world";

type Phase = "intro" | "drawing" | "reveal" | "life" | "end";

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
    const timer = window.setTimeout(() => setPhase("reveal"), reduce ? 0 : 650);
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "life" || !auto || paused || !life || fault) return;
    if (isFinished(life)) {
      const timer = window.setTimeout(() => {
        remember(life);
        setPhase("end");
      }, 700);
      return () => window.clearTimeout(timer);
    }
    const delay = life.pending ? 780 : PACES[life.setup.pace].delay;
    const timer = window.setTimeout(() => {
      setLife((current) => {
        if (!current || isFinished(current)) return current;
        try {
          if (current.pending?.type === "choice") return applyChoice(current, autoChoiceId(current));
          if (current.pending?.type === "reflect") return applyReflection(current, "");
          return advance({ ...current, focus: autoFocus(current) });
        } catch {
          setFault("推演進行到一半斷了。");
          return current;
        }
      });
    }, delay);
    return () => window.clearTimeout(timer);
  }, [phase, auto, paused, life, fault]);

  function remember(current: Life) {
    const line = current.reflections.find((item) => item.id === "farewell")?.text ?? "";
    upsertPast(toPast(current, line));
  }

  function begin(nextSetup: Setup) {
    setFault(null);
    setAuto(false);
    setPaused(false);
    try {
      setLife(createLife(nextSetup));
      setSetup(nextSetup);
      setPhase("drawing");
    } catch {
      setLife(null);
      setFault("這一世沒有抽成。");
    }
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
      <IntroView
        world={setup.world}
        cohort={setup.cohort}
        pace={setup.pace}
        onWorld={(world: WorldId) => setSetup((current) => ({ ...current, world }))}
        onCohort={(cohort: CohortId) => setSetup((current) => ({ ...current, cohort }))}
        onPace={(pace: PaceId) => setSetup((current) => ({ ...current, pace }))}
        onBegin={() => begin({ ...setup, seed: randomSeed() })}
      />
    );
  }

  if (phase === "drawing" || !life) return <DrawingView />;
  if (phase === "reveal") return <RevealView life={life} onStart={() => setPhase("life")} />;

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
        onAgain={() => begin({ ...setup, seed: randomSeed() })}
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
      onPace={(pace) => {
        setSetup((current) => ({ ...current, pace }));
        setLife((current) => (current ? { ...current, setup: { ...current.setup, pace } } : current));
      }}
      onFocus={(focus: FocusId) => setLife((current) => (current ? { ...current, focus } : current))}
      onAdvance={() => {
        if (isFinished(life)) {
          remember(life);
          setPhase("end");
          return;
        }
        run((current) => advance(current));
      }}
      onChoice={(id) => run((current) => applyChoice(current, id))}
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

function toPast(life: Life, line: string): PastLife {
  return {
    id: `${life.setup.seed}-${life.setup.world}-${life.setup.cohort}`,
    at: Date.now(),
    name: life.name,
    root: life.root,
    rootName: ROOTS[life.root].name,
    realm: life.realm,
    realmName: realmById(life.realm).name,
    age: life.age,
    cause: life.cause || (life.ending === "edge" ? "停在化神之前" : ""),
    line,
    world: life.setup.world,
    worldName: WORLDS[life.setup.world].name,
    ending: life.ending === "edge" ? "edge" : "dead",
  };
}
