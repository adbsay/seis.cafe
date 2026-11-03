# Seis Cafe & Public Space (prototipe website)

Next.js 16 (App Router) · TypeScript · Tailwind 4 · Framer Motion · React Hook Form + Zod.
Rancangan lengkap ada di `project.md`.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
node scripts/prepare-assets.mjs   # buat ulang foto WebP + logo transparan dari /assets
```

Salin `.env.example` ke `.env.local` bila ingin mengaktifkan GA4, Meta Pixel, atau Google Maps Embed API (semua opsional).

## Struktur

- `src/data/` sumber data tunggal: `site.ts` (alamat, jam, kontak, proof), `menu.ts`, `booking.ts` (tarif & DP)
- `src/components/sections/` Hero, DigitalMenu, Ambience, Booking, Footer (+ peta live)
- `src/components/booking/` form 4 langkah, kalender, slot picker
- `src/lib/` validasi Zod, ketersediaan slot, tanggal WIB, analytics, JSON-LD

## Status prototipe (belum untuk produksi)

Tidak ada backend dan tidak ada payment gateway. Alur booking berjalan di sisi client:

- **Ketersediaan slot**: simulasi deterministik (`src/lib/availability.ts`). Ganti dengan inventori nyata sebelum rilis.
- **Pembayaran DP**: simulasi (`src/lib/payment.ts`), selalu berhasil. Tambahkan `?demo=payfail` di URL untuk mendemokan kegagalan dan fallback WhatsApp.
- **Data placeholder yang harus diganti pemilik**: nama/harga/komposisi menu, tarif minimum spend, persentase DP, kapasitas, batas jumlah orang, dan counter "1.500+ reservasi / 100+ acara" (`src/data/*`).
- Rating 4,3, alamat, dan koordinat diambil dari Google Maps (6 Okt 2026).

## Event analytics (GA4 / Meta Pixel)

`view_booking_section`, `booking_step_view`, `booking_type_select`, `booking_date_select`, `booking_slot_select`,
`booking_contact_submit`, `booking_summary_view`, `booking_submit`, `booking_payment_success`,
`booking_payment_failed`, `booking_abandon` (drop-off), `whatsapp_fallback_click`, `menu_item_view`, `cta_click`.
Saat QA, semua event juga tersimpan di `window.__seisEvents`.
