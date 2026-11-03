import { site } from "@/data/site";

/** Jam operasional detail (wajib tampil). */
export function HoursList({ className = "" }: { className?: string }) {
  return (
    <dl className={`space-y-2 ${className}`}>
      {site.hours.map((h) => (
        <div key={h.label} className="flex items-baseline justify-between gap-6 border-b border-line/60 pb-2 last:border-0">
          <dt className="text-muted">{h.label}</dt>
          <dd className="font-medium tabular-nums text-cream">
            {h.open} – {h.close} WIB
          </dd>
        </div>
      ))}
    </dl>
  );
}
