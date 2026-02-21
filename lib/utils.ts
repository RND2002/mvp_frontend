import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import dayjs from "dayjs"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date | undefined, format: string = "DD MMMM, h:mm A") {
  if (!date) return "-";
  return dayjs(date).format(format);
}
