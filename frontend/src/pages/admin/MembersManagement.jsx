import { useState, useEffect } from 'react';
import membersData from '../../data/members.json';

export default function MembersManagement() {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  
  // Form state
  const [formData, setFormData] = useState({
    id: '',
    nama: '',
    nim: '',
    angkatan: '',
    email: '',
    foto: '',
    instagram: '',
    linkedin: '',
    github: '',
    deskripsi: '',
    prestasi: [''],
    keahlian: [''],
    kontak: '',
    status: 'aktif',
    jenisKelamin: ''
  });

  useEffect(() => {
    // Load data
    setMembers(membersData.membersList);
    setFilteredMembers(membersData.membersList);
  }, []);

  useEffect(() => {
    // Filter and search
    const filtered = members.filter(item => {
      const matchesSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.nim.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'all' || item.status === filter;
      return matchesSearch && matchesFilter;
    });
    setFilteredMembers(filtered);
  }, [searchTerm, filter, members]);

  const handleAdd = () => {
    setSelectedMember(null);
    setFormData({
      id: members.length ? Math.max(...members.map(item => item.id)) + 1 : 1,
      nama: '',
      nim: '',
      angkatan: new Date().getFullYear().toString(),
      email: '',
      foto: '',
      instagram: '',
      linkedin: '',
      github: '',
      deskripsi: '',
      prestasi: [''],
      keahlian: [''],
      kontak: '',
      status: 'aktif',
      jenisKelamin: ''
    });
    setIsFormVisible(true);
  };

  const handleEdit = (member) => {
    setSelectedMember(member);
    setFormData({
      ...member,
      prestasi: member.prestasi?.length ? member.prestasi : [''],
      keahlian: member.keahlian?.length ? member.keahlian : ['']
    });
    setIsFormVisible(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data anggota ini?')) {
      const updatedMembers = members.filter(item => item.id !== id);
      setMembers(updatedMembers);
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
    
    if (selectedMember) {
      // Update existing member
      const updatedMembers = members.map(item => 
        item.id === selectedMember.id ? formData : item
      );
      setMembers(updatedMembers);
    } else {
      // Add new member
      setMembers([...members, formData]);
    }
    
    setIsFormVisible(false);
    // In production, make API call to update the backend
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manajemen Anggota</h2>
        <button
          onClick={handleAdd}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Tambah Anggota Baru
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Cari nama atau NIM..."
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
            <option value="all">Semua Status</option>
            <option value="aktif">Aktif</option>
            <option value="alumni">Alumni</option>
            <option value="cuti">Cuti</option>
            <option value="mengundurkan diri">Mengundurkan Diri</option>
          </select>
        </div>
      </div>

      {/* Members List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Nama</th>
              <th className="py-3 px-4">NIM</th>
              <th className="py-3 px-4">Angkatan</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Jenis Kelamin</th>
              <th className="py-3 px-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="py-3 px-4">{item.id}</td>
                <td className="py-3 px-4">{item.nama}</td>
                <td className="py-3 px-4">{item.nim}</td>
                <td className="py-3 px-4">{item.angkatan}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    item.status === 'aktif' ? 'bg-green-100 text-green-800' :
                    item.status === 'alumni' ? 'bg-blue-100 text-blue-800' :
                    item.status === 'cuti' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="py-3 px-4">{item.jenisKelamin}</td>
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

            {filteredMembers.length === 0 && (
              <tr>
                <td colSpan="7" className="py-4 px-4 text-center">
                  Tidak ada data anggota yang ditemukan
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
              {selectedMember ? 'Edit Data Anggota' : 'Tambah Anggota Baru'}
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
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="aktif">Aktif</option>
                    <option value="alumni">Alumni</option>
                    <option value="cuti">Cuti</option>
                    <option value="mengundurkan diri">Mengundurkan Diri</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Jenis Kelamin</label>
                  <select
                    name="jenisKelamin"
                    value={formData.jenisKelamin}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Pilih Jenis Kelamin</option>
                    <option value="Laki - Laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">URL Foto</label>
                  <input
                    type="text"
                    name="foto"
                    value={formData.foto}
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
                  {selectedMember ? 'Perbarui' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 