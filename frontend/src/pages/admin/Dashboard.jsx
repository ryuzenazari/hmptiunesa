import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    dosen: 0,
    events: 0,
    fungsionaris: 0,
    gallery: 0,
    members: 0,
    news: 0,
    projects: 0
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    // Check admin authentication
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (isLoggedIn !== 'true') {
      navigate('/admin/login');
    }
    
    // Fetch data statistics (in production, fetch from actual API)
    async function fetchStats() {
      try {
        // Demo data - in production, fetch actual counts from API
        setStats({
          dosen: 12,
          events: 2,
          fungsionaris: 34,
          gallery: 16,
          members: 120,
          news: 10,
          projects: 5
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    }
    
    fetchStats();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/admin/login');
  };

  const menuItems = [
    { name: 'Dosen', icon: '👨‍🏫', path: '/admin/dosen', count: stats.dosen },
    { name: 'Events', icon: '📅', path: '/admin/events', count: stats.events },
    { name: 'Fungsionaris', icon: '👥', path: '/admin/fungsionaris', count: stats.fungsionaris },
    { name: 'Gallery', icon: '🖼️', path: '/admin/gallery', count: stats.gallery },
    { name: 'Members', icon: '👤', path: '/admin/members', count: stats.members },
    { name: 'News', icon: '📰', path: '/admin/news', count: stats.news },
    { name: 'Projects', icon: '💼', path: '/admin/projects', count: stats.projects }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Admin Dashboard HMP TI</h1>
          <button
            onClick={handleLogout}
            className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Selamat Datang di Panel Admin</h2>
        
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-5">
                <div className="flex justify-between items-center">
                  <div className="text-3xl">{item.icon}</div>
                  <div className="text-2xl font-bold">{item.count}</div>
                </div>
                <h3 className="text-lg font-semibold mt-2">{item.name}</h3>
                <p className="text-sm text-gray-600 mt-1">Kelola {item.name}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Aktivitas Terbaru</h3>
          <div className="space-y-3">
            <div className="flex items-center py-2 border-b">
              <span className="text-green-500 mr-3">✓</span>
              <span>Event baru ditambahkan: LKMM TD</span>
              <span className="ml-auto text-sm text-gray-500">1 jam yang lalu</span>
            </div>
            <div className="flex items-center py-2 border-b">
              <span className="text-blue-500 mr-3">✎</span>
              <span>Data dosen diperbarui: Dr. Yuni Yamasari</span>
              <span className="ml-auto text-sm text-gray-500">3 jam yang lalu</span>
            </div>
            <div className="flex items-center py-2 border-b">
              <span className="text-red-500 mr-3">✕</span>
              <span>Foto dihapus dari galeri: Workshop UI/UX</span>
              <span className="ml-auto text-sm text-gray-500">1 hari yang lalu</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 