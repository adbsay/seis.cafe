// Data Menu Lengkap Seis Cafe & Public Space berdasarkan buku menu resmi.
// UI kartu menu, filter pencarian, dan JSON-LD (SEO) otomatis mengikuti file ini.

export type MenuCategoryId =
  | "kopi"
  | "non-kopi"
  | "makanan"
  | "pasta-western"
  | "mie-sup"
  | "snack";

export interface MenuCategory {
  id: MenuCategoryId;
  label: string;
}

export const menuCategories: MenuCategory[] = [
  { id: "kopi", label: "Coffee & V60" },
  { id: "non-kopi", label: "Non-Coffee & Mocktail" },
  { id: "makanan", label: "Makanan Utama" },
  { id: "pasta-western", label: "Pasta & Western" },
  { id: "mie-sup", label: "Mie & Sup" },
  { id: "snack", label: "Snack & Camilan" },
];

export interface MenuItem {
  id: string;
  category: MenuCategoryId;
  subcategory: string;
  name: string;
  price: number; // Rupiah
  priceDisplay?: string; // Tampilan alternatif (misal: "48k / 53k" atau "R 40k / L 55k")
  priceNote?: string; // Catatan varian harga
  teaser?: string; // Penjelasan singkat rasa/karakter
  isSignature?: boolean;
  image?: string;
  alt?: string;
}

