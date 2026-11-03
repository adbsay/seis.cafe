// Ketersediaan slot reservasi (PROTOTIPE).
//
// Keterisian dihitung secara SIMULASI deterministik (hash tanggal + jam + jenis) agar status
// "Tersisa N Slot / Terisi X% / Habis" bisa didemokan tanpa backend. Hasilnya selalu sama
// untuk input yang sama. Saat sistem sungguhan dibuat, ganti `baselineOccupied()` dengan data
// inventori nyata dan jangan menampilkan kelangkaan simulasi ke pelanggan sungguhan.

import { bookingTypes, type BookingTypeId } from "@/data/booking";
import { isPrimeSlot, isSlotPast, isWeekend, nowWIB, slotsFor, weekday } from "@/lib/datetime";

export type SlotStatus = "available" | "busy" | "limited" | "full" | "past";

export interface Slot {
  time: string;
  prime: boolean;
  remaining: number;
  capacity: number;
  occupancyPct: number;
  status: SlotStatus;
}

function hash01(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

function baselineOccupied(date: string, time: string, type: BookingTypeId) {
  const cfg = bookingTypes[type];
  if (type === "wedding") {
    // Venue event: satu acara per hari
    const p = isWeekend(date) ? 0.35 : 0.1;
    return hash01(`${date}|wedding`) < p ? cfg.capacity : 0;
  }
  const h = Number(time.slice(0, 2));
  let base = h < 12 ? 0.15 : h < 17 ? 0.3 : h < 19 ? 0.45 : 0.62;
  if (isWeekend(date)) base += 0.18;
  else if (weekday(date) === 5 && h >= 17) base += 0.12;
  if (isPrimeSlot(time)) base += 0.12;
  const jitter = (hash01(`${date}|${time}|${type}`) - 0.5) * 0.3;
  return Math.round(cfg.capacity * clamp(base + jitter, 0.05, 1));
}

export function getAvailability(date: string, type: BookingTypeId): Slot[] {
  const cfg = bookingTypes[type];
  const now = nowWIB();
  return slotsFor(date).map((time) => {
    const remaining = Math.max(0, cfg.capacity - baselineOccupied(date, time, type));
    const occupancy = (cfg.capacity - remaining) / cfg.capacity;
    let status: SlotStatus = "available";
    if (isSlotPast(date, time, now)) status = "past";
    else if (remaining === 0) status = "full";
    else if (cfg.capacity > 2 && remaining <= 2) status = "limited";
    else if (cfg.capacity > 2 && occupancy >= 0.6) status = "busy";
    return { time, prime: isPrimeSlot(time), remaining, capacity: cfg.capacity, occupancyPct: Math.round(occupancy * 100), status };
  });
}
