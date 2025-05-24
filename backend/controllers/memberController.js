const Member = require('../models/Member');

// Mendapatkan semua anggota
exports.getAllMembers = async (req, res) => {
  try {
    const members = await Member.find().sort({ name: 1 });
    res.status(200).json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mendapatkan data anggota',
      error: error.message
    });
  }
};

// Mendapatkan anggota berdasarkan ID
exports.getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Anggota tidak ditemukan'
      });
    }
    
    res.status(200).json({
      success: true,
      data: member
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mendapatkan data anggota',
      error: error.message
    });
  }
};

// Membuat data anggota baru
exports.createMember = async (req, res) => {
  try {
    const member = await Member.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Anggota berhasil ditambahkan',
      data: member
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Gagal menambahkan anggota',
      error: error.message
    });
  }
};

// Memperbarui data anggota
exports.updateMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Anggota tidak ditemukan'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Data anggota berhasil diperbarui',
      data: member
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Gagal memperbarui data anggota',
      error: error.message
    });
  }
};

// Menghapus data anggota
exports.deleteMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Anggota tidak ditemukan'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Anggota berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus data anggota',
      error: error.message
    });
  }
};

// Mendapatkan anggota berdasarkan angkatan
exports.getMembersByBatch = async (req, res) => {
  try {
    const { batch } = req.params;
    
    const members = await Member.find({ batch }).sort({ name: 1 });
    
    res.status(200).json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mendapatkan data anggota',
      error: error.message
    });
  }
};

// Mendapatkan anggota berdasarkan departemen
exports.getMembersByDepartment = async (req, res) => {
  try {
    const { department } = req.params;
    
    const members = await Member.find({ 
      department: { $regex: department, $options: 'i' } 
    }).sort({ name: 1 });
    
    res.status(200).json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mendapatkan data anggota',
      error: error.message
    });
  }
};

// Mendapatkan anggota aktif
exports.getActiveMembers = async (req, res) => {
  try {
    const members = await Member.find({ 'membership.isActive': true }).sort({ name: 1 });
    
    res.status(200).json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mendapatkan data anggota aktif',
      error: error.message
    });
  }
};

// Mencari anggota berdasarkan kata kunci
exports.searchMembers = async (req, res) => {
  try {
    const { keyword } = req.query;
    
    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: 'Parameter pencarian dibutuhkan'
      });
    }
    
    const query = {
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { studentId: { $regex: keyword, $options: 'i' } },
        { department: { $regex: keyword, $options: 'i' } },
        { batch: { $regex: keyword, $options: 'i' } }
      ]
    };
    
    const members = await Member.find(query).sort({ name: 1 });
    
    res.status(200).json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mencari data anggota',
      error: error.message
    });
  }
}; 