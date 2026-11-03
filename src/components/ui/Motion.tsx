"use client";

import { MotionConfig, animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";
import { formatNumber } from "@/lib/format";

/** Menghormati prefers-reduced-motion di seluruh animasi Framer Motion. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/** Fade-in + naik tipis saat masuk viewport (sekali). */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/** Angka yang menghitung naik saat terlihat. */
export function CountUp({ to, suffix = "", decimals = 0 }: { to: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const value = useMotionValue(0);
  const text = useTransform(value, (v) => `${formatNumber(v, decimals)}${suffix}`);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(value, to, { duration: 1.8, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [inView, to, value]);

  return <motion.span ref={ref}>{text}</motion.span>;
}
