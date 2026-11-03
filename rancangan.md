<thinking>
lynqo
</thinking>
# Penjelasan Ulang Website Lelang Kupon: Halaman dan Cara Teknis Lelang

Website ini adalah platform lelang berbayar di mana pengguna tidak perlu membuat akun. Mereka cukup datang sebagai guest, melihat daftar lelang, lalu membeli tiket partisipasi untuk bisa masuk ke ruang lelang dan menawar barang. Halaman publik terdiri dari beranda yang menampilkan kartu-kartu lelang aktif, halaman detail lelang yang memuat foto barang, deskripsi, harga awal, harga tiket, sisa tiket, ambang minimum, batas waktu pembelian tiket, dan countdown, lalu ada halaman Cara Kerja, FAQ, Syarat & Ketentuan, serta Kebijakan Privasi. Di halaman detail lelang ada dua tombol utama: “Beli Tiket” sebelum lelang dimulai, dan “Masuk Ruang Lelang” yang aktif saat lelang berjalan. Untuk bertransaksi, pengguna mengisi nama, email aktif, dan nomor WhatsApp, memilih jumlah tiket, lalu membayar via QRIS. Setelah pembayaran terverifikasi, sistem mengirim kode tiket unik ke email dan WhatsApp, dan pengguna diarahkan ke halaman sukses yang menampilkan kode tersebut. Ada juga halaman “Tiket Saya” untuk melihat daftar tiket berdasarkan email dan OTP, serta halaman instruksi pembayaran dan halaman sukses tiket.

Secara teknis, lelang berjalan dalam beberapa tahap. Pertama, admin membuat lelang dengan menentukan barang, harga pokok, harga tiket, total tiket, ambang minimum tiket terjual, harga awal penawaran, kelipatan penawaran, tanggal mulai, batas pembelian tiket, dan tanggal draw. Kedua, pengguna membeli tiket dan mendapatkan kode unik. Ketiga, saat lelang dimulai, pengguna membuka halaman ruang lelang, memasukkan kode tiket, lalu sistem mengirim OTP ke email atau WhatsApp yang terdaftar. Jika kode valid, OTP benar, dan lelang sedang berjalan, pengguna masuk ke ruang lelang. Di dalam ruang lelang, pengguna melihat harga tertinggi saat ini, riwayat penawaran real-time, dan countdown sisa waktu. Mereka memasukkan penawaran yang harus lebih tinggi dari harga tertinggi ditambah kelipatan. Setiap penawaran divalidasi secara atomik di backend menggunakan Redis Lua Compare-and-Swap agar tidak ada dua penawaran dengan harga sama yang diterima bersamaan, lalu penawaran disiarkan ke semua peserta via WebSocket.

Saat waktu lelang habis, sistem otomatis memeriksa apakah ambang minimum tiket terjual terpenuhi. Jika ya, sistem mengambil penawaran tertinggi sebagai pemenang, mengirim notifikasi ke pemenang, dan memberi waktu 24 jam untuk melunasi harga penawaran. Jika pemenang tidak melunasi, ia gugur, tiketnya hangus, dan barang ditawarkan ke penawar tertinggi berikutnya atau dilelang ulang. Jika ambang minimum tidak terpenuhi, lelang dibatalkan dan seluruh dana tiket dikembalikan 100% atau dikonversi menjadi kredit lelang berikutnya. Halaman admin mencakup dashboard keuangan, kelola lelang, buat/edit lelang, detail lelang real-time, keuangan per lelang, pemenang dan pengiriman, refund, audit log, dan pengaturan situs. Admin login dengan email, password, dan TOTP MFA, sementara guest tidak perlu akun sama sekali. Seluruh sistem dirancang untuk local test terlebih dahulu dengan Docker Compose, payment gateway sandbox, dan pengujian menyeluruh sebelum hosting dan domain produksi


<thinking>
lynqo
</thinking>
# Rancangan Ekosistem Lengkap: Platform Lelang Kupon Berbasis Web

Dokumen ini disusun sebagai **blueprint arsitektur produksi** yang siap Anda serahkan kepada AI agent atau tim developer. Seluruh keputusan teknis, keamanan, alur halaman, dan aktor dirinci tanpa mengulang diskusi sebelumnya. Fokusnya adalah **local-first**, artinya seluruh ekosistem harus dapat dijalankan dan diuji di mesin lokal sebelum menyentuh hosting atau domain publik.

