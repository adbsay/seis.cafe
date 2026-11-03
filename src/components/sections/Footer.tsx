import Image from "next/image";
import { HoursList } from "@/components/HoursList";
import { ButtonLink } from "@/components/ui/Button";
import { IconInstagram, IconPin } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Motion";
import { mapEmbedSrc, site } from "@/data/site";

export function Footer() {
  const a = site.address;
  return (
    <footer id="lokasi" aria-labelledby="lokasi-title" className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-5 py-12 sm:py-20 md:grid-cols-2 md:gap-14 md:py-24">
        <Reveal>
          <Image src="/images/logo-wordmark.png" alt="Seis Cafe & Public Space" width={884} height={400} className="h-9 sm:h-12 w-auto" />
          <h2 id="lokasi-title" className="mt-5 sm:mt-8 font-display text-2xl sm:text-4xl font-medium leading-tight md:text-5xl">
            Datang dan rasakan sendiri.
          </h2>
          <address className="mt-3 sm:mt-5 flex gap-2.5 not-italic text-sm leading-relaxed text-cream/80 sm:text-base">
            <IconPin className="mt-0.5 shrink-0 text-amber" width={18} height={18} />
            <span>
              {a.street}, {a.area}, {a.city}, {a.region} {a.postalCode}
            </span>
          </address>

          <h3 className="mb-2 sm:mb-3 mt-5 sm:mt-8 text-xs font-semibold uppercase tracking-[0.24em] text-amber">Jam operasional</h3>
          <HoursList className="max-w-sm text-sm" />

          {/* Mobile: 2 tombol sejajar 1 baris */}
          <div className="mt-5 sm:mt-8 grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:flex-wrap sm:gap-3">
            <ButtonLink href={site.mapsUrl} external trackName="cta_click" className="!text-xs sm:!text-base !px-3 sm:!px-5">
              Buka di Maps
            </ButtonLink>
            <ButtonLink href={site.instagram} external variant="secondary" trackName="cta_click" className="!text-xs sm:!text-base !px-3 sm:!px-5">
              <IconInstagram width={15} height={15} className="sm:w-[18px] sm:h-[18px]" /> @seis.cafe
            </ButtonLink>
          </div>
          <p className="mt-3 sm:mt-5 text-xs sm:text-sm text-muted">
            Wedding &amp; event:{" "}
            <a href={site.venueInstagram} target="_blank" rel="noopener noreferrer" className="font-medium text-cream underline decoration-amber/60 underline-offset-4 hover:text-amber">
              @seiscafe.venue
            </a>
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative h-[260px] sm:h-[360px] overflow-hidden rounded-2xl sm:rounded-3xl border border-line bg-raised md:h-full md:min-h-[420px]">
            <iframe
              title="Peta lokasi Seis Cafe & Public Space di Google Maps"
              src={mapEmbedSrc()}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="map-dark absolute inset-0 h-full w-full border-0"
            />
          </div>
        </Reveal>
      </div>

      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-4 sm:px-5 py-5 text-xs sm:text-sm text-muted">
          © {new Date().getFullYear()} {site.name}. Medan, Sumatera Utara.
        </p>
      </div>
    </footer>
  );
}
