const Project = require('../models/Project');
const { uploadSingle, formatFileUrl, uploadMultiple, formatFilesUrl } = require('../middleware/uploadMiddleware');

// Validasi input proyek
const validateProject = (data) => {
  const errors = {};

  // Validasi title
  if (!data.title) {
    errors.title = 'Judul proyek wajib diisi';
  } else if (data.title.length < 5) {
    errors.title = 'Judul proyek minimal 5 karakter';
  } else if (data.title.length > 100) {
    errors.title = 'Judul proyek maksimal 100 karakter';
  }

  // Validasi description
  if (!data.description) {
    errors.description = 'Deskripsi proyek wajib diisi';
  } else if (data.description.length < 20) {
    errors.description = 'Deskripsi proyek minimal 20 karakter';
  }

  // Validasi category
  if (!data.category) {
    errors.category = 'Kategori proyek wajib diisi';
  }

  // Validasi status
  if (data.status && !['ongoing', 'completed', 'planned'].includes(data.status)) {
    errors.status = 'Status proyek tidak valid';
  }

  // Validasi startDate
  if (!data.startDate) {
    errors.startDate = 'Tanggal mulai proyek wajib diisi';
  } else {
    const startDateObj = new Date(data.startDate);
    if (isNaN(startDateObj.getTime())) {
      errors.startDate = 'Format tanggal mulai tidak valid';
    }
  }

  // Validasi endDate (jika ada)
  if (data.endDate) {
    const endDateObj = new Date(data.endDate);
    const startDateObj = new Date(data.startDate);
    
    if (isNaN(endDateObj.getTime())) {
      errors.endDate = 'Format tanggal selesai tidak valid';
    } else if (startDateObj > endDateObj) {
      errors.endDate = 'Tanggal selesai harus setelah tanggal mulai';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Mendapatkan semua proyek
exports.getAllProjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const projects = await Project.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Project.countDocuments();
    
    res.status(200).json({
      success: true,
      count: projects.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mendapatkan data proyek',
      error: error.message
    });
  }
};

// Mendapatkan proyek berdasarkan ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Proyek tidak ditemukan'
      });
    }
    
    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mendapatkan data proyek',
      error: error.message
    });
  }
};

// Membuat data proyek baru
exports.createProject = async (req, res) => {
  try {
    // Validasi input
    const { isValid, errors } = validateProject(req.body);
    
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors
      });
    }
    
    // Jika ada thumbnail yang diupload
    if (req.file) {
      req.body.thumbnail = formatFileUrl(req);
    }
    
    // Jika ada multiple images yang diupload
    if (req.files && req.files.length > 0) {
      req.body.images = formatFilesUrl(req);
    }
    
    const project = await Project.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Proyek berhasil ditambahkan',
      data: project
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Gagal menambahkan proyek',
      error: error.message
    });
  }
};

// Memperbarui data proyek
exports.updateProject = async (req, res) => {
  try {
    // Cari proyek yang akan diupdate
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Proyek tidak ditemukan'
      });
    }
    
    // Validasi input
    const { isValid, errors } = validateProject(req.body);
    
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors
      });
    }
    
    // Jika ada thumbnail yang diupload
    if (req.file) {
      req.body.thumbnail = formatFileUrl(req);
    }
    
    // Jika ada multiple images yang diupload
    if (req.files && req.files.length > 0) {
      // Gabungkan dengan images yang sudah ada jika tidak mau mengganti semua
      if (req.body.keepExistingImages === 'true' && project.images) {
        const newImages = formatFilesUrl(req);
        req.body.images = [...project.images, ...newImages];
      } else {
        req.body.images = formatFilesUrl(req);
      }
    }
    
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Data proyek berhasil diperbarui',
      data: updatedProject
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Gagal memperbarui data proyek',
      error: error.message
    });
  }
};

// Menghapus data proyek
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Proyek tidak ditemukan'
      });
    }
    
    // Hapus proyek dari database
    await Project.findByIdAndDelete(req.params.id);
    
    // TODO: Tambahkan logika untuk menghapus file gambar terkait dari server
    
    res.status(200).json({
      success: true,
      message: 'Proyek berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus data proyek',
      error: error.message
    });
  }
};

// Mendapatkan proyek berdasarkan kategori
exports.getProjectsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const projects = await Project.find({ 
      category: { $regex: category, $options: 'i' } 
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
    
    const total = await Project.countDocuments({ 
      category: { $regex: category, $options: 'i' } 
    });
    
    res.status(200).json({
      success: true,
      count: projects.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mendapatkan data proyek',
      error: error.message
    });
  }
};

// Mendapatkan proyek berdasarkan status
exports.getProjectsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Validasi status
    if (!['ongoing', 'completed', 'planned'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status tidak valid'
      });
    }
    
    const projects = await Project.find({ status })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Project.countDocuments({ status });
    
    res.status(200).json({
      success: true,
      count: projects.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mendapatkan data proyek',
      error: error.message
    });
  }
};

// Mencari proyek berdasarkan kata kunci
exports.searchProjects = async (req, res) => {
  try {
    const { keyword } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: 'Parameter pencarian dibutuhkan'
      });
    }
    
    const query = {
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { category: { $regex: keyword, $options: 'i' } },
        { technologies: { $regex: keyword, $options: 'i' } }
      ]
    };
    
    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Project.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: projects.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mencari data proyek',
      error: error.message
    });
  }
}; 