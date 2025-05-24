<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import dosenData from '@/data/dosen.json'

const route = useRoute()
const router = useRouter()

// Tab aktif
const activeTab = ref('profil')

// Fungsi untuk mengubah tab aktif
const setActiveTab = (tab: string) => {
  activeTab.value = tab
}

// Interface untuk data dosen
interface Publication {
  title: string
  journal: string
  year: number
  authors: string
  doi: string
  citations: number
}

interface Schedule {
  day: string
  time: string
  course: string
  location: string
}

interface Stats {
  publications: number
  citations: number
  h_index: number
  active_projects: number
}

interface Socials {
  scholar: string
  scopus: string
  sinta: string
}

interface DosenItem {
  id: number
  name: string
  specialization: string
  email: string
  nidn: string
  bidang: string
  imageUrl: string
  position?: string
  education?: string[]
  research?: string[]
  teaching?: string[]
  office_hours?: string
  room?: string
  phone?: string
  publications?: Publication[]
  schedule?: Schedule[]
  stats?: Stats
  socials?: Socials
}

// ID dosen dari parameter URL
const dosenId = computed(() => parseInt(route.params.id as string))

// Data dosen yang sedang dilihat
const dosen = ref<DosenItem | null>(null)

// Fungsi untuk kembali ke halaman daftar dosen
const goBack = () => {
  router.push('/dosen')
}

// Fungsi untuk membuka link eksternal
const openExternalLink = (url: string) => {
  window.open(url, '_blank')
}

onMounted(() => {
  // Cari dosen dengan ID yang sesuai dari data JSON
  const found = dosenData.dosenItems.find((item) => item.id === dosenId.value)

  if (found) {
    dosen.value = found
  } else {
    // Jika tidak ditemukan, kembali ke halaman daftar dosen
    router.push('/dosen')
  }

  // Animasi untuk elemen-elemen pada halaman
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
  setTimeout(() => {
    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el)
    })
  }, 100)
})
</script>

