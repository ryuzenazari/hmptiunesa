const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware untuk memverifikasi token JWT
exports.protect = async (req, res, next) => {
  let token;
  
  // Cek jika header authorization ada dan dimulai dengan 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Dapatkan token dari header
      token = req.headers.authorization.split(' ')[1];
      
      // Verifikasi token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Dapatkan data user dari token (tanpa password)
      req.user = await User.findById(decoded.id).select('-password');
      
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({
        success: false,
        message: 'Token tidak valid atau sudah kadaluarsa'
      });
    }
  }
  
  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Akses ditolak, token tidak tersedia'
    });
  }
};

// Middleware untuk membatasi akses berdasarkan role
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        success: false,
        message: 'User tidak memiliki hak akses'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User dengan role ${req.user.role} tidak memiliki akses ke rute ini`
      });
    }
    
    next();
  };
};

// Middleware untuk otorisasi admin
exports.adminMiddleware = (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Akses ditolak. Membutuhkan hak admin.' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Middleware untuk otorisasi pengurus
exports.pengurusMiddleware = (req, res, next) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'pengurus') {
      return res.status(403).json({ message: 'Akses ditolak. Membutuhkan hak pengurus.' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 