const News = require('../models/News');

// Get all news with filters and pagination
exports.getAllNews = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, status, search } = req.query;
    const query = {};
    
    // Default hanya tampilkan berita yang published
    query.status = status || 'published';
    
    // Filter berdasarkan kategori
    if (category) {
      query.category = category;
    }
    
    // Search berdasarkan judul atau konten
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } }
      ];
    }
    
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { publishDate: -1 },
      populate: { path: 'author', select: 'nama email nim' }
    };
    
    const news = await News.find(query)
      .skip((options.page - 1) * options.limit)
      .limit(options.limit)
      .sort(options.sort)
      .populate(options.populate.path, options.populate.select);
    
    const total = await News.countDocuments(query);
    
    res.status(200).json({
      news,
      totalPages: Math.ceil(total / options.limit),
      currentPage: options.page,
      totalNews: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
  }
};

// Get news by ID
exports.getNewsById = async (req, res) => {
  try {
    const newsId = req.params.id;
    
    const news = await News.findById(newsId)
      .populate('author', 'nama email nim');
    
    if (!news) {
      return res.status(404).json({ message: 'Berita tidak ditemukan' });
    }
    
    // Increment view count
    news.viewCount += 1;
    await news.save();
    
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
  }
};

// Create new news
exports.createNews = async (req, res) => {
  try {
    const newsData = req.body;
    
    // Tambahkan user yang membuat sebagai author
    newsData.author = req.user.id;
    
    // Jika tidak ada status, set ke draft
    if (!newsData.status) {
      newsData.status = 'draft';
    }
    
    // Set tanggal publish
    if (newsData.status === 'published' && !newsData.publishDate) {
      newsData.publishDate = new Date();
    }
    
    const news = await News.create(newsData);
    
    res.status(201).json(news);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
  }
};

// Update news
exports.updateNews = async (req, res) => {
  try {
    const newsId = req.params.id;
    const updateData = req.body;
    
    const news = await News.findById(newsId);
    
    if (!news) {
      return res.status(404).json({ message: 'Berita tidak ditemukan' });
    }
    
    // Cek apakah user adalah author atau admin
    if (news.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Tidak memiliki izin untuk mengubah berita' });
    }
    
    // Jika status berubah ke published, set tanggal publish
    if (updateData.status === 'published' && news.status !== 'published') {
      updateData.publishDate = new Date();
    }
    
    const updatedNews = await News.findByIdAndUpdate(
      newsId,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.status(200).json(updatedNews);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
  }
};

// Delete news
exports.deleteNews = async (req, res) => {
  try {
    const newsId = req.params.id;
    
    const news = await News.findById(newsId);
    
    if (!news) {
      return res.status(404).json({ message: 'Berita tidak ditemukan' });
    }
    
    // Cek apakah user adalah author atau admin
    if (news.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Tidak memiliki izin untuk menghapus berita' });
    }
    
    await News.findByIdAndDelete(newsId);
    
    res.status(200).json({ message: 'Berita berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
  }
};

// Get news by category
exports.getNewsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const query = {
      category,
      status: 'published'
    };
    
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { publishDate: -1 },
      populate: { path: 'author', select: 'nama email nim' }
    };
    
    const news = await News.find(query)
      .skip((options.page - 1) * options.limit)
      .limit(options.limit)
      .sort(options.sort)
      .populate(options.populate.path, options.populate.select);
    
    const total = await News.countDocuments(query);
    
    res.status(200).json({
      news,
      totalPages: Math.ceil(total / options.limit),
      currentPage: options.page,
      totalNews: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
  }
}; 