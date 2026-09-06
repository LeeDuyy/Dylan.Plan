const ENGLISH_MONTH_BY_NAME: Record<string, number> = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12
};

function stripDiacritics(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function toIsoDate(year: number, month: number, day: number) {
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    return null;
  }

  const pad = (part: number) => String(part).padStart(2, "0");
  return `${year}-${pad(month)}-${pad(day)}`;
}

function parseNumberDateMatch(match: RegExpExecArray, order: "ymd" | "dmy") {
  if (order === "ymd") {
    return toIsoDate(Number(match[2]), Number(match[3]), Number(match[4]));
  }

  return toIsoDate(Number(match[4]), Number(match[3]), Number(match[2]));
}

function findFirstValidDate(text: string, pattern: RegExp, order: "ymd" | "dmy") {
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    const parsed = parseNumberDateMatch(match, order);
    if (parsed) return parsed;
  }

  return null;
}

export function parseAbsoluteDeadline(text: string | null | undefined): string | null {
  const trimmed = text?.trim();
  if (!trimmed) return null;

  const isoDate = findFirstValidDate(trimmed, /(^|[^\d])(\d{4})-(\d{2})-(\d{2})(?=$|[^\d])/g, "ymd");
  if (isoDate) return isoDate;

  const slashOrDashDate = findFirstValidDate(trimmed, /(^|[^\d])(\d{1,2})[/-](\d{1,2})[/-](\d{4})(?=$|[^\d])/g, "dmy");
  if (slashOrDashDate) return slashOrDashDate;

  const normalized = stripDiacritics(trimmed).toLowerCase();
  const vietnameseDate = findFirstValidDate(normalized, /(^|[^\d])(\d{1,2})\s*thang\s*(\d{1,2})\s*,?\s*(\d{4})(?=$|[^\d])/g, "dmy");
  if (vietnameseDate) return vietnameseDate;

  const monthNames = Object.keys(ENGLISH_MONTH_BY_NAME).join("|");
  const monthFirstPattern = new RegExp(`(^|[^a-z0-9])(${monthNames})\\s+(\\d{1,2}),?\\s+(\\d{4})(?=$|[^a-z0-9])`, "gi");
  let monthFirstMatch: RegExpExecArray | null;
  while ((monthFirstMatch = monthFirstPattern.exec(trimmed)) !== null) {
    const month = ENGLISH_MONTH_BY_NAME[monthFirstMatch[2]?.toLowerCase() ?? ""];
    const parsed = month ? toIsoDate(Number(monthFirstMatch[4]), month, Number(monthFirstMatch[3])) : null;
    if (parsed) return parsed;
  }

  const dayFirstPattern = new RegExp(`(^|[^a-z0-9])(\\d{1,2})\\s+(${monthNames})\\s+(\\d{4})(?=$|[^a-z0-9])`, "gi");
  let dayFirstMatch: RegExpExecArray | null;
  while ((dayFirstMatch = dayFirstPattern.exec(trimmed)) !== null) {
    const month = ENGLISH_MONTH_BY_NAME[dayFirstMatch[3]?.toLowerCase() ?? ""];
    const parsed = month ? toIsoDate(Number(dayFirstMatch[4]), month, Number(dayFirstMatch[2])) : null;
    if (parsed) return parsed;
  }

  return null;
}
