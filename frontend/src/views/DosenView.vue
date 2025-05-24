<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import dosenData from '@/data/dosen.json'

// Interface untuk data dosen
interface DosenItem {
  id: number
  name: string
  specialization: string
  email: string
  nidn: string
  bidang: string
  imageUrl: string
}

interface ExpertiseField {
  id: string
  name: string
  count?: number
}

// Data bidang keahlian dari file JSON
const expertiseFields = ref<ExpertiseField[]>(dosenData.expertiseFields)

// Data dosen dari file JSON
const originalDosenItems = ref<DosenItem[]>(dosenData.dosenItems)

// Stats untuk dosen dari file JSON
const dosenStats = ref(dosenData.dosenStats)

// State untuk aktif bidang
const activeBidang = ref('all')

// State untuk pencarian
const searchQuery = ref('')

// Filtered dosen items
const filteredDosen = computed(() => {
  let result = [...originalDosenItems.value]

  // Filter berdasarkan bidang
  if (activeBidang.value !== 'all') {
    result = result.filter((item) => item.bidang === activeBidang.value)
  }

  // Filter berdasarkan pencarian
  if (searchQuery.value.trim() !== '') {
    const query = searchQuery.value.toLowerCase().trim()
    result = result.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.specialization.toLowerCase().includes(query) ||
        item.email.toLowerCase().includes(query) ||
        item.nidn.toLowerCase().includes(query),
    )
  }

  return result
})

// Paginasi
const currentPage = ref(1)
const itemsPerPage = ref(6)

// Computed untuk item yang ditampilkan berdasarkan paginasi
const paginatedDosen = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value
  const endIndex = startIndex + itemsPerPage.value
  return filteredDosen.value.slice(startIndex, endIndex)
})

// Computed total halaman
const totalPages = computed(() => {
  return Math.ceil(filteredDosen.value.length / itemsPerPage.value)
})

// Method untuk navigasi paginasi
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page

    // Scroll ke atas konten saat ganti halaman
    const filterSection = document.querySelector('.filter-section') as HTMLElement
    if (filterSection) {
      window.scrollTo({
        top: filterSection.offsetTop + 300,
        behavior: 'smooth',
      })
    }
  }
}

// Pagination methods
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    goToPage(currentPage.value + 1)
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    goToPage(currentPage.value - 1)
  }
}

// Method untuk mengubah bidang
const setBidang = (bidangId: string) => {
  activeBidang.value = bidangId
  // Reset ke halaman pertama saat bidang berubah
  currentPage.value = 1
}

// Untuk mendapatkan array dari pages yang akan ditampilkan
const paginationItems = computed(() => {
  const pages = []
  const maxPagesToShow = 5
  let startPage = Math.max(1, currentPage.value - Math.floor(maxPagesToShow / 2))
  let endPage = Math.min(totalPages.value, startPage + maxPagesToShow - 1)

  // Adjustment jika di akhir halaman
  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return pages
})

// Function untuk mendapatkan icon berdasarkan bidang
const getBidangIcon = (bidang: string): string => {
  switch (bidang) {
    case 'ai':
      return '🧠'
    case 'database':
      return '💾'
    case 'network':
      return '🌐'
    case 'software':
      return '💻'
    case 'multimedia':
      return '🎨'
    default:
      return '📚'
  }
}

// Fungsi untuk melakukan pencarian
const handleSearch = () => {
  // Reset halaman ke halaman pertama saat pencarian berubah
  currentPage.value = 1
}

// Reset filters
const resetFilters = () => {
  searchQuery.value = ''
  activeBidang.value = 'all'
  currentPage.value = 1
}

// Update counts for each expertise field
const updateExpertiseFieldCounts = () => {
  expertiseFields.value.forEach((field) => {
    if (field.id === 'all') {
      field.count = originalDosenItems.value.length
    } else {
      field.count = originalDosenItems.value.filter((item) => item.bidang === field.id).length
    }
  })
}

onMounted(() => {
  console.log('Dosen page mounted, items:', filteredDosen.value.length)

  // Update expertise field counts
  updateExpertiseFieldCounts()

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
  setTimeout(() => {
    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el)
    })
  }, 100)
})
</script>

