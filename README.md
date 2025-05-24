# Website Himpunan Mahasiswa

Repositori ini berisi dua bagian utama:
1. Website Himpunan - Aplikasi web full-stack untuk himpunan mahasiswa
2. Tools Konverter Data - Kumpulan program untuk mengelola data anggota himpunan

## Website Himpunan

Website untuk himpunan mahasiswa dengan fitur pengelolaan anggota, berita, acara, galeri, dan informasi organisasi.

### Struktur Project

```
website-himpunan/
├── frontend/     # Aplikasi client-side dengan Vue.js
│   ├── src/      # Source code aplikasi frontend
│   ├── public/   # Asset statis
│   └── dist/     # Build output
├── backend/      # API server dengan Express.js dan MongoDB
    ├── config/   # Konfigurasi aplikasi
    ├── controllers/ # Logic pengendali API
    ├── middleware/ # Middleware validasi & autentikasi
    ├── models/   # Schema database
    ├── routes/   # Definisi endpoint API
    └── seeders/  # Script seeder database
```

### Teknologi yang Digunakan

#### Frontend
- Vue.js 3.5 dengan Composition API
- TypeScript 5.8
- Vite 6.2 sebagai build tool
- Pinia 3.0 untuk state management
- Axios 1.9 untuk HTTP requests
- ESLint 9.22 & Prettier 3.5 untuk code quality

#### Backend
- Node.js dengan Express.js 4.18
- MongoDB sebagai database
- Mongoose 8.0 ODM
- JWT 9.0 untuk autentikasi
- Multer untuk upload file
- Bcrypt 2.4 untuk enkripsi password

### API Endpoints

Backend menyediakan API untuk berbagai fitur:

- `/api/users` - Manajemen pengguna dan autentikasi
- `/api/organization` - Informasi organisasi himpunan
- `/api/events` - Pengelolaan acara dan kegiatan
- `/api/news` - Artikel berita dan pengumuman
- `/api/gallery` - Galeri foto dan video kegiatan
- `/api/lecturers` - Data dosen dan pembimbing
- `/api/functionaries` - Pengurus himpunan
- `/api/members` - Data anggota himpunan
- `/api/projects` - Proyek-proyek himpunan

### Cara Menjalankan

#### Frontend
1. Masuk ke direktori frontend:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Jalankan server development:
   ```bash
   npm run dev
   ```
4. Frontend akan berjalan di http://localhost:5173

#### Backend
1. Pastikan MongoDB sudah berjalan
2. Masuk ke direktori backend:
   ```bash
   cd backend
   ```
3. Copy `.env.example` menjadi `.env` dan sesuaikan konfigurasi
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
npm run seed:event    # Hanya menjalankan seeder event
```

## Fitur Utama Website

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

## Program Konverter Data Anggota Himpunan

Kumpulan program untuk mengelola data anggota himpunan dalam format JSON dan teks.

### Format Data

#### Format Teks
```
Angkatan XXXX

NAMA ANGGOTA
NIM : XXXXXXXXXX
Jenis Kelamin: XXXX
Status Keaktifan: XXXX
```

#### Format JSON
```json
{
  "membersList": [
    {
      "id": 1,
      "nama": "NAMA ANGGOTA",
      "nim": "XXXXXXXXXX",
      "angkatan": "XXXX",
      "email": "email@mhs.unesa.ac.id",
      "foto": "/default-avatar.png",
      "instagram": "",
      "linkedin": "",
      "github": "",
      "deskripsi": "",
      "prestasi": [],
      "keahlian": [],
      "kontak": "",
      "status": "xxxx",
      "jenisKelamin": "XXXX"
    }
  ]
}
```

## Repositori GitHub

Proyek ini tersedia di GitHub melalui alamat berikut:
```
git@github.com:ryuzenazari/hmptiunesa.git
```

Untuk mengkloning repositori ini:
```bash
git clone git@github.com:ryuzenazari/hmptiunesa.git
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
