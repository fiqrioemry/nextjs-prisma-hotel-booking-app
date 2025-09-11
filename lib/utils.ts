//

import { format } from "date-fns";
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(number);
};

type DateFormat = "DD/MM/YY" | "MM/DD/YY" | "YYYY-MM-DD" | "LOCALE";

export const formatDateTime = (
  dateStr: string | Date,
  format: DateFormat = "LOCALE"
) => {
  const date = new Date(dateStr);

  switch (format) {
    case "DD/MM/YY":
      return `${String(date.getDate()).padStart(2, "0")}/${String(
        date.getMonth() + 1
      ).padStart(2, "0")}/${String(date.getFullYear()).slice(-2)} ${String(
        date.getHours()
      ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

    case "MM/DD/YY":
      return `${String(date.getMonth() + 1).padStart(2, "0")}/${String(
        date.getDate()
      ).padStart(2, "0")}/${String(date.getFullYear()).slice(-2)} ${String(
        date.getHours()
      ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

    case "YYYY-MM-DD":
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(date.getDate()).padStart(2, "0")} ${String(
        date.getHours()
      ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

    default: // pakai format lokal (id-ID)
      return date.toLocaleString("id-ID", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
  }
};

export const formatDate = (dateStr: string, format: DateFormat = "LOCALE") => {
  const date = new Date(dateStr);

  switch (format) {
    case "DD/MM/YY":
      return `${String(date.getDate()).padStart(2, "0")}/${String(
        date.getMonth() + 1
      ).padStart(2, "0")}/${String(date.getFullYear()).slice(-2)}`;

    case "MM/DD/YY":
      return `${String(date.getMonth() + 1).padStart(2, "0")}/${String(
        date.getDate()
      ).padStart(2, "0")}/${String(date.getFullYear()).slice(-2)}`;

    case "YYYY-MM-DD":
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(date.getDate()).padStart(2, "0")}`;

    default:
      return date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
  }
};

export const formatDateRange = (startDate: Date, endDate: Date) => {
  const start = format(startDate, "MMM yyyy");
  const end = format(endDate, "MMM yyyy");
  return `${start} - ${end}`;
};

export const calculateDuration = (startDate: Date, endDate: Date) => {
  const months =
    Math.abs(endDate.getTime() - startDate.getTime()) /
    (1000 * 60 * 60 * 24 * 30);
  const years = Math.floor(months / 12);
  const remainingMonths = Math.floor(months % 12);

  if (years === 0) {
    return `${remainingMonths} month${remainingMonths !== 1 ? "s" : ""}`;
  } else if (remainingMonths === 0) {
    return `${years} year${years !== 1 ? "s" : ""}`;
  } else {
    return `${years} year${years !== 1 ? "s" : ""} ${remainingMonths} month${
      remainingMonths !== 1 ? "s" : ""
    }`;
  }
};