<template>
  <div class="dosen-container">
    <!-- Hero Section -->
    <section class="dosen-hero">
      <div class="dosen-hero-content">
        <h1>Daftar Dosen</h1>
        <p>Mengenal tenaga pendidik Prodi Teknik Informatika UNESA</p>
      </div>
    </section>

    <div class="page-content">
      <!-- Filter dan Stats -->
      <section class="filter-section">
        <div class="filter-container">
          <div class="stats-items">
            <div class="stat-item" v-for="stat in dosenStats" :key="stat.id">
              <div class="stat-number">{{ stat.number }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>

          <!-- Search Box -->
          <div class="search-box">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Cari dosen..."
              class="search-input"
              @input="handleSearch"
            />
            <span class="search-icon">🔍</span>
          </div>

          <!-- Filter Options -->
          <div class="filter-options">
            <button class="reset-btn" @click="resetFilters">Reset Filter</button>
          </div>
        </div>
      </section>

      <!-- Kategori Bidang -->
      <section class="category-section animate-on-scroll">
        <div class="section-header">
          <h2 class="section-title">Tenaga Pendidik</h2>
          <div class="section-line"></div>
        </div>

        <div class="category-tabs">
          <button
            v-for="field in expertiseFields"
            :key="field.id"
            :class="['category-btn', { active: activeBidang === field.id }]"
            @click="setBidang(field.id)"
          >
            {{ field.name }}
            <span class="category-count">{{ field.count || 0 }}</span>
          </button>
        </div>
      </section>

      <!-- Dosen List -->
      <section class="dosen-grid-section animate-on-scroll">
        <!-- Empty State -->
        <div v-if="filteredDosen.length === 0" class="empty-state">
          <div class="empty-icon">👨‍🏫</div>
          <h3>Tidak ada dosen</h3>
          <p>Tidak ada dosen yang sesuai dengan kriteria pencarian.</p>
          <button @click="resetFilters" class="reset-btn">Reset Filter</button>
        </div>

        <!-- Dosen Grid -->
        <div class="dosen-grid">
          <!-- Dosen Card -->
          <div class="dosen-card" v-for="dosen in paginatedDosen" :key="dosen.id">
            <div class="dosen-image">
              <img :src="dosen.imageUrl" :alt="dosen.name" />
              <div class="dosen-overlay">
                <span
                  class="dosen-category"
                  :title="expertiseFields.find((field) => field.id === dosen.bidang)?.name"
                  >{{ getBidangIcon(dosen.bidang) }}</span
                >
              </div>
            </div>
            <div class="dosen-content">
              <h3>{{ dosen.name }}</h3>
              <p class="dosen-position">{{ dosen.specialization }}</p>
              <p class="dosen-email">{{ dosen.email }}</p>

              <div class="dosen-info-grid">
                <div class="info-item">
                  <h4>NIDN</h4>
                  <p>{{ dosen.nidn }}</p>
                </div>
                <div class="info-item">
                  <h4>Bidang</h4>
                  <p>{{ expertiseFields.find((field) => field.id === dosen.bidang)?.name }}</p>
                </div>
              </div>

              <div class="dosen-links">
                <router-link :to="`/dosen/${dosen.id}`" class="action-btn">Profil</router-link>
                <a href="https://scholar.google.com" target="_blank" class="action-btn secondary"
                  >Google Scholar</a
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="pagination-container" v-if="totalPages > 1">
          <div class="pagination">
            <button class="pagination-btn" :disabled="currentPage === 1" @click="prevPage()">
              &laquo; Sebelumnya
            </button>

            <div class="pagination-numbers">
              <button
                v-for="page in paginationItems"
                :key="page"
                :class="['page-number', { active: currentPage === page }]"
                @click="goToPage(page)"
              >
                {{ page }}
              </button>
            </div>

            <button
              class="pagination-btn"
              :disabled="currentPage === totalPages"
              @click="nextPage()"
            >
              Selanjutnya &raquo;
            </button>
          </div>

          <div class="dosen-info-text" v-if="filteredDosen.length > 0">
            Menampilkan {{ (currentPage - 1) * itemsPerPage + 1 }}-{{
              Math.min(currentPage * itemsPerPage, filteredDosen.length)
            }}
            dari {{ filteredDosen.length }} dosen
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* Container */
.dosen-container {
  width: 100%;
  background-color: var(--background-light, #f8fafc);
  color: var(--text-color, #1e293b);
}

/* Hero Section */
.dosen-hero {
  background: linear-gradient(135deg, #002e54, #004680, #001830);
  color: white;
  padding: 5rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.dosen-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc0MCcgaGVpZ2h0PSc0MCcgdmlld0JveD0nMCAwIDQwIDQwJz48cGF0aCBkPSdNMTkuOTk1IDBDOC43MSAwIDAgOC43MSAwIDE5Ljk5NVMzMy42NiA0MCAxOS45OTUgNDBTNDAgOC43MSA0MCAxOS45OTUgMjQuNTcgMCAxOS45OTUgMHptLjAwNSAyQTM1IDM1IDAgMCAxIDM4IDE5Ljk5IDE4IDE4IDAgMSAxIDIgMTkuOTkgMzUgMzUgMCAwIDEgMjAgMnonIGZpbGw9JyNmZmYnIGZpbGwtb3BhY2l0eT0nMC4wMycgZmlsbC1ydWxlPSdldmVub2RkJy8+PC9zdmc+');
  background-size: 100px 100px;
  opacity: 0.15;
  z-index: 1;
}

.dosen-hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
}

.dosen-hero h1 {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;
}

.dosen-hero h1::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(to right, #ff6b00, #ff9248);
  border-radius: 2px;
}

.dosen-hero p {
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

/* Filter Section */
.filter-section {
  margin-top: -4rem;
  margin-bottom: 2rem;
  position: relative;
  z-index: 10;
}

.filter-container {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem 2rem 2rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.stats-items {
  display: flex;
  justify-content: space-around;
  gap: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
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

.search-box {
  position: relative;
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
}

.search-input {
  width: 100%;
  padding: 1rem 3rem 1rem 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.search-input:focus {
  border-color: #004680;
  box-shadow: 0 4px 12px -1px rgba(0, 70, 128, 0.15);
}

.search-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  color: #94a3b8;
  pointer-events: none;
}

.filter-options {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.reset-btn {
  padding: 0.75rem 1.5rem;
  background-color: #f8fafc;
  color: #64748b;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  background-color: #f1f5f9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px -1px rgba(0, 0, 0, 0.1);
}

/* Category Section */
.category-section {
  margin-top: 4rem;
  margin-bottom: 2rem;
}

.section-header {
  text-align: center;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 1rem;
}

.section-line {
  width: 80px;
  height: 4px;
  background: linear-gradient(to right, #004680, #00a0e3);
  margin: 0 auto;
  border-radius: 2px;
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
  align-items: center;
}

.category-btn {
  padding: 0.75rem 1.5rem;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.category-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.category-btn.active {
  background-color: #004680;
  color: white;
  border-color: #004680;
}

.category-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.5rem;
  height: 1.5rem;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 1rem;
  font-size: 0.8rem;
  padding: 0 0.5rem;
}

.category-btn.active .category-count {
  background: rgba(255, 255, 255, 0.3);
}

/* Loading & Error States */
.loading-container,
.error-container,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  margin: 2rem 0;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
}

.empty-state {
  background-color: white;
  border-radius: 1rem;
  padding: 3rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  display: block;
}

.empty-state h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.empty-state p {
  color: #64748b;
  margin-bottom: 1.5rem;
}

/* Dosen Grid Section */
.dosen-grid-section {
  padding: 1rem 0 3rem;
}

.dosen-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  width: 100%;
  position: relative;
  margin-bottom: 2rem;
}

.dosen-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid #f0f0f0;
}

.dosen-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.1);
}

.dosen-image {
  height: 360px;
  position: relative;
  overflow: hidden;
}

.dosen-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  transition: transform 0.5s ease;
}

.dosen-card:hover .dosen-image img {
  transform: scale(1.05);
}

.dosen-overlay {
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.5rem;
  z-index: 2;
}

.dosen-category {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: #004680;
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  font-size: 1.25rem;
  border: 2px solid white;
}

.dosen-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.dosen-content h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.dosen-position {
  color: #004680;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.dosen-email {
  color: #94a3b8;
  font-size: 0.85rem;
  margin-bottom: 1.5rem;
}

.dosen-info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
  margin-bottom: 1.5rem;
  flex: 1;
}

.info-item h4 {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
  margin-bottom: 0.25rem;
}

.info-item p {
  font-weight: 600;
  color: #1e293b;
}

.dosen-links {
  display: flex;
  gap: 1rem;
  margin-top: auto;
}

.action-btn {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;
  transition: all 0.3s ease;
  background-color: #004680;
  color: white;
  border: none;
  cursor: pointer;
}

.action-btn:hover {
  background-color: #00396a;
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 70, 128, 0.2);
}

