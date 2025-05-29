<script setup lang="ts">
import { ref, onMounted } from 'vue'
import organizationData from '@/data/organization.json'

// Stats data dari file JSON
const statsData = ref(organizationData.statsData)

// Info Cards data dari file JSON
const infoData = ref(organizationData.infoData)

// Department data dari file JSON
const departments = ref(organizationData.departments)

// Program data dari file JSON
const programs = ref(organizationData.programs)

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

<template>
  <div class="organization-container">
    <!-- Hero Section dengan style yang sama dengan EventsView -->
    <section class="organization-hero">
      <div class="organization-hero-content">
        <h1>Profil Organisasi</h1>
        <p>
          Mengenal lebih dekat visi, misi, dan struktur Himpunan Mahasiswa Prodi Teknik Informatika
          UNESA
        </p>
      </div>
    </section>

    <div class="page-content">
      <!-- Stats Section dengan style yang diperbarui seperti EventsView -->
      <section class="filter-section">
        <div class="filter-container">
          <div class="stats-items">
            <div v-for="stat in statsData" :key="stat.id" class="stat-item">
              <div class="stat-number">{{ stat.number }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Tentang Kami -->
      <section class="about-section animate-on-scroll">
        <div class="section-header">
          <h2 class="section-title">Tentang HMP TI UNESA</h2>
          <div class="section-line"></div>
        </div>

        <div class="about-card">
          <div class="about-grid">
            <div class="about-image-container">
              <img
                src="@/assets/kegiatan/raker/raker2.jpg"
                alt="Foto Raker HMP TI UNESA"
                class="about-image"
              />
            </div>
            <div class="about-content">
              <p>
                Himpunan Mahasiswa Prodi Teknik Informatika Universitas Negeri Surabaya (HMP TI
                UNESA) adalah organisasi kemahasiswaan yang berfungsi sebagai wadah untuk
                mengembangkan kemampuan akademik, minat, bakat, dan kepemimpinan mahasiswa Teknik
                Informatika UNESA.
              </p>
              <p>
                Organisasi ini berperan dalam menjembatani komunikasi antara mahasiswa dengan
                jurusan, fakultas, dan universitas. HMP TI UNESA berusaha menciptakan lingkungan
                yang kondusif bagi pengembangan potensi mahasiswa Teknik Informatika dan
                berkontribusi aktif dalam kemajuan teknologi informasi.
              </p>
            </div>
          </div>

          <div class="info-cards">
            <div class="info-card" v-for="(info, index) in infoData" :key="index">
              <div class="info-icon">
                <i :class="info.icon"></i>
              </div>
              <div class="info-content">
                <h3>{{ info.title }}</h3>
                <p>{{ info.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Sejarah Organisasi -->
      <section class="history-section animate-on-scroll">
        <div class="section-header">
          <h2 class="section-title">Sejarah Organisasi</h2>
          <div class="section-line"></div>
        </div>

        <div class="history-card">
          <div class="history-image">
            <img src="@/assets/kegiatan/raker/raker1.jpg" alt="raker1" />
          </div>
          <div class="history-content">
            <h3>Cikal Bakal HMP TI UNESA</h3>
            <div class="history-text">
              <p>
                Himpunan Mahasiswa Prodi Teknik Informatika (HMP TI) UNESA merupakan pecahan dari
                Himpunan Mahasiswa Teknik Informatika (HIMTI) UNESA yang berdiri pada tahun 2015.
                Sejarah HIMTI UNESA dimulai sejalan dengan perkembangan Jurusan Teknik Informatika
                di Fakultas Teknik Universitas Negeri Surabaya.
              </p>
              <p>
                Jurusan Teknik Informatika UNESA didirikan sebagai respons terhadap kebutuhan akan
                tenaga profesional di bidang teknologi informasi dan komputer. Pada awalnya, jurusan
                ini menawarkan program studi Teknik Informatika yang berada di bawah Fakultas Teknik
                (FT) UNESA.
              </p>
              <p>
                Seiring berjalannya waktu, HIMTI UNESA berkembang pesat dan mengalami reorganisasi
                pada tahun 2024 menjadi tiga himpunan mahasiswa prodi terpisah, yaitu HMP TI
                (Himpunan Mahasiswa Prodi Teknik Informatika), HMP SI (Himpunan Mahasiswa Prodi
                Sistem Informasi), dan HMP PTI (Himpunan Mahasiswa Prodi Pendidikan Teknologi
                Informasi), sesuai dengan pembagian program studi di Jurusan Teknik Informatika
                UNESA.
              </p>
              <p>
                HMP TI UNESA sebagai organisasi kemahasiswaan prodi Teknik Informatika terus
                berkomitmen untuk menjadi wadah pengembangan potensi mahasiswa dan menjembatani
                aspirasi mahasiswa dengan pihak jurusan, fakultas, dan universitas.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Visi & Misi -->
      <section class="vision-mission-section animate-on-scroll">
        <div class="section-header">
          <h2 class="section-title">Visi & Misi</h2>
          <div class="section-line"></div>
        </div>

        <div class="vision-mission-container">
          <div class="vision-card">
            <h3>Visi</h3>
            <p>
              Menjadikan mahasiswa Prodi Teknik Informatika yang unggul secara akademik, inovatif,
              dan berdaya saing global melalui semangat kerja keras, kerja cerdas, kerja ikhlas, dan
              kerja tuntas.
            </p>
          </div>

          <div class="mission-card">
            <h3>Misi</h3>
            <ul>
              <li>
                Mendorong budaya inovasi di kalangan mahasiswa Teknik Informatika untuk menghasilkan
                karya yang kreatif dan solutif.
              </li>
              <li>
                Mengembangkan kompetensi mahasiswa agar mampu bersaing di tingkat nasional maupun
                internasional.
              </li>
              <li>
                Menanamkan nilai kerja keras, kerja cerdas, kerja ikhlas, dan kerja tuntas dalam
                setiap aktivitas mahasiswa Teknik Informatika.
              </li>
              <li>
                Memperkuat kekeluargaan dan kolaborasi antar mahasiswa Teknik Informatika untuk
                mencapai tujuan bersama.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Struktur Organisasi -->
      <section class="structure-section animate-on-scroll">
        <div class="section-header">
          <h2 class="section-title">Struktur Organisasi</h2>
          <div class="section-line"></div>
        </div>

        <div class="org-structure">
          <!-- Wakil Dekan 2 -->
          <div class="org-level">
            <div class="org-card top-position">
              <div class="org-photo">
                <img
                  src="https://staticsiakadu.unesa.ac.id/photo/dosen/086c2703-a718-432c-a487-19fd811a2de2.jpg"
                  alt="Wakil Dekan 1"
                />
              </div>
              <div class="org-info">
                <h3>Prof. Dr. Agus Wiyono, S.Pd., M.T.</h3>
                <p>
                  Wakil Dekan Bidang I<br />
                  <span style="font-size: 0.95em">
                    (Pembelajaran, Penelitian, dan Pengabdian Kepada Masyarakat, Kemahasiswaan, dan
                    Alumni)
                  </span>
                </p>
              </div>
            </div>
          </div>

          <!-- Pembina & Koor Prodi -->
          <div class="org-level vice-dean-line">
            <div class="org-card advisor">
              <div class="org-photo">
                <img
                  src="https://staticsiakadu.unesa.ac.id/photo/dosen/a773ae8f-82b3-4776-b261-431d91a72de4.jpg"
                  alt="Koordinator Prodi"
                />
              </div>
              <div class="org-info">
                <h3>Koordinator Prodi</h3>
                <p>Paramitha Nerisafitra, S.ST., M.Kom.</p>
              </div>
            </div>

            <div class="org-card advisor">
              <div class="org-photo">
                <img
                  src="https://staticsiakadu.unesa.ac.id/photo/dosen/f18fe67c-016b-41ac-99b7-dae03a9b7898.jpg"
                  alt="Pembina HMP TI"
                />
              </div>
              <div class="org-info">
                <h3>Pembina HMP TI</h3>
                <p>Ramadhan Cakra Wibawa, S.Pd., M.Kom.</p>
              </div>
            </div>
          </div>

          <!-- Ketua -->
          <div class="org-level chairman-line">
            <div class="org-card chairman">
              <div class="org-photo">
                <img
                  src="https://siakadu.unesa.ac.id/photo/fotomhs/23051204212.jpg"
                  alt="Ketua HMP TI"
                />
              </div>
              <div class="org-info">
                <h3>Ketua Himpunan</h3>
                <p>Diha Anfeu Nio Julaynda</p>
              </div>
            </div>
          </div>

          <!-- Wakil Ketua, Sekretaris, Bendahara -->
          <div class="org-level executive-team">
            <div class="org-card">
              <div class="org-photo">
                <img
                  src="https://siakadu.unesa.ac.id/photo/fotomhs/23051204145.jpg"
                  alt="Wakil Ketua HMP TI"
                />
              </div>
              <div class="org-info">
                <h3>Wakil Ketua</h3>
                <p>Muhammad Rafdi Fawwaz Nuralyf</p>
              </div>
            </div>
          </div>

          <!-- Sekretaris & Bendahara -->
          <div class="org-level secretary-treasurer">
            <div class="org-card">
              <div class="org-photo">
                <img
                  src="https://siakadu.unesa.ac.id/photo/fotomhs/23051204035.jpg"
                  alt="Sekretaris 1 HMP TI"
                />
              </div>
              <div class="org-info">
                <h3>Sekretaris 1</h3>
                <p>Masyita Ika Sahara</p>
              </div>
            </div>

            <div class="org-card">
              <div class="org-photo">
                <img
                  src="https://siakadu.unesa.ac.id/photo/fotomhs/24051204156.jpg"
                  alt="Sekretaris 2 HMP TI"
                />
              </div>
              <div class="org-info">
                <h3>Sekretaris 2</h3>
                <p>Desty Putri Puspitasari</p>
              </div>
            </div>

            <div class="org-card">
              <div class="org-photo">
                <img
                  src="https://siakadu.unesa.ac.id/photo/fotomhs/23051204171.jpg"
                  alt="Bendahara 1 HMP TI"
                />
              </div>
              <div class="org-info">
                <h3>Bendahara 1</h3>
                <p>Muhammad Iqbal Fikri Fadhlurrahman</p>
              </div>
            </div>

            <div class="org-card">
              <div class="org-photo">
                <img
                  src="https://siakadu.unesa.ac.id/photo/fotomhs/24051204112.jpg"
                  alt="Bendahara 2 HMP TI"
                />
              </div>
              <div class="org-info">
                <h3>Bendahara 2</h3>
                <p>Nuris Safira Rohmah</p>
              </div>
            </div>
          </div>

          <!-- Divisi -->
          <div class="org-level departments">
            <div v-for="(department, index) in departments" :key="index" class="department-card">
              <div class="org-info">
                <h3>{{ department.title }}</h3>
                <p>{{ department.coordinator }}</p>
                <div class="department-members">
                  <p class="members-title">Anggota:</p>
                  <ul>
                    <li v-for="(member, mIndex) in department.members" :key="mIndex">
                      {{ member }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Program Kerja -->
      <section class="programs-section animate-on-scroll">
        <div class="section-header">
          <h2 class="section-title">Program Kerja Unggulan</h2>
          <div class="section-line"></div>
        </div>

        <div class="programs-grid">
          <div class="program-card" v-for="(program, index) in programs" :key="index">
            <div class="program-icon">
              <i :class="program.icon"></i>
            </div>
            <h3>{{ program.title }}</h3>
            <p>{{ program.description }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* Container */
.organization-container {
  width: 100%;
  background-color: var(--background-light, #f8fafc);
  color: var(--text-color, #1e293b);
}

/* Hero Section - dibuat mirip dengan EventsView */
.organization-hero {
  background: linear-gradient(135deg, #002e54, #004680, #001830);
  color: white;
  padding: 5rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.organization-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc0MCcgaGVpZ2h0PSc0MCcgdmlld0JveD0nMCAwIDQwIDQwJz48cGF0aCBkPSdNMTkuOTk1IDBDOC43MSAwIDAgOC43MSAwIDE5Ljk5NVMzMy42NiA0MCAxOS45OTUgNDBTNDAgOC43MSA0MCAxOS45OTUgMjQuNTcgMCAxOS45OTUgMHptLjAwNSAyQTM1IDM1IDAgMCAxIDM4IDE5Ljk5IDE4IDE4IDAgMSAxIDIgMTkuOTkgMzUgMzUgMCAwIDEgMjAgMnonIGZpbGw9JyNmZmYnIGZpbGwtb3BhY2l0eT0nMC4wMycgZmlsbC1ydWxlPSdldmVub2RkJy8+PC9zdmc+');
  opacity: 0.15;
  z-index: 1;
}

.organization-hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
}

.organization-hero h1 {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;
}

.organization-hero h1::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(to right, orangered, #ff7e47);
  border-radius: 2px;
}

.organization-hero p {
  font-size: 1.25rem;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Page Content */
.page-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* Filter Section with Stats - diubah agar mirip EventsView */
.filter-section {
  margin-top: -4rem;
  margin-bottom: 3rem;
  position: relative;
  z-index: 10;
}

.filter-container {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem 2rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

.stats-items {
  display: flex;
  justify-content: space-around;
  gap: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: 800;
  color: #004680;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
}

/* Section Headers */
.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: #1e293b;
}

.section-line {
  width: 80px;
  height: 4px;
  background: linear-gradient(to right, #004680, #00a0e3);
  margin: 0 auto;
  border-radius: 2px;
}

/* About Section */
.about-section {
  margin-bottom: 4rem;
}

.about-card {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.about-card:hover {
  transform: translateY(-5px);
}

.about-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2.5rem;
  align-items: center;
  margin-bottom: 3rem;
}

.about-image-container {
  height: 100%;
  overflow: hidden;
  border-radius: 1rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

.about-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.about-image-container:hover .about-image {
  transform: scale(1.05);
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.about-content p {
  color: #64748b;
  line-height: 1.7;
  margin: 0;
}

/* Info Cards */
.info-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.info-card {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.4s ease,
    box-shadow 0.4s ease;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #f0f0f0;
}

.info-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 25px 35px -12px rgba(0, 0, 0, 0.15);
}

.info-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #004680, #00a0e3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 10px 15px -5px rgba(0, 70, 128, 0.3);
}

.info-content h3 {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 0.8rem;
  color: #1e293b;
}

.info-content p {
  color: #64748b;
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
}

/* History Section */
.history-section {
  margin-bottom: 4rem;
}

.history-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  display: grid;
  grid-template-columns: 1fr;
}

.history-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 30px 40px -15px rgba(0, 0, 0, 0.15);
}

.history-image {
  height: 350px;
  overflow: hidden;
  width: 100%;
}

.history-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.history-card:hover .history-image img {
  transform: scale(1.05);
}

.history-content {
  padding: 2.5rem;
}

.history-content h3 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #004680;
  position: relative;
  padding-bottom: 0.75rem;
}

.history-content h3::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 3px;
  background: linear-gradient(to right, #004680, #00a0e3);
}

.history-text {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.history-text p {
  color: #64748b;
  line-height: 1.7;
  margin: 0;
}

/* Vision & Mission */
.vision-mission-section {
  margin-bottom: 4rem;
}

.vision-mission-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 2.5rem;
}

.vision-card,
.mission-card {
  background: white;
  border-radius: 1rem;
  padding: 2.5rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.4s ease,
    box-shadow 0.4s ease;
}

.vision-card {
  background: linear-gradient(135deg, #004680, #00a0e3);
  color: white;
}

.vision-card:hover,
.mission-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 30px 40px -15px rgba(0, 0, 0, 0.15);
}

.vision-card h3,
.mission-card h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  position: relative;
  padding-bottom: 0.75rem;
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

.mission-card h3 {
  color: #004680;
}

.vision-card p {
  line-height: 1.7;
  margin: 0;
}

.mission-card ul {
  padding-left: 1.25rem;
  margin: 0;
}

.mission-card li {
  margin-bottom: 1rem;
  color: #64748b;
  line-height: 1.7;
}

/* Structure Section */
.structure-section {
  margin-bottom: 4rem;
}

.org-structure {
  background: white;
  border-radius: 1rem;
  padding: 2.5rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  position: relative;
}

.org-level {
  display: flex;
  justify-content: center;
  gap: 2.5rem;
  flex-wrap: wrap;
  position: relative;
}

.org-level::after {
  content: '';
  position: absolute;
  bottom: -1.5rem;
  left: 50%;
  height: 1.5rem;
  width: 2px;
  background-color: #004680;
  transform: translateX(-50%);
}

.org-level:last-child::after {
  display: none;
}

.vice-dean-line::before {
  content: '';
  position: absolute;
  top: -1.5rem;
  left: 50%;
  height: 1.5rem;
  width: 2px;
  background-color: #004680;
  transform: translateX(-50%);
}

.chairman-line::before {
  content: '';
  position: absolute;
  top: -1.5rem;
  left: 50%;
  height: 1.5rem;
  width: 2px;
  background-color: #004680;
  transform: translateX(-50%);
}

.org-card {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.4s ease,
    box-shadow 0.4s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 230px;
  position: relative;
  border: 1px solid #f0f0f0;
}

.org-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 25px 35px -12px rgba(0, 0, 0, 0.15);
}

.top-position {
  background: linear-gradient(135deg, #3a4b66, #003366);
  color: white;
  border: none;
}

.top-position .org-photo {
  border-color: white;
}

.top-position .org-info h3,
.top-position .org-info p,
.top-position .org-subtitle {
  color: white;
}

.advisor {
  background: linear-gradient(135deg, #004680, #076bab);
  color: white;
  border: none;
}

.advisor .org-photo {
  border-color: white;
}

.advisor .org-info h3,
.advisor .org-info p {
  color: white;
}

.org-subtitle {
  font-size: 0.8rem;
  opacity: 0.8;
  display: block;
  margin-top: 0.25rem;
}

.org-photo {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 1.5rem;
  border: 3px solid #004680;
  padding: 3px;
}

.org-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  border-radius: 50%;
  transition: transform 0.5s ease;
}

.org-card:hover .org-photo img {
  transform: scale(1.1);
}

.chairman {
  background: linear-gradient(135deg, #004680, #00a0e3);
  color: white;
  border: none;
}

.chairman .org-photo {
  border-color: white;
}

.chairman .org-info h3,
.chairman .org-info p {
  color: white;
}

.org-info h3 {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
  color: #004680;
}

.org-info p {
  margin: 0;
  color: #64748b;
}

.departments {
  flex-wrap: wrap;
  justify-content: center;
}

/* Style for departments with members */
.department-card {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.4s ease,
    box-shadow 0.4s ease;
  width: 100%;
  max-width: 500px;
  margin-bottom: 2rem;
  text-align: left;
  border: 1px solid #f0f0f0;
}

.department-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 25px 35px -12px rgba(0, 0, 0, 0.15);
}

.department-card h3 {
  color: #004680;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 0.5rem;
}

.department-card p {
  color: #1e293b;
  margin-bottom: 1rem;
}

.department-members {
  margin-top: 1rem;
}

.members-title {
  font-weight: 600;
  margin-bottom: 0.5rem !important;
  color: #1e293b;
}

.department-members ul {
  list-style: none;
  padding-left: 0.5rem;
  margin: 0;
}

.department-members li {
  padding: 0.25rem 0;
  color: #64748b;
  position: relative;
  padding-left: 1rem;
}

.department-members li:before {
  content: '•';
  color: #004680;
  position: absolute;
  left: 0;
}

/* Programs Section */
.programs-section {
  margin-bottom: 4rem;
}

.programs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2.5rem;
}

.program-card {
  background: white;
  border-radius: 1rem;
  padding: 2.5rem;
  box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.4s ease,
    box-shadow 0.4s ease;
  text-align: center;
  border: 1px solid #f0f0f0;
}

.program-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 25px 35px -12px rgba(0, 0, 0, 0.15);
}

.program-icon {
  font-size: 3rem;
  color: #004680;
  margin-bottom: 1.5rem;
}

.program-card h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1e293b;
}

.program-card p {
  color: #64748b;
  line-height: 1.6;
  margin: 0;
}

/* Icons */
.icon-calendar:before {
  content: '📅';
  font-style: normal;
}

.icon-users:before {
  content: '👥';
  font-style: normal;
}

.icon-award:before {
  content: '🏆';
  font-style: normal;
}

.icon-code:before {
  content: '💻';
  font-style: normal;
}

.icon-bulb:before {
  content: '💡';
  font-style: normal;
}

.icon-trophy:before {
  content: '🏆';
  font-style: normal;
}

.icon-heart:before {
  content: '❤️';
  font-style: normal;
}

/* Tambahan ikon untuk program kerja */
.icon-project:before {
  content: '📊';
  font-style: normal;
}

.icon-camp:before {
  content: '🏕️';
  font-style: normal;
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

/* Responsive Design */
@media (max-width: 1024px) {
  .vision-mission-container {
    grid-template-columns: 1fr;
  }

  .about-grid {
    grid-template-columns: 1fr;
  }

  .about-image-container {
    max-height: 350px;
  }

  .history-card {
    grid-template-columns: 1fr;
  }

  .secretary-treasurer {
    flex-wrap: wrap;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .organization-hero h1 {
    font-size: 2.5rem;
  }

  .organization-hero p {
    font-size: 1.1rem;
  }

  .filter-container {
    padding: 1.5rem 1rem;
  }

  .stats-items {
    flex-direction: column;
    gap: 1.5rem;
  }

  .info-cards,
  .programs-grid {
    grid-template-columns: 1fr;
  }

  .secretary-treasurer {
    flex-direction: row;
  }

  .secretary-treasurer .org-card {
    margin: 0.5rem;
    width: 180px;
  }

  .departments {
    flex-direction: column;
    align-items: center;
  }

  .section-title {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .organization-hero h1 {
    font-size: 2rem;
  }

  .org-level {
    gap: 1.5rem;
  }

  .org-card {
    width: 100%;
    max-width: 280px;
  }

  .department-card {
    max-width: 100%;
  }
}

/* Style secretary-treasurer level */
.secretary-treasurer {
  gap: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  margin: 0 auto;
  width: 100%;
  max-width: 1000px;
}

.secretary-treasurer .org-card {
  margin: 0.75rem;
  width: 200px;
  height: auto;
  min-height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 0 0 auto;
}

.secretary-treasurer .org-photo {
  width: 110px;
  height: 110px;
}

/* Tweaks untuk mobile */
@media (max-width: 360px) {
  .program-card {
    padding: 1.5rem;
  }

  .org-photo {
    width: 100px;
    height: 100px;
  }
}
</style>
