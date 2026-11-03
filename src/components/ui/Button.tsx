"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { BookingTypeId } from "@/data/booking";
import { track } from "@/lib/analytics";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-amber text-ink hover:bg-amber-soft",
  secondary: "border border-cream/30 text-cream hover:border-amber hover:text-amber",
  ghost: "text-muted hover:text-cream",
};

const press = { whileHover: { y: -1 }, whileTap: { scale: 0.97 } };

interface ButtonProps {
  variant?: Variant;
  className?: string;
  children: ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
  "aria-label"?: string;
}

export function Button({ variant = "primary", className = "", children, type = "button", ...rest }: ButtonProps) {
  return (
    <motion.button type={type} className={`${base} ${variants[variant]} ${className}`} {...press} {...rest}>
      {children}
    </motion.button>
  );
}

interface ButtonLinkProps {
  href: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
  external?: boolean;
  /** nama event analytics saat diklik */
  trackName?: string;
  /** pilih jenis reservasi di form sebelum scroll ke #booking */
  prefillType?: BookingTypeId;
  "aria-label"?: string;
}

export function ButtonLink({
  href,
  variant = "primary",
  className = "",
  children,
  external,
  trackName,
  prefillType,
  ...rest
}: ButtonLinkProps) {
  const onClick = () => {
    if (trackName) track(trackName, { target: href, type: prefillType });
    if (prefillType) window.dispatchEvent(new CustomEvent("seis:prefill", { detail: { type: prefillType } }));
  };
  return (
    <motion.a
      href={href}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...press}
      {...rest}
    >
      {children}
    </motion.a>
  );
}
