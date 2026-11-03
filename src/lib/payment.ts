// Simulasi pembayaran DP (PROTOTIPE, tanpa gateway dan tanpa backend).
//
// Selalu berhasil, kecuali URL memuat ?demo=payfail, supaya fallback WhatsApp bisa didemokan
// kepada pemilik. Saat sistem sungguhan dibuat, ganti `payDeposit` dengan pemanggilan gateway.

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function payDeposit(): Promise<boolean> {
  await delay(1200);
  return new URLSearchParams(window.location.search).get("demo") !== "payfail";
}

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // tanpa karakter yang mudah tertukar (0/O, 1/I)

export function newBookingCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(5));
  return `SEIS-${Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("")}`;
}
