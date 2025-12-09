export function getDateBR() {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })
  );
}

export function isInsideRange(range: string | null, now: Date) {
  if (!range) return true;

  const [start, end] = range.split("-").map(Number);
  const h = now.getHours();

  return h >= start && h < end;
}

export function sentInThisRange(last: Date | null, range: string | null, now: Date) {
  if (!last || !range) return false;
  if (last.toDateString() !== now.toDateString()) return false;

  const [start, end] = range.split("-").map(Number);
  const h = last.getHours();

  return h >= start && h < end;
}
