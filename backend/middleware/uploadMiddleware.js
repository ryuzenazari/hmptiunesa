const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Konfigurasi penyimpanan 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Menentukan folder berdasarkan tipe upload
    let uploadPath = '';
    
    if (req.baseUrl.includes('gallery')) {
      uploadPath = 'uploads/gallery';
    } else if (req.baseUrl.includes('events')) {
      uploadPath = 'uploads/events';
    } else if (req.baseUrl.includes('news')) {
      uploadPath = 'uploads/news';
    } else if (req.baseUrl.includes('members') || req.baseUrl.includes('functionaries')) {
      uploadPath = 'uploads/profiles';
    } else if (req.baseUrl.includes('lecturers')) {
      uploadPath = 'uploads/lecturers';
    } else if (req.baseUrl.includes('projects')) {
      uploadPath = 'uploads/projects';
    } else {
      uploadPath = 'uploads/others';
    }
    
    // Pastikan folder ada
    const fullPath = path.join(__dirname, '..', uploadPath);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Format nama file: timestamp-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, uniqueSuffix + extension);
  }
});

// Filter file berdasarkan tipe
const fileFilter = (req, file, cb) => {
  // Menerima hanya image files
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  
  if (mimetype && extname) {
    return cb(null, true);
  }
  
  cb(new Error('Hanya file gambar yang diperbolehkan (jpeg, jpg, png, gif, webp)'));
};

// Konfigurasi multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB maksimum ukuran file
  },
  fileFilter: fileFilter
});

// Middleware untuk upload file tunggal
exports.uploadSingle = (fieldName) => upload.single(fieldName);

// Middleware untuk upload multiple files
exports.uploadMultiple = (fieldName, maxCount) => upload.array(fieldName, maxCount);

// Error handler untuk multer
exports.handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Ukuran file terlalu besar. Maksimum 5MB.'
      });
    }
    return res.status(400).json({
      success: false,
      message: `Error upload: ${err.message}`
    });
  }
  
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  next();
};

// URL formatter untuk file yang diupload
exports.formatFileUrl = (req) => {
  if (!req.file) return null;
  
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  return `${baseUrl}/${req.file.path.replace(/\\/g, '/')}`;
};

// URL formatter untuk multiple files
exports.formatFilesUrl = (req) => {
  if (!req.files || req.files.length === 0) return [];
  
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  return req.files.map(file => `${baseUrl}/${file.path.replace(/\\/g, '/')}`);
}; 