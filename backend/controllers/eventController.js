const Event = require('../models/Event');

// Helper untuk format tanggal sesuai dengan frontend
const formatDateForFrontend = (date) => {
  if (!date) return null;
  
  const dateObj = new Date(date);
  const day = dateObj.getDate().toString().padStart(2, '0');
  
  // Array nama bulan dalam bahasa Indonesia (3 huruf)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
  const month = months[dateObj.getMonth()];
  
  const year = dateObj.getFullYear().toString();
  
  return { day, month, year };
};

// Get event categories
exports.getEventCategories = async (req, res) => {
  try {
    const categories = [
      { id: "all", name: "Semua", icon: "🗓️" },
      { id: "webinar", name: "Webinar", icon: "🌐" },
      { id: "workshop", name: "Workshop", icon: "💻" },
      { id: "competition", name: "Kompetisi", icon: "🏆" },
      { id: "internal", name: "Internal", icon: "👥" },
      { id: "training", name: "Latihan/Pelatihan", icon: "🏋️" },
      { id: "seminar", name: "Seminar", icon: "🎤" },
      { id: "external", name: "Eksternal", icon: "🌍" },
      { id: "general", name: "Umum", icon: "📋" }
    ];
    
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
  }
};

// Get event statistics
exports.getEventStats = async (req, res) => {
  try {
    const now = new Date();
    
    // Hitung jumlah event yang akan datang (date.start > now)
    const upcomingCount = await Event.countDocuments({
      'date.start': { $gt: now }
    });
    
    // Hitung total event
    const totalEvents = await Event.countDocuments();
    
    const eventStats = [
      { id: 1, number: upcomingCount.toString(), label: "Kegiatan Mendatang" },
      { id: 2, number: `${totalEvents}+`, label: "Kegiatan Terselenggara" },
      { id: 3, number: "1000+", label: "Peserta Terdaftar" }
    ];
    
    res.status(200).json(eventStats);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
  }
};

// Get all events with filters and pagination
exports.getEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, status, search } = req.query;
    const query = {};
    
    // Filter berdasarkan kategori
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Filter berdasarkan status
    if (status) {
      query.status = status;
    }
    
    // Search berdasarkan judul atau deskripsi
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { 'date.start': -1 },
      populate: { path: 'createdBy', select: 'nama email nim' }
    };
    
    const events = await Event.find(query)
      .skip((options.page - 1) * options.limit)
      .limit(options.limit)
      .sort(options.sort)
      .populate(options.populate.path, options.populate.select);
    
    // Format events for frontend
    const formattedEvents = events.map(event => {
      const eventObj = event.toObject();
      return {
        ...eventObj,
        date: formatDateForFrontend(eventObj.date.start),
        slots: {
          registered: 0,
          total: eventObj.capacity || 0
        }
      };
    });
    
    const total = await Event.countDocuments(query);
    
    res.status(200).json({
      events: formattedEvents,
      totalPages: Math.ceil(total / options.limit),
      currentPage: options.page,
      totalEvents: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
  }
};

// Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'nama email nim')
      .populate('organizers', 'nama email nim');
    
    if (!event) {
      return res.status(404).json({ message: 'Event tidak ditemukan' });
    }
    
    // Format event untuk frontend
    const eventObj = event.toObject();
    const formattedEvent = {
      ...eventObj,
      date: formatDateForFrontend(eventObj.date.start),
      slots: {
        registered: 0,
        total: eventObj.capacity || 0
      }
    };
    
    res.status(200).json(formattedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
  }
};

// Create new event
exports.createEvent = async (req, res) => {
  try {
    const eventData = req.body;
    
    // Tambahkan user yang membuat
    eventData.createdBy = req.user.id;
    
    const event = await Event.create(eventData);
    
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const updateData = req.body;
    
    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({ message: 'Event tidak ditemukan' });
    }
    
    // Cek apakah user adalah pembuat event atau admin
    if (event.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Tidak memiliki izin untuk mengubah event' });
    }
    
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    
    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({ message: 'Event tidak ditemukan' });
    }
    
    // Cek apakah user adalah pembuat event atau admin
    if (event.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Tidak memiliki izin untuk menghapus event' });
    }
    
    await Event.findByIdAndDelete(eventId);
    
    res.status(200).json({ message: 'Event berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
  }
}; 