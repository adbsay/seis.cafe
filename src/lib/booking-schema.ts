import { z } from "zod";
import { bookingTypeIds, bookingTypes, type BookingTypeId } from "@/data/booking";
import { MAX_ADVANCE_DAYS, addDays, isSlotPast, isValidISODate, nowWIB, slotsFor } from "@/lib/datetime";

/** "0812-3456-7890" / "+62 812..." -> "62812..." */
export function normalizePhone(input: string) {
  const digits = input.replace(/\D/g, "");
  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  return digits;
}

const typeField = z.enum(bookingTypeIds, { error: "Pilih jenis reservasi" });
const dateField = z
  .string({ error: "Pilih tanggal reservasi" })
  .min(1, "Pilih tanggal reservasi")
  .refine(isValidISODate, "Tanggal tidak valid");
const timeField = z.string({ error: "Pilih jam kedatangan" }).regex(/^\d{2}:\d{2}$/, "Pilih jam kedatangan");
const paxField = z
  .number({ error: "Isi jumlah orang" })
  .int("Jumlah orang harus bilangan bulat")
  .min(1, "Jumlah orang minimal 1");
const nameField = z.string().trim().min(2, "Nama minimal 2 karakter").max(60, "Nama maksimal 60 karakter");
const phoneField = z
  .string()
  .trim()
  .refine((v) => /^628[1-9]\d{7,11}$/.test(normalizePhone(v)), "Nomor WhatsApp tidak valid, contoh: 0812 3456 7890");
const notesField = z.string().trim().max(300, "Maksimal 300 karakter").optional();

interface ScheduleValues {
  type: BookingTypeId;
  date: string;
  time: string;
  pax: number;
}

/** Aturan lintas-field: tanggal lampau, jam operasional, rentang jumlah orang per jenis. */
function scheduleChecks(v: ScheduleValues, add: (path: keyof ScheduleValues, message: string) => void) {
  const cfg = bookingTypes[v.type];
  if (Number.isFinite(v.pax) && (v.pax < cfg.minPax || v.pax > cfg.maxPax)) {
    add("pax", `Jumlah orang untuk ${cfg.label}: ${cfg.minPax}–${cfg.maxPax}`);
  }
  if (!isValidISODate(v.date)) return;
  const now = nowWIB();
  if (v.date < now.date) return add("date", "Tanggal tidak boleh di masa lalu");
  if (v.date > addDays(now.date, MAX_ADVANCE_DAYS)) {
    return add("date", `Reservasi maksimal ${MAX_ADVANCE_DAYS} hari ke depan`);
  }
  if (/^\d{2}:\d{2}$/.test(v.time)) {
    if (!slotsFor(v.date).includes(v.time)) add("time", "Jam di luar jam operasional");
    else if (isSlotPast(v.date, v.time, now)) add("time", "Jam ini sudah lewat, pilih jam lain");
  }
}

const scheduleShape = { type: typeField, date: dateField, time: timeField, pax: paxField };
const contactShape = { name: nameField, phone: phoneField, notes: notesField };

// Skema per langkah form (React Hook Form memilih skema sesuai langkah aktif)
export const typeStepSchema = z.object({ type: typeField });
export const scheduleStepSchema = z.object(scheduleShape).superRefine((v, ctx) =>
  scheduleChecks(v, (path, message) => ctx.addIssue({ code: "custom", path: [path], message })),
);
export const contactStepSchema = z.object(contactShape);

// Skema penuh: dipakai di langkah terakhir
export const bookingSchema = z.object({ ...scheduleShape, ...contactShape }).superRefine((v, ctx) =>
  scheduleChecks(v, (path, message) => ctx.addIssue({ code: "custom", path: [path], message })),
);

export type BookingInput = z.infer<typeof bookingSchema>;
