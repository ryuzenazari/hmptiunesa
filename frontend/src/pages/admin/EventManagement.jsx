import { useState, useEffect } from 'react';
import eventsData from '../../data/events.json';

export default function EventManagement() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  
  // Form state for events
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    category: '',
    description: '',
    location: '',
    time: '',
    date: {
      day: '',
      month: '',
      year: ''
    },
    imageUrl: '',
    slots: {
      registered: 0,
      total: 0
    },
    speaker: '',
    level: '',
    htm: '',
    htm_note: '',
    formUrl: '',
    contacts: [
      {
        name: '',
        phone: ''
      }
    ]
  });

  useEffect(() => {
    // Load data
    setEvents(eventsData.eventItems);
    setFilteredEvents(eventsData.eventItems);
  }, []);

  useEffect(() => {
    // Filter and search
    const filtered = events.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'all' || item.category === filter;
      return matchesSearch && matchesFilter;
    });
    setFilteredEvents(filtered);
  }, [searchTerm, filter, events]);

  const handleAdd = () => {
    setSelectedEvent(null);
    setFormData({
      id: events.length ? Math.max(...events.map(item => item.id)) + 1 : 1,
      title: '',
      category: 'webinar',
      description: '',
      location: '',
      time: '',
      date: {
        day: '',
        month: '',
        year: ''
      },
      imageUrl: '',
      slots: {
        registered: 0,
        total: 0
      },
      speaker: '',
      level: '',
      htm: '',
      htm_note: '',
      formUrl: '',
      contacts: [
        {
          name: '',
          phone: ''
        }
      ]
    });
    setIsFormVisible(true);
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setFormData({
      ...event,
    });
    setIsFormVisible(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data kegiatan ini?')) {
      const updatedEvents = events.filter(item => item.id !== id);
      setEvents(updatedEvents);
      // In production, make API call to update the backend
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleContactChange = (index, field, value) => {
    const updatedContacts = [...formData.contacts];
    updatedContacts[index] = {
      ...updatedContacts[index],
      [field]: value
    };
    setFormData({
      ...formData,
      contacts: updatedContacts,
    });
  };

  const addContact = () => {
    setFormData({
      ...formData,
      contacts: [...formData.contacts, { name: '', phone: '' }],
    });
  };

  const removeContact = (index) => {
    const updatedContacts = [...formData.contacts];
    updatedContacts.splice(index, 1);
    setFormData({
      ...formData,
      contacts: updatedContacts,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (selectedEvent) {
      // Update existing event
      const updatedEvents = events.map(item => 
        item.id === selectedEvent.id ? formData : item
      );
      setEvents(updatedEvents);
    } else {
      // Add new event
      setEvents([...events, formData]);
    }
    
    setIsFormVisible(false);
    // In production, make API call to update the backend
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manajemen Kegiatan</h2>
        <button
          onClick={handleAdd}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Tambah Kegiatan Baru
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Cari kegiatan..."
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
            {eventsData.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Events List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Judul</th>
              <th className="py-3 px-4">Kategori</th>
              <th className="py-3 px-4">Tanggal</th>
              <th className="py-3 px-4">Lokasi</th>
              <th className="py-3 px-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="py-3 px-4">{item.id}</td>
                <td className="py-3 px-4">{item.title}</td>
                <td className="py-3 px-4">
                  {eventsData.categories.find(cat => cat.id === item.category)?.name || item.category}
                </td>
                <td className="py-3 px-4">
                  {`${item.date.day}/${item.date.month}/${item.date.year}`}
                </td>
                <td className="py-3 px-4">{item.location}</td>
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

            {filteredEvents.length === 0 && (
              <tr>
                <td colSpan="6" className="py-4 px-4 text-center">
                  Tidak ada data kegiatan yang ditemukan
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
              {selectedEvent ? 'Edit Data Kegiatan' : 'Tambah Kegiatan Baru'}
            </h3>
            
            <form onSubmit={handleSubmit}>
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
                    {eventsData.categories.filter(cat => cat.id !== 'all').map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Deskripsi</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md h-24"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Lokasi</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Waktu</label>
                  <input
                    type="text"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                    placeholder="08:00 - 15:00 WIB"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tanggal (Hari)</label>
                  <input
                    type="text"
                    name="date.day"
                    value={formData.date.day}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                    placeholder="31"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Bulan</label>
                  <input
                    type="text"
                    name="date.month"
                    value={formData.date.month}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                    placeholder="Jun"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tahun</label>
                  <input
                    type="text"
                    name="date.year"
                    value={formData.date.year}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                    placeholder="2025"
                  />
                </div>
                <div>
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
                <div>
                  <label className="block text-sm font-medium mb-1">Jumlah Terdaftar</label>
                  <input
                    type="number"
                    name="slots.registered"
                    value={formData.slots.registered}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Total Slot</label>
                  <input
                    type="number"
                    name="slots.total"
                    value={formData.slots.total}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Pembicara</label>
                  <input
                    type="text"
                    name="speaker"
                    value={formData.speaker}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Level</label>
                  <input
                    type="text"
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Pemula"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">HTM</label>
                  <input
                    type="text"
                    name="htm"
                    value={formData.htm}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Rp 50.000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Catatan HTM</label>
                  <input
                    type="text"
                    name="htm_note"
                    value={formData.htm_note}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">URL Formulir</label>
                  <input
                    type="text"
                    name="formUrl"
                    value={formData.formUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              {/* Contacts */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Kontak</label>
                {formData.contacts.map((contact, index) => (
                  <div key={`contact-${index}`} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={contact.name}
                      onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Nama"
                      required
                    />
                    <input
                      type="text"
                      value={contact.phone}
                      onChange={(e) => handleContactChange(index, 'phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="No. HP"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeContact(index)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addContact}
                  className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded text-sm"
                >
                  + Tambah Kontak
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
                  {selectedEvent ? 'Perbarui' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 