<template>
  <div v-if="dosen" class="dosen-detail-page">
    <!-- Hero Section -->
    <section class="dosen-hero">
      <div class="hero-overlay"></div>
      <button class="back-button" @click="goBack"><span class="back-arrow">←</span> Kembali</button>
      <div class="hero-content container">
        <h1 class="hero-title">{{ dosen.name }}</h1>
        <div class="hero-meta">
          <span class="meta-position">{{ dosen.position || 'Dosen' }}</span>
          <span class="meta-divider">•</span>
          <span class="meta-specialization">{{ dosen.specialization }}</span>
        </div>
      </div>
    </section>

    <div class="container">
      <div class="content-wrapper">
        <!-- Main Content -->
        <main class="dosen-content animate-on-scroll">
          <section class="dosen-profile-section">
            <div class="profile-header">
              <div class="profile-photo">
                <img :src="dosen.imageUrl" :alt="dosen.name" />
              </div>
              <div class="profile-info">
                <h2>{{ dosen.name }}</h2>
                <p class="profile-specialization">{{ dosen.specialization }}</p>
                <div class="profile-contact">
                  <div class="contact-item">
                    <i class="contact-icon">✉️</i>
                    <span>{{ dosen.email }}</span>
                  </div>
                  <div class="contact-item" v-if="dosen.phone">
                    <i class="contact-icon">📞</i>
                    <span>{{ dosen.phone }}</span>
                  </div>
                  <div class="contact-item" v-if="dosen.room">
                    <i class="contact-icon">🏢</i>
                    <span>{{ dosen.room }}</span>
                  </div>
                </div>
                <div class="profile-links" v-if="dosen.socials">
                  <a 
                    :href="dosen.socials.scholar" 
                    target="_blank" 
                    class="profile-link"
                    @click.prevent="openExternalLink(dosen.socials.scholar)"
                  >
                    <span class="link-icon">🎓</span>
                    Google Scholar
                  </a>
                  <a 
                    :href="dosen.socials.sinta" 
                    class="profile-link"
                    @click.prevent="openExternalLink(dosen.socials.sinta)"
                  >
                    <span class="link-icon">📝</span>
                    SINTA
                  </a>
                  <a 
                    :href="dosen.socials.scopus" 
                    class="profile-link"
                    @click.prevent="openExternalLink(dosen.socials.scopus)"
                  >
                    <span class="link-icon">🔗</span>
                    Scopus
                  </a>
                </div>
              </div>
            </div>
          </section>

          <div class="tabs-container">
            <div class="tabs">
              <button
                :class="['tab', { active: activeTab === 'profil' }]"
                @click="setActiveTab('profil')"
              >
                Profil
              </button>
              <button
                :class="['tab', { active: activeTab === 'publikasi' }]"
                @click="setActiveTab('publikasi')"
                :disabled="!dosen.publications?.length"
              >
                Publikasi
              </button>
              <button
                :class="['tab', { active: activeTab === 'pengajaran' }]"
                @click="setActiveTab('pengajaran')"
                :disabled="!dosen.teaching?.length"
              >
                Pengajaran
              </button>
            </div>

            <div class="tab-content">
              <section class="bio-section" v-show="activeTab === 'profil'">
                <h3 class="section-title">Riwayat Pendidikan</h3>
                <ul class="education-list" v-if="dosen.education?.length">
                  <li v-for="(edu, index) in dosen.education" :key="index" class="education-item">
                    <span class="education-dot"></span>
                    {{ edu }}
                  </li>
                </ul>
                <p v-else class="no-data">Data pendidikan belum tersedia.</p>

                <h3 class="section-title">Bidang Penelitian</h3>
                <ul class="research-list" v-if="dosen.research?.length">
                  <li
                    v-for="(research, index) in dosen.research"
                    :key="index"
                    class="research-item"
                  >
                    {{ research }}
                  </li>
                </ul>
                <p v-else class="no-data">Data penelitian belum tersedia.</p>

                <h3 class="section-title">Jadwal Konsultasi</h3>
                <div class="consultation" v-if="dosen.office_hours">
                  <div class="consultation-item">
                    <span class="consultation-label">Hari/Jam:</span>
                    <span class="consultation-value">{{ dosen.office_hours }}</span>
                  </div>
                  <div class="consultation-item" v-if="dosen.room">
                    <span class="consultation-label">Lokasi:</span>
                    <span class="consultation-value">{{ dosen.room }}</span>
                  </div>
                  <div class="consultation-note">
                    * Mahasiswa diharapkan untuk membuat janji terlebih dahulu melalui email
                  </div>
                </div>
                <p v-else class="no-data">Jadwal konsultasi belum tersedia.</p>
              </section>

              <section class="publications-section" v-show="activeTab === 'publikasi'">
                <h3 class="section-title">Publikasi Ilmiah</h3>
                <div class="publications-list" v-if="dosen.publications?.length">
                  <div v-for="(pub, index) in dosen.publications" :key="index" class="publication-item">
                    <h4 class="publication-title">{{ pub.title }}</h4>
                    <p class="publication-authors">{{ pub.authors }}</p>
                    <p class="publication-journal">{{ pub.journal }}, {{ pub.year }}</p>
                    <div class="publication-meta">
                      <span class="publication-doi">DOI: {{ pub.doi }}</span>
                      <span class="publication-divider">|</span>
                      <span class="publication-citations">Citations: {{ pub.citations }}</span>
                    </div>
                  </div>
                </div>
                <p v-else class="no-data">Data publikasi belum tersedia.</p>
              </section>

              <section class="teaching-section" v-show="activeTab === 'pengajaran'">
                <h3 class="section-title">Mata Kuliah yang Diampu</h3>
                <div class="teaching-list" v-if="dosen.teaching?.length">
                  <div
                    v-for="(subject, index) in dosen.teaching"
                    :key="index"
                    class="teaching-item"
                  >
                    {{ subject }}
                  </div>
                </div>
                <p v-else class="no-data">Data mata kuliah belum tersedia.</p>
              </section>
            </div>
          </div>
        </main>

        <!-- Sidebar -->
        <aside class="dosen-sidebar">
          <!-- ID dan Bidang -->
          <div class="sidebar-section animate-on-scroll">
            <h3>Informasi</h3>
            <div class="info-list">
              <div class="info-item">
                <span class="info-label">NIDN</span>
                <span class="info-value">{{ dosen.nidn }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Bidang Keahlian</span>
                <span class="info-value">{{ dosen.specialization }}</span>
              </div>
              <div class="info-item" v-if="dosen.position">
                <span class="info-label">Jabatan</span>
                <span class="info-value">{{ dosen.position }}</span>
              </div>
            </div>
          </div>

          <!-- Jadwal Perkuliahan -->
          <div class="sidebar-section animate-on-scroll" v-if="dosen.schedule?.length">
            <h3>Jadwal Perkuliahan</h3>
            <div class="schedule-list">
              <div 
                v-for="(item, index) in dosen.schedule" 
                :key="index" 
                class="schedule-item"
              >
                <div class="schedule-header">
                  <span class="schedule-day">{{ item.day }}</span>
                </div>
                <div class="schedule-details">
                  <div class="schedule-time">{{ item.time }}</div>
                  <div class="schedule-course">{{ item.course }}</div>
                  <div class="schedule-location">{{ item.location }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Statistik Penelitian -->
          <div class="sidebar-section animate-on-scroll" v-if="dosen.stats">
            <h3>Statistik Penelitian</h3>
            <div class="stats-grid">
              <div class="stat-box">
                <div class="stat-number">{{ dosen.stats.publications }}</div>
                <div class="stat-label">Publikasi</div>
              </div>
              <div class="stat-box">
                <div class="stat-number">{{ dosen.stats.citations }}</div>
                <div class="stat-label">Sitasi</div>
              </div>
              <div class="stat-box">
                <div class="stat-number">{{ dosen.stats.h_index }}</div>
                <div class="stat-label">h-index</div>
              </div>
              <div class="stat-box">
                <div class="stat-number">{{ dosen.stats.active_projects }}</div>
                <div class="stat-label">Proyek Aktif</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>

  <!-- Loading State -->
  <div v-else class="loading-container">
    <div class="loading-spinner"></div>
    <p>Memuat data dosen...</p>
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

.dosen-detail-page {
  width: 100%;
  background-color: var(--background);
  color: var(--text-primary);
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* ---------- Hero Section ---------- */
.dosen-hero {
  position: relative;
  height: 40vh;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 3rem;
  background-size: cover;
  background-position: center;
  margin-bottom: 3rem;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.5) 50%,
    rgba(0, 0, 0, 0.3) 100%
  );
  z-index: 1;
}

.dosen-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc0MCcgaGVpZ2h0PSc0MCcgdmlld0JveD0nMCAwIDQwIDQwJz48cGF0aCBkPSdNMTkuOTk1IDBDOC43MSAwIDAgOC43MSAwIDE5Ljk5NVMzMy42NiA0MCAxOS45OTUgNDBTNDAgOC43MSA0MCAxOS45OTUgMjQuNTcgMCAxOS45OTUgMHptLjAwNSAyQTM1IDM1IDAgMCAxIDM4IDE5Ljk5IDE4IDE4IDAgMSAxIDIgMTkuOTkgMzUgMzUgMCAwIDEgMjAgMnonIGZpbGw9JyNmZmYnIGZpbGwtb3BhY2l0eT0nMC4wMycgZmlsbC1ydWxlPSdldmVub2RkJy8+PC9zdmc+');
  opacity: 0.3;
}

