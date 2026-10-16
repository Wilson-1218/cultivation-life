"use client";

import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-6">
      <h1 className="text-3xl font-semibold">這一世沒有推演完</h1>
      <p className="mt-3 leading-8 text-muted-foreground">頁面中途斷了。可以再走一次。</p>
      <Button className="mt-6 h-11 w-fit" onClick={() => reset()}>
        重新來過
      </Button>
    </main>
  );
}
