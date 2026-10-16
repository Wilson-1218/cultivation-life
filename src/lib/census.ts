import { POPULATION, REALMS, ROOTS, type RealmId, type RootId } from "./world";

export function allocateStocks(
  hits: Record<RootId, Record<RealmId, number>>,
  perRoot: Record<RootId, number>,
): Record<RealmId, number> {
  const weights = REALMS.map((realm) => {
    let weight = 0;
    for (const root of Object.keys(ROOTS) as RootId[]) {
      const samples = perRoot[root];
      if (samples <= 0) continue;
      weight += (hits[root][realm.id] / samples) * ROOTS[root].share;
    }
    return weight;
  });
  const counts = largestRemainder(weights, POPULATION);
  const stocks = {} as Record<RealmId, number>;
  REALMS.forEach((realm, index) => {
    stocks[realm.id] = counts[index] ?? 0;
  });
  return stocks;
}

export function largestRemainder(weights: number[], total: number): number[] {
  const sum = weights.reduce((acc, weight) => acc + weight, 0);
  const scale = sum > 0 ? total / sum : 0;
  const raw = weights.map((weight) => weight * scale);
  const floors = raw.map((value) => Math.floor(value));
  const left = total - floors.reduce((acc, value) => acc + value, 0);
  const order = raw
    .map((value, index) => ({ index, frac: value - Math.floor(value) }))
    .sort((a, b) => b.frac - a.frac || a.index - b.index);
  for (let cursor = 0; cursor < left; cursor += 1) {
    const next = order[cursor % order.length];
    if (!next) break;
    floors[next.index] += 1;
  }
  return floors;
}
