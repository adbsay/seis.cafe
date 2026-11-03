import { useSyncExternalStore } from "react";
import { nowWIB } from "@/lib/datetime";

const subscribe = (onChange: () => void) => {
  const id = setInterval(onChange, 60_000); // tangkap pergantian hari saat halaman dibiarkan terbuka
  return () => clearInterval(id);
};

/** Tanggal hari ini (WIB). `null` saat render server, supaya tidak pernah memakai tanggal build yang basi. */
export function useToday() {
  return useSyncExternalStore<string | null>(subscribe, () => nowWIB().date, () => null);
}
