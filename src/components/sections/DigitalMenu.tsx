"use client";

import { useMemo, useState } from "react";
import { IconArrowRight, IconClose, IconStar } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Motion";
import {
  categoryLabel,
  menuCategories,
  menuItems,
  type MenuCategoryId,
  type MenuItem,
} from "@/data/menu";
import { track } from "@/lib/analytics";

// Helper format harga ringkas seperti buku menu (cth: 18k, 48k / 53k, R 40k / L 55k)
const formatPrice = (item: MenuItem) => {
  if (item.priceDisplay) return item.priceDisplay;
  return `${Math.round(item.price / 1000)}k`;
};

// Komponen baris menu ringkas (Menu Item Row dengan dotted leader line)
function MenuRow({ item }: { item: MenuItem }) {
  return (
    <div className="group -mx-2 flex flex-col rounded-lg px-2 py-1.5 transition-colors hover:bg-raised/70">
      <div className="flex items-baseline justify-between gap-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="truncate text-sm font-medium text-cream transition-colors group-hover:text-amber">
            {item.name}
          </span>
          {item.isSignature && (
            <span
              title="Menu Signature / Favorit"
              className="inline-flex shrink-0 items-center text-amber text-xs"
            >
              <IconStar width={12} height={12} />
            </span>
          )}
        </div>

        {/* Garis titik-titik pemisah (Dotted leader line) */}
        <span
          aria-hidden="true"
          className="min-w-3 flex-1 border-b border-dotted border-line/45 self-center mb-0.5"
        />

        {/* Harga Ringkas */}
        <span className="shrink-0 font-semibold tabular-nums text-amber text-sm whitespace-nowrap">
          {formatPrice(item)}
        </span>
      </div>

      {/* Catatan varian jika ada (cth: Chicken 48k / Beef 53k) */}
      {item.priceNote && (
        <span className="text-[11px] text-muted/80 pl-0.5 leading-tight">
          {item.priceNote}
        </span>
      )}
    </div>
  );
}