.hero-content {
  position: relative;
  z-index: 2;
  color: white;
  max-width: 800px;
}

.back-button {
  position: absolute;
  top: 2rem;
  left: 2rem;
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateX(-5px);
}

.back-arrow {
  margin-right: 0.5rem;
  font-size: 1.25rem;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.2;
  position: relative;
  display: inline-block;
}

.hero-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 100px;
  height: 4px;
  background: linear-gradient(to right, var(--accent-color), #ff7e47);
  border-radius: 2px;
}

.hero-meta {
  display: flex;
  align-items: center;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.95);
  margin-top: 1.5rem;
  font-weight: 500;
}

.meta-divider {
  margin: 0 0.75rem;
}

/* Content Layout */
.content-wrapper {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2.5rem;
  margin-bottom: 4rem;
}

/* Dosen Content */
.dosen-content {
  background-color: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* Profile Section */
.dosen-profile-section {
  padding: 2.5rem;
  border-bottom: 1px solid var(--border-color);
}

.profile-header {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.profile-photo {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  border: 3px solid var(--primary-color);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
  margin: 0.5rem 0;
}

.profile-photo:hover {
  transform: scale(1.05);
}

.profile-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  transition: transform 0.5s ease;
}

.profile-photo:hover img {
  transform: scale(1.1);
}

.profile-info {
  flex: 1;
}

.profile-info h2 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.profile-specialization {
  font-size: 1.1rem;
  color: var(--primary-color);
  margin-bottom: 1.25rem;
  font-weight: 500;
}

.profile-contact {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: black;
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.contact-icon {
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(59, 130, 246, 0.2);
  color: var(--primary-color);
  border-radius: 50%;
  transition: all 0.3s ease;
}

.contact-item:hover .contact-icon {
  background: rgba(59, 130, 246, 0.3);
  transform: scale(1.1);
}

.profile-links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.profile-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #f3f4f6;
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 0.9rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  text-decoration: none;
  cursor: pointer;
}

.profile-link:hover {
  background-color: var(--primary-color);
  color: white;
  transform: translateY(-3px);
}

.link-icon {
  font-size: 1.1rem;
}

/* Tabs */
.tabs-container {
  padding: 0 2.5rem;
}

.tabs {
  display: flex;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 2rem;
}

.tab {
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 600;
  color: var(--text-secondary);
  transition: all 0.3s ease;
  position: relative;
}

.tab:hover:not(:disabled) {
  color: var(--primary-color);
}

.tab.active {
  color: var(--primary-color);
}

.tab:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
  border-radius: 2px;
}

/* Tab Content */
.tab-content {
  padding-bottom: 2.5rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 2rem 0 1.25rem;
  color: var(--text-primary);
  position: relative;
  padding-left: 0.75rem;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(to bottom, var(--primary-color), var(--secondary-color));
  border-radius: 2px;
}

