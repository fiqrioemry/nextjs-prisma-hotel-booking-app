import { Brain, Bubbles, Database, Megaphone, Moon, Sun } from "lucide-react";

export const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
];

export const transactionOptions = [
  { value: "GRANTED", label: "Granted" },
  { value: "TOPUP", label: "Top Up" },
  { value: "USAGE", label: "Usage" },
];

export const limitOptions = [
  { value: "10", label: "10 / page" },
  { value: "20", label: "20 / page" },
  { value: "50", label: "50 / page" },
  { value: "100", label: "100 / page" },
];

export const statusOptions = [
  { value: "PENDING", label: "Pending" },
  { value: "PAID", label: "Paid" },
  { value: "FAILED", label: "Failed" },
];

export const themeOptions = [
  { value: "light", label: "light", icon: Sun },
  { value: "bubblegum", label: "bubblegum", icon: Bubbles },
  { value: "claude", label: "claude", icon: Brain },
  { value: "supabase", label: "supabase", icon: Database },
  { value: "dark", label: "dark", icon: Moon },
  { value: "system", label: "system", icon: Megaphone },
];

export const timezoneOptions = [
  { value: "Asia/Jakarta", label: "Asia/Jakarta (WIB, UTC+7)" },
  { value: "Asia/Singapore", label: "Asia/Singapore (UTC+8)" },
  { value: "America/New_York", label: "America/New_York (ET, UTC-5/UTC-4)" },
  { value: "Europe/London", label: "Europe/London (UK, UTC+0/UTC+1)" },
  { value: "Asia/Tokyo", label: "Asia/Tokyo (JST, UTC+9)" },
];

export const languageOptions = [
  { value: "EN", label: "English" },
  { value: "ID", label: "Bahasa Indonesia" },
];
