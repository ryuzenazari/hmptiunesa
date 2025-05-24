import { useState, useEffect } from 'react';
import fungsionarisData from '../../data/fungsionaris.json';

export default function FungsionarisManagement() {
  const [fungsionaris, setFungsionaris] = useState([]);
  const [filteredFungsionaris, setFilteredFungsionaris] = useState([]);
  const [selectedFungsionaris, setSelectedFungsionaris] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    id: '',
    nama: '',
    nim: '',
    angkatan: '',
    jabatan: '',
    departemen: '',
    email: '',
    foto: '',
    fotoPos: 'center 20%',
    sosmed: '',
    instagram: '',
    linkedin: '',
    github: '',
    deskripsi: '',
    prestasi: [''],
    keahlian: [''],
    kontak: ''
  });

  useEffect(() => {
    // Load data
    setFungsionaris(fungsionarisData.fungsionarisList);
    setFilteredFungsionaris(fungsionarisData.fungsionarisList);
  }, []);

  useEffect(() => {
    // Filter and search
    const filtered = fungsionaris.filter(item => {
      const matchesSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.nim.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.jabatan.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === '' || item.departemen === filter;
      return matchesSearch && matchesFilter;
    });
    setFilteredFungsionaris(filtered);
  }, [searchTerm, filter, fungsionaris]);

  const handleAdd = () => {
    setSelectedFungsionaris(null);
    setFormData({
      id: fungsionaris.length ? Math.max(...fungsionaris.map(item => item.id)) + 1 : 1,
      nama: '',
      nim: '',
      angkatan: new Date().getFullYear().toString(),
      jabatan: '',
      departemen: 'BPH',
      email: '',
      foto: '',
      fotoPos: 'center 20%',
      sosmed: '',
      instagram: '',
      linkedin: '',
      github: '',
      deskripsi: '',
      prestasi: [''],
      keahlian: [''],
      kontak: ''
    });
    setIsFormVisible(true);
  };

  const handleEdit = (fungsionaris) => {
    setSelectedFungsionaris(fungsionaris);
    setFormData({
      ...fungsionaris,
      prestasi: fungsionaris.prestasi || [''],
      keahlian: fungsionaris.keahlian || ['']
    });
    setIsFormVisible(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data fungsionaris ini?')) {
      const updatedFungsionaris = fungsionaris.filter(item => item.id !== id);
      setFungsionaris(updatedFungsionaris);
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

  const handleArrayInputChange = (type, index, value) => {
    const updatedArray = [...formData[type]];
    updatedArray[index] = value;
    setFormData({
      ...formData,
      [type]: updatedArray,
    });
  };

  const addArrayItem = (type) => {
    setFormData({
      ...formData,
      [type]: [...formData[type], ''],
    });
  };

  const removeArrayItem = (type, index) => {
    const updatedArray = [...formData[type]];
    updatedArray.splice(index, 1);
    setFormData({
      ...formData,
      [type]: updatedArray,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (selectedFungsionaris) {
      // Update existing fungsionaris
      const updatedFungsionaris = fungsionaris.map(item => 
        item.id === selectedFungsionaris.id ? formData : item
      );
      setFungsionaris(updatedFungsionaris);
    } else {
      // Add new fungsionaris
      setFungsionaris([...fungsionaris, formData]);
    }
    
    setIsFormVisible(false);
    // In production, make API call to update the backend
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manajemen Fungsionaris</h2>
        <button
          onClick={handleAdd}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Tambah Fungsionaris Baru
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Cari nama, NIM, atau jabatan..."
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
            {fungsionarisData.departemenCategories.map((departemen) => (
              <option key={departemen.id} value={departemen.id}>
                {departemen.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Fungsionaris List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Nama</th>
              <th className="py-3 px-4">NIM</th>
              <th className="py-3 px-4">Jabatan</th>
              <th className="py-3 px-4">Departemen</th>
              <th className="py-3 px-4">Angkatan</th>
              <th className="py-3 px-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredFungsionaris.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="py-3 px-4">{item.id}</td>
                <td className="py-3 px-4">{item.nama}</td>
                <td className="py-3 px-4">{item.nim}</td>
                <td className="py-3 px-4">{item.jabatan}</td>
                <td className="py-3 px-4">{item.departemen}</td>
                <td className="py-3 px-4">{item.angkatan}</td>
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

            {filteredFungsionaris.length === 0 && (
              <tr>
                <td colSpan="7" className="py-4 px-4 text-center">
                  Tidak ada data fungsionaris yang ditemukan
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
              {selectedFungsionaris ? 'Edit Data Fungsionaris' : 'Tambah Fungsionaris Baru'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nama</label>
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">NIM</label>
                  <input
                    type="text"
                    name="nim"
                    value={formData.nim}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Angkatan</label>
                  <input
                    type="text"
                    name="angkatan"
                    value={formData.angkatan}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Jabatan</label>
                  <input
                    type="text"
                    name="jabatan"
                    value={formData.jabatan}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Departemen</label>
                  <select
                    name="departemen"
                    value={formData.departemen}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    {fungsionarisData.departemenCategories.filter(dep => dep.id !== '').map((departemen) => (
                      <option key={departemen.id} value={departemen.id}>
                        {departemen.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">URL Foto</label>
                  <input
                    type="text"
                    name="foto"
                    value={formData.foto}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Posisi Foto</label>
                  <input
                    type="text"
                    name="fotoPos"
                    value={formData.fotoPos}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Instagram</label>
                  <input
                    type="text"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">LinkedIn</label>
                  <input
                    type="text"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">GitHub</label>
                  <input
                    type="text"
                    name="github"
                    value={formData.github}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Kontak</label>
                  <input
                    type="text"
                    name="kontak"
                    value={formData.kontak}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Deskripsi</label>
                  <textarea
                    name="deskripsi"
                    value={formData.deskripsi}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md h-24"
                  />
                </div>
              </div>

              {/* Prestasi Array */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Prestasi</label>
                {formData.prestasi.map((prestasi, index) => (
                  <div key={`prestasi-${index}`} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={prestasi}
                      onChange={(e) => handleArrayInputChange('prestasi', index, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Masukkan prestasi"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('prestasi', index)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('prestasi')}
                  className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded text-sm"
                >
                  + Tambah Prestasi
                </button>
              </div>

              {/* Keahlian Array */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Keahlian</label>
                {formData.keahlian.map((keahlian, index) => (
                  <div key={`keahlian-${index}`} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={keahlian}
                      onChange={(e) => handleArrayInputChange('keahlian', index, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Masukkan keahlian"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('keahlian', index)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('keahlian')}
                  className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded text-sm"
                >
                  + Tambah Keahlian
                </button>
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
                  {selectedFungsionaris ? 'Perbarui' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 