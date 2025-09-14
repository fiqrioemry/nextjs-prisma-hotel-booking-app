import { Brain, Bubbles, Database, Megaphone, Moon, Sun } from "lucide-react";

export const sortOptions = [
  { value: "available_rooms", label: "room available" },
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
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

export const paymentStatusOptions = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "PAID", label: "Paid" },
  { value: "FAILED", label: "Failed" },
];

export const locationOptions = [
  { value: "medan", label: "Medan" },
  { value: "semarang", label: "Semarang" },
  { value: "bandung", label: "Bandung" },
  { value: "jakarta", label: "Jakarta" },
  { value: "surabaya", label: "Surabaya" },
];

export const themeOptions = [
  { value: "light", label: "light", icon: Sun },
  { value: "bubblegum", label: "bubblegum", icon: Bubbles },
  { value: "claude", label: "claude", icon: Brain },
  { value: "supabase", label: "supabase", icon: Database },
  { value: "dark", label: "dark", icon: Moon },
  { value: "system", label: "system", icon: Megaphone },
];

export const languageOptions = [
  { value: "EN", label: "English" },
  { value: "ID", label: "Bahasa Indonesia" },
];
