const connectDB = require('../config/database');
const mongoose = require('mongoose');
const { exec } = require('child_process');

async function runSeeders() {
  try {
    // Koneksi ke database
    await connectDB();
    console.log('Terhubung ke database, mulai seeding...');
    
    // Jalankan semua seeder secara berurutan
    console.log('\n===== MULAI SEED DATA EVENT =====');
    await runSeeder('eventSeeder.js');
    
    console.log('\n===== MULAI SEED DATA DOSEN =====');
    await runSeeder('dosenSeeder.js');
    
    console.log('\n===== MULAI SEED DATA BERITA =====');
    await runSeeder('newsSeeder.js');
    
    console.log('\n===== MULAI SEED DATA ORGANISASI =====');
    await runSeeder('organizationSeeder.js');
    
    console.log('\n===== MULAI SEED DATA GALERI =====');
    await runSeeder('gallerySeeder.js');
    
    // Tambahkan seeder lainnya sesuai kebutuhan
    
    // Tutup koneksi
    await mongoose.connection.close();
    console.log('\n===== SEEDING SELESAI =====');
    console.log('Semua data berhasil di-seed!');
    
  } catch (error) {
    console.error('Error saat menjalankan seeders:', error);
    process.exit(1);
  }
}

// Fungsi untuk menjalankan seeder individual menggunakan child process
function runSeeder(seederFileName) {
  return new Promise((resolve, reject) => {
    const seederPath = `${__dirname}/${seederFileName}`;
    const childProcess = exec(`node ${seederPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error saat menjalankan ${seederFileName}:`, error);
        reject(error);
        return;
      }
      
      if (stderr) {
        console.error(`STDERR dari ${seederFileName}:`, stderr);
      }
      
      console.log(stdout);
      resolve();
    });
  });
}

// Jalankan semua seeder
runSeeders(); 