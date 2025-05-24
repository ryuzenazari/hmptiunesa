import { useState, useEffect } from 'react';
import galleryData from '../../data/gallery.json';
import FileUploader from '../../components/admin/FileUploader';

export default function GalleryManagement() {
  const [gallery, setGallery] = useState([]);
  const [filteredGallery, setFilteredGallery] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [imagePreview, setImagePreview] = useState(null);
  
  // Form state for gallery
  const [formData, setFormData] = useState({
    id: '',
    imageUrl: '',
    title: '',
    category: '',
    date: '',
    description: '',
    eventId: 1
  });

  useEffect(() => {
    // Load data
    setGallery(galleryData.galleryItems);
    setFilteredGallery(galleryData.galleryItems);
  }, []);

  useEffect(() => {
    // Filter and search
    const filtered = gallery.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'all' || item.category === filter;
      return matchesSearch && matchesFilter;
    });
    setFilteredGallery(filtered);
  }, [searchTerm, filter, gallery]);

  const handleAdd = () => {
    setSelectedImage(null);
    setFormData({
      id: gallery.length ? Math.max(...gallery.map(item => item.id)) + 1 : 1,
      imageUrl: '',
      title: '',
      category: 'events',
      date: formatDate(new Date()),
      description: '',
      eventId: 1
    });
    setImagePreview(null);
    setIsFormVisible(true);
  };

  const handleEdit = (image) => {
    setSelectedImage(image);
    setFormData({
      ...image,
    });
    setImagePreview(image.imageUrl);
    setIsFormVisible(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus gambar ini?')) {
      const updatedGallery = gallery.filter(item => item.id !== id);
      setGallery(updatedGallery);
      // In production, make API call to update the backend
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileUpload = ({ preview }) => {
    setImagePreview(preview);
    // In production, you would upload the file to a server
    // For now, just set the preview in the form data
    setFormData({
      ...formData,
      imageUrl: preview, // In real scenario, this would be the URL from server
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // If no image is uploaded and we are adding a new item, don't allow submission
    if (!formData.imageUrl && !selectedImage) {
      alert('Harap unggah gambar terlebih dahulu.');
      return;
    }
    
    if (selectedImage) {
      // Update existing gallery item
      const updatedGallery = gallery.map(item => 
        item.id === selectedImage.id ? formData : item
      );
      setGallery(updatedGallery);
    } else {
      // Add new gallery item
      setGallery([...gallery, formData]);
    }
    
    setIsFormVisible(false);
    // In production, make API call to update the backend
  };

  // Helper function to format date
  const formatDate = (date) => {
    return `${date.getDate()} ${getMonthName(date.getMonth())} ${date.getFullYear()}`;
  };

  const getMonthName = (monthIndex) => {
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return months[monthIndex];
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manajemen Galeri</h2>
        <button
          onClick={handleAdd}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Tambah Gambar Baru
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Cari gambar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            {galleryData.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {filteredGallery.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="h-48 relative">
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
            <div className="p-3">
              <h3 className="font-medium truncate">{item.title}</h3>
              <p className="text-sm text-gray-600 truncate">{item.date}</p>
              <p className="text-xs text-gray-500 mt-1">
                {galleryData.categories.find(cat => cat.id === item.category)?.name || item.category}
              </p>
            </div>
          </div>
        ))}

        {filteredGallery.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            Tidak ada gambar yang ditemukan
          </div>
        )}
      </div>

      {/* Form Modal */}
      {isFormVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {selectedImage ? 'Edit Gambar' : 'Tambah Gambar Baru'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              {/* Image Upload */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Gambar</label>
                {imagePreview ? (
                  <div className="relative mb-2">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-64 object-contain border rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData({ ...formData, imageUrl: '' });
                      }}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <FileUploader 
                    onFileUpload={handleFileUpload} 
                    acceptedTypes="image/jpeg,image/png,image/jpg,image/gif"
                    maxSizeMB={2}
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Judul</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Kategori</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    {galleryData.categories.filter(cat => cat.id !== 'all').map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tanggal</label>
                  <input
                    type="text"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                    placeholder="Format: 15 Mei 2024"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">ID Event</label>
                  <input
                    type="number"
                    name="eventId"
                    value={formData.eventId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Deskripsi</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md h-20"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormVisible(false)}
                  className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {selectedImage ? 'Perbarui' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 