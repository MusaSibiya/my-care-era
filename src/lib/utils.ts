import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompact(amount: number): string {
  if (amount >= 1_000_000) return `R${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `R${(amount / 1_000).toFixed(0)}k`;
  return `R${amount}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getDemandColor(level: string): string {
  switch (level?.toLowerCase()) {
    case "very high":
      return "bg-emerald-100 text-emerald-800 border border-emerald-200";
    case "high":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    case "moderate":
    case "medium":
      return "bg-amber-50 text-amber-800 border border-amber-200";
    case "low":
      return "bg-red-50 text-red-700 border border-red-200";
    default:
      return "bg-slate-50 text-slate-700 border border-slate-200";
  }
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "text-emerald-700";
  if (score >= 60) return "text-amber-700";
  if (score >= 40) return "text-orange-700";
  return "text-red-700";
}

export function calculateAPS(subjects: { level: number }[]): number {
  return subjects.reduce((sum, s) => sum + Math.min(s.level, 7), 0);
}
