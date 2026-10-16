import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type MarkName = "stone" | "realm" | "root" | "life" | "pill" | "companion";

const GLYPH: Record<MarkName, ReactNode> = {
  stone: (
    <>
      <path d="M8 1.7 12.3 5.2 11.15 14.3H4.85L3.7 5.2Z" />
      <path d="M3.7 5.2h8.6M8 5.2v9.1" />
    </>
  ),
  realm: <path d="M2.2 13.6H6V10h3.7V6.4H13.8V2.8" />,
  root: (
    <>
      <path d="M2.2 3.4h11.6" />
      <path d="M4.8 3.4c.15 2.6-.7 5-2.2 8.4" />
      <path d="M8 3.4v9.3" />
      <path d="M11.2 3.4c-.15 2.6.7 5 2.2 8.4" />
      <path d="M8 7.1c1.7.7 2.7 1 3.6.7" />
    </>
  ),
  life: (
    <>
      <path d="M8 1.7c.95 1.05.95 1.85 0 2.7-.95-.85-.95-1.65 0-2.7Z" />
      <path d="M6.25 5.55h3.5v7.15h-3.5Z" />
      <path d="M5.45 12.7h5.1" />
    </>
  ),
  pill: (
    <>
      <path d="M6.1 2.4h3.8M6.7 2.4v1.7h2.6V2.4" />
      <path d="M5.15 6h5.7v.7c0 3.15-.7 5.55-2.85 5.55S5.15 9.85 5.15 6.7V6Z" />
    </>
  ),
  companion: (
    <>
      <circle cx="5.15" cy="4.25" r="1.35" />
      <path d="M2.65 13.25v-3c0-1.45 5-1.45 5 0v3" />
      <circle cx="11.15" cy="4.85" r="1.2" />
      <path d="M8.85 13.25v-2.55c0-1.3 4.5-1.3 4.5 0v2.55" />
    </>
  ),
};

export function Mark({ name, className }: { name: MarkName; className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("inline-block size-[1em] shrink-0", className)}
    >
      {GLYPH[name]}
    </svg>
  );
}

export function WithMark({
  name,
  children,
  className,
}: {
  name: MarkName;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-[0.35em]", className)}>
      <Mark name={name} />
      <span>{children}</span>
    </span>
  );
}

export function choiceMarks(title: string, body: string): MarkName[] {
  const marks: MarkName[] = [];
  if (/丹|速成的藥/.test(title)) marks.push("pill");
  if (/延壽/.test(title)) marks.push("life");
  if (/靈石|坊市|斷供|喂|壓進/.test(title) || /坊市/.test(body)) marks.push("stone");
  return marks.slice(0, 2);
}

export function buttonMark(title: string, body: string, label: string): MarkName | null {
  const fromLabel = labelMark(label);
  if (fromLabel) return fromLabel;
  const marks = choiceMarks(title, body);
  if (marks.includes("pill") && /買/.test(label)) return "pill";
  if (marks.includes("stone") && /花 .*塊/.test(label)) return "stone";
  return null;
}

export function labelMark(label: string): MarkName | null {
  if (/丹|藥/.test(label)) return "pill";
  if (/靈石|坊市|斷供|喂|壓進/.test(label)) return "stone";
  if (/壽元/.test(label)) return "life";
  if (/靈根/.test(label)) return "root";
  return null;
}

export function passageMark(text: string): MarkName | null {
  if (/斷供|喂靈石|喂這一層|壓進|坊市/.test(text)) return "stone";
  if (/續氣丹|延壽丹|速成的藥|那瓶丹|丹是/.test(text)) return "pill";
  return null;
}
