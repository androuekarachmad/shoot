# A Little Story About Us 🌙✨
> *"Some stories are worth telling."*

Sebuah website mobile interaktif bertema **Romantic Visual Novel**, dibuat dengan pendekatan sinematik, estetika modern, dan pengalaman pengguna layaknya memainkan game visual novel emosional.

---

## 🎨 Palet Warna & Visual
- **Midnight Navy (`#071426`)**: Latar belakang antarmuka utama.
- **Deep Ocean (`#102C4C`)**: Panel kartu cerita & elemen sekunder.
- **Ocean Blue (`#275D82`)**: Tombol sekunder & aksen navigasi.
- **Soft Blue (`#8BB9D8`)**: Aksen, ikon, dan garis dekoratif.
- **Ice White (`#D6E9F5`)**: Teks utama dengan kontras tinggi dan mudah dibaca.
- **Sunset Gold (`#FFD69A`)**: Tombol utama, highlight keemasan, dan nuansa romantis.

Visual utama menggunakan gambar asli **`bg.webp`** (dua karakter memandang bumi dari permukaan bulan) tanpa perubahan atau distorsi pada karakter aslinya.

---

## 📱 Fitur Utama & Pengalaman Pengguna
1. **Intro Screen Sinematik**:
   - Efek nafas *Ken Burns* pada background secara perlahan.
   - Partikel bintang dan debu kosmik berkelap-kelip halus.
   - Kartu pembuka kaca (*glassmorphism*) dengan tombol utama "Mulai Cerita".
2. **Story Screen Interaktif**:
   - Pembagian narasi utuh menjadi 7 bagian berurutan.
   - Efek *typewriter* (mengetik otomatis) yang nyaman dibaca, dengan kemampuan ketuk layar untuk menyelesaikan teks secara instan atau melanjutkan.
   - Indikator progres bab (`01 / 07`) dan *progress bar* bercahaya di bagian atas.
   - Panel dialog transparan *Midnight Navy* dengan *backdrop blur* yang menjaga kedua karakter di bagian bawah layar tetap terlihat jelas.
   - Tombol "Sebelumnya" dan "Lanjutkan" untuk kenyamanan membaca ulang.
   - Keterangan lembut: *"Baca pelan-pelan, ya."*
3. **Final Confession Screen**:
   - Puncak cerita dengan kutipan penutup dan pertanyaan utama:  
     `"Would you like to create more memories with me?"`
   - Dua pilihan yang seimbang, nyaman ditekan, dan menghargai keputusan pembaca:
     - **"Iya, tentu."**
     - **"Maaf, aku belum bisa."**
4. **Response Screen Adaptif**:
   - **Jika "Iya, tentu."**: Letupan partikel bintang keemasan (*stardust celebration*), tema hangat bercahaya, dan pesan penuh harapan.
   - **Jika "Maaf, aku belum bisa."**: Transisi tenang, pesan penuh rasa terima kasih dan penghormatan.
5. **Web Audio API BGM & SFX**:
   - Musik piano instrumental generatif yang lembut, romantis, dan emosional (tanpa ketergantungan file audio eksternal).
   - Efek suara klik tombol lembut, efek membalik halaman (*chime*), dan lonceng bintang saat pengakuan diterima.
   - Tombol toggle suara (Mute / Unmute) dengan animasi gelombang suara.
   - Mengikuti aturan *audio policy* browser modern (hanya berbunyi setelah interaksi pengguna).
6. **Menu Navigasi Cepat (Drawer)**:
   - Lompat langsung ke bab mana pun (01 sampai 07 atau Akhir).
   - Pengatur volume musik.
   - Opsi mode teks instan.
   - Tombol ulangi dari awal.
7. **Responsif & Aksesibel**:
   - Desain *mobile-first* (320px–480px, rasio 9:16 dan 19.5:9, aman untuk *notch* / *dynamic island*).
   - Tampilan desktop rapi di tengah dengan frame visual novel mobile yang elegan.
   - Navigasi keyboard: `Space` / `Enter` / `Panah Kanan` (Lanjut), `Panah Kiri` (Sebelumnya), `Esc` (Tutup Menu).
   - Mendukung `prefers-reduced-motion`.

---

## 🚀 Cara Menjalankan Website

### Opsi 1: Menjalankan Server Lokal Ringan (Rekomendasi)
Buka terminal pada folder proyek dan jalankan:
```bash
node server.js
```
Lalu buka browser Anda di:
```
http://localhost:3000
```

### Opsi 2: Langsung Buka di Browser
Anda juga dapat langsung membuka file `index.html` menggunakan browser modern apa pun (Chrome, Safari, Edge, Firefox).

---

## 📁 Struktur Berkas
```
shoot/
├── bg.webp               # Aset visual utama asli
├── index.html            # Struktur semantik HTML5
├── server.js             # Server HTTP lokal statis ringan (Node.js)
├── README.md             # Dokumentasi proyek
├── css/
│   ├── style.css         # Desain UI/UX visual novel, tema warna, & layout responsif
│   └── animations.css    # Animasi keyframes, transisi halus, & efek cahaya
└── js/
    ├── app.js            # Controller utama aplikasi & event listeners
    ├── audio.js          # Audio engine (musik piano romantis & sfx via Web Audio API)
    ├── particles.js      # Sistem canvas partikel bintang & stardust celebration
    ├── storyData.js      # Narasi teks cerita lengkap & data metadata
    └── vnEngine.js       # Engine visual novel (alur layar, typewriter, navigasi)
```
