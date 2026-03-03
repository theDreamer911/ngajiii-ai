# 📖 Ngajiii AI - Latihan Hafalan (Juz 29/30)

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)
[![Author: @handhikayp](https://img.shields.io/badge/Author-@handhikayp-blue.svg)](https://github.com/handhikayp)

Aplikasi web sederhana untuk melatih hafalan Al-Qur'an (fokus Juz 29 & 30) dengan memanfaatkan teknologi **Web Speech API** dan algoritma **Levenshtein Distance** untuk pencocokan suara secara *real-time*.

---

## 🚀 Tujuan
Aplikasi ini dirancang untuk memberikan pengalaman belajar yang interaktif:
* **Mendengarkan:** Memutar murottal per ayat untuk memperbaiki tajwid.
* **Melafalkan:** Menguji hafalan dengan berbicara langsung ke mikrofon.
* **Progressive Reveal:** Ayat selanjutnya hanya akan terbuka (*unlocked*) jika pengucapan ayat saat ini dinyatakan akurat.

---

## 🛠️ Mekanisme Teknis

Sistem ini menggunakan alur **Pencocokan Suara + Levenshtein-check**:

1.  **Speech Recognition:** Menggunakan `Web Speech API` (`SpeechRecognition`) untuk menangkap suara pengguna dan mengubahnya menjadi teks digital secara instan.
2.  **Normalisasi Teks:** Melalui fungsi `normalize()`, teks hasil rekaman dibersihkan dari tanda baca, spasi berlebih, dan diubah menjadi *lowercase*.
3.  **Algoritma Levenshtein:** Menghitung jarak perbedaan (*edit distance*) antara transkrip pengguna dengan teks target (Latin/Transliterasi).
4.  **Similarity Threshold:** * Skor kemiripan dihitung dengan rumus: $1 - \frac{distance}{\max(a.length, b.length)}$
    * **Threshold: 0.75 (75%)**. Jika skor di atas ini, ayat dinyatakan `diterima`.
5.  **Granular Feedback:** Jika gagal, fungsi `comparePerWord()` akan menandai kata mana yang sudah benar (hijau) dan mana yang perlu diperbaiki (merah).

---

## 📂 Struktur Data Surah

Setiap surah disimpan sebagai modul JavaScript mandiri di folder `data/` dan diekspor ke global `window.surahModules`.

**Contoh Format (`data/al-fatihah.js`):**
```javascript
window.surahModules = window.surahModules || {};
window.surahModules['al-fatihah'] = {
  name: 'Al-Fatihah',
  ayat: [
    { 
      trigger: 'bismillahirrahmanirrahim', // Digunakan untuk pencocokan suara
      text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', // Ditampilkan di UI
      audio: '[https://everyayah.com/data/](https://everyayah.com/data/)...' // Link audio murottal
    },
  ]
};
```

# ✨ Fitur Utama

✅ **Katalog Lengkap**  
Akses cepat ke berbagai surat di Juz 30. | Juz 29 masih dalam proses pengembangan. ⏲️

✅ **Layout 3-Kolom**  
Kontrol suara, fokus ayat aktif (Arab/Latin), dan daftar hafalan yang sudah terbuka.

✅ **Murottal Auto-Play**  
Audio otomatis berputar saat ayat berhasil dikuasai sebagai validasi.

✅ **Responsive Design**  
Dibangun dengan Tailwind CSS, nyaman digunakan di desktop maupun mobile.


---

# 💻 Cara Menjalankan Secara Lokal

1. Clone atau download repositori ini ke komputer Anda.

 ```bash
   git clone https://github.com/theDreamer911/ngajiii-ai.git
 ```

2. Buka `index.html` menggunakan browser modern (Chrome/Edge direkomendasikan).
3. Gunakan **Live Server** (jika menggunakan VS Code) untuk memastikan fitur audio dan mikrofon berjalan lancar tanpa kendala kebijakan origin.
4. Pastikan izin akses **Microphone** telah diberikan pada browser.


---

# 🤝 Kontribusi

Ingin menambahkan surah baru atau memperbaiki algoritma?

1. Buat file surah baru di folder `data/` mengikuti struktur yang ada.
2. Daftarkan nama surahnya ke dalam `allSurahList` di `main.js`.
3. Kirimkan Pull Request (PR) atau hubungi saya melalui:

- 📧 Email: handhikayp@gmail.com  
- 📱 Sosial Media: @handhikayp (Instagram/X)


---

# ☕ Dukung Proyek Ini

Jika aplikasi ini bermanfaat bagi proses hafalan Anda, dukung pengembangannya melalui:

- 💝 Saweria: https://saweria.co/handhikayp

---

# 📜 Lisensi

Terbuka (MIT).  
Silakan gunakan dan modifikasi dengan tetap menyertakan atribusi kepada pengembang asli.
