import { cn } from "@/lib/utils";

export function heartFill(heart: number): string {
  const t = Math.max(0, Math.min(100, heart)) / 100;
  const paper = [239, 228, 208];
  const ink = [28, 22, 18];
  const mix = paper.map((channel, index) => Math.round(channel + (ink[index]! - channel) * t));
  return `rgb(${mix.join(",")})`;
}

export function YearGrid({
  lived,
  hearts,
  markAge,
  current,
  columns = 10,
}: {
  lived: number;
  hearts: number[];
  markAge?: number | null;
  current?: number | null;
  columns?: number;
}) {
  const last = Math.max(lived, markAge ?? lived);
  const count = last <= 220 ? last + 1 : Math.min(220, lived + 1);
  const markHere = markAge != null && markAge >= 0 && markAge < count;
  let carried = hearts.find((value) => Number.isFinite(value)) ?? 46;
  return (
    <div
      className="grid w-full min-w-0 gap-1"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      aria-label="人生地圖"
    >
      {Array.from({ length: count }, (_, year) => {
        const known = hearts[year];
        if (Number.isFinite(known)) carried = known!;
        const seen = year <= lived;
        return (
          <div
            key={year}
            title={seen ? `${year}歲，心境 ${Math.round(carried)}` : `${year}歲`}
            className={cn(
              "aspect-square min-w-0 rounded-[2px] border border-border",
              markHere && year === markAge && "border-2 border-foreground",
              current === year && seen && "ring-1 ring-[#9c2f2a]",
            )}
            style={seen ? { backgroundColor: heartFill(carried) } : undefined}
          />
        );
      })}
    </div>
  );
}
