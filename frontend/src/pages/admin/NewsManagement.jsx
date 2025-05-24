import { useState, useEffect } from 'react';
import newsData from '../../data/news.json';

export default function NewsManagement() {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  
  // Form state
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    category: '',
    date: '',
    description: '',
    content: '',
    imageUrl: '',
    featured: false
  });

  useEffect(() => {
    // Load data
    setNews(newsData.newsItems);
    setFilteredNews(newsData.newsItems);
  }, []);

  useEffect(() => {
    // Filter and search
    const filtered = news.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'all' || item.category === filter;
      return matchesSearch && matchesFilter;
    });
    setFilteredNews(filtered);
  }, [searchTerm, filter, news]);

  const handleAdd = () => {
    setSelectedNews(null);
    setFormData({
      id: news.length ? Math.max(...news.map(item => item.id)) + 1 : 1,
      title: '',
      category: newsData.categories[0].id,
      date: formatDate(new Date()),
      description: '',
      content: '',
      imageUrl: '',
      featured: false
    });
    setIsFormVisible(true);
  };

  const handleEdit = (newsItem) => {
    setSelectedNews(newsItem);
    setFormData({
      ...newsItem
    });
    setIsFormVisible(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
      const updatedNews = news.filter(item => item.id !== id);
      setNews(updatedNews);
      // In production, make API call to update the backend
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (selectedNews) {
      // Update existing news
      const updatedNews = news.map(item => 
        item.id === selectedNews.id ? formData : item
      );
      setNews(updatedNews);
    } else {
      // Add new news
      setNews([...news, formData]);
    }
    
    setIsFormVisible(false);
    // In production, make API call to update the backend
  };

  // Helper function to format date as "DD Month YYYY"
  const formatDate = (date) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Intl.DateTimeFormat('id-ID', options).format(date);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manajemen Berita</h2>
        <button
          onClick={handleAdd}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Tambah Berita Baru
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Cari berita..."
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
            <option value="all">Semua Kategori</option>
            {newsData.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* News List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Judul</th>
              <th className="py-3 px-4">Kategori</th>
              <th className="py-3 px-4">Tanggal</th>
              <th className="py-3 px-4">Unggulan</th>
              <th className="py-3 px-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredNews.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="py-3 px-4">{item.id}</td>
                <td className="py-3 px-4">{item.title}</td>
                <td className="py-3 px-4">
                  {newsData.categories.find(cat => cat.id === item.category)?.name || item.category}
                </td>
                <td className="py-3 px-4">{item.date}</td>
                <td className="py-3 px-4">
                  {item.featured ? (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      Ya
                    </span>
                  ) : (
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                      Tidak
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 flex gap-2">
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
                </td>
              </tr>
            ))}

            {filteredNews.length === 0 && (
              <tr>
                <td colSpan="6" className="py-4 px-4 text-center">
                  Tidak ada berita yang ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Form Modal */}
      {isFormVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {selectedNews ? 'Edit Berita' : 'Tambah Berita Baru'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="md:col-span-2">
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
                    {newsData.categories.map((category) => (
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
                    placeholder="Contoh: 15 Mei 2023"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">URL Gambar</label>
                  <input
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Deskripsi Singkat</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md h-24"
                    required
                    placeholder="Deskripsi singkat yang akan muncul di halaman utama"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Konten Lengkap</label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md h-56"
                    required
                    placeholder="Konten lengkap berita. Mendukung tag HTML dasar seperti <br>, <b>, dll."
                  />
                </div>
                <div className="md:col-span-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="featured"
                      id="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                      Jadikan sebagai berita unggulan
                    </label>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Berita unggulan akan ditampilkan di bagian atas halaman berita
                  </p>
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
                  {selectedNews ? 'Perbarui' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 