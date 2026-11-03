// Tracking event ke GA4 dan Meta Pixel (bila ID dipasang lewat env), plus buffer
// `window.__seisEvents` untuk debugging/QA. Tidak ada request keluar tanpa ID.

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    __seisEvents?: { name: string; params: Params; t: number }[];
  }
}

// Event kita -> event standar Meta Pixel (sisanya dikirim sebagai custom event)
const META_STANDARD: Record<string, { event: string; map: (p: Params) => Params }> = {
  menu_item_view: { event: "ViewContent", map: (p) => ({ content_name: p.item_name, content_category: p.category }) },
  booking_contact_submit: { event: "Lead", map: () => ({}) },
  booking_summary_view: { event: "InitiateCheckout", map: (p) => ({ value: p.dp, currency: "IDR" }) },
  booking_payment_success: { event: "Purchase", map: (p) => ({ value: p.dp, currency: "IDR" }) },
};

export function track(name: string, params: Params = {}) {
  if (typeof window === "undefined") return;
  (window.__seisEvents ??= []).push({ name, params, t: Date.now() });
  window.gtag?.("event", name, params);
  if (window.fbq) {
    const std = META_STANDARD[name];
    if (std) window.fbq("track", std.event, std.map(params));
    else window.fbq("trackCustom", name, params);
  }
}
