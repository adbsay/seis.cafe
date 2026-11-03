"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { Calendar } from "@/components/booking/Calendar";
import { SlotPicker } from "@/components/booking/SlotPicker";
import { Button, ButtonLink } from "@/components/ui/Button";
import { IconCheck, IconMinus, IconPlus, IconWhatsapp } from "@/components/ui/Icons";
import {
  bookingTypeList,
  bookingTypes,
  computeQuote,
  dpNote,
  type BookingTypeId,
} from "@/data/booking";
import { whatsappLink } from "@/data/site";
import { track } from "@/lib/analytics";
import { getAvailability } from "@/lib/availability";
import {
  bookingSchema,
  contactStepSchema,
  scheduleStepSchema,
  typeStepSchema,
  type BookingInput,
} from "@/lib/booking-schema";
import { MAX_ADVANCE_DAYS, addDays, formatDateID, isPrimeSlot } from "@/lib/datetime";
import { rupiah } from "@/lib/format";
import { newBookingCode, payDeposit } from "@/lib/payment";
import { useToday } from "@/lib/use-today";

const STEPS = ["Jenis", "Jadwal", "Data diri", "Konfirmasi"] as const;
const TITLES = [
  "Mau reservasi untuk apa?",
  "Pilih tanggal, jam, dan jumlah orang",
  "Siapa yang kita sambut?",
  "Cek total, lalu amankan dengan DP",
];
const SCHEMAS = [typeStepSchema, scheduleStepSchema, contactStepSchema, bookingSchema];
const SCARCITY_THRESHOLD = 6; // tampilkan pesan kelangkaan bila sisa slot prime time <= ini

type PayState = "idle" | "paying" | "success" | "failed";

const inputClass =
  "h-12 w-full rounded-xl border border-line bg-raised px-4 text-base text-cream placeholder:text-muted/70 transition-colors focus:border-amber focus:outline-none aria-[invalid=true]:border-rose-400/70";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-sm text-rose-300">
      {message}
    </p>
  );
}

function fallbackMessage(v: BookingInput) {
  return `Halo Seis, saya mau reservasi ${bookingTypes[v.type].label} untuk ${v.pax} orang pada ${formatDateID(v.date)} pukul ${v.time} WIB atas nama ${v.name}. Pembayaran DP lewat website gagal, mohon dibantu.`;
}

