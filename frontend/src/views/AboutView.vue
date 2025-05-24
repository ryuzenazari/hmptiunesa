<template>
  <div class="about-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="hero-badge">HMP TI</div>
        <h1 class="hero-title">Tentang HMP TI UNESA</h1>
        <p class="hero-subtitle">
          Mengenal lebih dekat Himpunan Mahasiswa Prodi Teknik Informatika UNESA
        </p>
      </div>
    </section>

    <div class="page-content">
      <!-- Stats Section -->
      <section class="stats-section">
        <div class="stats-container">
          <div class="stat-item">
            <div class="stat-number">200+</div>
            <div class="stat-label">Total Anggota</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">2005</div>
            <div class="stat-label">Tahun Berdiri</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">20+</div>
            <div class="stat-label">Program Kerja Tahunan</div>
          </div>
        </div>
      </section>

      <!-- Main Content -->
      <main class="main-content">
        <!-- Visi & Misi Section -->
        <section class="about-section animate-on-scroll">
          <div class="section-header">
            <h2 class="section-title">Visi dan Misi</h2>
            <div class="section-line"></div>
          </div>

          <div class="vision-mission-container">
            <div class="vision-card">
              <h3>Visi</h3>
              <p>
                Menjadikan Himpunan Mahasiswa Prodi Teknik Informatika UNESA sebagai wadah yang
                profesional dalam pengembangan kemampuan akademik dan non-akademik anggotanya serta
                berperan aktif dalam pengembangan teknologi informasi untuk masyarakat.
              </p>
            </div>

            <div class="mission-card">
              <h3>Misi</h3>
              <ul>
                <li>
                  Meningkatkan kualitas dan kuantitas kegiatan yang berfokus pada pengembangan hard
                  skill dan soft skill anggota
                </li>
                <li>
                  Membangun hubungan kerjasama yang baik dengan berbagai pihak baik internal maupun
                  eksternal
                </li>
                <li>Mengembangkan potensi dan minat anggota dalam bidang teknologi informasi</li>
                <li>
                  Mengadakan kegiatan pengabdian kepada masyarakat yang berkaitan dengan teknologi
                  informasi
                </li>
                <li>Mendukung kebijakan kampus dalam pengembangan akademik dan kemahasiswaan</li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Sejarah Section -->
        <section class="history-section animate-on-scroll">
          <div class="section-header">
            <h2 class="section-title">Sejarah HMP TI</h2>
            <div class="section-line"></div>
          </div>

          <div class="history-content">
            <div class="history-image">
              <img src="https://picsum.photos/id/20/800/600" alt="Sejarah HMP TI" />
            </div>
            <div class="history-text">
              <p>
                Himpunan Mahasiswa Prodi Teknik Informatika Universitas Negeri Surabaya (HMP TI
                UNESA) didirikan pada tahun 2005 sebagai wadah aspirasi dan kegiatan mahasiswa
                Teknik Informatika UNESA.
              </p>

              <p>
                Berawal dari sekelompok mahasiswa angkatan pertama program studi Teknik Informatika
                yang memiliki visi untuk menciptakan lingkungan akademik yang kondusif dan
                profesional, HMP TI terus berkembang hingga saat ini.
              </p>

              <p>
                Selama perjalanannya, HMP TI telah menyelenggarakan berbagai kegiatan seperti
                seminar teknologi, workshop keterampilan, kompetisi pemrograman, bakti sosial, dan
                kegiatan pengembangan soft skill lainnya yang bermanfaat bagi mahasiswa dan
                masyarakat luas.
              </p>

              <p>
                Kini, HMP TI UNESA telah menjadi salah satu organisasi kemahasiswaan yang solid dan
                berpengaruh di Fakultas Teknik UNESA dengan berbagai prestasi baik di tingkat
                regional maupun nasional.
              </p>
            </div>
          </div>
        </section>

        <!-- Struktur Organisasi Section -->
        <section class="organization-section animate-on-scroll">
          <div class="section-header">
            <h2 class="section-title">Struktur Organisasi</h2>
            <div class="section-line"></div>
          </div>

          <div class="org-structure">
            <div class="org-chart">
              <div class="org-box main-box">
                <h4>Ketua & Wakil Ketua</h4>
                <p>Kepemimpinan dan Koordinasi</p>
              </div>

              <div class="org-branches">
                <div class="org-box branch-box">
                  <h4>Sekretaris</h4>
                  <p>Administrasi & Dokumentasi</p>
                </div>

                <div class="org-box branch-box">
                  <h4>Bendahara</h4>
                  <p>Keuangan & Pendanaan</p>
                </div>

                <div class="org-box branch-box">
                  <h4>Divisi Akademik</h4>
                  <p>Pengembangan Hard Skill</p>
                </div>

                <div class="org-box branch-box">
                  <h4>Divisi Humas</h4>
                  <p>Komunikasi & Kerjasama</p>
                </div>

                <div class="org-box branch-box">
                  <h4>Divisi PSDM</h4>
                  <p>Pengembangan Anggota</p>
                </div>

                <div class="org-box branch-box">
                  <h4>Divisi Minat Bakat</h4>
                  <p>Kompetisi & Kreativitas</p>
                </div>
              </div>
            </div>
          </div>

          <div class="cta-section">
            <router-link to="/fungsionaris" class="cta-button">Lihat Kepengurusan</router-link>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
