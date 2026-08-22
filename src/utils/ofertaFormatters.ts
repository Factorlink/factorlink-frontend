export const EMPTY_DISPLAY = "—";

export type OptionalValue = string | number | Date | null | undefined;

export const isInformed = (
  value: OptionalValue,
): value is string | number | Date => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string" && value.trim() === "") return false;
  return true;
};

export const toFiniteNumber = (
  value: string | number | null | undefined,
): number | undefined => {
  if (!isInformed(value)) return undefined;
  const n = typeof value === "number" ? value : Number(String(value).trim());
  return Number.isFinite(n) ? n : undefined;
};

const DATE_ONLY_RE = /^(\d{4})-(\d{2})-(\d{2})/;

export const parseDateOnly = (value: OptionalValue): Date | null => {
  if (!isInformed(value)) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const match = DATE_ONLY_RE.exec(String(value).trim());
  if (match) {
    const year = Number(match[1]);
    const month = Number(match[2]) - 1;
    const day = Number(match[3]);
    const date = new Date(year, month, day);
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month ||
      date.getDate() !== day
    ) {
      return null;
    }
    return date;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const toDateOnlyString = (value: OptionalValue): string | undefined => {
  const date = parseDateOnly(value);
  if (!date) return undefined;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formatOptional = <T>(
  value: T,
  formatter: (informed: NonNullable<T>) => string,
): string => {
  if (!isInformed(value as OptionalValue)) return EMPTY_DISPLAY;
  return formatter(value as NonNullable<T>);
};

export const formatMoney = (value: OptionalValue): string => {
  const n = toFiniteNumber(value as string | number | null | undefined);
  if (n === undefined) return EMPTY_DISPLAY;
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(n);
};

export const formatPercent = (value: OptionalValue): string => {
  const n = toFiniteNumber(value as string | number | null | undefined);
  if (n === undefined) return EMPTY_DISPLAY;
  return `${n}%`;
};

export const formatInteger = (value: OptionalValue): string => {
  const n = toFiniteNumber(value as string | number | null | undefined);
  if (n === undefined) return EMPTY_DISPLAY;
  return String(Math.trunc(n));
};

/** No usa parseDateOnly porque truncaría la hora de un ISO completo. */
export const formatDateTime = (value: OptionalValue): string => {
  if (!isInformed(value)) return EMPTY_DISPLAY;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return EMPTY_DISPLAY;
  return date.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDateOnly = (value: OptionalValue): string => {
  const date = parseDateOnly(value);
  if (!date) return EMPTY_DISPLAY;
  return date.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
