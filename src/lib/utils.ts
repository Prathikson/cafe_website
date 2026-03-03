import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ease = {
  expo: [0.16, 1, 0.3, 1],
  circ: [0, 0.55, 0.45, 1],
  back: [0.34, 1.56, 0.64, 1],
} as const;

export function stagger(count: number, delay = 0.08) {
  return Array.from({ length: count }, (_, i) => delay * i);
}
