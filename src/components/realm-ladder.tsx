import { REALMS, formatPeople, type RealmId } from "@/lib/world";
import { cn } from "@/lib/utils";

export function RealmLadder({ current }: { current: RealmId }) {
  return (
    <ol className="flex flex-col gap-1.5">
      {REALMS.map((realm) => {
        const on = realm.id === current;
        return (
          <li
            key={realm.id}
            className={cn(
              "flex items-baseline justify-between gap-3 border-b border-border/70 pb-1 text-sm",
              on ? "text-[#9c2f2a]" : "text-muted-foreground",
            )}
          >
            <span className={on ? "font-semibold" : undefined}>{realm.name}</span>
            <span className="num">{formatPeople(realm.stock)}</span>
          </li>
        );
      })}
    </ol>
  );
}
