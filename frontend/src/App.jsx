import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Public pages imports
// ... import existing public pages here

// Admin pages imports
import AdminLogin from './pages/admin/Login';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import DosenManagement from './pages/admin/DosenManagement';
import EventManagement from './pages/admin/EventManagement';

// Placeholder for other admin pages
const FungsionarisManagement = () => <div>Manajemen Fungsionaris</div>;
const GalleryManagement = () => <div>Manajemen Galeri</div>;
const HomeManagement = () => <div>Manajemen Konten Beranda</div>;
const MembersManagement = () => <div>Manajemen Anggota</div>;
const NewsManagement = () => <div>Manajemen Berita</div>;
const OrganizationManagement = () => <div>Manajemen Organisasi</div>;
const ProjectsManagement = () => <div>Manajemen Proyek</div>;

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        {/* ... existing public routes */}
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="dosen" element={<DosenManagement />} />
          <Route path="events" element={<EventManagement />} />
          <Route path="fungsionaris" element={<FungsionarisManagement />} />
          <Route path="gallery" element={<GalleryManagement />} />
          <Route path="home" element={<HomeManagement />} />
          <Route path="members" element={<MembersManagement />} />
          <Route path="news" element={<NewsManagement />} />
          <Route path="organization" element={<OrganizationManagement />} />
          <Route path="projects" element={<ProjectsManagement />} />
          
          {/* Default redirect for /admin */}
          <Route index element={<AdminDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App; 