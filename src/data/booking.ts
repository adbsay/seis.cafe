// PLACEHOLDER: tarif minimum spend, persentase DP, kapasitas, dan batas jumlah orang
// di bawah adalah asumsi awal. Ganti dengan kebijakan resmi Seis sebelum rilis.
// Kalkulasi DP di UI membaca file ini, jadi cukup ubah di satu tempat.

export const bookingTypeIds = ["personal", "group", "wedding"] as const;
export type BookingTypeId = (typeof bookingTypeIds)[number];

export interface BookingTypeConfig {
  id: BookingTypeId;
  label: string;
  blurb: string;
  minPax: number;
  maxPax: number;
  defaultPax: number;
  minSpendPerPax: number; // Rupiah per orang
  dpRate: number; // 0..1
  capacity: number; // jumlah unit (meja/ruang/venue) per slot jam
  notesLabel: string;
  notesPlaceholder: string;
}

export const bookingTypes: Record<BookingTypeId, BookingTypeConfig> = {
  personal: {
    id: "personal",
    label: "Personal",
    blurb: "Meja nyaman untuk 1–4 orang",
    minPax: 1,
    maxPax: 4,
    defaultPax: 2,
    minSpendPerPax: 50_000,
    dpRate: 0.2,
    capacity: 12,
    notesLabel: "Catatan (opsional)",
    notesPlaceholder: "Mis. dekat colokan, area non-smoking",
  },
  group: {
    id: "group",
    label: "Grup / Meeting",
    blurb: "Area privat untuk 5–30 orang",
    minPax: 5,
    maxPax: 30,
    defaultPax: 8,
    minSpendPerPax: 75_000,
    dpRate: 0.3,
    capacity: 4,
    notesLabel: "Keperluan (opsional)",
    notesPlaceholder: "Mis. meeting tim, arisan, ulang tahun, butuh proyektor",
  },
  wedding: {
    id: "wedding",
    label: "Wedding / Event",
    blurb: "Venue untuk 30–150 orang",
    minPax: 30,
    maxPax: 150,
    defaultPax: 50,
    minSpendPerPax: 150_000,
    dpRate: 0.3,
    capacity: 1,
    notesLabel: "Detail acara (opsional)",
    notesPlaceholder: "Mis. jenis acara, konsep, kebutuhan dekorasi",
  },
};

export const bookingTypeList = bookingTypeIds.map((id) => bookingTypes[id]);

export const isBookingTypeId = (v: string): v is BookingTypeId =>
  (bookingTypeIds as readonly string[]).includes(v);

/** DP dibulatkan ke atas per Rp1.000. */
export function computeQuote(type: BookingTypeId, pax: number) {
  const cfg = bookingTypes[type];
  const total = cfg.minSpendPerPax * pax;
  const dp = Math.ceil((total * cfg.dpRate) / 1000) * 1000;
  return { total, dp, remaining: total - dp, dpPercent: Math.round(cfg.dpRate * 100) };
}

export const dpNote = "DP dihitung otomatis dan dipotong dari total tagihanmu saat datang.";