.action-btn.secondary {
  background-color: #f1f5f9;
  color: #004680;
}

.action-btn.secondary:hover {
  background-color: #e2e8f0;
}

/* Pagination */
.pagination-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 3rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.pagination-btn {
  padding: 0.75rem 1rem;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn:not(:disabled):hover {
  background-color: #004680;
  color: white;
  border-color: #004680;
}

.pagination-numbers {
  display: flex;
  gap: 0.5rem;
}

.page-number {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-number:hover {
  background-color: #f8fafc;
}

.page-number.active {
  background-color: #004680;
  color: white;
  border-color: #004680;
}

.dosen-info-text {
  text-align: center;
  color: #64748b;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

/* Animation for scroll */
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
  .dosen-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .stats-items {
    flex-wrap: wrap;
    justify-content: space-evenly;
    gap: 1rem;
  }

  .stat-item {
    flex: 1 1 30%;
    min-width: 100px;
  }
}

@media (max-width: 768px) {
  .dosen-hero h1 {
    font-size: 2.5rem;
  }

  .dosen-hero p {
    font-size: 1.1rem;
  }

  .filter-container {
    padding: 1.5rem 1rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .dosen-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.25rem;
  }

  .filter-options {
    flex-direction: row;
    width: 100%;
    justify-content: center;
  }

  .category-btn {
    padding: 0.6rem 1rem;
  }
}

@media (max-width: 480px) {
  .dosen-hero h1 {
    font-size: 2rem;
  }

  .dosen-hero p {
    font-size: 1rem;
  }

  .category-tabs {
    overflow-x: auto;
    padding-bottom: 1rem;
    justify-content: flex-start;
    gap: 0.5rem;
  }

  .category-btn {
    padding: 0.5rem 0.8rem;
    font-size: 0.875rem;
  }

  .stats-items {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .pagination {
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .dosen-grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }

  .filter-options {
    flex-direction: column;
    gap: 0.75rem;
  }
}
</style>
