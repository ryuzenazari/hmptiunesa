const fs = require('fs');
const path = require('path');
const connectDB = require('../config/database');
const GalleryItem = require('../models/Gallery');
const User = require('../models/User');
const mongoose = require('mongoose');

async function seedGallery() {
  try {
    // Koneksi ke database
    await connectDB();
    
    // Hapus semua data gallery yang ada
    await GalleryItem.deleteMany({});
    console.log('Data galeri yang ada telah dihapus');
    
    // Cari atau buat user admin untuk uploadedBy
    let adminUser = await User.findOne({ role: 'admin' });
    
    if (!adminUser) {
      adminUser = await User.create({
        nama: 'Admin HMP',
        email: 'admin@hmp.unesa.ac.id',
        password: 'admin123', // Seharusnya di-hash pada implementasi nyata
        nim: 'ADMIN001',
        role: 'admin'
      });
      console.log('User admin dibuat untuk seed');
    }
    
    // Baca file gallery.json
    const galleryDataPath = path.join(__dirname, '../../frontend/src/data/gallery.json');
    const data = JSON.parse(fs.readFileSync(galleryDataPath, 'utf8'));
    
    // Mapping kategori frontend ke type di backend
    const typeMapping = {
      'events': 'image',
      'workshops': 'image',
      'competitions': 'image',
      'gatherings': 'image'
    };
    
    const galleryItems = data.galleryItems.map(item => {
      // Parse tanggal dari format string
      const dateParts = item.date.split(' ');
      const day = parseInt(dateParts[0]);
      
      // Mapping bulan bahasa Indonesia ke angka
      const monthMap = {
        'Januari': 0, 'Februari': 1, 'Maret': 2, 'April': 3, 'Mei': 4, 'Juni': 5,
        'Juli': 6, 'Agustus': 7, 'September': 8, 'Oktober': 9, 'November': 10, 'Desember': 11
      };
      
      const month = monthMap[dateParts[1]] || 0;
      const year = parseInt(dateParts[2]);
      
      const itemDate = new Date(year, month, day);
      
      // Buat object dasar
      const galleryItem = {
        title: item.title,
        description: item.description,
        type: typeMapping[item.category] || 'image',
        category: item.category,
        tags: [item.category, 'himpunan', 'dokumentasi'],
        fileUrl: item.imageUrl,
        thumbnail: item.imageUrl,
        metadata: {
          date: itemDate,
          location: 'UNESA Ketintang',
          dimensions: '1200x800',
          fileSize: 1024 * 1024 // Ukuran dummy 1MB
        },
        contributors: [{
          user: adminUser._id,
          role: 'photographer'
        }],
        featured: item.id <= 5, // 5 items pertama featured
        uploadedBy: adminUser._id
      };
      
      // Hapus referensi event karena perlu ObjectId yang valid
      // Jika perlu, bisa ditambahkan kembali setelah mendapatkan ID event yang valid dari database
      
      return galleryItem;
    });
    
    // Menyimpan data ke database
    const result = await GalleryItem.insertMany(galleryItems);
    console.log(`${result.length} item galeri berhasil ditambahkan ke database`);
    
    // Menutup koneksi
    await mongoose.connection.close();
    console.log('Koneksi ditutup. Seeding data galeri selesai!');
    
  } catch (error) {
    console.error('Error saat seeding galeri:', error);
    process.exit(1);
  }
}

// Jalankan seeder
seedGallery(); 