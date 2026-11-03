import Image from "next/image";
import { BookingForm } from "@/components/booking/BookingForm";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Motion";

const steps = [
  ["Pilih jadwal", "Tanggal, jam, dan jumlah orang. Slot terlihat real-time."],
  ["Lihat total & DP", "Nominal DP dihitung otomatis. Tidak ada tawar-menawar chat."],
  ["Bayar DP", "Jadwalmu langsung terkunci dan kode reservasi dikirim."],
];

export function Booking() {
  return (
    <section id="booking" aria-labelledby="booking-title" className="relative py-12 md:py-24 lg:py-32">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-5 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Reveal>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-amber">Reservasi</p>
            <h2 id="booking-title" className="font-display text-2xl font-medium leading-[1.1] sm:text-3xl md:text-5xl lg:text-6xl">
              Amankan mejamu sebelum malam jadi penuh.
            </h2>
            <ol className="mt-4 grid grid-cols-3 gap-2 sm:gap-3 lg:mt-8 lg:block lg:space-y-5">
              {steps.map(([title, text], i) => (
                <li
                  key={title}
                  className="flex flex-col items-center text-center rounded-xl border border-line/40 bg-surface/50 p-2 sm:p-2.5 lg:flex-row lg:items-start lg:text-left lg:border-0 lg:bg-transparent lg:p-0 lg:gap-4"
                >
                  <span className="grid size-7 place-items-center rounded-full border border-amber/60 text-xs font-semibold text-amber shrink-0 mb-1 lg:mb-0 lg:size-9 lg:text-sm">
                    {i + 1}
                  </span>
                  <span>
                    <span className="block text-xs font-semibold sm:text-sm lg:text-base leading-tight">{title}</span>
                    <span className="hidden sm:block text-[11px] leading-tight text-muted/80 lg:block lg:text-sm lg:leading-relaxed">{text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={0.1} className="mt-10 hidden lg:block">
            <EventCard />
          </Reveal>
        </div>

        <div>
          <Reveal>
            <BookingForm />
          </Reveal>
          <Reveal className="mt-8 lg:hidden">
            <EventCard />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function EventCard() {
  return (
    <figure className="photo-grade relative overflow-hidden rounded-3xl border border-line">
      <div className="relative aspect-[4/3]">
        <Image
          src="/images/venue-event.webp"
          alt="Meja panjang dan kursi di area outdoor Seis dengan signage SEIS di dinding bata merah"
          fill
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="object-cover object-[50%_35%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/30 to-transparent" />
      </div>
      <figcaption className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6">
        <p className="font-display text-2xl font-medium">Wedding &amp; private event</p>
        <p className="mt-1 max-w-sm text-sm text-cream/75">
          Venue yang sama, suasana yang kamu rancang sendiri. DP mengunci tanggal acaramu.
        </p>
        <ButtonLink
          href="#booking"
          prefillType="wedding"
          trackName="cta_click"
          variant="secondary"
          className="mt-4 !min-h-11 bg-ink/50 !px-5 !text-sm backdrop-blur"
        >
          Reservasi Wedding / Event
        </ButtonLink>
      </figcaption>
    </figure>
  );
}