// Panel Kategori / Subkategori Ringkas (Menu Board Card)
function MenuBoardCard({
  title,
  items,
  twoColumns = false,
}: {
  title: string;
  items: MenuItem[];
  twoColumns?: boolean;
}) {
  if (!items || items.length === 0) return null;

  return (
    <div className="flex flex-col rounded-2xl border border-line/70 bg-surface/75 p-4 sm:p-5 shadow-sm">
      {/* Header Section */}
      <div className="mb-2.5 flex items-center justify-between border-b border-line/40 pb-2">
        <h3 className="font-display text-lg font-medium tracking-wide text-amber sm:text-xl">
          {title}
        </h3>
        <span className="text-[11px] font-medium tabular-nums text-muted/70">
          {items.length} item
        </span>
      </div>

      {/* Daftar Baris Menu */}
      {twoColumns ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0.5">
          {items.map((item) => (
            <MenuRow key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="space-y-0.5">
          {items.map((item) => (
            <MenuRow key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export function DigitalMenu() {
  const [activeCategory, setActiveCategory] = useState<MenuCategoryId | "all">("kopi");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter pencarian
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    return menuItems.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.subcategory.toLowerCase().includes(q) ||
        (item.priceNote?.toLowerCase().includes(q) ?? false) ||
        (item.teaser?.toLowerCase().includes(q) ?? false)
    );
  }, [searchQuery]);

  // Kelompokkan menu per subkategori untuk kategori aktif
  const currentSections = useMemo(() => {
    const list =
      activeCategory === "all"
        ? menuItems
        : menuItems.filter((i) => i.category === activeCategory);

    const subcats = Array.from(new Set(list.map((i) => i.subcategory)));
    return subcats.map((sub) => ({
      title: sub,
      items: list.filter((i) => i.subcategory === sub),
    }));
  }, [activeCategory]);

  // Hitung jumlah item per kategori
  const countPerCategory = useMemo(() => {
    const counts: Record<string, number> = { all: menuItems.length };
    for (const c of menuCategories) {
      counts[c.id] = menuItems.filter((i) => i.category === c.id).length;
    }
    return counts;
  }, []);

  const handleCategoryChange = (cat: MenuCategoryId | "all") => {
    setActiveCategory(cat);
    track("booking_type_select", { category: cat === "all" ? "Semua" : categoryLabel(cat) });
  };

  return (
    <section id="menu" aria-labelledby="menu-title" className="relative py-10 sm:py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-5">
        <Reveal>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-4">
            <div>
              <p className="mb-1.5 sm:mb-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.24em] text-amber">
                Buku Menu Resmi Seis Cafe
              </p>
              <h2
                id="menu-title"
                className="font-display text-2xl font-medium leading-tight sm:text-3xl md:text-4xl lg:text-5xl"
              >
                Daftar Menu &amp; Harga
              </h2>
            </div>

            {/* Quick Search Bar Ringkas */}
            <div className="relative w-full md:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari menu (misal: Sanger, Taliwang)..."
                className="w-full rounded-full border border-line bg-surface/90 py-2 pl-9 pr-8 text-xs sm:text-sm text-cream placeholder:text-muted/60 focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
              />
              <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </div>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Hapus pencarian"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted hover:text-cream"
                >
                  <IconClose width={13} height={13} />
                </button>
              )}
            </div>
          </div>
        </Reveal>

        {/* Tab Kategori Ringkas (Kecil, Tidak Penuh-Penuhin) */}
        {!searchResults && (
          <div
            role="tablist"
            aria-label="Kategori menu"
            className="no-scrollbar -mx-4 mt-6 flex gap-1.5 overflow-x-auto px-4 md:mx-0 md:px-0"
          >
            {menuCategories.map((c) => {
              const isSelected = activeCategory === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => handleCategoryChange(c.id)}
                  className={`min-h-9 shrink-0 rounded-full border px-3.5 text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    isSelected
                      ? "border-amber bg-amber text-ink"
                      : "border-line text-muted hover:border-amber/50 hover:text-cream"
                  }`}
                >
                  <span>{c.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? "bg-ink/15 text-ink" : "bg-raised text-muted/70"
                    }`}
                  >
                    {countPerCategory[c.id]}
                  </span>
                </button>
              );
            })}

            <button
              type="button"
              role="tab"
              aria-selected={activeCategory === "all"}
              onClick={() => handleCategoryChange("all")}
              className={`min-h-9 shrink-0 rounded-full border px-3.5 text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeCategory === "all"
                  ? "border-amber bg-amber text-ink"
                  : "border-line text-muted hover:border-amber/50 hover:text-cream"
              }`}
            >
              <span>Semua</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeCategory === "all" ? "bg-ink/15 text-ink" : "bg-raised text-muted/70"
                }`}
              >
                {countPerCategory.all}
              </span>
            </button>
          </div>
        )}

        {/* Tampilan Konten Menu */}
        <div className="mt-6">
          {/* Mode Hasil Pencarian */}
          {searchResults ? (
            <div>
              <div className="mb-4 flex items-center justify-between text-xs text-muted">
                <span>
                  Hasil pencarian untuk &quot;<strong className="text-cream">{searchQuery}</strong>&quot; ({searchResults.length} item)
                </span>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-amber hover:underline"
                >
                  Tutup Pencarian
                </button>
              </div>

              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-line/60 bg-surface/75 p-3.5"
                    >
                      <div className="flex items-center justify-between gap-1 text-[11px] text-muted/80 mb-1">
                        <span className="uppercase tracking-wider">{item.subcategory}</span>
                        {item.isSignature && (
                          <span className="text-amber flex items-center gap-0.5">
                            <IconStar width={11} height={11} /> Signature
                          </span>
                        )}
                      </div>
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-medium text-cream text-sm">{item.name}</span>
                        <span className="font-semibold text-amber text-sm tabular-nums shrink-0">
                          {formatPrice(item)}
                        </span>
                      </div>
                      {item.priceNote && (
                        <p className="text-[11px] text-muted mt-1">{item.priceNote}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-line/60 bg-surface/50 p-8 text-center text-sm text-muted">
                  Menu &quot;{searchQuery}&quot; tidak ditemukan. Coba kata kunci lain atau pilih tab kategori.
                </div>
              )}
            </div>
          ) : (
            /* Mode Tata Letak Menu Board Standar */
            <div>
              {/* Kategori Kopi & V60: 3 Kolom Elegan */}
              {activeCategory === "kopi" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 items-start">
                  {/* Kolom 1: Coffee Series (17 item) */}
                  <MenuBoardCard
                    title="Coffee Series"
                    items={currentSections.find((s) => s.title === "Coffee Series")?.items ?? []}
                  />

                  {/* Kolom 2: Coffee Mocktail & V60 Series */}
                  <div className="space-y-4 sm:space-y-5">
                    <MenuBoardCard
                      title="Coffee Mocktail"
                      items={currentSections.find((s) => s.title === "Coffee Mocktail")?.items ?? []}
                    />
                    <MenuBoardCard
                      title="V60 Series (Manual Brew)"
                      items={currentSections.find((s) => s.title === "V60 Series")?.items ?? []}
                    />
                  </div>

                  {/* Kolom 3: Montblanc Series */}
                  <MenuBoardCard
                    title="Montblanc Series"
                    items={currentSections.find((s) => s.title === "Montblanc Series")?.items ?? []}
                  />
                </div>
              )}

              {/* Kategori Non-Kopi & Mocktail: 3 Kolom Elegan */}
              {activeCategory === "non-kopi" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 items-start">
                  {/* Kolom 1: Milk Base (12 item) */}
                  <MenuBoardCard
                    title="Milk Base"
                    items={currentSections.find((s) => s.title === "Milk Base")?.items ?? []}
                  />

                  {/* Kolom 2: Tea Base & Fruity */}
                  <div className="space-y-4 sm:space-y-5">
                    <MenuBoardCard
                      title="Tea Base"
                      items={currentSections.find((s) => s.title === "Tea Base")?.items ?? []}
                    />
                    <MenuBoardCard
                      title="Fruity (Fresh Juice)"
                      items={currentSections.find((s) => s.title === "Fruity")?.items ?? []}
                    />
                  </div>

                  {/* Kolom 3: Mocktail Segar */}
                  <MenuBoardCard
                    title="Mocktail"
                    items={currentSections.find((s) => s.title === "Mocktail")?.items ?? []}
                  />
                </div>
              )}

              {/* Kategori Makanan Utama: 3 Kolom Sejajar (Main Course, Fried Rice, Rice Bowl) */}
              {activeCategory === "makanan" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 items-start">
                  <MenuBoardCard
                    title="Main Course"
                    items={currentSections.find((s) => s.title === "Main Course")?.items ?? []}
                  />
                  <MenuBoardCard
                    title="Fried Rice"
                    items={currentSections.find((s) => s.title === "Fried Rice")?.items ?? []}
                  />
                  <MenuBoardCard
                    title="Rice Bowl"
                    items={currentSections.find((s) => s.title === "Rice Bowl")?.items ?? []}
                  />
                </div>
              )}

              {/* Kategori Pasta & Western: Layout 2 Kolom Ringkas */}
              {activeCategory === "pasta-western" && (
                <div className="max-w-3xl mx-auto">
                  <MenuBoardCard
                    title="Pasta & Western"
                    items={currentSections.find((s) => s.title === "Pasta & Western")?.items ?? []}
                    twoColumns
                  />
                </div>
              )}

              {/* Kategori Mie & Sup: 2 Kolom Sejajar */}
              {activeCategory === "mie-sup" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 items-start max-w-4xl mx-auto">
                  <MenuBoardCard
                    title="Soup"
                    items={currentSections.find((s) => s.title === "Soup")?.items ?? []}
                  />
                  <MenuBoardCard
                    title="Noodle"
                    items={currentSections.find((s) => s.title === "Noodle")?.items ?? []}
                  />
                </div>
              )}

              {/* Kategori Snack & Camilan: 2 Kolom Rapi */}
              {activeCategory === "snack" && (
                <div className="max-w-4xl mx-auto">
                  <MenuBoardCard
                    title="Snack & Camilan"
                    items={currentSections.find((s) => s.title === "Snack")?.items ?? []}
                    twoColumns
                  />
                </div>
              )}

              {/* Tab Semua: Menampilkan Seluruh Bagian Secara Padat */}
              {activeCategory === "all" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 items-start">
                  {currentSections.map((sec) => (
                    <MenuBoardCard key={sec.title} title={sec.title} items={sec.items} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Baris Ringkas Ajakan Reservasi */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-line/60 bg-surface/60 px-5 py-3.5 text-xs text-muted">
          <span>Sudah menentukan pilihan? Kunci meja atau sewa ruang privat sekarang.</span>
          <a
            href="#booking"
            onClick={() => track("cta_click", { target: "#booking", source: "menu_bottom" })}
            className="inline-flex items-center gap-1 font-semibold text-amber hover:text-amber-soft transition-colors shrink-0"
          >
            <span>Lanjut ke Form Reservasi</span>
            <IconArrowRight width={14} height={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
