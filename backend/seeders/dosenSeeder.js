const fs = require('fs');
const path = require('path');
const connectDB = require('../config/database');
const Lecturer = require('../models/Lecturer');
const mongoose = require('mongoose');

async function seedLecturers() {
  try {
    // Koneksi ke database
    await connectDB();
    
    // Hapus semua data dosen yang ada
    await Lecturer.deleteMany({});
    console.log('Data dosen yang ada telah dihapus');
    
    // Baca file dosen.json
    const dosenDataPath = path.join(__dirname, '../../frontend/src/data/dosen.json');
    const data = JSON.parse(fs.readFileSync(dosenDataPath, 'utf8'));
    
    const lecturers = data.dosenItems.map(item => {
      return {
        name: item.name,
        nip: item.nidn || '000000000000000000',
        position: item.position || 'Dosen Teknik Informatika',
        specialization: item.specialization || 'Ilmu Komputer',
        email: item.email || 'dosen@unesa.ac.id',
        photo: item.imageUrl || '',
        education: Array.isArray(item.education) ? item.education.join('\n') : 'S1 Teknik Informatika',
        research: Array.isArray(item.research) ? item.research.map(research => {
          return {
            title: research,
            year: new Date().getFullYear(),
            description: research
          };
        }) : [{
          title: 'Penelitian',
          year: new Date().getFullYear(),
          description: 'Penelitian di bidang Teknik Informatika'
        }],
        biography: `${item.name} adalah dosen dengan keahlian di bidang ${item.specialization || 'Ilmu Komputer'}.`,
        socialMedia: {
          website: item.socials?.scholar || '',
          linkedin: '',
          googleScholar: item.socials?.scholar || ''
        }
      };
    });
    
    // Menyimpan data ke database
    const result = await Lecturer.insertMany(lecturers);
    console.log(`${result.length} dosen berhasil ditambahkan ke database`);
    
    // Menutup koneksi
    await mongoose.connection.close();
    console.log('Koneksi ditutup. Seeding data dosen selesai!');
    
  } catch (error) {
    console.error('Error saat seeding dosen:', error);
    process.exit(1);
  }
}

// Jalankan seeder
seedLecturers(); 