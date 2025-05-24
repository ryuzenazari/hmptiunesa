const fs = require('fs');
const path = require('path');
const connectDB = require('../config/database');
const Organization = require('../models/Organization');
const User = require('../models/User');
const mongoose = require('mongoose');

async function seedOrganization() {
  try {
    // Koneksi ke database
    await connectDB();
    
    // Hapus semua data organisasi yang ada
    await Organization.deleteMany({});
    console.log('Data organisasi yang ada telah dihapus');
    
    // Cari atau buat user admin untuk updatedBy
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
    
    // Baca file organization.json
    const orgDataPath = path.join(__dirname, '../../frontend/src/data/organization.json');
    const data = JSON.parse(fs.readFileSync(orgDataPath, 'utf8'));
    
    // Siapkan departemen
    const departments = data.departments.map(dept => {
      return {
        name: dept.title,
        description: `${dept.title} terdiri dari ${dept.members.length} anggota aktif.`,
        head: adminUser._id // Gunakan admin sebagai kepala departemen
      };
    });
    
    // Buat objek organisasi
    const organization = {
      name: 'Himpunan Mahasiswa Teknik Informatika UNESA',
      description: 'Himpunan Mahasiswa Teknik Informatika (HIMTI) UNESA adalah organisasi kemahasiswaan yang bertujuan untuk mengembangkan potensi mahasiswa di bidang teknologi informasi dan memberikan kontribusi dalam pengembangan akademik, non-akademik, dan pengabdian kepada masyarakat.',
      visionMission: {
        vision: 'Menjadi organisasi mahasiswa yang unggul, kreatif, dan inovatif dalam mengembangkan kompetensi mahasiswa Teknik Informatika di bidang teknologi informasi dan memberikan kontribusi nyata bagi masyarakat.',
        mission: [
          'Meningkatkan kualitas akademik dan non-akademik mahasiswa Teknik Informatika',
          'Mengembangkan minat dan bakat mahasiswa di bidang teknologi informasi',
          'Menjalin kerjasama dengan berbagai pihak untuk pengembangan kompetensi mahasiswa',
          'Mengadakan kegiatan yang bermanfaat bagi anggota dan masyarakat',
          'Menyediakan platform untuk mengekspresikan kreativitas dan inovasi mahasiswa'
        ]
      },
      logo: '/images/logo.png',
      contactInfo: {
        email: 'hmptiunesa@gmail.com',
        phone: '+62 812 3456 7890',
        address: 'Gedung A10, Kampus Unesa Ketintang, Surabaya',
        socialMedia: {
          instagram: 'https://instagram.com/hmptiunesa',
          twitter: 'https://twitter.com/hmptiunesa',
          facebook: 'https://facebook.com/hmptiunesa',
          linkedin: 'https://linkedin.com/company/hmptiunesa',
          website: 'https://hmptiunesa.org'
        }
      },
      departments: departments,
      history: 'Himpunan Mahasiswa Teknik Informatika (HIMTI) UNESA didirikan pada 11 Mei 2024 sebagai wadah bagi mahasiswa Teknik Informatika untuk mengembangkan diri dalam bidang akademik dan non-akademik. Sejak berdiri, HIMTI UNESA telah mengadakan berbagai kegiatan yang bermanfaat bagi anggota dan masyarakat sekitar.',
      updatedBy: adminUser._id
    };
    
    // Menyimpan data ke database
    const result = await Organization.create(organization);
    console.log('Data organisasi berhasil ditambahkan ke database');
    
    // Menutup koneksi
    await mongoose.connection.close();
    console.log('Koneksi ditutup. Seeding data organisasi selesai!');
    
  } catch (error) {
    console.error('Error saat seeding organisasi:', error);
    process.exit(1);
  }
}

// Jalankan seeder
seedOrganization(); 