import { toJalaali } from "jalaali-js";
import jalaali from "jalaali-js";
// import jalaali from "jalaali-js";
// import { type ClassValue, clsx } from 'clsx';
// import { twMerge } from 'tailwind-merge';

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs));
// }

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatFileNameWithDate = (originalName: string) => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  // Generate 6-digit random number
  const random6Digits = Math.floor(100000 + Math.random() * 900000);

  const lastDotIndex = originalName.lastIndexOf(".");
  const name =
    lastDotIndex === -1 ? originalName : originalName.slice(0, lastDotIndex);
  const extension =
    lastDotIndex === -1 ? "" : originalName.slice(lastDotIndex + 1);

  if (extension) {
    return `${name}_${year}${month}${day}_${random6Digits}.${extension}`;
  } else {
    return `${name}_${year}${month}${day}_${random6Digits}`;
  }
};

export function formatPersianDate(isoDateString) {
  const date = new Date(isoDateString);
  const now = new Date();

  // Convert to Jalaali (Persian) date
  const persianDate = toJalaali(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  );

  const persianNow = toJalaali(
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate(),
  );

  // Check if it's today
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  // Check if it's in the current week
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)

  const isThisWeek = date >= startOfWeek && date <= now;

  // Persian day names
  const persianDays = [
    "یکشنبه",
    "دوشنبه",
    "سه‌شنبه",
    "چهارشنبه",
    "پنجشنبه",
    "جمعه",
    "شنبه",
  ];

  // Persian month names
  const persianMonths = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
  ];

  if (isToday) {
    // Return time in HH:MM format
    return date.toLocaleTimeString("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } else if (isThisWeek) {
    // Return Persian day name
    const dayOfWeek = date.getDay();
    return persianDays[dayOfWeek];
  } else if (persianDate.jy === persianNow.jy) {
    // Same year - return day and month
    return `${persianDate.jd} ${persianMonths[persianDate.jm - 1]}`;
  } else {
    // Different year - return full date
    return `${persianDate.jy}/${persianDate.jm}/${persianDate.jd}`;
  }
}

// Alternative version without jalaali-js dependency (basic implementation)
export function formatPersianDateBasic(isoDateString) {
  const date = new Date(isoDateString);
  const now = new Date();

  // Persian day names
  const persianDays = [
    "یکشنبه",
    "دوشنبه",
    "سه‌شنبه",
    "چهارشنبه",
    "پنجشنبه",
    "جمعه",
    "شنبه",
  ];

  // Check if it's today
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  // Check if it's in the current week
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());

  const isThisWeek = date >= startOfWeek && date <= now;

  if (isToday) {
    // Return time in HH:MM format
    return date.toLocaleTimeString("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } else if (isThisWeek) {
    // Return Persian day name
    const dayOfWeek = date.getDay();
    return persianDays[dayOfWeek];
  } else if (date.getFullYear() === now.getFullYear()) {
    // Same year - use simple formatting
    return date.toLocaleDateString("fa-IR", {
      month: "long",
      day: "numeric",
    });
  } else {
    // Different year - return full date
    return date.toLocaleDateString("fa-IR");
  }
}

export function toPersianClock(isoDateString) {
  const date = new Date(isoDateString);

  // Get hours and minutes
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Convert to Persian digits
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

  const formatToPersian = (number) => {
    return number
      .toString()
      .replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
  };

  // Format as HH:MM with Persian digits
  const formattedHours = formatToPersian(hours.toString().padStart(2, "0"));
  const formattedMinutes = formatToPersian(minutes.toString().padStart(2, "0"));

  return `${formattedHours}:${formattedMinutes}`;
}