/* Education List */
.education-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  list-style: none;
  padding: 0;
}

.education-item {
  display: flex;
  align-items: center;
  font-size: 1rem;
  color: var(--text-secondary);
  transition: transform 0.3s ease;
}

.education-item:hover {
  transform: translateX(5px);
  color: var(--text-primary);
}

.education-dot {
  width: 0.5rem;
  height: 0.5rem;
  background-color: var(--primary-color);
  border-radius: 50%;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

/* Research List */
.research-list {
  list-style-type: disc;
  padding-left: 1.5rem;
  color: var(--text-secondary);
}

.research-item {
  margin-bottom: 0.75rem;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.research-item:hover {
  color: var(--text-primary);
  transform: translateX(5px);
}

/* Consultation */
.consultation {
  background-color: #f8fafc;
  border-radius: 0.75rem;
  padding: 1.25rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.consultation:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -5px rgba(0, 0, 0, 0.1);
}

.consultation-item {
  margin-bottom: 0.75rem;
}

.consultation-label {
  font-weight: 600;
  color: var(--text-primary);
  margin-right: 0.5rem;
}

.consultation-value {
  color: var(--text-secondary);
}

.consultation-note {
  font-size: 0.875rem;
  color: var(--text-light);
  margin-top: 1rem;
  font-style: italic;
}

/* Publications */
.publications-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.publication-item {
  padding: 1.25rem;
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
}

.publication-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.1);
}

.publication-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(to bottom, var(--primary-color), var(--secondary-color));
}

.publication-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.publication-authors {
  font-size: 0.95rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.publication-journal {
  font-size: 0.95rem;
  color: var(--text-secondary);
  font-style: italic;
  margin-bottom: 0.5rem;
}

.publication-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: var(--text-light);
}

.publication-divider {
  color: var(--border-color);
}

/* Teaching */
.teaching-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.teaching-item {
  background-color: #f3f4f6;
  border-radius: 0.75rem;
  padding: 0.75rem 1.25rem;
  font-size: 0.95rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  text-align: center;
  cursor: pointer;
}

.teaching-item:hover {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(124, 58, 237, 0.1));
  color: var(--primary-color);
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

/* No data message */
.no-data {
  color: var(--text-light);
  font-style: italic;
  padding: 1rem;
  background-color: #f8fafc;
  border-radius: 0.5rem;
  text-align: center;
}

/* Sidebar */
.dosen-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sidebar-section {
  background-color: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.sidebar-section:hover {
  transform: translateY(-5px);
}

.sidebar-section h3 {
  font-size: 1.2rem;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-primary);
  font-weight: 700;
  position: relative;
}

.sidebar-section h3::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -1px;
  width: 50px;
  height: 2px;
  background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
}

/* Info List */
.info-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 0.875rem;
  color: var(--text-light);
  margin-bottom: 0.25rem;
}

.info-value {
  font-weight: 500;
  color: var(--text-primary);
}

/* Schedule */
.schedule-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.schedule-item {
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.schedule-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.15);
}

.schedule-header {
  background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
  color: white;
  padding: 0.5rem 1rem;
  font-weight: 600;
}

.schedule-details {
  padding: 1rem;
  font-size: 0.95rem;
}

.schedule-time {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.schedule-course {
  color: var(--text-secondary);
}

.schedule-location {
  font-size: 0.875rem;
  color: var(--text-light);
  margin-top: 0.25rem;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.stat-box {
  background-color: #f3f4f6;
  border-radius: 0.75rem;
  padding: 1.25rem 1rem;
  text-align: center;
  transition: all 0.3s ease;
  cursor: default;
}

.stat-box:hover {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(124, 58, 237, 0.1));
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.stat-number {
  font-size: 1.75rem;
  font-weight: 700;
  background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  color: var(--text-secondary);
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(59, 130, 246, 0.2);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1.5rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Animation classes */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.animate-in {
  opacity: 1;
  transform: translateY(0);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .content-wrapper {
    grid-template-columns: 3fr 2fr;
  }

  .hero-title {
    font-size: 2.25rem;
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    grid-template-columns: 1fr;
  }

  .profile-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .profile-links {
    justify-content: center;
  }

  .profile-contact {
    align-items: center;
  }

  .teaching-list {
    grid-template-columns: repeat(2, 1fr);
  }

  .hero-title::after {
    left: 50%;
    transform: translateX(-50%);
  }

  .section-title::before {
    display: none;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.75rem;
  }

  .dosen-profile-section {
    padding: 1.5rem;
  }

  .tabs-container {
    padding: 0 1.5rem;
  }

  .tabs {
    overflow-x: auto;
    gap: 1rem;
  }

  .tab {
    padding: 1rem 0.75rem;
    white-space: nowrap;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .teaching-list {
    grid-template-columns: 1fr;
  }
}
</style>
