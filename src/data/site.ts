// Sumber tunggal data bisnis Seis. Dipakai UI, JSON-LD (SEO), dan fallback WhatsApp.
//
// Sumber data:
//  - alamat, koordinat, rating  -> Google Maps (diambil 6 Okt 2026)
//  - jam operasional, kontak    -> project.md
//  - proof.counters             -> contoh angka dari brief (project.md), BELUM terverifikasi

export const site = {
  name: "Seis Cafe & Public Space",
  shortName: "Seis",
  tagline: "A Night Where Curiosity Meets Creativity",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  address: {
    street: "Jl. Sei Silau No.89c",
    area: "Padang Bulan Selayang I, Kec. Medan Selayang",
    city: "Kota Medan",
    region: "Sumatera Utara",
    postalCode: "20154",
    country: "ID",
  },
  geo: { lat: 3.5730366, lng: 98.6458386 },
  mapsUrl:
    "https://www.google.com/maps/place/Seis+Cafe+%26+Public+Space/@3.572463,98.6435761,16.38z/data=!4m6!3m5!1s0x30312f5327d2dbb9:0xdc905baf7bc01d18!8m2!3d3.5730366!4d98.6458386!16s%2Fg%2F11s0dzz05q",
  instagram: "https://www.instagram.com/seis.cafe/",
  venueInstagram: "https://www.instagram.com/seiscafe.venue/",
  // WhatsApp HANYA dipakai sebagai fallback otomatis saat pembayaran DP gagal.
  whatsappNumber: "6282363269923",
  hours: [
    { label: "Senin – Jumat", short: "Sen–Jum", open: "10.00", close: "22.00", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    { label: "Sabtu – Minggu", short: "Sab–Min", open: "10.00", close: "23.00", days: ["Saturday", "Sunday"] },
  ],
  proof: {
    rating: { value: 4.3, source: "Google Maps" }, // verified: Google Maps
    counters: [
      { value: 1500, suffix: "+", label: "Reservasi terpenuhi" }, // TODO: verifikasi dengan pemilik
      { value: 100, suffix: "+", label: "Acara korporat sukses" }, // TODO: verifikasi dengan pemilik
    ],
  },
} as const;

/** Embed peta. Pakai Maps Embed API bila key tersedia; kalau tidak, embed publik tanpa key. */
export function mapEmbedSrc() {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY;
  if (key && /^[\w-]+$/.test(key)) {
    return `https://www.google.com/maps/embed/v1/place?key=${key}&q=${site.geo.lat},${site.geo.lng}&zoom=17`;
  }
  return `https://www.google.com/maps?q=${site.geo.lat},${site.geo.lng}&z=17&hl=id&output=embed`;
}

export function whatsappLink(message: string) {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
