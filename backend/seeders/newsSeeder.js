const fs = require('fs');
const path = require('path');
const connectDB = require('../config/database');
const News = require('../models/News');
const User = require('../models/User');
const mongoose = require('mongoose');

async function seedNews() {
  try {
    // Koneksi ke database
    await connectDB();
    
    // Hapus semua data news yang ada
    await News.deleteMany({});
    console.log('Data berita yang ada telah dihapus');
    
    // Cari atau buat user admin untuk author
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
    
    // Baca file news.json
    const newsDataPath = path.join(__dirname, '../../frontend/src/data/news.json');
    const data = JSON.parse(fs.readFileSync(newsDataPath, 'utf8'));
    
    // Mapping kategori dari frontend ke enum backend
    const categoryMapping = {
      'program-kerja': 'event',
      'akademik': 'academic',
      'teknologi': 'article',
      'organisasi': 'announcement',
      'kerjasama': 'article',
      'beasiswa': 'announcement',
      'karir': 'announcement'
    };
    
    const news = data.newsItems.map(item => {
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
      
      const publishDate = new Date(year, month, day);
      
      return {
        title: item.title,
        content: item.content,
        summary: item.description,
        category: categoryMapping[item.category] || 'other',
        tags: data.tags.slice(0, 3), // Ambil beberapa tag untuk contoh
        thumbnail: item.imageUrl,
        featuredImage: item.imageUrl,
        status: 'published',
        publishDate: publishDate,
        viewCount: Math.floor(Math.random() * 1000), // Random view count
        author: adminUser._id
      };
    });
    
    // Menyimpan data ke database
    const result = await News.insertMany(news);
    console.log(`${result.length} berita berhasil ditambahkan ke database`);
    
    // Menutup koneksi
    await mongoose.connection.close();
    console.log('Koneksi ditutup. Seeding data berita selesai!');
    
  } catch (error) {
    console.error('Error saat seeding berita:', error);
    process.exit(1);
  }
}

// Jalankan seeder
seedNews(); 