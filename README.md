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
├── backend/      # API server dengan Express.js dan MongoDB
```

### Teknologi yang Digunakan

#### Frontend
- Vue.js 3 dengan Composition API
- TypeScript
- Vite sebagai build tool
- Tailwind CSS untuk styling
- Vue Router untuk navigasi
- Axios untuk HTTP requests

#### Backend
- Node.js dengan Express.js
- MongoDB sebagai database
- Mongoose ODM
- JWT untuk autentikasi
- Multer untuk upload file

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

### Daftar Program

1. `member_converter.py` - Program utama dengan menu interaktif yang mencakup semua fungsionalitas
2. `converter.py` - Program untuk mengonversi data teks anggota menjadi JSON
3. `json_to_txt.py` - Program untuk mengonversi data JSON anggota menjadi teks
4. `create_member_txt.py` - Program untuk membuat file teks anggota dari input manual

### Cara Penggunaan

#### Program Utama (`member_converter.py`)

Program ini mencakup semua fungsionalitas dalam satu aplikasi dengan menu interaktif.

```bash
python member_converter.py
```

Menu yang tersedia:
1. Konversi TXT ke JSON
2. Konversi JSON ke TXT  
3. Buat file TXT anggota (input manual)
4. Buat file TXT anggota (input batch)
5. Gabungkan dua file JSON

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
