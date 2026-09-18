# Repositori: agroconnect-frontend-web
## Portal Web Responsif: Dashboard Petani & Marketplace Pembeli (React JS + Vite)
**Skema Sertifikasi**: BNSP Full-Stack Developer | **Kandidat**: Fredli Fourqoni

---

### Deskripsi
Aplikasi web klien berbasis Single Page Application (SPA) yang dibangun menggunakan **React JS** dan **Vite** dengan tema visual agrikultur modern.

### Fitur Utama:
1. **Pemantauan Cuaca Agrikultur**: Visualisasi data real-time suhu, kelembaban, dan angin dari BMKG serta kartu rekomendasi aksi tani.
2. **Katalog & Marketplace**: Penjelajahan produk hasil panen, filter kategori, dan pencarian instan.
3. **Manajemen Produk Petani**: Formulir penambahan dan pengelolaan komoditas untuk peran petani.
4. **Keranjang & Checkout ACID**: Perhitungan otomatis biaya belanja, input alamat kirim, dan konfirmasi transaksi pesanan.
5. **Riwayat Pesanan**: Pelacakan status faktur pesanan pembeli.
6. **Otentikasi Terintegrasi**: Modal login & register dengan penyimpanan token JWT.

### Port
- Port Pengembangan Lokal: `3000` (atau default Vite `5173`)
- Port Kontainer Produksi Nginx: `80` (dimapping ke `3000` pada Docker Compose)
