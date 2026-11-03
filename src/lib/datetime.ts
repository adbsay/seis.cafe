// Semua logika tanggal/jam memakai WIB (Asia/Jakarta) secara eksplisit,
// sehingga hasilnya sama di server (UTC, mis. Vercel) maupun di browser pengunjung.

export const TZ = "Asia/Jakarta";
export const MAX_ADVANCE_DAYS = 90; // batas reservasi ke depan
export const LEAD_MINUTES = 60; // minimal jarak dari sekarang untuk reservasi hari ini
export const OPEN_HOUR = 10;

const pad = (n: number) => String(n).padStart(2, "0");

const wibFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** Tanggal (YYYY-MM-DD) dan menit-sejak-tengah-malam saat ini di WIB. */
export function nowWIB(now: Date = new Date()) {
  const parts: Record<string, string> = {};
  for (const p of wibFormatter.formatToParts(now)) parts[p.type] = p.value;
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  };
}

function parse(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return { y, m, d };
}

export function toISO(y: number, m: number, d: number) {
  return `${y}-${pad(m)}-${pad(d)}`;
}

export function isValidISODate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const { y, m, d } = parse(value);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

export function addDays(date: string, n: number) {
  const { y, m, d } = parse(date);
  const dt = new Date(Date.UTC(y, m - 1, d + n));
  return toISO(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate());
}

/** 0 = Minggu ... 6 = Sabtu */
export function weekday(date: string) {
  const { y, m, d } = parse(date);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export const isWeekend = (date: string) => weekday(date) === 0 || weekday(date) === 6;

export function formatDateID(
  date: string,
  options: Intl.DateTimeFormatOptions = { weekday: "long", day: "numeric", month: "long", year: "numeric" },
) {
  const { y, m, d } = parse(date);
  return new Intl.DateTimeFormat("id-ID", { ...options, timeZone: "UTC" }).format(
    new Date(Date.UTC(y, m - 1, d, 12)),
  );
}

/** Jam tutup: weekdays 22.00, weekend 23.00 (sesuai jam operasional). */
export const closeHour = (date: string) => (isWeekend(date) ? 23 : 22);

/** Slot kedatangan per jam, dari buka sampai 1 jam sebelum tutup. */
export function slotsFor(date: string): string[] {
  const out: string[] = [];
  for (let h = OPEN_HOUR; h < closeHour(date); h++) out.push(`${pad(h)}:00`);
  return out;
}

export const slotMinutes = (time: string) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5));

/** Prime time 19.00–21.00: slot yang dimulai 19:00 dan 20:00. */
export const isPrimeSlot = (time: string) => {
  const h = Number(time.slice(0, 2));
  return h >= 19 && h < 21;
};

export function isSlotPast(date: string, time: string, now = nowWIB()) {
  if (date < now.date) return true;
  if (date > now.date) return false;
  return slotMinutes(time) < now.minutes + LEAD_MINUTES;
}
