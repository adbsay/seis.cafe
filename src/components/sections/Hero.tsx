import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Motion";
import { IconArrowRight } from "@/components/ui/Icons";
import { site } from "@/data/site";

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] items-center overflow-hidden">
      <div className="photo-grade absolute inset-0 -z-10">
        <Image
          src="/images/hero.webp"
          alt="Suasana malam di dalam Seis Cafe: pengunjung berbincang di bawah lampu gantung hangat"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[68%_50%] md:object-[60%_50%]"
        />
        {/* Overlay gradient: mobile = gelap merata tengah, desktop = gelap ke kiri */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,9,7,0.6)_0%,rgba(11,9,7,0.3)_35%,rgba(11,9,7,0.65)_65%,rgba(11,9,7,0.92)_100%)] md:bg-[linear-gradient(90deg,rgba(11,9,7,0.95)_0%,rgba(11,9,7,0.75)_38%,rgba(11,9,7,0.3)_72%,rgba(11,9,7,0.5)_100%)]" />
        <div className="absolute inset-0 hidden bg-gradient-to-t from-ink via-transparent to-ink/70 md:block" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-5 py-24 sm:py-28 md:py-16">
        <Reveal y={16}>
          <p className="mb-3 sm:mb-5 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.24em] sm:tracking-[0.28em] text-amber">
            Cafe &amp; Public Space · Medan
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <h1
            id="hero-title"
            className="max-w-[13ch] font-display text-[clamp(2.4rem,9vw,6.75rem)] font-medium leading-[0.95] tracking-tight text-cream md:max-w-[15ch]"
          >
            A Night Where <em className="font-medium italic text-amber">Curiosity</em> Meets Creativity
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-4 sm:mt-6 max-w-md text-sm leading-relaxed text-cream/80 sm:text-base md:text-lg">
            Meja untuk kerja remote, ruang privat untuk meeting, dan malam yang layak diingat. Semuanya bisa kamu amankan dalam
            satu menit.
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          {/* Mobile: 2 tombol sejajar 1 baris, Desktop: tetap flex row */}
          <div className="mt-6 sm:mt-9 grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:gap-3">
            <ButtonLink href="#booking" trackName="cta_click" className="sm:min-w-52 !text-sm sm:!text-base">
              Reservasi <IconArrowRight width={16} height={16} className="inline-block sm:hidden" />
              <span className="hidden sm:inline">Sekarang <IconArrowRight width={18} height={18} /></span>
            </ButtonLink>
            <ButtonLink href="#menu" variant="secondary" trackName="cta_click" className="!text-sm sm:!text-base">
              Lihat Menu
            </ButtonLink>
          </div>
        </Reveal>

        <Reveal delay={0.32}>
          {/* Jam operasional: Mobile = baris wrap rapat, Desktop = row */}
          <ul className="mt-8 sm:mt-12 flex flex-wrap gap-x-4 gap-y-1 sm:gap-x-8 sm:gap-y-2 border-t border-cream/15 pt-4 sm:pt-5 text-xs sm:text-sm text-cream/75">
            {site.hours.map((h) => (
              <li key={h.label}>
                <span className="text-muted">{h.short}</span>{" "}
                <span className="tabular-nums">
                  {h.open}–{h.close} WIB
                </span>
              </li>
            ))}
            <li className="text-muted">Medan Selayang</li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
