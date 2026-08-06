# Panduan Pengelolaan & Administrasi Website Resmi Desa Wonoanti

Panduan ini disusun untuk memudahkan Pemerintah Desa Wonoanti dalam mengelola, memperbarui konten, serta melakukan pemeliharaan website resmi desa. Website ini dibangun menggunakan arsitektur **Website Statis** (HTML5, CSS3, dan JavaScript modern) tanpa basis data (*database*) rumit, sehingga sangat cepat, aman dari peretasan, dan gratis biaya operasional bulanan jika di-host di platform seperti GitHub Pages.

---

## 📂 Struktur Berkas Website

Berikut adalah berkas dan folder utama yang menyusun website ini:

```text
📁 website/
├── 📄 index.html                # Halaman utama (Struktur teks, jajaran perangkat, kontak, dll)
├── 📄 style.css                  # Gaya visual, tata letak, warna, responsivitas ponsel
├── 📄 script.js                  # Logika interaktif (Pencarian, filter galeri, pop-up pop-up modal)
├── 📄 PANDUAN_PENGELOLAAN.md     # Panduan ini
└── 📁 assets/
    └── 📁 images/                # Seluruh berkas gambar, foto kegiatan, dan peta desa
```

---

## ✍️ Cara Memperbarui Konten Populer

Semua pembaruan kode dapat dilakukan menggunakan aplikasi penyunting teks sederhana seperti **Visual Studio Code**, **Notepad++**, atau editor teks bawaan komputer.

### 1. Mengubah Data Perangkat Desa (Bagan Pemerintahan)
Jika terjadi mutasi jabatan atau perubahan nama perangkat desa:
1. Buka berkas **`index.html`** dan cari bagian bertuliskan `<!-- Organization Structure Tree -->` (sekitar baris 300).
2. Cari nama pejabat lama yang ingin diubah (contoh: `Yudi Sutarta` atau `Bogianto`).
3. Ganti nama tersebut dengan nama pejabat baru.
4. **Mengganti Foto Kepala Desa**: 
   * Simpan foto Kepala Desa yang baru ke dalam folder `assets/images/` dengan nama **`kades.png`** (rekomendasi rasio aspek 1:1 / kotak). File baru otomatis menggantikan foto lama.

---

### 2. Menambahkan Kegiatan Warga atau Program Kerja Baru
Galeri dokumentasi website ini disusun secara kronologis terbalik (terbaru di posisi atas). Jika ingin menambahkan program/kegiatan baru:

#### Langkah A: Tambah Kartu di Galeri (`index.html`)
1. Buka berkas **`index.html`** dan temukan kontainer `<!-- Gallery Grid -->` (sekitar baris 530).
2. Salin salah satu blok kode kartu galeri yang sudah ada, lalu letakkan di posisi atas untuk menjadikannya yang terbaru. Contoh struktur kartu:
   ```html
   <!-- Gallery Item: Nama Program -->
   <div class="gallery-item" data-category="kegiatan" onclick="openPotentialModal('proker_kunci_unik')">
       <div class="gallery-img-wrapper">
           <img src="assets/images/nama_foto_utama.jpg" alt="Deskripsi gambar singkat" class="gallery-img">
       </div>
       <div class="gallery-info">
           <div class="gallery-meta">
               <span class="gallery-tag">Kegiatan Warga</span> <!-- Kategori: Program Kerja / Kegiatan Warga -->
               <span class="gallery-date">Tanggal Pelaksanaan</span>
           </div>
           <h4 class="gallery-title">Nama Kegiatan Singkat</h4>
       </div>
   </div>
   ```
   * *Catatan*: Ganti `data-category` dengan `proker` (untuk Program Kerja) atau `kegiatan` (untuk Kegiatan Warga).

#### Langkah B: Tambah Detail Isi Kegiatan (`script.js`)
1. Buka berkas **`script.js`** dan temukan objek `const potentialData = { ... }` (sekitar baris 360).
2. Tambahkan isi konten baru di bawah baris kegiatan lain menggunakan nama kunci unik yang sama dengan `onclick` di HTML tadi (misal: `proker_kunci_unik`):
   ```javascript
   proker_kunci_unik: {
       tag: 'Kegiatan Warga', // Tag kategori
       title: 'Nama Lengkap Kegiatan', // Judul dalam modal
       image: 'assets/images/nama_foto_utama.jpg', // Foto utama pop-up
       desc: `
           <p>Paragraf penjelasan detail kegiatan di sini...</p>
           <p>Gunakan tag HTML p untuk paragraf baru.</p>
           
           <!-- Jika ada foto tambahan di dalam pop-up, gunakan kode di bawah ini -->
           <div style="text-align: center; margin: 1.5rem 0;">
               <img src="assets/images/foto_tambahan.jpg" alt="Keterangan" style="max-width:100%; border-radius:8px; box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
               <p style="font-size:0.85rem; color:#6b7280; margin-top:0.5rem; font-style:italic;">Keterangan foto tambahan di sini.</p>
           </div>
       `,
       source: '<span style="font-size: 0.85rem; color: #6b7280;">Sumber: KKN-PPM UGM Periode II Tahun 2026 Unit Tilik Tulakan</span>'
   },
   ```

---

### 3. Memperbarui Peta Tematik Desa Wonoanti
Jika ada peta mitigasi baru yang ingin diperbarui:
1. Ekspor peta baru dari aplikasi GIS ke format `.png`.
2. Simpan di folder `assets/images/` dengan menimpa nama file lama:
   * **Peta Rawan Bencana**: Simpan dengan nama **`peta_bencana.png`**
   * **Peta Persebaran Lalat**: Simpan dengan nama **`peta_lalat.png`**
   * **Peta Risiko Zoonosis**: Simpan dengan nama **`peta_zoonosis.png`**
3. Halaman web otomatis membaca berkas baru tersebut tanpa perlu mengubah baris kode apa pun.

---

## 🌐 Proses Hosting & Deployment (Live Online)

Saat ini website di-deploy secara otomatis menggunakan metode **GitHub Pages** yang terhubung langsung ke nama domain **`desawonoanti.com`**.

* **Alur Pembaruan Live**:
  1. Lakukan pengeditan pada berkas HTML/CSS/JS lokal di komputer Anda.
  2. Lakukan *push* perubahan tersebut ke repositori GitHub resmi desa.
  3. Server GitHub Pages akan otomatis memperbarui tampilan website online dalam waktu 1-3 menit setelah proses push selesai.
  
* **Penyedia Layanan (Registrar Domain)**:
  * Masa aktif domain **`desawonoanti.com`** harus diperpanjang secara berkala setiap tahun melalui panel kontrol penyedia domain resmi yang digunakan saat pembelian (misal: Niagahoster, Domainesia, Rumahweb, dll.) agar website tetap dapat diakses publik.

---

*Dokumentasi ini disiapkan oleh Tim KKN-PPM UGM Periode II Tahun 2026 Unit Tilik Tulakan untuk kemudahan pengelolaan berkelanjutan Desa Wonoanti.*
