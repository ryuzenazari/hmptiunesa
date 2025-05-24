const GalleryItem = require('../models/Gallery');

// Get all gallery items with filters and pagination
exports.getAllGalleryItems = async (req, res) => {
  try {
    const { page = 1, limit = 12, type, category, featured, search } = req.query;
    const query = {};
    
    // Filter berdasarkan tipe
    if (type) {
      query.type = type;
    }
    
    // Filter berdasarkan kategori
    if (category) {
      query.category = category;
    }
    
    // Filter item yang ditonjolkan
    if (featured === 'true') {
      query.featured = true;
    }
    
    // Search berdasarkan judul, deskripsi, atau tags
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 },
      populate: [
        { path: 'uploadedBy', select: 'nama email nim' },
        { path: 'contributors.user', select: 'nama email nim' },
        { path: 'metadata.event', select: 'title date' }
      ]
    };
    
    const galleryItems = await GalleryItem.find(query)
      .skip((options.page - 1) * options.limit)
      .limit(options.limit)
      .sort(options.sort)
      .populate(options.populate[0].path, options.populate[0].select)
      .populate(options.populate[1].path, options.populate[1].select)
      .populate(options.populate[2].path, options.populate[2].select);
    
    const total = await GalleryItem.countDocuments(query);
    
    res.status(200).json({
      galleryItems,
      totalPages: Math.ceil(total / options.limit),
      currentPage: options.page,
      totalItems: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
  }
};

// Get gallery item by ID
exports.getGalleryItemById = async (req, res) => {
  try {
    const itemId = req.params.id;
    
    const galleryItem = await GalleryItem.findById(itemId)
      .populate('uploadedBy', 'nama email nim')
      .populate('contributors.user', 'nama email nim')
      .populate('metadata.event', 'title date location');
    
    if (!galleryItem) {
      return res.status(404).json({ message: 'Item tidak ditemukan' });
    }
    
    res.status(200).json(galleryItem);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
  }
};

// Create new gallery item
exports.createGalleryItem = async (req, res) => {
  try {
    const itemData = req.body;
    
    // Tambahkan user yang mengupload
    itemData.uploadedBy = req.user.id;
    
    const galleryItem = await GalleryItem.create(itemData);
    
    res.status(201).json(galleryItem);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
  }
};

// Update gallery item
exports.updateGalleryItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const updateData = req.body;
    
    const galleryItem = await GalleryItem.findById(itemId);
    
    if (!galleryItem) {
      return res.status(404).json({ message: 'Item tidak ditemukan' });
    }
    
    // Cek apakah user adalah uploader atau admin
    if (galleryItem.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Tidak memiliki izin untuk mengubah item' });
    }
    
    const updatedItem = await GalleryItem.findByIdAndUpdate(
      itemId,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
  }
};

// Delete gallery item
exports.deleteGalleryItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    
    const galleryItem = await GalleryItem.findById(itemId);
    
    if (!galleryItem) {
      return res.status(404).json({ message: 'Item tidak ditemukan' });
    }
    
    // Cek apakah user adalah uploader atau admin
    if (galleryItem.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Tidak memiliki izin untuk menghapus item' });
    }
    
    await GalleryItem.findByIdAndDelete(itemId);
    
    res.status(200).json({ message: 'Item berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
  }
};

// Toggle featured status
exports.toggleFeatured = async (req, res) => {
  try {
    const itemId = req.params.id;
    
    const galleryItem = await GalleryItem.findById(itemId);
    
    if (!galleryItem) {
      return res.status(404).json({ message: 'Item tidak ditemukan' });
    }
    
    // Hanya admin yang boleh mengganti status featured
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Tidak memiliki izin untuk mengubah status featured' });
    }
    
    galleryItem.featured = !galleryItem.featured;
    await galleryItem.save();
    
    res.status(200).json({ 
      message: `Item ${galleryItem.featured ? 'ditonjolkan' : 'tidak ditonjolkan'}`,
      featured: galleryItem.featured
    });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
  }
};

// Get featured items
exports.getFeaturedItems = async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    
    const featuredItems = await GalleryItem.find({ featured: true })
      .limit(parseInt(limit, 10))
      .sort({ createdAt: -1 })
      .populate('uploadedBy', 'nama email nim');
    
    res.status(200).json(featuredItems);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
  }
}; 