// app/utils/date.ts
import dayjs, { Dayjs } from "dayjs";

export const DATE_FORMAT = "DD-MM-YYYY";
export const DATE_DISPLAY_FORMAT = "DD/MM/YYYY";

export const parseDate = (value?: string): Dayjs | null => {
  if (!value) return null;
  const parsed = dayjs(value, DATE_FORMAT, true);
  return parsed.isValid() ? parsed : null;
};

export const formatDate = (date: Dayjs | null): string =>
  date ? date.format(DATE_FORMAT) : "";

export const today = () => dayjs();

export function formatToShortDate(dateString: string): string {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatToShortDateTime(dateString: string): string {
  if (!dateString) return "-";

  const date = new Date(dateString);

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