:root {
  --primary-color: #3b82f6;
  --primary-dark: #2563eb;
  --secondary-color: #7c3aed;
  --accent-color: #f97316;
  --background: #f8fafc;
  --card-bg: #ffffff;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --text-light: #94a3b8;
  --border-color: #e2e8f0;
}

.about-page {
  width: 100%;
  background-color: var(--background);
  color: var(--text-primary);
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* ---------- Hero Section ---------- */
.hero {
  position: relative;
  height: 50vh;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background: linear-gradient(120deg, #2563eb, #7c3aed);
  overflow: hidden;
  margin-bottom: 5rem;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fHN0dWRlbnRzJTIwZXZlbnR8ZW58MHwwfDB8fA%3D%3D&auto=format&fit=crop&w=1170&q=80')
    center/cover;
  opacity: 0.15;
  z-index: 1;
}

.hero-content {
  position: relative;
  max-width: 900px;
  text-align: center;
  color: white;
  z-index: 2;
  padding: 0 1rem;
}

.hero-badge {
  display: inline-block;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  margin-bottom: 1.5rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.hero-title {
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.3;
  background: linear-gradient(to right, #ffffff, #f0f9ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero-subtitle {
  font-size: 1.5rem;
  line-height: 1.5;
  margin-bottom: 2.5rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  color: rgba(255, 255, 255, 0.9);
}

/* Page Content */
.page-content {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* ---------- Stats Section ---------- */
.stats-section {
  position: absolute;
  top: -9.4rem;
  left: 0;
  right: 0;
  z-index: 10;
}

.stats-container {
  display: flex;
  gap: 2.5rem;
  justify-content: center;
  background-color: white;
  border-radius: 1rem;
  padding: 2rem 3rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: 800;
  color: var(--primary-color);
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* ---------- Main Content ---------- */
.main-content {
  margin-top: 3rem;
  padding-top: 2rem;
}

/* Section Header */
.section-header {
  text-align: center;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.section-line {
  width: 80px;
  height: 4px;
  background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
  margin: 0 auto;
  border-radius: 2px;
}

/* Visi Misi Section */
.about-section {
  margin-bottom: 5rem;
}

.vision-mission-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.vision-card,
.mission-card {
  background-color: white;
  border-radius: 1rem;
  padding: 2.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.vision-card:hover,
.mission-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.vision-card {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
}

.vision-card h3,
.mission-card h3 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  position: relative;
  padding-bottom: 1rem;
}

.vision-card h3::after,
.mission-card h3::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 3px;
  background-color: currentColor;
  opacity: 0.5;
}

.vision-card p {
  font-size: 1.1rem;
  line-height: 1.7;
}

.mission-card ul {
  padding-left: 1.25rem;
}

.mission-card li {
  margin-bottom: 1rem;
  font-size: 1.05rem;
  line-height: 1.5;
  color: var(--text-secondary);
}

/* History Section */
.history-section {
  margin-bottom: 5rem;
}

.history-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-top: 3rem;
}

.history-image {
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.history-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.history-image:hover img {
  transform: scale(1.05);
}

.history-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.history-text p {
  font-size: 1.05rem;
  line-height: 1.8;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

/* Organization Section */
.organization-section {
  margin-bottom: 5rem;
}

.org-structure {
  margin-top: 3rem;
  margin-bottom: 3rem;
}

.org-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.org-box {
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  text-align: center;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.org-box:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.main-box {
  width: 300px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  margin-bottom: 2rem;
  position: relative;
}

.main-box::after {
  content: '';
  position: absolute;
  width: 2px;
  height: 2rem;
  background-color: var(--border-color);
  bottom: -2rem;
  left: 50%;
  transform: translateX(-50%);
}

.org-branches {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  width: 100%;
}

.branch-box {
  position: relative;
}

.branch-box h4 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}

.branch-box p {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.cta-section {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.cta-button {
  display: inline-block;
  padding: 0.875rem 2rem;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  font-weight: 600;
  border-radius: 0.5rem;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

/* Animation classes */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition:
    opacity 0.8s ease,
    transform 0.8s ease;
}

.animate-in {
  opacity: 1;
  transform: translateY(0);
}

/* Responsive Styles */
@media (max-width: 1024px) {
  .stats-container {
    flex-wrap: wrap;
    width: 90%;
    justify-content: space-between;
    padding: 1.5rem;
  }

  .stat-item {
    flex: 1 1 45%;
    margin-bottom: 1rem;
  }

  .history-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .hero {
    margin-bottom: 7rem;
  }

  .hero-title {
    font-size: 3rem;
  }

  .hero-subtitle {
    font-size: 1.25rem;
  }

  .stats-section {
    position: relative;
    top: -6.5rem;
    margin-bottom: -3rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .main-box {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .hero {
    margin-bottom: 8rem;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-badge {
    font-size: 0.75rem;
  }

  .stats-section {
    top: -7.5rem;
    margin-bottom: -4rem;
  }

  .stats-container {
    flex-direction: column;
    align-items: center;
    padding: 1.5rem;
  }

  .stat-item {
    width: 100%;
    margin-bottom: 1.5rem;
  }

  .stat-item:last-child {
    margin-bottom: 0;
  }
}
</style>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  // Animasi scroll untuk elemen-elemen pada halaman
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in')
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  // Amati elemen yang akan dianimasikan
  document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    observer.observe(el)
  })
})
</script>
