"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";

const links = [
  { href: "#menu", label: "Menu" },
  { href: "#suasana", label: "Suasana" },
  { href: "#lokasi", label: "Lokasi" },
];

export function Header() {
  const { scrollY } = useScroll();
  const background = useTransform(scrollY, [0, 140], ["rgba(11,9,7,0)", "rgba(11,9,7,0.88)"]);
  const blur = useTransform(scrollY, [0, 140], ["blur(0px)", "blur(14px)"]);
  const border = useTransform(scrollY, [0, 140], ["rgba(233,196,130,0)", "rgba(233,196,130,0.16)"]);

  return (
    <motion.header
      style={{ background, backdropFilter: blur, WebkitBackdropFilter: blur, borderColor: border }}
      className="fixed inset-x-0 top-0 z-50 border-b"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#top" aria-label="Seis Cafe, kembali ke atas" className="flex min-h-11 items-center">
          <Image src="/images/logo-wordmark.png" alt="Seis" width={884} height={400} className="h-9 w-auto" priority />
        </a>
        <nav aria-label="Navigasi utama" className="flex items-center gap-1 sm:gap-2">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="hidden min-h-11 items-center rounded-full px-4 text-sm font-medium text-muted transition-colors hover:text-cream md:inline-flex"
            >
              {l.label}
            </a>
          ))}
          <ButtonLink href="#booking" trackName="cta_click" className="!min-h-11 !px-5 !text-sm">
            Reservasi
          </ButtonLink>
        </nav>
      </div>
    </motion.header>
  );
}