export const menuItems: MenuItem[] = [
  // ==========================================
  // COFFEE & V60 (Coffee Series, V60, Mocktail, Montblanc)
  // ==========================================
  { id: "espresso", category: "kopi", subcategory: "Coffee Series", name: "Espresso", price: 18000, teaser: "Ekstraksi kopi murni berkarakter intens dan pekat." },
  { id: "americano", category: "kopi", subcategory: "Coffee Series", name: "Americano", price: 28000, teaser: "Espresso klasik dengan air panas/es, bersih dan menyegarkan." },
  { id: "cappucino", category: "kopi", subcategory: "Coffee Series", name: "Cappucino", price: 32000, teaser: "Perpaduan espresso seimbang dengan microfoam susu lembut." },
  { id: "sanger", category: "kopi", subcategory: "Coffee Series", name: "Sanger", price: 33000, isSignature: true, teaser: "Kopi khas Medan legendaris: espresso pekat dengan sentuhan manis gurih kental manis." },
  { id: "caramel-machiato", category: "kopi", subcategory: "Coffee Series", name: "Caramel Macchiato", price: 38000, teaser: "Lapisan espresso, steamed milk, dan drizzle karamel legit." },
  { id: "moccacino", category: "kopi", subcategory: "Coffee Series", name: "Moccacino", price: 40000, teaser: "Harmonisasi espresso mantap dan cokelat premium yang creamy." },
  { id: "vanila-coffee", category: "kopi", subcategory: "Coffee Series", name: "Vanilla Coffee", price: 32000, teaser: "Kopi susu dengan aroma harum vanila yang menenangkan." },
  { id: "biscoff-latte", category: "kopi", subcategory: "Coffee Series", name: "Biscoff Latte", price: 40000, teaser: "Latte creamy berpadu rempah karamel biskuit Lotus Biscoff." },
  { id: "pandan-latte", category: "kopi", subcategory: "Coffee Series", name: "Pandan Latte", price: 38000, teaser: "Sentuhan wangi pandan alami dalam seduhan kopi susu hangat/dingin." },
  { id: "butterscotch", category: "kopi", subcategory: "Coffee Series", name: "Butterscotch Coffee", price: 40000, teaser: "Rasa karamel mentega gurih manis berpadu double shot espresso." },
  { id: "seis-coffee-2", category: "kopi", subcategory: "Coffee Series", name: "Seis Coffee 2.0", price: 38000, isSignature: true, teaser: "Signature house blend racikan khas Seis Cafe dengan tekstur ekstra creamy." },
  { id: "creme-brulle", category: "kopi", subcategory: "Coffee Series", name: "Creme Brulle Coffee", price: 37000, teaser: "Kopi susu nikmat berpadu custard karamel lembut khas crème brûlée." },
  { id: "avogato", category: "kopi", subcategory: "Coffee Series", name: "Affogato", price: 35000, teaser: "Satu scoop es krim vanila disiram shot espresso panas yang pekat." },
  { id: "watermelon-latte", category: "kopi", subcategory: "Coffee Series", name: "Watermelon Latte", price: 35000, teaser: "Inovasi unik perpaduan rasa semangka segar berpadu kopi lembut." },
  { id: "seasalt-caramel-latte", category: "kopi", subcategory: "Coffee Series", name: "Seasalt Caramel Latte", price: 37000, teaser: "Sensasi gurih sea salt berpadu manisnya karamel dan kopi susu." },
  { id: "aren-latte", category: "kopi", subcategory: "Coffee Series", name: "Aren Latte", price: 35000, teaser: "Kopi susu gula aren murni Nusantara yang kaya rasa." },
  { id: "ubee-latte", category: "kopi", subcategory: "Coffee Series", name: "Ubee Latte", price: 37000, teaser: "Kombinasi harum ubi ungu khas dengan kopi susu gurih." },

  // V60 Series
  { id: "v60-international", category: "kopi", subcategory: "V60 Series", name: "V60 International Beans", price: 45000, teaser: "Manual brew pour over menggunakan biji kopi pilihan internasional dengan notes floral & fruity." },
  { id: "v60-local", category: "kopi", subcategory: "V60 Series", name: "V60 Local Beans", price: 30000, teaser: "Seduhan manual biji kopi origin lokal terbaik Nusantara." },

  // Coffee Mocktail
  { id: "kopi-tonic", category: "kopi", subcategory: "Coffee Mocktail", name: "Kopi Tonic", price: 32000, teaser: "Espresso berpadu tonic water sparkling dingin yang menyegarkan." },
  { id: "syahdu", category: "kopi", subcategory: "Coffee Mocktail", name: "Syahdu", price: 37000, isSignature: true, teaser: "Mocktail kopi signature bercita rasa misterius, manis, dan aromatik." },
  { id: "black-angel", category: "kopi", subcategory: "Coffee Mocktail", name: "Black Angel", price: 37000, teaser: "Kombinasi kopi pekat dengan kesegaran citrus dingin." },
  { id: "berriecano", category: "kopi", subcategory: "Coffee Mocktail", name: "Berriecano", price: 35000, teaser: "Espresso dipadukan sari berry segar yang asam manis." },
  { id: "elderis-momo", category: "kopi", subcategory: "Coffee Mocktail", name: "Elderis Momo", price: 35000, teaser: "Infusi bunga elderflower dan peach pada racikan kopi mocktail." },

  // Montblanc Series
  { id: "orange-blanc", category: "kopi", subcategory: "Montblanc Series", name: "Orange Blanc", price: 37000, teaser: "Sajian dingin buah jeruk segar dimahkotai krim putih lembut." },
  { id: "strawberry-blanc", category: "kopi", subcategory: "Montblanc Series", name: "Strawberry Blanc", price: 37000, teaser: "Strawberry manis asam dilapisi busa krim montblanc gurih." },
  { id: "pinnaple-blanc", category: "kopi", subcategory: "Montblanc Series", name: "Pineapple Blanc", price: 37000, teaser: "Kesegaran buah nanas tropis berpadu krim velouté lembut." },
  { id: "manggo-blanc", category: "kopi", subcategory: "Montblanc Series", name: "Mango Blanc", price: 37000, teaser: "Jus mangga manis pekat dengan lapisan foam montblanc spesial." },

  // ==========================================
  // NON-COFFEE & MOCKTAIL (Milk Base, Tea Base, Mocktail, Fruity)
  // ==========================================
  { id: "banana-chocorilla", category: "non-kopi", subcategory: "Milk Base", name: "Banana Chocorilla", price: 38000, teaser: "Perpaduan pisang manis dan cokelat pekat yang memanjakan lidah." },
  { id: "strawberry-matcha-latte", category: "non-kopi", subcategory: "Milk Base", name: "Strawberry Matcha Latte", price: 40000, teaser: "Dua lapisan cantik: puree stroberi manis asam dan matcha jepang autentik." },
  { id: "chocolate", category: "non-kopi", subcategory: "Milk Base", name: "Chocolate", price: 35000, teaser: "Cokelat murni kaya rasa dengan tekstur lembut dan tidak terlalu manis." },
  { id: "choco-freeze", category: "non-kopi", subcategory: "Milk Base", name: "Choco Freeze", price: 37000, teaser: "Minuman cokelat dingin dengan sensasi dingin menyegarkan." },
  { id: "caramel-choco", category: "non-kopi", subcategory: "Milk Base", name: "Caramel Choco", price: 38000, teaser: "Cokelat pekat berpadu saus karamel leleh yang harum." },
  { id: "matcha", category: "non-kopi", subcategory: "Milk Base", name: "Matcha Latte", price: 37000, teaser: "Bubuk teh hijau Jepang pilihan dipadu susu segar gurih." },
  { id: "red-velvet", category: "non-kopi", subcategory: "Milk Base", name: "Red Velvet", price: 35000, teaser: "Rasa kue red velvet klasik dengan aroma vanila kakao yang creamy." },
  { id: "taro", category: "non-kopi", subcategory: "Milk Base", name: "Taro Latte", price: 35000, teaser: "Minuman talas ungu dengan rasa nutty manis yang lembut." },
  { id: "earlgrey-milk-tea", category: "non-kopi", subcategory: "Milk Base", name: "Earlgrey Milk Tea", price: 33000, teaser: "Teh earl grey beraroma minyak bergamot dipadukan susu creamy." },
  { id: "jasmin-milk-tea", category: "non-kopi", subcategory: "Milk Base", name: "Jasmine Milk Tea", price: 33000, teaser: "Wangi melati menenangkan bersatu dalam kelembutan susu." },
  { id: "ubee-creamy", category: "non-kopi", subcategory: "Milk Base", name: "Ubee Creamy", price: 34000, teaser: "Kombinasi ubi ungu dan susu creamy lembut." },
  { id: "ubee-matcha-latte", category: "non-kopi", subcategory: "Milk Base", name: "Ubee Matcha Latte", price: 40000, teaser: "Harmoni rasa ubi ungu manis dan gurihnya matcha premium." },

  // Tea Base
  { id: "strawberry-tea", category: "non-kopi", subcategory: "Tea Base", name: "Strawberry Tea", price: 32000, teaser: "Teh seduh dingin dengan buah stroberi segar." },
  { id: "lychee-tea", category: "non-kopi", subcategory: "Tea Base", name: "Lychee Tea", price: 32000, teaser: "Teh beraroma leci segar dengan rasa manis yang pas." },
  { id: "peach-tea", category: "non-kopi", subcategory: "Tea Base", name: "Peach Tea", price: 32000, teaser: "Teh wangi buah persik manis yang menyegarkan di siang hari." },
  { id: "apple-tea", category: "non-kopi", subcategory: "Tea Base", name: "Apple Tea", price: 32000, teaser: "Seduhan teh dengan ekstrak sari apel segar bercita rasa renyah." },
  { id: "thai-tea", category: "non-kopi", subcategory: "Tea Base", name: "Thai Tea", price: 35000, teaser: "Teh rempah khas Thailand pekat dengan susu kental manis gurih." },
  { id: "earlgrey-tea", category: "non-kopi", subcategory: "Tea Base", name: "Earlgrey Tea", price: 28000, teaser: "Seduhan teh hitam earl grey aromatik tanpa susu." },

  // Mocktail
  { id: "sweeties", category: "non-kopi", subcategory: "Mocktail", name: "Sweeties", price: 30000, teaser: "Mocktail manis buah tropis dengan soda segar pelepas dahaga." },
  { id: "pina-punk", category: "non-kopi", subcategory: "Mocktail", name: "Pina Punk", price: 34000, teaser: "Perpaduan seru nanas tropis, kelapa, dan sparkling citrus." },
  { id: "sunkist-mili-mili", category: "non-kopi", subcategory: "Mocktail", name: "Sunkist Mili Mili", price: 35000, teaser: "Sari jeruk sunkist segar dengan sensasi asam manis menggigit." },
  { id: "peachy-pink", category: "non-kopi", subcategory: "Mocktail", name: "Peachy Pink", price: 32000, teaser: "Mocktail merah muda nan cantik dari persik dan sirup buah." },
  { id: "strawberry-on-the-rock", category: "non-kopi", subcategory: "Mocktail", name: "Strawberry On The Rock", price: 33000, teaser: "Stroberi segar di-crush dengan es batu dan soda dingin." },

  // Fruity (Fresh Juice)
  { id: "jus-mangga", category: "non-kopi", subcategory: "Fruity", name: "Jus Mangga", price: 40000, priceDisplay: "40k / 55k", priceNote: "Reguler 40k · Large 55k", teaser: "Jus mangga asli pilihan kental dan manis alami." },
  { id: "jus-orange", category: "non-kopi", subcategory: "Fruity", name: "Jus Orange", price: 40000, priceDisplay: "40k / 55k", priceNote: "Reguler 40k · Large 55k", teaser: "Perasan jeruk segar murni kaya vitamin C." },
  { id: "jus-semangka", category: "non-kopi", subcategory: "Fruity", name: "Jus Semangka", price: 40000, priceDisplay: "40k / 55k", priceNote: "Reguler 40k · Large 55k", teaser: "Jus semangka merah manis alami pelepas dahaga seketika." },
  { id: "sanas", category: "non-kopi", subcategory: "Fruity", name: "Sanas (Sawi & Nenas)", price: 28000, isSignature: true, teaser: "Cold-pressed jus sehat kombinasi sawi hijau segar dan nanas manis madu." },

  // ==========================================
  // MAKANAN UTAMA (Main Course, Fried Rice, Rice Bowl)
  // ==========================================
  { id: "ayam-bakar-taliwang", category: "makanan", subcategory: "Main Course", name: "Ayam Bakar Taliwang", price: 48000, teaser: "Ayam bakar bumbu pedas khas Taliwang dengan aroma bakar gurih nikmat." },
  { id: "ayam-sambal-bawang", category: "makanan", subcategory: "Main Course", name: "Ayam Sambal Bawang", price: 48000, teaser: "Ayam goreng renyah disiram sambal bawang ulek segar pedas nendang." },
  { id: "ayam-kemangi-andaliman", category: "makanan", subcategory: "Main Course", name: "Ayam Kemangi Andaliman", price: 45000, isSignature: true, teaser: "Sajian khas Seis: olahan ayam berpadu aroma kemangi dan getir getir segar andaliman Medan." },
  { id: "ikan-asam-manis", category: "makanan", subcategory: "Main Course", name: "Ikan Asam Manis", price: 45000, teaser: "Fillet ikan renyah dengan siraman saus asam manis oriental yang segar." },
  { id: "ikan-cabe-hijau", category: "makanan", subcategory: "Main Course", name: "Ikan Cabe Hijau", price: 46000, teaser: "Ikan gurih berbalut racikan cabe hijau pedas khas Nusantara." },
  { id: "ikan-bakar-madu", category: "makanan", subcategory: "Main Course", name: "Ikan Bakar Madu", price: 50000, teaser: "Ikan bakar bumbu manis legit madu dengan aroma bakaran smokey." },
  { id: "chicken-katsu-curry", category: "makanan", subcategory: "Main Course", name: "Chicken Katsu Curry", price: 52000, teaser: "Chicken katsu tebal garing berpadu kuah kari Jepang kental beraroma kaya." },
  { id: "chicken-grill-mushroom", category: "makanan", subcategory: "Main Course", name: "Chicken Grill Mushroom Sauce", price: 52000, teaser: "Steak ayam panggang juicy dengan siraman saus jamur lezat gurih." },
  { id: "chicken-cops-mongolian", category: "makanan", subcategory: "Main Course", name: "Chicken Chops Mongolian Sauce", price: 52000, teaser: "Potongan ayam renyah empuk dengan lumuran saus Mongolian gurih legit." },

  // Fried Rice
  { id: "nasgor-cabe-hijau", category: "makanan", subcategory: "Fried Rice", name: "Nasi Goreng Cabe Hijau", price: 42000, teaser: "Nasi goreng berbumbu cabai hijau segar dengan aroma rempah harum." },
  { id: "nasgor-seafood", category: "makanan", subcategory: "Fried Rice", name: "Nasi Goreng Seafood", price: 45000, teaser: "Nasi goreng gurih dengan topping udang, cumi, dan telur." },
  { id: "nasgor-kampung", category: "makanan", subcategory: "Fried Rice", name: "Nasi Goreng Kampung", price: 40000, teaser: "Nasi goreng rasa otentik tradisional dengan aroma terasi dan bumbu sederhana gurih." },
  { id: "nasgor-daging", category: "makanan", subcategory: "Fried Rice", name: "Nasi Goreng Daging", price: 48000, teaser: "Nasi goreng berlimpah irisan daging sapi empuk berbumbu pekat." },
  { id: "nasgor-katsu", category: "makanan", subcategory: "Fried Rice", name: "Nasi Goreng Katsu", price: 48000, isSignature: true, teaser: "Nasi goreng spesial disajikan dengan potongan chicken katsu renyah garing." },
  { id: "nasgor-blackpepper", category: "makanan", subcategory: "Fried Rice", name: "Nasi Goreng Blackpepper", price: 45000, teaser: "Nasi goreng pedas hangat bumbu lada hitam gurih mantap." },

  // Rice Bowl
  { id: "ricebowl-chicken-teriyaki", category: "makanan", subcategory: "Rice Bowl", name: "Chicken Teriyaki Rice Bowl", price: 44000, teaser: "Nasi hangat dengan tumisan ayam bersaus teriyaki manis gurih khas Jepang." },
  { id: "ricebowl-chicken-butter-milk", category: "makanan", subcategory: "Rice Bowl", name: "Chicken Butter Milk Rice Bowl", price: 45000, teaser: "Ayam krispi berlumur saus buttermilk creamy harum mentega dan daun kari." },
  { id: "ricebowl-chicken-blackpepper", category: "makanan", subcategory: "Rice Bowl", name: "Chicken Blackpepper Rice Bowl", price: 44000, teaser: "Ayam bumbu saus lada hitam wangi yang hangat dan gurih di atas nasi." },
  { id: "ricebowl-dory-korean-spicy", category: "makanan", subcategory: "Rice Bowl", name: "Dory Korean Spicy Rice Bowl", price: 45000, teaser: "Ikan dory lembut krispi berbalut saus pedas manis gochujang ala Korea." },
  { id: "ricebowl-dory-saus-padang", category: "makanan", subcategory: "Rice Bowl", name: "Dory Saus Padang Rice Bowl", price: 45000, teaser: "Ikan dory garing dengan siraman saus padang pedas manis asam kaya rempah." },

  // ==========================================
  // PASTA & WESTERN
  // ==========================================
  { id: "spaghetti-chicken-katsu", category: "pasta-western", subcategory: "Pasta & Western", name: "Spaghetti Chicken Katsu", price: 50000, teaser: "Pasta spaghetti dipadu saus gurih dan topping chicken katsu renyah." },
  { id: "spaghetti-prawn-aglio-olio", category: "pasta-western", subcategory: "Pasta & Western", name: "Spaghetti Prawn Aglio Olio", price: 55000, teaser: "Spaghetti tumis olive oil, bawang putih harum, cabai kering, dan udang segar manis." },
  { id: "spaghetti-bolognese", category: "pasta-western", subcategory: "Pasta & Western", name: "Spaghetti Bolognese", price: 52000, teaser: "Spaghetti dengan saus tomat klasik daging cincang gurih bertabur keju." },
  { id: "fettucini-carbonara", category: "pasta-western", subcategory: "Pasta & Western", name: "Fettucini Carbonara", price: 48000, priceDisplay: "48k / 53k", priceNote: "Chicken 48k · Beef 53k", teaser: "Pasta fettucini creamy gurih dengan pilihan topping ayam empuk atau daging sapi." },
  { id: "fettucini-alfredo", category: "pasta-western", subcategory: "Pasta & Western", name: "Fettucini Alfredo", price: 55000, teaser: "Pasta fettucini lembut diselimuti saus keju parmesan dan butter yang gurih legit." },
  { id: "fettucini-tomyam", category: "pasta-western", subcategory: "Pasta & Western", name: "Fettucini Tomyam", price: 55000, teaser: "Perpaduan fusion pasta Italia dengan bumbu tom yam pedas asam menggugah selera." },
  { id: "burger-chicken-crispy", category: "pasta-western", subcategory: "Pasta & Western", name: "Burger Chicken Crispy", price: 45000, teaser: "Burger bun empuk dengan fillet ayam krispi tebal, selada segar, dan saus spesial." },
  { id: "kebab-chicken", category: "pasta-western", subcategory: "Pasta & Western", name: "Kebab Chicken", price: 38000, teaser: "Tortilla wrap hangat berisi suwiran ayam berbumbu rempah, sayuran, dan mayones gurih." },
  { id: "quesadillas", category: "pasta-western", subcategory: "Pasta & Western", name: "Quesadillas", price: 40000, teaser: "Lipatan tortilla panggang renyah berisikan keju leleh dan daging berempah gurih." },
  { id: "fish-and-chips", category: "pasta-western", subcategory: "Pasta & Western", name: "Fish & Chips", price: 40000, teaser: "Ikan dory bersalut tepung renyah keemasan ditemani kentang goreng dan saus tartar." },

  // ==========================================
  // MIE & SUP (Soup, Noodle)
  // ==========================================
  { id: "sop-daging-seis", category: "mie-sup", subcategory: "Soup", name: "Sop Daging Seis", price: 55000, isSignature: true, teaser: "Signature sop sapi kaldu gurih berempah khas Seis Cafe dengan potongan daging empuk." },
  { id: "tomyam-seafood", category: "mie-sup", subcategory: "Soup", name: "Tomyam Seafood", price: 58000, teaser: "Sup khas Thailand dengan kuah pedas asam kaya rempah berisi aneka seafood segar." },
  { id: "kari-ayam", category: "mie-sup", subcategory: "Soup", name: "Kari Ayam", price: 48000, teaser: "Gulai kari ayam berkuah santan kental rempah kaya rasa ditemani kentang lembut." },

  // Noodle
  { id: "ifu-mie", category: "mie-sup", subcategory: "Noodle", name: "Ifu Mie (Kuah / Goreng)", price: 30000, priceDisplay: "30k / 40k", priceNote: "Biasa 30k · Seafood 40k", teaser: "Mie kering renyah disiram kuah kental sayuran gurih atau digoreng nikmat." },
  { id: "indomie", category: "mie-sup", subcategory: "Noodle", name: "Indomie (Kuah / Goreng)", price: 28000, priceDisplay: "28k / 34k", priceNote: "Biasa 28k · Spesial 34k", teaser: "Indomie favorit disajikan kuah hangat atau goreng, bisa tambah topping spesial telur/kornet." },
  { id: "bihun-goreng", category: "mie-sup", subcategory: "Noodle", name: "Bihun Goreng", price: 30000, priceDisplay: "30k / 40k", priceNote: "Biasa 30k · Seafood 40k", teaser: "Bihun lembut ditumis harum dengan sayuran segar dan kecap bumbu gurih." },
  { id: "kari-bihun", category: "mie-sup", subcategory: "Noodle", name: "Kari Bihun", price: 33000, teaser: "Bihun lembut disiram kuah kari rempah hangat gurih menggugah selera." },
  { id: "kwetiaw-goreng", category: "mie-sup", subcategory: "Noodle", name: "Kwetiaw Goreng", price: 30000, teaser: "Kwetiau kenyal ditumis aroma 'wok hei' sedap dengan bumbu kecap manis gurih." },
  { id: "kwetiaw-siram-seafood", category: "mie-sup", subcategory: "Noodle", name: "Kwetiaw Siram Seafood", price: 40000, teaser: "Kwetiau lembut dengan siraman kuah telur kental gurih berlimpah seafood." },
  { id: "mie-goreng-jawa", category: "mie-sup", subcategory: "Noodle", name: "Mie Goreng Jawa", price: 38000, teaser: "Mie kuning tradisional ditumis bumbu medok khas Jawa dengan suwiran ayam dan kol." },

  // ==========================================
  // SNACK & CAMILAN
  // ==========================================
  { id: "bakwan-bumbu-kacang", category: "snack", subcategory: "Snack", name: "Bakwan Bumbu Kacang", price: 35000, teaser: "Gorengan bakwan sayur garing renyah dicocol bumbu saus kacang gurih pedas manis." },
  { id: "tempe-mendoan", category: "snack", subcategory: "Snack", name: "Tempe Mendoan", price: 30000, teaser: "Tempe berbalut adonan daun bawang setengah matang lembut gurih dengan kecap rawit." },
  { id: "ubi-goreng-bawang-putih", category: "snack", subcategory: "Snack", name: "Ubi Goreng Bawang Putih", price: 28000, teaser: "Ubi manis legit digoreng renyah bertabur aroma gurih bawang putih sedap." },
  { id: "pisang-pop-crispy", category: "snack", subcategory: "Snack", name: "Pisang Pop Crispy", price: 32000, teaser: "Potongan pisang goreng tepung panir renyah manis pas untuk teman ngopi." },
  { id: "pisang-srikaya-sisir", category: "snack", subcategory: "Snack", name: "Pisang Srikaya Sisir", price: 35000, teaser: "Pisang manis disajikan dengan selai srikaya legit harum khas Sumatera." },
  { id: "pisang-bakar-seis", category: "snack", subcategory: "Snack", name: "Pisang Bakar Seis", price: 30000, isSignature: true, teaser: "Pisang bakar beraroma karamel smokey bertabur keju parut dan kental manis." },
  { id: "roti-bakar-coklat-keju", category: "snack", subcategory: "Snack", name: "Roti Bakar Coklat Keju", price: 30000, teaser: "Roti bakar tebal panggang renyah berpadu cokelat leleh dan keju gurih melimpah." },
  { id: "roti-butter-corn", category: "snack", subcategory: "Snack", name: "Roti Butter Corn", price: 30000, teaser: "Roti bakar harum mentega berpadu jagung manis manis gurih yang nikmat." },
  { id: "chicken-strip", category: "snack", subcategory: "Snack", name: "Chicken Strip", price: 38000, teaser: "Daging dada ayam fillet tanpa tulang berbalut tepung renyah bumbu gurih." },
  { id: "chicken-pop", category: "snack", subcategory: "Snack", name: "Chicken Pop", price: 38000, teaser: "Bite-sized popcorn chicken garing gurih yang asyik dicamil." },
  { id: "chicken-wings", category: "snack", subcategory: "Snack", name: "Chicken Wings", price: 38000, teaser: "Sayap ayam goreng berbumbu meresap sampai ke tulang." },
  { id: "fries-bolognese", category: "snack", subcategory: "Snack", name: "Fries Bolognese", price: 30000, teaser: "Kentang goreng renyah disiram saus bolognese daging sapi cincang lezat." },
  { id: "mix-platter", category: "snack", subcategory: "Snack", name: "Mix Platter Seis", price: 45000, isSignature: true, teaser: "Kombinasi lengkap camilan favorit: kentang, sosis, dan finger foods untuk dinikmati bersama." },
  { id: "french-fries", category: "snack", subcategory: "Snack", name: "French Fries", price: 28000, teaser: "Kentang goreng klasik potong lurus yang renyah dan gurih." },
];

export const categoryLabel = (id: string) =>
  menuCategories.find((c) => c.id === id)?.label ?? id;
