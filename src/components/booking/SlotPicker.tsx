"use client";

import type { Slot } from "@/lib/availability";

function statusNote(s: Slot): { text: string; className: string } | null {
  switch (s.status) {
    case "full":
      return { text: "Habis", className: "text-muted" };
    case "past":
      return { text: "Lewat", className: "text-muted" };
    case "limited":
      return { text: `Tersisa ${s.remaining} Slot`, className: "text-warn" };
    case "busy":
      return { text: `Terisi ${Math.round(s.occupancyPct / 10) * 10}%`, className: "text-busy" };
    default:
      return null;
  }
}

interface SlotPickerProps {
  slots: Slot[];
  value: string;
  onSelect: (time: string) => void;
}

export function SlotPicker({ slots, value, onSelect }: SlotPickerProps) {
  return (
    <div role="radiogroup" aria-label="Jam kedatangan" className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {slots.map((s) => {
        const unavailable = s.status === "full" || s.status === "past";
        const note = statusNote(s);
        const prime = s.prime && !unavailable;
        return (
          <label key={s.time} className={unavailable ? "cursor-not-allowed" : "cursor-pointer"}>
            <input
              type="radio"
              name="slot"
              value={s.time}
              checked={value === s.time}
              disabled={unavailable}
              onChange={() => onSelect(s.time)}
              className="peer sr-only"
            />
            <span
              className={`flex min-h-[4.25rem] flex-col items-center justify-center rounded-xl border px-1 py-2 text-center transition-colors peer-checked:border-amber peer-checked:bg-amber/15 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-amber ${
                unavailable ? "border-line/50 bg-transparent" : "border-line bg-raised hover:border-amber/60"
              }`}
            >
              <span className={`text-base font-semibold tabular-nums ${unavailable ? "text-muted line-through" : ""}`}>
                {s.time}
              </span>
              {prime && <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber">Tersedia Terbatas</span>}
              {note && <span className={`mt-0.5 text-[11px] font-medium ${note.className}`}>{note.text}</span>}
            </span>
          </label>
        );
      })}
    </div>
  );
}
