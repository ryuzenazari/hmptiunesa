import { useState, useEffect } from 'react';
import dosenData from '../../data/dosen.json';

export default function DosenManagement() {
  const [dosen, setDosen] = useState([]);
  const [filteredDosen, setFilteredDosen] = useState([]);
  const [selectedDosen, setSelectedDosen] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  
  // Form state
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    specialization: '',
    email: '',
    nidn: '',
    bidang: 'ai',
    imageUrl: '',
    position: '',
    education: [''],
    research: [''],
    teaching: [''],
  });

  useEffect(() => {
    // Load data
    setDosen(dosenData.dosenItems);
    setFilteredDosen(dosenData.dosenItems);
  }, []);

  useEffect(() => {
    // Filter and search
    const filtered = dosen.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'all' || item.bidang === filter;
      return matchesSearch && matchesFilter;
    });
    setFilteredDosen(filtered);
  }, [searchTerm, filter, dosen]);

  const handleAdd = () => {
    setSelectedDosen(null);
    setFormData({
      id: dosen.length ? Math.max(...dosen.map(item => item.id)) + 1 : 1,
      name: '',
      specialization: '',
      email: '',
      nidn: '',
      bidang: 'ai',
      imageUrl: '',
      position: '',
      education: [''],
      research: [''],
      teaching: [''],
    });
    setIsFormVisible(true);
  };

  const handleEdit = (dosen) => {
    setSelectedDosen(dosen);
    setFormData({
      ...dosen,
      education: dosen.education || [''],
      research: dosen.research || [''],
      teaching: dosen.teaching || [''],
    });
    setIsFormVisible(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data dosen ini?')) {
      const updatedDosen = dosen.filter(item => item.id !== id);
      setDosen(updatedDosen);
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
    
    if (selectedDosen) {
      // Update existing dosen
      const updatedDosen = dosen.map(item => 
        item.id === selectedDosen.id ? formData : item
      );
      setDosen(updatedDosen);
    } else {
      // Add new dosen
      setDosen([...dosen, formData]);
    }
    
    setIsFormVisible(false);
    // In production, make API call to update the backend
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manajemen Data Dosen</h2>
        <button
          onClick={handleAdd}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Tambah Dosen Baru
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Cari dosen..."
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
            {dosenData.expertiseFields.map((field) => (
              <option key={field.id} value={field.id}>
                {field.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dosen List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Nama</th>
              <th className="py-3 px-4">Bidang Keahlian</th>
              <th className="py-3 px-4">NIDN</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredDosen.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="py-3 px-4">{item.id}</td>
                <td className="py-3 px-4">{item.name}</td>
                <td className="py-3 px-4">{item.specialization}</td>
                <td className="py-3 px-4">{item.nidn}</td>
                <td className="py-3 px-4">{item.email}</td>
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

            {filteredDosen.length === 0 && (
              <tr>
                <td colSpan="6" className="py-4 px-4 text-center">
                  Tidak ada data dosen yang ditemukan
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
              {selectedDosen ? 'Edit Data Dosen' : 'Tambah Dosen Baru'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nama</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Spesialisasi</label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
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
                  <label className="block text-sm font-medium mb-1">NIDN</label>
                  <input
                    type="text"
                    name="nidn"
                    value={formData.nidn}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Bidang Keahlian</label>
                  <select
                    name="bidang"
                    value={formData.bidang}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    {dosenData.expertiseFields.filter(field => field.id !== 'all').map((field) => (
                      <option key={field.id} value={field.id}>
                        {field.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">URL Foto</label>
                  <input
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Jabatan</label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              {/* Education Array */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Riwayat Pendidikan</label>
                {formData.education.map((edu, index) => (
                  <div key={`edu-${index}`} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={edu}
                      onChange={(e) => handleArrayInputChange('education', index, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('education', index)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('education')}
                  className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded text-sm"
                >
                  + Tambah Pendidikan
                </button>
              </div>

              {/* Research Array */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Penelitian</label>
                {formData.research.map((research, index) => (
                  <div key={`research-${index}`} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={research}
                      onChange={(e) => handleArrayInputChange('research', index, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('research', index)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('research')}
                  className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded text-sm"
                >
                  + Tambah Penelitian
                </button>
              </div>

              {/* Teaching Array */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Mata Kuliah</label>
                {formData.teaching.map((teaching, index) => (
                  <div key={`teaching-${index}`} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={teaching}
                      onChange={(e) => handleArrayInputChange('teaching', index, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('teaching', index)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('teaching')}
                  className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded text-sm"
                >
                  + Tambah Mata Kuliah
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
                  {selectedDosen ? 'Perbarui' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 