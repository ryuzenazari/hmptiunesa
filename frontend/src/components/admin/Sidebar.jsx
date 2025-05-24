import { Link, useLocation } from 'react-router-dom';

export default function AdminSidebar() {
  const location = useLocation();
  
  const menuItems = [
    { name: 'Dashboard', icon: '📊', path: '/admin/dashboard' },
    { name: 'Dosen', icon: '👨‍🏫', path: '/admin/dosen' },
    { name: 'Events', icon: '📅', path: '/admin/events' },
    { name: 'Fungsionaris', icon: '👥', path: '/admin/fungsionaris' },
    { name: 'Gallery', icon: '🖼️', path: '/admin/gallery' },
    { name: 'Home Content', icon: '🏠', path: '/admin/home' },
    { name: 'Members', icon: '👤', path: '/admin/members' },
    { name: 'News', icon: '📰', path: '/admin/news' },
    { name: 'Organization', icon: '🏢', path: '/admin/organization' },
    { name: 'Projects', icon: '💼', path: '/admin/projects' },
  ];

  return (
    <div className="bg-gray-800 text-white h-screen w-64 fixed left-0 top-0 overflow-y-auto">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">Admin HMP TI</h2>
        <p className="text-xs text-gray-400">Sistem Manajemen Website</p>
      </div>

      <nav className="mt-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 ${
                  location.pathname === item.path
                    ? 'bg-blue-600'
                    : 'hover:bg-gray-700'
                } transition-colors`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-700">
        <div className="text-xs text-gray-400 mb-2">Login sebagai:</div>
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-2">
            A
          </div>
          <div>
            <div className="font-medium">Admin</div>
            <div className="text-xs text-gray-400">admin@hmptiunesa.ac.id</div>
          </div>
        </div>
      </div>
    </div>
  );
} 