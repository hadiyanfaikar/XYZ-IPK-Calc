# XYZ-IPK-Calc

# Kalkulator IPK XYZ University

Aplikasi full-stack yang formal dan elegan untuk menghitung IPK Universitas XYZ berdasarkan standar Nilai Skor Mata Kuliah (NSM).

## Teknologi & Desain
- **Frontend**: HTML5, CSS3 berdesain formal Akademik Nusantara (Tema Terang / Merah-Putih, Elegan, Pop-up Kustom Modal), dan Vanilla JavaScript.
- **Backend**: Python 3.11+ dengan Flask API (Sekaligus sebagai Host / Server Static File).

## Cara Menjalankan Aplikasi

Anda kini cukup menjalankan file backend **Flask** karena halaman frontend secara otomatis akan disajikan oleh Flask pada jalur *root* (/).

1. Buka terminal/Command Prompt di dalam folder proyek ini `d:\IPK Calculator`.
2. Masuk ke direktori backend:
   ```bash
   cd backend
   ```
3. Instal dependencies yang dibutuhkan (Flask, Flask-CORS):
   ```bash
   pip install -r requirements.txt
   ```
4. Jalankan aplikasi server Flask:
   ```bash
   python app.py
   ```
5. Buka Browser Anda dan akses tautan:
   **[http://127.0.0.1:5000/](http://127.0.0.1:5000/)**

## Aturan Penilaian Sesuai Dokumen
Aplikasi akan secara otomatis menghitung IPK (Indeks Prestasi Kumulatif) beserta mengonversi huruf mutunya dengan referensi NSM berikut:
- 85 < NSM: **A** (Poin 4.0)
- 75 < NSM ≤ 85: **AB** (Poin 3.5)
- 65 < NSM ≤ 75: **B** (Poin 3.0)
- 60 < NSM ≤ 65: **BC** (Poin 2.5)
- 50 < NSM ≤ 60: **C** (Poin 2.0)
- 40 < NSM ≤ 50: **D** (Poin 1.0)
- NSM ≤ 40: **E** (Poin 0.0)
