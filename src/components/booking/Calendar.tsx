"use client";

import { useState } from "react";
import { IconChevronLeft, IconChevronRight } from "@/components/ui/Icons";
import { formatDateID, toISO } from "@/lib/datetime";

const WEEKDAYS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

interface CalendarProps {
  value: string;
  today: string;
  maxDate: string;
  onSelect: (date: string) => void;
}

export function Calendar({ value, today, maxDate, onSelect }: CalendarProps) {
  const initial = (value || today).split("-").map(Number);
  const [view, setView] = useState({ y: initial[0], m: initial[1] });

  const [ty, tm] = today.split("-").map(Number);
  const [my, mm] = maxDate.split("-").map(Number);
  const canPrev = view.y * 12 + view.m > ty * 12 + tm;
  const canNext = view.y * 12 + view.m < my * 12 + mm;

  const shift = (delta: number) =>
    setView(({ y, m }) => {
      const idx = y * 12 + (m - 1) + delta;
      return { y: Math.floor(idx / 12), m: (idx % 12) + 1 };
    });

  const startOffset = (new Date(Date.UTC(view.y, view.m - 1, 1)).getUTCDay() + 6) % 7; // Senin = kolom pertama
  const daysInMonth = new Date(Date.UTC(view.y, view.m, 0)).getUTCDate();
  const monthLabel = formatDateID(toISO(view.y, view.m, 1), { month: "long", year: "numeric" });

  return (
    <div className="rounded-2xl border border-line bg-raised p-4">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => shift(-1)}
          disabled={!canPrev}
          aria-label="Bulan sebelumnya"
          className="grid size-11 place-items-center rounded-full text-cream transition-colors hover:text-amber disabled:opacity-30 disabled:hover:text-cream"
        >
          <IconChevronLeft />
        </button>
        <p className="font-semibold capitalize" aria-live="polite">
          {monthLabel}
        </p>
        <button
          type="button"
          onClick={() => shift(1)}
          disabled={!canNext}
          aria-label="Bulan berikutnya"
          className="grid size-11 place-items-center rounded-full text-cream transition-colors hover:text-amber disabled:opacity-30 disabled:hover:text-cream"
        >
          <IconChevronRight />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((d) => (
          <span key={d} className="pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted">
            {d}
          </span>
        ))}
        {Array.from({ length: startOffset }, (_, i) => (
          <span key={`b${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const iso = toISO(view.y, view.m, i + 1);
          const disabled = iso < today || iso > maxDate;
          const selected = iso === value;
          return (
            <button
              key={iso}
              type="button"
              disabled={disabled}
              aria-pressed={selected}
              aria-label={formatDateID(iso)}
              onClick={() => onSelect(iso)}
              className={`mx-auto grid aspect-square w-full max-w-11 place-items-center rounded-full text-sm tabular-nums transition-colors ${
                selected
                  ? "bg-amber font-semibold text-ink"
                  : disabled
                    ? "cursor-not-allowed text-muted/40"
                    : "text-cream hover:bg-cream/10"
              } ${iso === today && !selected ? "ring-1 ring-amber/70" : ""}`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
