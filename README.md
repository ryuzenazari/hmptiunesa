# Website Himpunan Mahasiswa

Repositori ini berisi aplikasi web full-stack untuk organisasi himpunan mahasiswa. Proyek ini dibagi menjadi dua bagian utama:
- **Frontend**: Aplikasi client-side dengan Vue.js 3 dan TypeScript
- **Backend**: API server dengan Express.js dan MongoDB

## Struktur Proyek

```
website-himpunan/
├── frontend/     # Aplikasi client-side dengan Vue.js
│   ├── src/      # Source code aplikasi frontend
│   │   ├── assets/     # Asset yang akan diproses oleh build tool
│   │   ├── components/ # Komponen Vue yang dapat digunakan kembali
│   │   ├── composables/# Composable functions
│   │   ├── layouts/    # Layout komponen
│   │   ├── router/     # Konfigurasi router
│   │   ├── stores/     # State management dengan Pinia
│   │   ├── services/   # Service untuk API calls
│   │   ├── types/      # Type definitions TypeScript
│   │   ├── utils/      # Utilitas functions
│   │   └── views/      # Komponen halaman utama
│   ├── public/   # Asset statis
│   └── dist/     # Build output
│
├── backend/      # API server dengan Express.js dan MongoDB
    ├── config/   # Konfigurasi aplikasi
    ├── controllers/ # Logic pengendali API
    ├── middleware/ # Middleware validasi & autentikasi
    ├── models/   # Schema database
    ├── routes/   # Definisi endpoint API
    └── seeders/  # Script seeder database
```

## Teknologi yang Digunakan

### Frontend
- Vue.js 3 dengan Composition API
- TypeScript
- Vite sebagai build tool
- Pinia untuk state management
- Axios untuk HTTP requests
- TailwindCSS untuk styling
- Vue Router untuk routing

### Backend
- Node.js dengan Express.js
- MongoDB sebagai database
- Mongoose ODM
- JWT untuk autentikasi
- Multer untuk upload file
- Bcrypt untuk enkripsi password

## Fitur Utama

1. **Manajemen Keanggotaan**
   - Profil anggota
   - Struktur organisasi
   - Statistik keanggotaan

2. **Manajemen Acara**
   - Pembuatan dan pengelolaan acara
   - Pendaftaran peserta
   - Tiket acara

3. **Portal Berita**
   - Kategori berita
   - Pencarian dan filter
   - Editor konten rich text

4. **Galeri Kegiatan**
   - Upload dan manajemen foto/video
   - Fitur highlight galeri

5. **Manajemen Organisasi**
   - Profil organisasi
   - Struktur departemen
   - Kontak dan sosial media

## API Endpoints

Backend menyediakan API untuk berbagai fitur:

- `/api/users` - Manajemen pengguna dan autentikasi
- `/api/organization` - Informasi organisasi himpunan
- `/api/events` - Pengelolaan acara dan kegiatan
- `/api/news` - Artikel berita dan pengumuman
- `/api/gallery` - Galeri foto dan video kegiatan

## Cara Menjalankan

### Prasyarat
- Node.js (versi 16.x atau lebih tinggi)
- MongoDB (lokal atau cloud)
- NPM atau Yarn

### Frontend
1. Masuk ke direktori frontend:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Buat file `.env` dengan konfigurasi:
   ```
   VITE_API_BASE_URL=http://localhost:5000/api
   ```
4. Jalankan server development:
   ```bash
   npm run dev
   ```
5. Frontend akan berjalan di http://localhost:5173

### Backend
1. Pastikan MongoDB sudah berjalan atau memiliki akses ke MongoDB Atlas
2. Masuk ke direktori backend:
   ```bash
   cd backend
   ```
3. Buat file `.env` dengan konfigurasi:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?
   JWT_SECRET=yoursecretkey
   JWT_EXPIRE=30d
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Jalankan server development:
   ```bash
   npm run dev
   ```
6. Backend akan berjalan di http://localhost:5000

### Seeding Database

Untuk mengisi database dengan data awal:

```bash
cd backend
npm run seed          # Menjalankan semua seeder
```

## Produksi dan Deployment

### Build Frontend
```bash
cd frontend
npm run build
```

### Menjalankan Backend di Produksi
```bash
cd backend
npm start
```

## Kontribusi

Jika Anda ingin berkontribusi pada proyek ini, silakan:
1. Fork repositori ini
2. Buat branch fitur (`git checkout -b fitur-baru`)
3. Commit perubahan Anda (`git commit -m 'Menambahkan fitur baru'`)
4. Push ke branch (`git push origin fitur-baru`)
5. Buat Pull Request

## Lisensi

Proyek ini dilisensikan di bawah lisensi MIT - lihat file LICENSE untuk detail.
