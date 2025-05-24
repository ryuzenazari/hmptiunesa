# Backend Website Himpunan

Backend API untuk website himpunan mahasiswa menggunakan Express.js dan MongoDB.

## Struktur Project

```
backend/
├── config/         # Konfigurasi aplikasi
├── controllers/    # Controller untuk setiap model
├── middleware/     # Middleware seperti autentikasi
├── models/         # Model database MongoDB
├── routes/         # Route API
├── server.js       # Entry point aplikasi
└── .env            # Environment variables
```

## API Endpoints

### Users
- `POST /api/users/register` - Registrasi user baru
- `POST /api/users/login` - Login user
- `GET /api/users/me` - Get current user (auth required)
- `PUT /api/users/me` - Update profil user (auth required)
- `PUT /api/users/change-password` - Ganti password (auth required)
- `GET /api/users` - List semua users (admin only)
- `PUT /api/users/:id/role` - Update role user (admin only)

### Organization
- `GET /api/organization` - Get profil organisasi
- `PUT /api/organization` - Update profil organisasi (admin only)
- `POST /api/organization/departments` - Tambah departemen (admin only)
- `PUT /api/organization/departments/:id` - Update departemen (admin only)
- `DELETE /api/organization/departments/:id` - Hapus departemen (admin only)

### Events
- `GET /api/events` - List semua events dengan filter
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Buat event baru (auth required)
- `PUT /api/events/:id` - Update event (auth required)
- `DELETE /api/events/:id` - Hapus event (auth required)
- `POST /api/events/:id/register` - Daftar ke event (auth required)
- `PUT /api/events/:eventId/registrants/:userId` - Update status pendaftar (auth required)

### News
- `GET /api/news` - List semua berita dengan filter
- `GET /api/news/:id` - Get berita by ID
- `GET /api/news/category/:category` - List berita by category
- `POST /api/news` - Buat berita baru (auth required)
- `PUT /api/news/:id` - Update berita (auth required)
- `DELETE /api/news/:id` - Hapus berita (auth required)

### Gallery
- `GET /api/gallery` - List semua item galeri dengan filter
- `GET /api/gallery/featured` - List item galeri yang ditonjolkan
- `GET /api/gallery/:id` - Get item galeri by ID
- `POST /api/gallery` - Upload item galeri baru (auth required)
- `PUT /api/gallery/:id` - Update item galeri (auth required)
- `DELETE /api/gallery/:id` - Hapus item galeri (auth required)
- `PUT /api/gallery/:id/featured` - Toggle status featured (admin only)

## Cara Menjalankan

1. Pastikan MongoDB sudah berjalan
2. Copy `.env.example` menjadi `.env` dan sesuaikan konfigurasi
3. Install dependencies:
   ```
   npm install
   ```
4. Jalankan server development:
   ```
   npm run dev
   ```
5. Server akan berjalan di http://localhost:5000 