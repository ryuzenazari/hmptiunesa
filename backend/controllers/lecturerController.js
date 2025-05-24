const Lecturer = require('../models/Lecturer');

// Mendapatkan semua dosen
exports.getAllLecturers = async (req, res) => {
  try {
    const lecturers = await Lecturer.find().sort({ name: 1 });
    res.status(200).json({
      success: true,
      count: lecturers.length,
      data: lecturers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mendapatkan data dosen',
      error: error.message
    });
  }
};

// Mendapatkan dosen berdasarkan ID
exports.getLecturerById = async (req, res) => {
  try {
    const lecturer = await Lecturer.findById(req.params.id);
    
    if (!lecturer) {
      return res.status(404).json({
        success: false,
        message: 'Dosen tidak ditemukan'
      });
    }
    
    res.status(200).json({
      success: true,
      data: lecturer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mendapatkan data dosen',
      error: error.message
    });
  }
};

// Membuat data dosen baru
exports.createLecturer = async (req, res) => {
  try {
    const lecturer = await Lecturer.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Dosen berhasil ditambahkan',
      data: lecturer
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Gagal menambahkan dosen',
      error: error.message
    });
  }
};

// Memperbarui data dosen
exports.updateLecturer = async (req, res) => {
  try {
    const lecturer = await Lecturer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!lecturer) {
      return res.status(404).json({
        success: false,
        message: 'Dosen tidak ditemukan'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Data dosen berhasil diperbarui',
      data: lecturer
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Gagal memperbarui data dosen',
      error: error.message
    });
  }
};

// Menghapus data dosen
exports.deleteLecturer = async (req, res) => {
  try {
    const lecturer = await Lecturer.findByIdAndDelete(req.params.id);
    
    if (!lecturer) {
      return res.status(404).json({
        success: false,
        message: 'Dosen tidak ditemukan'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Dosen berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus data dosen',
      error: error.message
    });
  }
};

// Mendapatkan dosen berdasarkan spesialisasi
exports.getLecturersBySpecialization = async (req, res) => {
  try {
    const { specialization } = req.params;
    
    const lecturers = await Lecturer.find({ 
      specialization: { $regex: specialization, $options: 'i' } 
    }).sort({ name: 1 });
    
    res.status(200).json({
      success: true,
      count: lecturers.length,
      data: lecturers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mendapatkan data dosen',
      error: error.message
    });
  }
};

// Mencari dosen berdasarkan kata kunci
exports.searchLecturers = async (req, res) => {
  try {
    const { keyword } = req.query;
    
    const query = {
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { specialization: { $regex: keyword, $options: 'i' } },
        { position: { $regex: keyword, $options: 'i' } }
      ]
    };
    
    const lecturers = await Lecturer.find(query).sort({ name: 1 });
    
    res.status(200).json({
      success: true,
      count: lecturers.length,
      data: lecturers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mencari data dosen',
      error: error.message
    });
  }
}; 