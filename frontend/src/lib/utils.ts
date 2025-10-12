import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };


// custom utils below... svelte-schadcn utils above...

export let focusVisibleRingStyle = "rounded-md focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive outline-none transition-all focus-visible:ring-[3px]"
export let focusWithinRingStyle = "rounded-md  focus-within:[&:has(:focus-visible)]:ring-ring/50 focus-within:[&:has(:focus-visible)]:border-ring aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive outline-none transition-all focus-within:[&:has(:focus-visible)]:ring-[3px]"
export let ringStyle = "rounded-md border-ring ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive outline-none transition-all ring-[3px]"

// a debounce function that only triggers on the trailing edge
export const debounce = (func: Function, timeout = 300) => {
  // @ts-ignore
  let timer;
  // @ts-ignore
  return (...args) => {
    // @ts-ignore
    clearTimeout(timer);
    timer = setTimeout(() => {
      // @ts-ignore
      func.apply(this, args);
    }, timeout);
  };
};


// checks if a click is outside an element
export function clickOutside(node: HTMLElement, callback: () => void) {
  function handle(event: MouseEvent | FocusEvent | KeyboardEvent) {
    if (event instanceof KeyboardEvent && event.key === "Escape") {
      callback()
    }
    else if (node && !node.contains(event.target as Node)) {
      callback();
    }
  }

  document.addEventListener("keydown", handle, true)
  document.addEventListener("click", handle, true);
  document.addEventListener("focusin", handle, true);

  return {
    destroy() {
      document.removeEventListener("keydown", handle, true)
      document.removeEventListener("click", handle, true);
      document.removeEventListener("focusin", handle, true);
    },
  };
}

//Check if a hex color is dark. Returns true if dark, false if light.
export function isDark(hex: string): boolean {
  // Remove leading # if present
  hex = hex.replace(/^#/, "");

  // Expand shorthand (e.g. "03F") to full form ("0033FF")
  if (hex.length === 3) {
    hex = hex.split("").map(c => c + c).join("");
  }

  if (hex.length !== 6) {
    throw new Error("Invalid HEX color.");
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate relative luminance (per WCAG)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance < 0.5; // true = dark, false = light
}

// format a timestamp into a date
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);

  return date.toLocaleDateString(undefined, {
    month: "short", // "Jan", "Feb", etc.
    day: "numeric"  // 1, 2, ..., 31
  });
}

// formats a duration to human readable
export function formatDuration(ms: number, short = false): string {
  if (ms < 1000) return short ? "0s" : "0 sec"; // less than 1 second

  if (ms < 60000) {
    const seconds = Math.floor(ms / 1000);
    return seconds + (short ? "s" : " sec");
  }

  const totalMinutes = Math.floor(ms / 60000); // 1 min = 60000 ms
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const parts: string[] = [];
  if (hours > 0) {
    parts.push(hours + (short ? "h" : " hour" + (hours !== 1 ? "s" : "")))
  }
  if (minutes > 0) {
    parts.push(minutes + (short ? "m" : " min"));
  }

  return parts.join(" ");
}


// converts date and time strings (from input fields) into the date ms
export function stringToDate(dateString: string, timeString: string): number {
  const dateTimeString = `${dateString}T${timeString}`;

  const date = new Date(dateTimeString);

  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date or time string: ${dateString} ${timeString}`);
  }

  return date.getTime();
}


// Extracts "YYYY-MM-DD"
export function msToDateString(ms: number): string {
  const date = new Date(ms);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Extracts "HH:mm" (or "HH:mm:ss" if you prefer)
export function msToTimeString(ms: number, includeSeconds = false): string {
  const date = new Date(ms);

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return includeSeconds
    ? `${hours}:${minutes}:${seconds}`
    : `${hours}:${minutes}`;
}


export function isToday(input: Date | number): boolean {
  const date = input instanceof Date ? input : new Date(input);
  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

export function formatDayOfWeek(
  dateMs: number,
  format: "long" | "short" | "tiny" = "long"
): string {
  const date = new Date(dateMs);

  if (format === "tiny") {
    // Custom tiny format: just first letter (M, T, W, …)
    return date
      .toLocaleDateString(undefined, { weekday: "short" })
      .charAt(0)
      .toUpperCase();
  }

  // Use Intl for "long" and "short"
  return date.toLocaleDateString(undefined, {
    weekday: format,
  });
}

// Function to convert file to data URL
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function capitalize(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}