---

## 1. Nama Brand dan Identitas Domain

### Rekomendasi Nama
**LelangKupon** — gabungan dua kata yang langsung mendeskripsikan mekanisme inti (lelang + kupon), mudah diucapkan, dan tidak mengandung konotasi negatif di mata gateway pembayaran. Nama ini belum ditemukan terpakai secara aktif sebagai platform di Indonesia berdasarkan penelusuran.

**Cadangan jika `lelangkupon.com` ternyata sudah diambil** (periksa real-time via WHOIS atau layanan cek domain seperti Hosterbyte/Whois）:

| Nama | Domain | Alasan |
|---|---|---|
| **BidKupon** | `bidkupon.com` | Singkat, teknis, langsung ke inti |
| **TawarKupon** | `tawarkupon.com` | Bahasa Indonesia, ramah |
| **KuponBid** | `kuponbid.com` | Urutan terbalik, tetap jelas |

**Tindakan wajib sebelum build**: cek ketersediaan ketiga domain di registrar (Namecheap, Cloudflare Registrar, atau lokal seperti Hosterbyte) dan amankan satu domain utama + satu cadangan.

---

## 2. Aktor dan Hak Akses

Ada **empat aktor** dalam ekosistem ini. Tidak ada aktor lain di luar daftar ini.

| Aktor | Autentikasi | Hak Akses |
|---|---|---|
| **Guest (User Anonim)** | Tanpa akun. Verifikasi via email + WhatsApp + OTP saat membeli tiket dan saat masuk ruang lelang. | Melihat daftar lelang, membeli tiket, masuk ruang lelang (dengan kode + OTP), menawar, melihat riwayat pribadi. |
| **Admin** | Login dengan email + password (di-hash bcrypt) + TOTP MFA. | Membuat/mengelola lelang, melihat dashboard keuangan, memverifikasi pembayaran pemenang, menginput resi, mengelola refund, melihat log audit, mengelola pengaturan situs. |
| **Super Admin** | Login dengan MFA + IP allowlist (opsional). | Semua hak Admin + mengelola akun Admin lain, mengubah konfigurasi sistem kritis (payment gateway key, enkripsi, rate limit), mengakses audit trail penuh. |
| **Sistem (Otomatis)** | Internal service account. | Menutup lelang pada waktunya, memilih pemenang, mengirim notifikasi, memproses refund otomatis jika ambang tidak terpenuhi, mencatat event ke audit log. |

---

## 3. Arsitektur Teknis (Local-First)

### 3.1 Tech Stack

| Layer | Teknologi | Alasan |
|---|---|---|
| **Frontend** | Next.js 15+ (App Router) + React 19 + TypeScript + Tailwind CSS + shadcn/ui | Server Components untuk performa, App Router untuk routing bersih, shadcn/ui untuk komponen aksesibel dan konsisten |
| **Backend** | NestJS 10+ + TypeScript | Guards + Interceptors untuk keamanan berlapis, modular, cocok untuk RBAC dan audit logging |
| **Database** | PostgreSQL 16+ + Prisma ORM | Transaksi ACID wajib karena melibatkan uang, row-level security (RLS) untuk isolasi data, Prisma untuk type-safe query |
| **Cache & Session** | Redis 7+ | Rate limiting terdistribusi, session store, cache data lelang yang sering dibaca |
| **Real-time** | WebSocket Gateway (NestJS) + Redis Pub/Sub | Siaran penawaran real-time ke semua peserta di ruang lelang |
| **Background Jobs** | BullMQ (Redis-based) | Menutup lelang otomatis, mengirim notifikasi, memproses refund, dan tugas terjadwal lainnya |
| **Payment Gateway** | **Pakasir** (QRIS + Virtual Account) atau **BayarQR** (SDK Node.js resmi) | QRIS dinamis, webhook signature-verified, biaya transparan (0,7% + Rp310 untuk QRIS via Pakasir) |
| **Email** | Resend atau Nodemailer + SMTP | Notifikasi tiket, OTP, pengumuman pemenang |
| **WhatsApp** | WhatsApp Business API (via provider resmi) atau gateway lokal | OTP dan notifikasi real-time |
| **Containerization** | Docker + Docker Compose | Menjalankan seluruh stack di lokal dengan satu perintah (`docker-compose up`) |
| **Reverse Proxy (Produksi)** | Nginx | TLS termination, rate limiting di edge, static file serving |
| **Monitoring** | Sentry (error tracking) + UptimeRobot (health check) + structured logging (Pino) | Deteksi anomali dan audit trail |

### 3.2 Struktur Direktori Monorepo (Local)

```
lelangkupon/
├── docker-compose.yml          # PostgreSQL, Redis, backend, frontend, nginx (opsional)
├── .env.example                # Semua environment variable (jangan commit .env asli)
├── apps/
│   ├── web/                    # Next.js frontend
│   │   ├── app/
│   │   │   ├── (public)/       # Halaman publik: beranda, detail lelang, cara kerja, FAQ, S&K
│   │   │   ├── (auth)/         # Halaman masuk ruang lelang, verifikasi OTP, tiket saya
│   │   │   ├── (admin)/        # Dashboard admin (protected)
│   │   │   └── api/            # Route handlers (hanya untuk keperluan frontend, bukan logika bisnis)
│   │   ├── components/         # shadcn/ui + komponen kustom
│   │   └── lib/                # API client, hooks, utils
│   └── api/                    # NestJS backend
│       ├── src/
│       │   ├── modules/
│       │   │   ├── auth/       # Guest OTP, Admin login, MFA
│       │   │   ├── auctions/   # CRUD lelang, status, jadwal
│       │   │   ├── tickets/    # Pembelian tiket, generate kode, validasi
│       │   │   ├── bids/       # Penawaran, validasi atomic (Redis Lua CAS)
│       │   │   ├── payments/   # Integrasi QRIS, webhook, verifikasi
│       │   │   ├── winners/    # Penentuan pemenang, fallback, verifikasi
│       │   │   ├── refunds/    # Refund otomatis, kredit
│       │   │   ├── notifications/ # Email, WA, in-app
│       │   │   ├── admin/      # Endpoint khusus admin
│       │   │   └── audit/      # Immutable event ledger
│       │   ├── common/         # Guards, Interceptors, Filters, DTO, Zod schemas
│       │   └── main.ts
│       └── prisma/
│           ├── schema.prisma
│           └── migrations/
```

---

## 4. Keamanan Tingkat Tinggi (Defense-in-Depth)

Keamanan tidak boleh bergantung pada satu lapisan. Arsitektur ini menerapkan **enam lapisan pertahanan** yang saling menutupi, mengacu pada OWASP Top 10 dan praktik enterprise 2026.

### 4.1 Lapisan Edge (Cloudflare / Nginx)
- **TLS 1.3 wajib**, HSTS aktif, redirect HTTP → HTTPS permanen.
- **DDoS mitigation** dan **geo-fencing** (opsional: blokir negara yang tidak menargetkan pengguna Indonesia).
- **Rate limiting di edge** untuk endpoint publik (misal: maks 100 request/menit per IP ke halaman lelang).

### 4.2 Lapisan API Gateway & Rate Limiting
- **Sliding-window token bucket** di Redis untuk setiap endpoint kritis (login, beli tiket, validasi kode, penawaran).
- **Batas percobaan kode tiket**: maksimal **5 kali salah per IP per 15 menit**; setelah itu blokir sementara 15 menit. Setelah 10 kali salah, blokir 24 jam.
- **CORS ketat**: hanya izinkan origin frontend yang dikenal.

### 4.3 Lapisan Identitas & Akses
- **Guest**: verifikasi **OTP 6 digit** via email/WA sebelum bisa membeli tiket dan sebelum masuk ruang lelang. Tidak ada password yang disimpan untuk guest.
- **Admin**: password di-hash **bcrypt (cost factor ≥ 12)**, **TOTP MFA wajib**, access token **JWT RS256 berumur 10–15 menit**, refresh token **rotating dan dapat dicabut** disimpan di **HttpOnly, Secure, SameSite=Strict cookie** — bukan di localStorage.
- **RBAC**: Admin dan Super Admin dipisahkan oleh guard NestJS; setiap endpoint memeriksa peran dan kepemilikan resource (bukan hanya “sudah login”).

### 4.4 Lapisan Aplikasi (Input & Logika Bisnis)
- **Validasi skema ketat di server** menggunakan **Zod** untuk semua input (body, query, params). Tidak ada input yang dipercaya dari klien.
- **Prisma parameterized query** — tidak ada string SQL yang dibangun manual. Ini menutup SQL injection.
- **Otorisasi kepemilikan**: setiap query ke tiket/lelang selalu menyertakan `userId` atau `email` yang terverifikasi. Tidak ada ID dari URL yang langsung dipercaya (mencegah IDOR/BOLA).

### 4.5 Lapisan Data (Enkripsi & Isolasi)
- **Field-level encryption (AES-256-GCM)** untuk data sensitif: nomor WhatsApp, email, dan token pembayaran. Kunci enkripsi dikelola melalui **envelope encryption** (data key dienkripsi oleh master key).
- **PostgreSQL Row-Level Security (RLS)** aktif pada tabel `tickets`, `bids`, dan `payments` — setiap baris hanya bisa diakses oleh pemiliknya (berdasarkan `user_email` atau `user_id` yang terverifikasi).
- **Backup terenkripsi** harian ke object storage (S3-compatible) dengan retensi 30 hari.

### 4.6 Lapisan Audit & Deteksi
- **Immutable event ledger**: setiap aksi kritis (pembelian tiket, penawaran, perubahan status lelang, refund, login admin) dicatat ke tabel audit dengan timestamp, aktor, IP, dan payload hash. Log tidak dapat diubah atau dihapus.
- **Alerting pipeline**: anomali (misal: lonjakan penawaran dari satu IP, percobaan kode gagal berulang, kegagalan webhook payment) memicu notifikasi ke admin dalam ≤ 6 jam.

### 4.7 Khusus untuk Real-Time Bidding
- **Redis Lua Compare-and-Swap (CAS)** digunakan untuk menerima atau menolak penawaran secara **atomik**. Ini mencegah dua penawaran dengan harga sama diterima bersamaan, dan memastikan urutan penawaran konsisten meskipun ada ribuan request per detik.
- **WebSocket terautentikasi**: koneksi WebSocket hanya diterima setelah sesi guest diverifikasi (kode tiket + OTP). Setiap pesan penawaran divalidasi ulang di backend sebelum disiarkan.

---

## 5. Halaman dan Isi Setiap Halaman

### 5.1 Halaman Publik (Guest)

| Halaman | Path | Isi |
|---|---|---|
| **Beranda** | `/` | Daftar lelang aktif (kartu dengan foto, nama barang, harga awal, sisa tiket, countdown). Filter kategori. Banner “Cara Kerja” singkat. |
| **Detail Lelang** | `/lelang/[slug]` | Foto barang, deskripsi, harga awal, kelipatan penawaran, **harga tiket**, **sisa tiket / total tiket**, **ambang minimum**, **batas waktu pembelian tiket**, countdown. Tombol **“Beli Tiket”** (membuka form) dan **“Masuk Ruang Lelang”** (disabled sampai lelang mulai). Penjelasan aturan refund jika ambang tidak terpenuhi. |
| **Cara Kerja** | `/cara-kerja` | Penjelasan langkah demi langkah: beli tiket → dapat kode → masuk ruang lelang → menawar → menang → bayar → terima barang. Termasuk penjelasan **tiket tidak refund** (kecuali lelang batal) dan **pemenang cadangan**. |
| **FAQ** | `/faq` | Pertanyaan umum: “Kapan lelang dimulai?”, “Apa yang terjadi jika saya kalah?”, “Bagaimana jika pemenang tidak bayar?”, “Apakah tiket bisa dikembalikan?”. |
| **Syarat & Ketentuan** | `/syarat-ketentuan` | Versi lengkap dan mengikat secara hukum: definisi tiket, aturan refund, batas waktu bayar pemenang (24 jam), mekanisme pemenang cadangan, lelang ulang, kebijakan privasi data (email/WA), dan klausul bahwa ini adalah **lelang berbayar**, bukan undian gratis. |
| **Kebijakan Privasi** | `/privasi` | Data apa yang dikumpulkan (email, WA, nama), bagaimana disimpan (enkripsi), berapa lama disimpan, dan hak pengguna untuk meminta penghapusan. |

### 5.2 Halaman Bertransaksi (Guest)

| Halaman | Path | Isi |
|---|---|---|
| **Form Pembelian Tiket** | `/lelang/[slug]/beli` | Input: **Nama lengkap**, **Email aktif**, **Nomor WhatsApp aktif**. Pilih jumlah tiket. Ringkasan total bayar. Tombol **“Bayar dengan QRIS”**. Setelah submit → halaman instruksi pembayaran. |
| **Instruksi Pembayaran** | `/pembayaran/[orderId]` | Menampilkan QR code QRIS (dinamis), countdown kedaluwarsa pembayaran (misal 15 menit), status pembayaran (polling atau WebSocket). Tombol “Saya sudah bayar” (opsional, untuk memicu cek manual). |
| **Sukses / Kode Tiket** | `/tiket/sukses/[orderId]` | Menampilkan **kode tiket unik** (format `LKP-XXXX-XXXX-XXXX`), ringkasan lelang, dan tombol **“Masuk Ruang Lelang”** (jika lelang sudah dimulai) atau countdown ke waktu mulai. Kode juga dikirim ke email dan WA. |
| **Tiket Saya** | `/tiket-saya` | Input email → kirim OTP → tampilkan daftar tiket yang dimiliki (per lelang), status (aktif/terpakai/kedaluwarsa), dan tombol “Masuk Ruang Lelang” untuk lelang yang sedang berjalan. |
| **Ruang Lelang** | `/ruang-lelang/[slug]` | **Gerbang masuk**: input kode tiket → verifikasi OTP ke email/WA → masuk. **Setelah masuk**: tampilan harga tertinggi saat ini, riwayat penawaran (live feed), input penawaran (harus ≥ harga tertinggi + kelipatan), tombol “Tawar”, countdown sisa waktu lelang, indikator “Anda adalah penawar tertinggi” atau “Anda tertinggal”. |

### 5.3 Halaman Admin

| Halaman | Path | Isi |
|---|---|---|
| **Login Admin** | `/admin/login` | Email + password + TOTP. |
| **Dashboard** | `/admin` | Ringkasan: total uang masuk hari ini/bulan ini, lelang aktif, tiket terjual, pemenang tertunda pembayaran, refund tertunda. |
| **Kelola Lelang** | `/admin/lelang` | Tabel semua lelang (aktif, selesai, batal). Tombol **“Buat Lelang Baru”**. Aksi: edit, tutup paksa, lihat detail. |
| **Buat/Edit Lelang** | `/admin/lelang/baru` dan `/admin/lelang/[id]/edit` | Form: nama barang, deskripsi, **harga pokok**, **harga tiket**, **total tiket**, **ambang minimum**, **harga awal penawaran**, **kelipatan penawaran**, **tanggal mulai**, **batas pembelian tiket**, **tanggal draw**. Upload foto (multiple). |
| **Detail Lelang (Admin)** | `/admin/lelang/[id]` | Statistik real-time: tiket terjual, uang masuk, daftar penawar, harga tertinggi saat ini. Tombol “Tutup Lelang Sekarang” (dengan konfirmasi). |
| **Keuangan** | `/admin/keuangan` | Tabel per lelang: total uang tiket, uang penawaran pemenang, harga pokok, **profit kotor**, biaya gateway, **profit bersih**. Export CSV/Excel. |
| **Pemenang & Pengiriman** | `/admin/pemenang` | Daftar pemenang per lelang. Status pembayaran (lunas/belum), status pengiriman. Input nomor resi. Tombol “Tandai Lunas” setelah verifikasi manual. |
| **Refund** | `/admin/refund` | Daftar lelang yang batal karena ambang tidak terpenuhi. Status refund per peserta. Tombol “Proses Refund” (integrasi dengan payment gateway atau transfer manual). |
| **Audit Log** | `/admin/audit` | Tabel event kritis (timestamp, aktor, aksi, IP, payload hash). Filter berdasarkan tanggal/aktor. Read-only. |
| **Pengaturan** | `/admin/pengaturan` | Konfigurasi: persentase biaya gateway, template notifikasi email/WA, teks S&K (bisa diedit), rekening escrow (jika ada). Hanya Super Admin yang bisa mengubah konfigurasi kritis. |

---

## 6. Tema Warna dan Desain UI/UX

### Palet Warna
Berdasarkan riset desain platform lelang yang membangun kepercayaan dan konversi:

| Token | Warna | Penggunaan |
|---|---|---|
| **Primary** | **Deep Navy Blue** `#1A2B4C` | Header, teks utama, tombol sekunder. Memberi kesan profesional dan terpercaya. |
| **Accent** | **Kinetic Green** `#0B7A47` | Tombol utama “Beli Tiket”, “Tawar”, indikator harga tertinggi. Hijau diasosiasikan dengan uang dan keberhasilan, bukan dengan keberuntungan. |
| **Urgency** | **Amber** `#D97706` | Countdown, sisa tiket, peringatan “waktu hampir habis”. Digunakan **sangat terbatas** agar tidak menimbulkan kesan murahan. |
| **Surface** | **Warm Off-White** `#F7F6F3` | Latar belakang halaman. |
| **Card** | **Pure White** `#FFFFFF` | Kartu lelang, form, panel admin. |
| **Text Primary** | **Near Black** `#1C1B19` | Teks isi. |
| **Text Muted** | **Muted Gray** `#55524B` | Teks sekunder, placeholder. |
| **Danger** | **Soft Red** `#B91C1C` | Validasi error, status gagal. |

**Mode gelap** didukung secara otomatis via `prefers-color-scheme`, dengan token yang sama namun dibalik (surface menjadi `#1C1B19`, teks menjadi `#F7F6F3`).

### Prinsip UI/UX
- **Mobile-first**: 80% pengguna akan mengakses dari ponsel. Setiap halaman diuji pada viewport 360px–430px terlebih dahulu.
- **Clean urgency**: countdown dan sisa tiket ditampilkan jelas tetapi tidak agresif. Tidak ada pop-up yang memblokir konten.
- **Satu aksi utama per layar**: di halaman detail lelang, hanya ada satu tombol utama (“Beli Tiket” sebelum lelang, “Masuk Ruang Lelang” saat lelang). Tombol lain bersifat sekunder.
- **Transparansi aturan di titik keputusan**: tepat di atas tombol “Beli Tiket”, tulis satu baris: *“Tiket tidak dapat dikembalikan. Lelang berjalan jika minimal [X] tiket terjual sebelum [tanggal].”*
- **Aksesibilitas**: kontras teks minimal 4.5:1, semua komponen dapat dioperasikan dengan keyboard, label form eksplisit.

---

## 7. Alur Data Kritis (Local Test)

### 7.1 Pembelian Tiket
1. Guest mengisi form → backend memvalidasi dengan Zod → membuat `order` dengan status `PENDING`.
2. Backend memanggil API Pakasir/BayarQR untuk membuat QRIS dinamis → menyimpan `payment_reference` dan `expires_at`.
3. Guest membayar → payment gateway mengirim **webhook** ke endpoint `/api/payments/webhook` dengan signature.
4. Backend **memverifikasi signature** → jika valid, ubah status `order` menjadi `PAID` → generate **kode tiket unik** (`LKP-` + 12 karakter alfanumerik acak) → simpan di tabel `tickets` dengan status `ACTIVE`.
5. Kirim kode tiket via email dan WA → redirect guest ke halaman sukses.

### 7.2 Masuk Ruang Lelang
1. Guest membuka `/ruang-lelang/[slug]` → memasukkan kode tiket.
2. Backend memeriksa: kode ada? untuk lelang ini? status `ACTIVE`? lelang sedang berjalan? **Rate limit** (maks 5 salah/15 menit).
3. Jika valid → backend mengirim OTP ke email/WA yang terdaftar → guest memasukkan OTP.
4. Jika OTP benar → backend membuat **session token** berumur pendek (misal 2 jam) yang disimpan di HttpOnly cookie → guest masuk ke ruang lelang.

### 7.3 Penawaran (Real-Time)
1. Guest mengirim penawaran → backend memvalidasi: sesi valid? harga ≥ tertinggi + kelipatan?
2. Backend menjalankan **Redis Lua CAS** untuk menerima/menolak penawaran secara atomik.
3. Jika diterima → simpan `bid` di PostgreSQL → siarkan event `new-bid` ke semua klien di room `auction:<id>` via WebSocket Gateway.
4. Jika ditolak (harga sudah berubah) → kirim error ke klien: *“Harga telah berubah, silakan muat ulang.”*

### 7.4 Penutupan Lelang dan Penentuan Pemenang
1. **BullMQ** menjadwalkan job penutupan lelang pada `draw_at`.
2. Saat job berjalan: backend memeriksa apakah **ambang minimum** terpenuhi.
3. Jika **ya** → ambil penawaran tertinggi → set pemenang → kirim notifikasi (email + WA) → beri waktu **24 jam** untuk melunasi harga penawaran.
4. Jika **tidak** → ubah status lelang menjadi `CANCELLED` → jalankan **refund otomatis** ke semua pembeli tiket (via payment gateway atau kredit) → kirim notifikasi.
5. Jika pemenang tidak melunasi dalam 24 jam → **gugurkan** → tawarkan ke penawar tertinggi berikutnya → tiket pemenang yang gugur **hangus**.

---

## 8. Environment Variable dan Konfigurasi Lokal

Semua rahasia **hanya** berada di `.env` (tidak di-commit). Contoh yang wajib ada:

```
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/lelangkupon
REDIS_URL=redis://localhost:6379

# Auth
JWT_PRIVATE_KEY=...
JWT_PUBLIC_KEY=...
OTP_EXPIRY_MINUTES=5
TICKET_CODE_SECRET=...  # untuk HMAC kode tiket (opsional, jika ingin kode tidak disimpan plain text)

# Payment
PAKASIR_API_KEY=...
PAKASIR_WEBHOOK_SECRET=...
PAKASIR_BASE_URL=https://api.pakasir.com  # sandbox saat local

# Notifikasi
RESEND_API_KEY=...
WA_API_URL=...
WA_API_TOKEN=...

# Aplikasi
NEXT_PUBLIC_APP_URL=http://localhost:3000
API_URL=http://localhost:4000
```

Untuk **local test**, gunakan **sandbox** dari Pakasir/BayarQR. Jangan pernah menggunakan kredensial produksi di lokal. Jalankan seluruh stack dengan:

```bash
docker-compose up --build
```

Akses frontend di `http://localhost:3000`, backend di `http://localhost:4000`, dan database di `localhost:5432`.

---

## 9. Ringkasan Keputusan Kunci

| Keputusan | Pilihan |
|---|---|
| **Nama brand** | **LelangKupon** (`lelangkupon.com`); cadangan: BidKupon, TawarKupon. |
| **Tech stack** | Next.js 15 + NestJS 10 + PostgreSQL 16 + Prisma + Redis + BullMQ + WebSocket Gateway. |
| **Payment** | Pakasir atau BayarQR (QRIS dinamis, webhook signature-verified). |
| **Autentikasi Guest** | Tanpa akun; email + WA + OTP per sesi. |
| **Keamanan** | Defense-in-depth 6 lapis; JWT RS256 short-lived; Redis Lua CAS untuk bid atomik; field-level encryption; RLS; audit ledger immutable. |
| **Real-time** | WebSocket Gateway + Redis Pub/Sub; siaran delta per 100 ms. |
| **Halaman** | 6 publik + 5 transaksi + 8 admin (total 19 halaman). |
| **Tema** | Deep Navy + Kinetic Green + Warm Off-White; mobile-first; clean urgency. |
| **Local test** | Docker Compose; sandbox payment; seluruh stack berjalan tanpa domain publik. |

Dokumen ini dapat langsung diserahkan kepada AI agent atau developer sebagai **spesifikasi build**. Setelah local test lulus (pembelian tiket, masuk ruang lelang, penawaran real-time, penutupan otomatis, refund, dan audit log), barulah masuk ke tahap hosting, domain, dan deployment produksi. ✅