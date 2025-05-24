const rateLimit = require('express-rate-limit');

// Middleware rate limiting untuk mencegah brute force attack
exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // Maksimum 100 request per IP dalam 15 menit
  message: {
    success: false,
    message: 'Terlalu banyak request dari IP ini, silakan coba lagi setelah 15 menit'
  },
  standardHeaders: true, // Return rate limit info dalam headers
  legacyHeaders: false // Disable X-RateLimit-* headers
});

// Middleware rate limiting khusus untuk login
exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 5, // Maksimum 5 login attempts per IP dalam 15 menit
  message: {
    success: false,
    message: 'Terlalu banyak percobaan login dari IP ini, silakan coba lagi setelah 15 menit'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Middleware rate limiting untuk register
exports.registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 jam
  max: 3, // Maksimum 3 registrasi dari IP yang sama dalam 1 jam
  message: {
    success: false,
    message: 'Terlalu banyak percobaan registrasi dari IP ini, silakan coba lagi setelah 1 jam'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Middleware rate limiting untuk API endpoints sensitif (create, update, delete)
exports.modifyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 jam
  max: 20, // Maksimum 20 operasi modifikasi dalam 1 jam
  message: {
    success: false,
    message: 'Terlalu banyak operasi modifikasi, silakan coba lagi setelah 1 jam'
  },
  standardHeaders: true,
  legacyHeaders: false
}); 