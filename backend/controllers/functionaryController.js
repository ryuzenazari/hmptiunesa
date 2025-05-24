const Functionary = require('../models/Functionary');

// Mendapatkan semua fungsionaris
exports.getAllFunctionaries = async (req, res) => {
  try {
    const functionaries = await Functionary.find().sort({ position: 1 });
    res.status(200).json({
      success: true,
      count: functionaries.length,
      data: functionaries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mendapatkan data fungsionaris',
      error: error.message
    });
  }
};

// Mendapatkan fungsionaris berdasarkan ID
exports.getFunctionaryById = async (req, res) => {
  try {
    const functionary = await Functionary.findById(req.params.id);
    
    if (!functionary) {
      return res.status(404).json({
        success: false,
        message: 'Fungsionaris tidak ditemukan'
      });
    }
    
    res.status(200).json({
      success: true,
      data: functionary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mendapatkan data fungsionaris',
      error: error.message
    });
  }
};

// Membuat data fungsionaris baru
exports.createFunctionary = async (req, res) => {
  try {
    const functionary = await Functionary.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Fungsionaris berhasil ditambahkan',
      data: functionary
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Gagal menambahkan fungsionaris',
      error: error.message
    });
  }
};

// Memperbarui data fungsionaris
exports.updateFunctionary = async (req, res) => {
  try {
    const functionary = await Functionary.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!functionary) {
      return res.status(404).json({
        success: false,
        message: 'Fungsionaris tidak ditemukan'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Data fungsionaris berhasil diperbarui',
      data: functionary
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Gagal memperbarui data fungsionaris',
      error: error.message
    });
  }
};

// Menghapus data fungsionaris
exports.deleteFunctionary = async (req, res) => {
  try {
    const functionary = await Functionary.findByIdAndDelete(req.params.id);
    
    if (!functionary) {
      return res.status(404).json({
        success: false,
        message: 'Fungsionaris tidak ditemukan'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Fungsionaris berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus data fungsionaris',
      error: error.message
    });
  }
};

// Mendapatkan fungsionaris berdasarkan periode
exports.getFunctionariesByPeriod = async (req, res) => {
  try {
    const { period } = req.params;
    
    const functionaries = await Functionary.find({ period }).sort({ position: 1 });
    
    res.status(200).json({
      success: true,
      count: functionaries.length,
      data: functionaries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mendapatkan data fungsionaris',
      error: error.message
    });
  }
};

// Mendapatkan fungsionaris berdasarkan departemen
exports.getFunctionariesByDepartment = async (req, res) => {
  try {
    const { department } = req.params;
    
    const functionaries = await Functionary.find({ 
      department: { $regex: department, $options: 'i' } 
    }).sort({ position: 1 });
    
    res.status(200).json({
      success: true,
      count: functionaries.length,
      data: functionaries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mendapatkan data fungsionaris',
      error: error.message
    });
  }
};

// Mendapatkan fungsionaris aktif
exports.getActiveFunctionaries = async (req, res) => {
  try {
    const functionaries = await Functionary.find({ isActive: true }).sort({ position: 1 });
    
    res.status(200).json({
      success: true,
      count: functionaries.length,
      data: functionaries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mendapatkan data fungsionaris aktif',
      error: error.message
    });
  }
}; 