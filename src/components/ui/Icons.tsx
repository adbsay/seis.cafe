import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = (p: P) => ({
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...p,
});

export const IconCheck = (p: P) => (<svg {...base(p)}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>);
export const IconPlus = (p: P) => (<svg {...base(p)}><path d="M12 5v14M5 12h14" /></svg>);
export const IconMinus = (p: P) => (<svg {...base(p)}><path d="M5 12h14" /></svg>);
export const IconClose = (p: P) => (<svg {...base(p)}><path d="m6 6 12 12M18 6 6 18" /></svg>);
export const IconChevronLeft = (p: P) => (<svg {...base(p)}><path d="m15 5-7 7 7 7" /></svg>);
export const IconChevronRight = (p: P) => (<svg {...base(p)}><path d="m9 5 7 7-7 7" /></svg>);
export const IconArrowRight = (p: P) => (<svg {...base(p)}><path d="M5 12h14m-6-6 6 6-6 6" /></svg>);
export const IconPlug = (p: P) => (<svg {...base(p)}><path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0V8ZM12 17v4" /></svg>);
export const IconWifi = (p: P) => (<svg {...base(p)}><path d="M2.5 9a15 15 0 0 1 19 0M5.5 12.5a10.5 10.5 0 0 1 13 0M8.7 16a6 6 0 0 1 6.6 0" /><circle cx="12" cy="19.2" r=".9" fill="currentColor" /></svg>);
export const IconDoor = (p: P) => (<svg {...base(p)}><path d="M5 21V4a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v17M3 21h18" /><circle cx="12.6" cy="12.5" r=".8" fill="currentColor" /></svg>);
export const IconPin = (p: P) => (<svg {...base(p)}><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.4" /></svg>);
export const IconInstagram = (p: P) => (<svg {...base(p)}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17" cy="7" r=".8" fill="currentColor" /></svg>);
export const IconWhatsapp = (p: P) => (<svg {...base(p)}><path d="M4 20l1.2-4.1A8 8 0 1 1 8.2 19L4 20Z" /><path d="M9.2 8.8c.3 2.6 2.4 4.7 5 5l1-1.1-1.7-.9-.7.6c-.8-.3-1.5-1-1.8-1.8l.6-.7-.9-1.7-1.5.6Z" /></svg>);

export function IconStar({ filled = true, ...p }: P & { filled?: boolean }) {
  return (
    <svg {...base(p)} fill={filled ? "currentColor" : "none"} strokeWidth={1.2}>
      <path d="m12 3.2 2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.5l6-.8L12 3.2Z" />
    </svg>
  );
}