// Alternative version using toLocaleTimeString
export function toPersianClockSimple(isoDateString) {
  const date = new Date(isoDateString);

  return date.toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

// import { toJalaali } from "jalaali-js";

type Message = {
  id: string;
  text: string;
  createdAt: string; // ISO string
};

export function labelFirstMessageOfDay(
  messages: Message[],
): (Message & { label?: string })[] {
  const labeled: (Message & { label?: string })[] = [];
  let lastJalaliDay = "";

  for (const msg of messages) {
    const date = new Date(msg.createdAt);
    const { jy, jm, jd } = toJalaali(date);
    const jalaliKey = `${jy}-${jm}-${jd}`;

    if (jalaliKey !== lastJalaliDay) {
      const today = new Date();
      const { jy: ty, jm: tm, jd: td } = toJalaali(today);

      let label = "";
      if (jy === ty && jm === tm && jd === td) {
        label = "امروز";
      } else if (jy === ty && jm === tm && jd === td - 1) {
        label = "دیروز";
      } else {
        const monthNames = [
          "",
          "فروردین",
          "اردیبهشت",
          "خرداد",
          "تیر",
          "مرداد",
          "شهریور",
          "مهر",
          "آبان",
          "آذر",
          "دی",
          "بهمن",
          "اسفند",
        ];
        label = `${jd} ${monthNames[jm]} ${jy}`;
      }

      labeled.push({ ...msg, label });
      lastJalaliDay = jalaliKey;
    } else {
      labeled.push({ ...msg });
    }
  }

  return labeled;
}

export function labelLastMessageOfDay(
  messages: Message[],
): (Message & { label?: string })[] {
  const labeled: (Message & { label?: string })[] = [];
  const seenDays = new Set<string>();

  const monthNames = [
    "",
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
  ];

  const today = new Date();
  const { jy: ty, jm: tm, jd: td } = toJalaali(today);

  // Traverse in reverse
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    const date = new Date(msg.createdAt);
    const { jy, jm, jd } = toJalaali(date);
    const jalaliKey = `${jy}-${jm}-${jd}`;

    let label: string | undefined;

    if (!seenDays.has(jalaliKey)) {
      if (jy === ty && jm === tm && jd === td) {
        label = "امروز";
      } else if (jy === ty && jm === tm && jd === td - 1) {
        label = "دیروز";
      } else {
        label = `${jd} ${monthNames[jm]} ${jy}`;
      }
      seenDays.add(jalaliKey);
    }

    labeled[i] = label ? { ...msg, label } : { ...msg };
  }

  return labeled;
}

// get type from mimetype
export function inferType(mime: string) {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  return "file";
}

export function formatJalaaliDate(dateStr: string): string {
  const gDate = new Date(dateStr);
  const { jy, jm, jd } = jalaali.toJalaali(gDate);
  const monthNames = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
  ];
  return `${jd} ${monthNames[jm - 1]} ${jy}`;
}

// @/lib/utils/persian-slugify.ts

/**
 * Converts Persian text into a hyphenated, URL-safe display slug.
 * This function keeps the Farsi characters (for SEO) but replaces spaces and punctuation.
 * @param text The input Persian string (e.g., "گوشی موبایل اپل")
 * @returns The clean display slug (e.g., "گوشی-موبایل-اپل")
 */
export function persianSlugify(text: string): string {
  if (!text) return "";

  return (
    text
      .toString()
      .trim()
      // Replace spaces, dots, commas, etc., with a single hyphen.
      .replace(/[\s\.\,،\/\\|]+/g, "-")
      // Remove known unsafe URL characters (e.g., query params).
      .replace(/[?#&%!@*()\[\]{}<>"']/g, "")
      // Replace multiple hyphens with a single one.
      .replace(/\-\-+/g, "-")
      // Ensure no trailing or leading hyphens.
      .replace(/^-+|-+$/g, "")
  );
}

export const formatNumberWithCommas = (value: number | string): string => {
  // 1. Convert input to a number and handle invalid inputs
  const num = Number(value);

  if (isNaN(num)) {
    console.error("Invalid input provided to formatNumberWithCommas:", value);
    return ""; // Return an empty string or '0' for safety
  }

  // 2. Use toLocaleString() for standard number formatting
  // The default behavior uses the system's locale, which usually defaults to commas for English.
  return num.toLocaleString();
};

import qs from "query-string";

interface UrlQueryParams {
  params: string;
  key: string;
  value: string | null;
}

export const formUrlQuery = ({ params, key, value }: UrlQueryParams) => {
  const currentUrl = qs.parse(params);
  currentUrl[key] = value;
  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }, // if null => doesn't isplay ex. ?filter=null
  );
};

interface RemoveUrlQueryParams {
  params: string;
  keysToRemove: string[];
}

export const removeKeysFromQuery = ({
  params,
  keysToRemove,
}: RemoveUrlQueryParams) => {
  const currentUrl = qs.parse(params);
  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });
  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true },
  );
};


export const toPersianDigits = (number) => {
  return new Intl.NumberFormat('fa-IR').format(number);
};