export function BookingForm() {
  const today = useToday();
  const [step, setStep] = useState(0);
  const [pay, setPay] = useState<PayState>("idle");
  const [confirmation, setConfirmation] = useState<{ code: string; values: BookingInput } | null>(null);

  const stepRef = useRef(0);
  const furthest = useRef(0);
  const payRef = useRef<PayState>("idle");
  const abandoned = useRef(false);
  const prevView = useRef({ step: 0, pay: "idle" as PayState });
  const rootRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Skema validasi mengikuti langkah aktif (Zod + React Hook Form)
  const resolver = useMemo<Resolver<BookingInput>>(
    () => (values, context, options) =>
      zodResolver(SCHEMAS[stepRef.current] as unknown as typeof bookingSchema)(values, context, options),
    [],
  );

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    clearErrors,
    reset,
    control,
    formState: { errors },
  } = useForm<BookingInput>({
    resolver,
    mode: "onTouched",
    defaultValues: {
      type: "personal",
      date: "",
      time: "",
      pax: bookingTypes.personal.defaultPax,
      name: "",
      phone: "",
      notes: "",
    },
  });

  const type = useWatch({ control, name: "type" });
  const date = useWatch({ control, name: "date" });
  const time = useWatch({ control, name: "time" });
  const pax = useWatch({ control, name: "pax" });
  const cfg = bookingTypes[type];
  const quote = useMemo(() => computeQuote(type, Number.isFinite(pax) ? pax : 0), [type, pax]);

  const slots = useMemo(() => (date && today ? getAvailability(date, type) : null), [date, type, today]);
  const primeLeft = slots
    ? slots.filter((s) => s.prime && s.status !== "full" && s.status !== "past").reduce((n, s) => n + s.remaining, 0)
    : 0;
  const allUnavailable = !!slots && slots.every((s) => s.status === "full" || s.status === "past");
  const showScarcity = !!slots && cfg.capacity > 2 && primeLeft > 0 && primeLeft <= SCARCITY_THRESHOLD;
  const scarcityLabel = date
    ? date === today
      ? `${formatDateID(date, { weekday: "long" })} malam ini`
      : `${formatDateID(date, { weekday: "long" })} malam, ${formatDateID(date, { day: "numeric", month: "short" })}`
    : "";

  useEffect(() => {
    payRef.current = pay;
  }, [pay]);

  const goTo = useCallback(
    (n: number) => {
      stepRef.current = n;
      furthest.current = Math.max(furthest.current, n);
      setStep(n);
      const t = getValues("type");
      track("booking_step_view", { step: n + 1, step_name: STEPS[n], type: t });
      if (n === 3) track("booking_summary_view", { type: t, dp: computeQuote(t, getValues("pax")).dp });
      requestAnimationFrame(() => {
        const top = rootRef.current?.getBoundingClientRect().top ?? 0;
        if (top < 72) window.scrollTo({ top: window.scrollY + top - 84, behavior: "smooth" });
      });
    },
    [getValues],
  );

  const selectType = useCallback(
    (id: BookingTypeId) => {
      setValue("type", id);
      setValue("pax", bookingTypes[id].defaultPax);
      setValue("time", "");
      clearErrors();
      track("booking_type_select", { type: id });
    },
    [setValue, clearErrors],
  );

  // Event analytics: form terlihat (awal funnel) dan pengunjung yang pergi di tengah funnel (drop-off)
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          track("view_booking_section");
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onLeave = () => {
      if (abandoned.current || payRef.current === "success" || furthest.current < 1) return;
      abandoned.current = true;
      track("booking_abandon", { step: stepRef.current + 1, step_name: STEPS[stepRef.current], type: getValues("type") });
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") onLeave();
      else abandoned.current = false;
    };
    window.addEventListener("pagehide", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pagehide", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [getValues]);

  // CTA di bagian lain (mis. "Reservasi ruang privat") memilihkan jenis lalu langsung ke jadwal
  useEffect(() => {
    const onPrefill = (e: Event) => {
      const id = (e as CustomEvent<{ type: BookingTypeId }>).detail?.type;
      if (!id || payRef.current === "success") return;
      selectType(id);
      goTo(1);
    };
    window.addEventListener("seis:prefill", onPrefill);
    return () => window.removeEventListener("seis:prefill", onPrefill);
  }, [selectType, goTo]);

  // Pindahkan fokus ke judul hanya saat langkah/status benar-benar berubah (bantu pengguna pembaca layar)
  useEffect(() => {
    const prev = prevView.current;
    if (prev.step !== step || prev.pay !== pay) headingRef.current?.focus({ preventScroll: true });
    prevView.current = { step, pay };
  }, [step, pay]);

  const selectDate = (d: string) => {
    setValue("date", d, { shouldValidate: true, shouldDirty: true });
    setValue("time", "");
    clearErrors("time");
    track("booking_date_select", { date: d, type });
  };

  const selectTime = (t: string) => {
    setValue("time", t, { shouldValidate: true, shouldDirty: true });
    const s = slots?.find((x) => x.time === t);
    track("booking_slot_select", { time: t, prime: isPrimeSlot(t), slot_status: s?.status, type });
  };

  const setPax = (n: number) => setValue("pax", n, { shouldValidate: true, shouldDirty: true });

  const runNext = () => {
    if (step === 2) track("booking_contact_submit", { type });
    goTo(step + 1);
  };

  const runPay = async (values: BookingInput) => {
    const q = computeQuote(values.type, values.pax);
    setPay("paying");
    track("booking_submit", { type: values.type, pax: values.pax, dp: q.dp });
    const ok = await payDeposit();
    if (ok) {
      setConfirmation({ code: newBookingCode(), values });
      setPay("success");
      track("booking_payment_success", { type: values.type, pax: values.pax, dp: q.dp });
    } else {
      setPay("failed");
      track("booking_payment_failed", { type: values.type, pax: values.pax, dp: q.dp });
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) =>
    handleSubmit(step === 3 ? runPay : runNext)(e);

  const restart = () => {
    reset();
    stepRef.current = 0;
    furthest.current = 0;
    setStep(0);
    setPay("idle");
    setConfirmation(null);
  };

  /* ---------- Berhasil ---------- */
  if (pay === "success" && confirmation) {
    const v = confirmation.values;
    const q = computeQuote(v.type, v.pax);
    return (
      <div ref={rootRef} className="rounded-3xl border border-line bg-surface/80 p-6 sm:p-9">
        <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="grid size-14 place-items-center rounded-full bg-amber text-ink">
          <IconCheck width={28} height={28} strokeWidth={2.4} />
        </motion.div>
        <h3 ref={headingRef} tabIndex={-1} className="mt-6 font-display text-4xl font-medium leading-tight outline-none">
          Reservasi terkonfirmasi, {v.name.split(" ")[0]}.
        </h3>
        <p className="mt-2 text-muted">Simpan kode ini dan tunjukkan saat kamu tiba.</p>
        <p className="mt-5 inline-block rounded-xl border border-amber/50 bg-amber/10 px-5 py-3 font-mono text-2xl font-semibold tracking-[0.18em] text-amber">
          {confirmation.code}
        </p>
        <dl className="mt-6 divide-y divide-line/60 rounded-2xl border border-line bg-raised text-sm">
          {[
            ["Jenis", bookingTypes[v.type].label],
            ["Tanggal", formatDateID(v.date)],
            ["Jam", `${v.time} WIB`],
            ["Jumlah orang", `${v.pax} orang`],
            ["DP dibayar", rupiah(q.dp)],
            ["Sisa dibayar di tempat", rupiah(q.remaining)],
          ].map(([k, val]) => (
            <div key={k} className="flex justify-between gap-4 px-4 py-3">
              <dt className="text-muted">{k}</dt>
              <dd className="text-right font-medium">{val}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-xs text-muted">Mode prototipe: pembayaran disimulasikan dan belum ada transaksi nyata.</p>
        <Button variant="secondary" onClick={restart} className="mt-6">
          Buat reservasi lain
        </Button>
      </div>
    );
  }

  const paying = pay === "paying";
  const submitLabel = step === 2 ? "Lihat Total & DP" : step === 3 ? `Bayar DP ${rupiah(quote.dp)}` : "Lanjut";

  return (
    <div ref={rootRef} className="rounded-2xl sm:rounded-3xl border border-line bg-surface/80 p-3.5 sm:p-7 md:p-9">
      <ol aria-label="Langkah reservasi" className="mb-4 sm:mb-7 flex gap-1.5 sm:gap-2">
        {STEPS.map((label, i) => (
          <li key={label} aria-current={i === step ? "step" : undefined} className="flex-1">
            <span className={`block h-1 rounded-full transition-colors ${i <= step ? "bg-amber" : "bg-line"}`} />
            <span
              className={`mt-2 block text-[11px] font-semibold uppercase tracking-wider max-sm:hidden ${
                i === step ? "text-amber" : "text-muted"
              }`}
            >
              {i + 1}. {label}
            </span>
          </li>
        ))}
      </ol>
      <p className="-mt-2 sm:-mt-4 mb-3 sm:mb-6 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-amber sm:hidden">
        Langkah {step + 1} dari {STEPS.length} · {STEPS[step]}
      </p>

      <h3 ref={headingRef} tabIndex={-1} className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium leading-tight outline-none">
        {TITLES[step]}
      </h3>

      <form noValidate onSubmit={onSubmit} className="mt-4 sm:mt-6">
        <motion.div key={step} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}>
          {/* ---- Langkah 1: Jenis ---- */}
          {step === 0 && (
            <div
              role="radiogroup"
              aria-label="Jenis reservasi"
              className="grid grid-cols-2 gap-2 sm:gap-2.5 lg:grid-cols-1 lg:gap-3"
            >
              {bookingTypeList.map((t) => {
                const isWedding = t.id === "wedding";
                return (
                  <label
                    key={t.id}
                    className={`cursor-pointer ${isWedding ? "col-span-2 lg:col-span-1" : "col-span-1"}`}
                  >
                    <input
                      type="radio"
                      name="booking-type"
                      value={t.id}
                      checked={type === t.id}
                      onChange={() => selectType(t.id)}
                      className="peer sr-only"
                    />
                    <span className="flex flex-col justify-between h-full rounded-xl sm:rounded-2xl border border-line bg-raised p-2.5 sm:p-3.5 lg:p-4 transition-colors hover:border-amber/60 peer-checked:border-amber peer-checked:bg-amber/10 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-amber">
                      <div className="flex items-start justify-between gap-1.5">
                        <span className="block text-xs sm:text-sm lg:text-lg font-semibold leading-tight text-cream">
                          {t.label}
                        </span>
                        <span className="shrink-0 rounded-full border border-amber/40 bg-amber/10 px-1.5 py-0.5 text-[10px] sm:text-xs font-semibold text-amber">
                          DP {Math.round(t.dpRate * 100)}%
                        </span>
                      </div>
                      <span className="mt-1 block text-[11px] sm:text-xs lg:text-sm text-muted leading-tight">
                        {t.blurb}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          )}

          {/* ---- Langkah 2: Jadwal ---- */}
          {step === 1 && (
            <div className="space-y-7">
              <div>
                <p className="mb-2 text-sm font-semibold">Tanggal</p>
                {today ? (
                  <Calendar value={date} today={today} maxDate={addDays(today, MAX_ADVANCE_DAYS)} onSelect={selectDate} />
                ) : (
                  <div className="h-[22rem] animate-pulse rounded-2xl border border-line bg-raised" />
                )}
                <FieldError id="err-date" message={errors.date?.message} />
              </div>

              {date && slots && (
                <div>
                  <p className="mb-2 text-sm font-semibold">
                    Jam kedatangan <span className="font-normal text-muted">· {formatDateID(date, { weekday: "long", day: "numeric", month: "long" })}</span>
                  </p>
                  {showScarcity && (
                    <p role="status" className="mb-3 rounded-xl border border-warn/40 bg-warn/10 px-4 py-3 text-sm text-warn">
                      Hanya tersisa {primeLeft} slot untuk {scarcityLabel}. Amankan meja favoritmu sekarang sebelum diambil orang.
                    </p>
                  )}
                  {allUnavailable && (
                    <p role="status" className="mb-3 rounded-xl border border-line bg-raised px-4 py-3 text-sm text-muted">
                      Semua jam di tanggal ini sudah penuh. Coba pilih tanggal lain.
                    </p>
                  )}
                  <SlotPicker slots={slots} value={time} onSelect={selectTime} />
                  <FieldError id="err-time" message={errors.time?.message} />
                </div>
              )}

              <div>
                <p id="pax-label" className="mb-2 text-sm font-semibold">
                  Jumlah orang <span className="font-normal text-muted">· {cfg.minPax}–{cfg.maxPax} orang untuk {cfg.label}</span>
                </p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="Kurangi jumlah orang"
                    disabled={!(pax > cfg.minPax)}
                    onClick={() => setPax(pax - 1)}
                    className="grid size-12 place-items-center rounded-full border border-line transition-colors hover:border-amber disabled:opacity-35 disabled:hover:border-line"
                  >
                    <IconMinus />
                  </button>
                  <input
                    aria-labelledby="pax-label"
                    aria-invalid={!!errors.pax}
                    aria-describedby={errors.pax ? "err-pax" : undefined}
                    inputMode="numeric"
                    autoComplete="off"
                    value={Number.isNaN(pax) ? "" : pax}
                    onChange={(e) => setPax(e.target.value === "" ? NaN : parseInt(e.target.value, 10))}
                    className={`${inputClass} w-24 text-center text-lg font-semibold tabular-nums`}
                  />
                  <button
                    type="button"
                    aria-label="Tambah jumlah orang"
                    disabled={!(pax < cfg.maxPax)}
                    onClick={() => setPax((Number.isFinite(pax) ? pax : cfg.minPax - 1) + 1)}
                    className="grid size-12 place-items-center rounded-full border border-line transition-colors hover:border-amber disabled:opacity-35 disabled:hover:border-line"
                  >
                    <IconPlus />
                  </button>
                </div>
                <FieldError id="err-pax" message={errors.pax?.message} />
              </div>
            </div>
          )}

          {/* ---- Langkah 3: Data diri ---- */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-semibold">Nama</label>
                <input id="name" autoComplete="name" placeholder="Nama lengkap" aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "err-name" : undefined} className={inputClass} {...register("name")} />
                <FieldError id="err-name" message={errors.name?.message} />
              </div>
              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-semibold">Nomor WhatsApp</label>
                <input id="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="0812 3456 7890" aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "err-phone" : "hint-phone"} className={inputClass} {...register("phone")} />
                {errors.phone ? (
                  <FieldError id="err-phone" message={errors.phone.message} />
                ) : (
                  <p id="hint-phone" className="mt-1.5 text-sm text-muted">Kode reservasi dan pengingat dikirim ke nomor ini.</p>
                )}
              </div>
              <div>
                <label htmlFor="notes" className="mb-2 block text-sm font-semibold">{cfg.notesLabel}</label>
                <textarea id="notes" rows={3} placeholder={cfg.notesPlaceholder} aria-invalid={!!errors.notes}
                  aria-describedby={errors.notes ? "err-notes" : undefined}
                  className={`${inputClass} h-auto py-3`} {...register("notes")} />
                <FieldError id="err-notes" message={errors.notes?.message} />
              </div>
            </div>
          )}

          {/* ---- Langkah 4: Konfirmasi & DP ---- */}
          {step === 3 && (
            <div>
              <dl className="divide-y divide-line/60 rounded-2xl border border-line bg-raised text-sm">
                {[
                  ["Jenis", cfg.label],
                  ["Tanggal", date ? formatDateID(date) : "-"],
                  ["Jam", `${time} WIB${isPrimeSlot(time) ? " · prime time" : ""}`],
                  ["Jumlah orang", `${pax} orang`],
                  ["Atas nama", getValues("name")],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 px-4 py-3">
                    <dt className="text-muted">{k}</dt>
                    <dd className="text-right font-medium">{v}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-4 rounded-2xl border border-amber/40 bg-amber/10 p-5">
                <div className="flex justify-between text-sm">
                  <span className="text-cream/80">Estimasi total (minimum spend)</span>
                  <span className="tabular-nums">{rupiah(quote.total)}</span>
                </div>
                <div className="mt-3 flex items-end justify-between gap-4">
                  <span className="text-sm font-semibold">DP {quote.dpPercent}% dibayar sekarang</span>
                  <span className="font-display text-4xl font-medium leading-none tabular-nums text-amber">{rupiah(quote.dp)}</span>
                </div>
                <div className="mt-3 flex justify-between border-t border-amber/25 pt-3 text-sm">
                  <span className="text-cream/80">Sisa dibayar di tempat</span>
                  <span className="tabular-nums">{rupiah(quote.remaining)}</span>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted">{dpNote}</p>

              {pay === "failed" && (
                <div role="alert" className="mt-5 rounded-2xl border border-rose-400/40 bg-rose-400/10 p-5">
                  <p className="font-semibold text-rose-200">Pembayaran DP belum berhasil.</p>
                  <p className="mt-1 text-sm text-cream/80">
                    Jadwalmu belum terkunci. Coba bayar lagi, atau lanjutkan lewat admin kami di WhatsApp. Data reservasimu sudah kami siapkan di pesannya.
                  </p>
                  <ButtonLink
                    href={whatsappLink(fallbackMessage(getValues()))}
                    external
                    trackName="whatsapp_fallback_click"
                    variant="secondary"
                    className="mt-4 w-full sm:w-auto"
                  >
                    <IconWhatsapp width={18} height={18} /> Lanjutkan via WhatsApp
                  </ButtonLink>
                </div>
              )}
            </div>
          )}
        </motion.div>

        <div className="mt-5 sm:mt-8 flex flex-col-reverse gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          {step > 0 ? (
            <Button variant="ghost" disabled={paying} onClick={() => { setPay("idle"); goTo(step - 1); }}>
              Kembali
            </Button>
          ) : (
            <span />
          )}
          <Button type="submit" disabled={paying} className="sm:min-w-56">
            {paying ? "Memproses pembayaran…" : pay === "failed" ? `Coba bayar lagi ${rupiah(quote.dp)}` : submitLabel}
          </Button>
        </div>
        <p className="sr-only" role="status" aria-live="polite">
          {paying ? "Memproses pembayaran DP" : ""}
        </p>
      </form>
    </div>
  );
}
