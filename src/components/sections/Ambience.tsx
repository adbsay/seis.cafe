import Image from "next/image";
import { IconDoor, IconPlug, IconStar, IconWifi } from "@/components/ui/Icons";
import { ButtonLink } from "@/components/ui/Button";
import { CountUp, Reveal } from "@/components/ui/Motion";
import { site } from "@/data/site";
import { formatNumber } from "@/lib/format";

function Chip({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="inline-flex items-center gap-1.5 rounded-full border border-cream/25 bg-ink/60 px-2.5 py-1.5 text-xs sm:gap-2 sm:px-3.5 sm:py-2 sm:text-sm backdrop-blur">
      <span className="text-amber">{icon}</span>
      {children}
    </li>
  );
}

function Stars({ value }: { value: number }) {
  const pct = (value / 5) * 100;
  return (
    <span className="relative inline-block" role="img" aria-label={`Rating ${formatNumber(value, 1)} dari 5`}>
      <span className="flex gap-0.5 text-cream/20">
        {Array.from({ length: 5 }, (_, i) => (
          <IconStar key={i} width={16} height={16} className="sm:w-[22px] sm:h-[22px]" />
        ))}
      </span>
      <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${pct}%` }}>
        <span className="flex gap-0.5 text-amber">
          {Array.from({ length: 5 }, (_, i) => (
            <IconStar key={i} width={16} height={16} className="shrink-0 sm:w-[22px] sm:h-[22px]" />
          ))}
        </span>
      </span>
    </span>
  );
}

export function Ambience() {
  const { rating, counters } = site.proof;
  return (
    <section id="suasana" aria-labelledby="suasana-title" className="relative bg-surface py-12 sm:py-20 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-5">
        <Reveal>
          <p className="mb-2 sm:mb-4 text-xs font-semibold uppercase tracking-[0.24em] sm:tracking-[0.28em] text-amber">Ambience &amp; Public Space</p>
          <h2 id="suasana-title" className="max-w-3xl font-display text-2xl font-medium leading-[1.05] sm:text-4xl md:text-6xl">
            Tempat kerja remote yang rasanya seperti nongkrong.
          </h2>
          <p className="mt-3 sm:mt-5 max-w-xl text-sm leading-relaxed text-muted sm:text-base md:text-lg">
            Spot favorit para kreator konten dan pekerja remote. Lihat bagaimana pelanggan kami menikmati suasana Seis, dari sesi
            fokus siang hari sampai malam yang hidup.
          </p>
        </Reveal>

        {/* ── Mobile: 2 kolom di atas + 1 penuh di bawah ───────────────────────────────
            ── Desktop: grid asimetris 12 kolom (7 besar kiri + 5 kanan × 2 baris) ─── */}
        <div className="mt-6 sm:mt-12 grid gap-2.5 sm:gap-4 md:grid-cols-12 md:grid-rows-[repeat(2,minmax(280px,1fr))]">

          {/* Foto Utama: Mobile = bawah (full), Desktop = kiri besar */}
          <Reveal className="order-3 md:order-none md:col-span-7 md:row-span-2">
            <figure className="photo-grade relative h-[200px] sm:h-[360px] md:h-full overflow-hidden rounded-2xl sm:rounded-3xl border border-line">
              <Image
                src="/images/ambience-interaksi.webp"
                alt="Sepasang pelanggan saling menyuapi makanan di meja bundar dengan lampu lantai hangat"
                fill
                sizes="(min-width: 768px) 56vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-6 md:p-8">
                <p className="font-display text-xl sm:text-2xl font-medium leading-tight md:text-4xl">Nongkrong yang bikin lupa waktu.</p>
                <p className="mt-1 sm:mt-2 max-w-sm text-xs sm:text-sm text-cream/75">Momen nyata dari meja-meja Seis. Tanpa model, tanpa pose.</p>
              </figcaption>
            </figure>
          </Reveal>

          {/* Foto 2 (produktif): Mobile = kiri atas, Desktop = kanan atas */}
          <Reveal delay={0.1} className="order-1 md:order-none md:col-span-5">
            <figure className="photo-grade relative h-[170px] sm:h-[280px] md:h-full overflow-hidden rounded-2xl sm:rounded-3xl border border-line">
              <Image
                src="/images/ambience-produktif.webp"
                alt="Meja kayu dengan latte, tablet, dan ponsel, tempat kerja remote yang terang alami"
                fill
                sizes="(min-width: 768px) 40vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 z-10 p-3 sm:p-6">
                <p className="font-display text-base sm:text-2xl font-medium">Meja kerja yang siap dipakai.</p>
                <ul className="mt-2 flex flex-wrap gap-1.5 sm:gap-2">
                  <Chip icon={<IconPlug width={14} height={14} />}>Colokan di area kerja</Chip>
                  <Chip icon={<IconWifi width={14} height={14} />}>Wi-Fi kencang</Chip>
                </ul>
              </figcaption>
            </figure>
          </Reveal>

          {/* Foto 3 (privat): Mobile = kanan atas, Desktop = kanan bawah */}
          <Reveal delay={0.2} className="order-2 md:order-none md:col-span-5">
            <figure className="photo-grade relative h-[170px] sm:h-[280px] md:h-full overflow-hidden rounded-2xl sm:rounded-3xl border border-line">
              <Image
                src="/images/ambience-privat.webp"
                alt="Sudut lounge privat dengan kursi empuk dan meja bundar dilihat dari atas"
                fill
                sizes="(min-width: 768px) 40vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 z-10 p-3 sm:p-6">
                <p className="flex items-center gap-1.5 font-display text-base sm:text-2xl font-medium">
                  <IconDoor className="text-amber shrink-0" width={18} height={18} /> Area privat untuk meeting
                </p>
                <ButtonLink
                  href="#booking"
                  prefillType="group"
                  trackName="cta_click"
                  variant="secondary"
                  className="mt-2 sm:mt-4 !min-h-8 sm:!min-h-11 bg-ink/50 !px-3 sm:!px-5 !text-xs sm:!text-sm backdrop-blur"
                >
                  Reservasi ruang privat
                </ButtonLink>
              </figcaption>
            </figure>
          </Reveal>
        </div>

        {/* ── Stats Counter: Mobile = 3 kolom 1 baris ringkas, Desktop = 3 kolom besar ── */}
        <Reveal delay={0.1}>
          <dl className="mt-4 sm:mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-2xl sm:rounded-3xl border border-line bg-line">
            {/* Rating Google Maps */}
            <div className="bg-raised px-3 py-4 sm:p-7">
              <dt className="text-[10px] sm:text-sm text-muted leading-tight">Rating {rating.source}</dt>
              <dd className="mt-1.5 sm:mt-2 flex flex-col sm:flex-row sm:items-center sm:gap-4">
                <span className="font-display text-3xl sm:text-6xl font-medium leading-none tabular-nums">
                  {formatNumber(rating.value, 1)}
                </span>
                <Stars value={rating.value} />
              </dd>
            </div>
            {counters.map((c) => (
              <div key={c.label} className="bg-raised px-3 py-4 sm:p-7">
                <dt className="text-[10px] sm:text-sm text-muted leading-tight">{c.label}</dt>
                <dd className="mt-1.5 sm:mt-2 font-display text-3xl sm:text-6xl font-medium leading-none tabular-nums">
                  <CountUp to={c.value} suffix={c.suffix} />
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
