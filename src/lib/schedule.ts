// Shared schedule presentation logic for the public timetable and the
// authenticated /me view. The public timetable API carries no explicit
// category, so `kind` is inferred from the item title; both views use the same
// dots, colors, and legend so the language stays consistent.

// A row from either source: the public TimetableItem or the /me timetable.
// Only the fields used for grouping/rendering are required here.
export type ScheduleRow = {
  day: number | string;
  start_time?: string | null;
  end_time?: string | null;
  title: string;
  location?: string | null;
  notes?: string | null;
};

export const KIND_COLOR: Record<string, string> = {
  arrival: "#B0822B",
  worship: "#5A3E8C",
  talk: "#241B2E",
  meal: "#9A8E7C",
  social: "#C99A3F",
  prayer: "#5A3E8C",
  mass: "#B0822B",
};

export const KIND_LABEL: Record<string, string> = {
  arrival: "Arrival",
  worship: "Worship",
  talk: "Session",
  meal: "Meal",
  social: "Gathering",
  prayer: "Prayer",
  mass: "Holy Mass",
};

export function inferKind(title: string): string {
  const t = title.toLowerCase();
  if (/\bmass\b/.test(t)) return "mass";
  if (/prayer|adoration|confession|rosary/.test(t)) return "prayer";
  if (/praise|worship/.test(t)) return "worship";
  if (/breakfast|lunch|dinner|meal|\btea\b|snack/.test(t)) return "meal";
  if (/arriv|registration|departure|check-?in/.test(t)) return "arrival";
  if (/session|talk|keynote|address|reflection|workshop|commission|welcome/.test(t)) return "talk";
  return "social";
}

// Group rows by `day`, preserving day order and sorting each day by start time.
export function groupByDay<T extends ScheduleRow>(items: T[]): { day: number | string; items: T[] }[] {
  const map = new Map<string, { day: number | string; items: T[] }>();
  for (const item of items) {
    const key = String(item.day);
    if (!map.has(key)) map.set(key, { day: item.day, items: [] });
    map.get(key)!.items.push(item);
  }
  const groups = Array.from(map.values());
  groups.sort((a, b) => String(a.day).localeCompare(String(b.day), undefined, { numeric: true }));
  for (const g of groups) {
    g.items.sort((a, b) => (a.start_time ?? "").localeCompare(b.start_time ?? ""));
  }
  return groups;
}
