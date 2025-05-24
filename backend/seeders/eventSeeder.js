const fs = require('fs');
const path = require('path');
const connectDB = require('../config/database');
const Event = require('../models/Event');
const User = require('../models/User');
const mongoose = require('mongoose');

// Helper untuk konversi format tanggal
function convertDate(dateObj) {
  const months = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'Mei': 4, 'Jun': 5,
    'Jul': 6, 'Ags': 7, 'Sep': 8, 'Okt': 9, 'Nov': 10, 'Des': 11
  };
  
  const day = parseInt(dateObj.day);
  const month = months[dateObj.month];
  const year = parseInt(dateObj.year);
  
  return new Date(year, month, day);
}

async function seedEvents() {
  try {
    // Koneksi ke database
    await connectDB();
    
    // Hapus semua data event yang ada
    await Event.deleteMany({});
    console.log('Data event yang ada telah dihapus');
    
    // Cari atau buat user admin untuk createdBy
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
    
    // Baca file events.json
    const eventsDataPath = path.join(__dirname, '../../frontend/src/data/events.json');
    const data = JSON.parse(fs.readFileSync(eventsDataPath, 'utf8'));
    
    const events = data.eventItems.map(item => {
      // Konversi format tanggal dari frontend ke format database
      const startDate = convertDate(item.date);
      const endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + 4); // Asumsi event berlangsung 4 jam
      
      return {
        title: item.title,
        description: item.description,
        date: {
          start: startDate,
          end: endDate
        },
        time: item.time,
        location: item.location,
        category: item.category,
        thumbnail: item.imageUrl.replace('@/assets', ''), // Menyesuaikan path
        status: 'upcoming',
        capacity: item.slots.total,
        speaker: item.speaker,
        level: item.level,
        htm: item.htm,
        htm_note: item.htm_note,
        formUrl: item.formUrl,
        contacts: item.contacts,
        createdBy: adminUser._id
      };
    });
    
    // Menyimpan data ke database
    const result = await Event.insertMany(events);
    console.log(`${result.length} event berhasil ditambahkan ke database`);
    
    // Menutup koneksi
    await mongoose.connection.close();
    console.log('Koneksi ditutup. Seeding selesai!');
    
  } catch (error) {
    console.error('Error saat seeding event:', error);
    process.exit(1);
  }
}

// Jalankan seeder
seedEvents(); 