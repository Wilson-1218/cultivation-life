"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mark, WithMark, passageMark } from "@/components/marks";
import { type Companion } from "@/lib/engine";
import { ROOTS, realmById } from "@/lib/world";

export function CompanionLife({
  companion,
  onClose,
}: {
  companion: Companion | null;
  onClose: () => void;
}) {
  const open = companion !== null;
  const ending = companion
    ? companion.mortal
      ? `${companion.finalAge}歲。${companion.cause}。`
      : companion.ending === "edge"
        ? `還活著，${companion.finalAge}歲。化神走到這一輪的盡頭。`
        : `${companion.finalAge}歲。${companion.cause}停在${realmById(companion.finalRealm).name}。`
    : "";

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent>
        {companion ? (
          <>
            <DialogHeader>
              <DialogTitle>
                <WithMark name="companion">{companion.name}的一生</WithMark>
              </DialogTitle>
              <DialogDescription>
                <span className="block">
                  <WithMark name="root">{companion.mortal ? "無靈根" : ROOTS[companion.root].name}</WithMark>
                  <span>
                    {" "}
                    · {companion.region} · {ending}
                  </span>
                </span>
                <span className="mt-1 block">同一套規則走出的短章，看完就回到你自己的人生。</span>
              </DialogDescription>
            </DialogHeader>
            <ol className="flex max-h-[min(38vh,22rem)] flex-col gap-4 overflow-y-auto pr-1">
              {companion.chapters.map((chapter, index) => (
                <li key={`${chapter.age}-${index}`} className="border-l border-border pl-3 text-sm leading-7">
                  <span className="num text-muted-foreground">{chapter.age}歲</span>
                  <span className="mt-1 block">
                    {passageMark(chapter.text) ? (
                      <Mark name={passageMark(chapter.text)!} className="mr-1 align-[-0.15em]" />
                    ) : null}
                    {chapter.text}
                  </span>
                </li>
              ))}
            </ol>
            <Button className="h-11 shrink-0" onClick={onClose}>
              回到自己的人生
            </Button>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
