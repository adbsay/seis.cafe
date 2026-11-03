import { menuCategories, menuItems } from "@/data/menu";
import { site } from "@/data/site";

/** Schema.org LocalBusiness (CafeOrCoffeeShop) + Menu, untuk Local SEO. Data diambil dari site.ts & menu.ts. */
export function buildJsonLd() {
  const a = site.address;
  return {
    "@context": "https://schema.org",
    "@type": ["CafeOrCoffeeShop", "LocalBusiness"],
    "@id": `${site.url}/#business`,
    name: site.name,
    url: site.url,
    image: `${site.url}/images/og.jpg`,
    logo: `${site.url}/images/logo-mark.png`,
    description:
      "Cafe private room di Medan: tempat kerja remote, ruang meeting privat, dan venue wedding/event dengan reservasi online.",
    address: {
      "@type": "PostalAddress",
      streetAddress: `${a.street}, ${a.area}`,
      addressLocality: a.city,
      addressRegion: a.region,
      postalCode: a.postalCode,
      addressCountry: a.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    hasMap: site.mapsUrl,
    sameAs: [site.instagram, site.venueInstagram],
    openingHoursSpecification: site.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.open.replace(".", ":"),
      closes: h.close.replace(".", ":"),
    })),
    hasMenu: {
      "@type": "Menu",
      name: `Menu ${site.shortName}`,
      hasMenuSection: menuCategories.map((c) => ({
        "@type": "MenuSection",
        name: c.label,
        hasMenuItem: menuItems
          .filter((i) => i.category === c.id)
          .map((i) => ({
            "@type": "MenuItem",
            name: i.name,
            description: i.teaser ?? i.name,
            image: i.image ? `${site.url}${i.image}` : `${site.url}/images/og.jpg`,
            offers: { "@type": "Offer", price: i.price, priceCurrency: "IDR" },
          })),
      })),
    },
  };
}
