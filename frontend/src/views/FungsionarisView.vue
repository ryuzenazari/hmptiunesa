<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import axios from 'axios'
import nioImg from '@/assets/kahim/nio.png'
import fungsionarisData from '@/data/fungsionaris.json'

// @ts-ignore
const isDev = process.env.NODE_ENV === 'development'

// Interface untuk data fungsionaris
interface Fungsionaris {
  id: number
  nama: string
  nim: string
  angkatan: string
  jabatan: string
  departemen: string
  email: string
  foto: string
  sosmed?: string
  instagram?: string
  linkedin?: string
  github?: string
  deskripsi?: string
  prestasi?: string[]
  keahlian?: string[]
  kontak?: string
  fotoPos?: string // Posisi gambar custom
}

// State
const fungsionarisList = ref<Fungsionaris[]>([])
const loading = ref(true)
const error = ref('')
const searchQuery = ref('')
const filterAngkatan = ref('')
const filterDepartemen = ref('')

// State untuk popup profil
const selectedMember = ref<Fungsionaris | null>(null)
const showProfilePopup = ref(false)

// Posisi foto untuk setiap pengurus
// Ini dikonfigurasi manual berdasarkan pengalaman dengan foto-foto di siakadu
const fotoPosConfig: Record<string, string> = {
  // Posisi default untuk semua foto
  default: 'center 20%',

  // BPH
  '23051204212': 'center 25%', // Diha Anfeu Nio Julaynda
  '23051204145': 'center 25%', // Muhammad Rafdi Fawwaz
  '23051204035': 'center 25%', // Masyita Ika Sahara
  '24051204156': 'center 30%', // Desty Putri
  '23051204171': 'center 20%', // Muhammad Iqbal
  '24051204112': 'center 30%', // Nuris Safira

  // Akademik
  '23051204243': 'center 25%', // Mirsa Alif
  '23051204052': 'center 25%', // Ferdi Al Majid

  // PSDM
  '23051204346': 'center 25%', // Nur Lintang

  // Add more custom positions as needed
}

// Function to get position for each member
const getFotoPosition = (nim: string): string => {
  return fotoPosConfig[nim] || fotoPosConfig['default']
}

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(9)

// Kategori departemen untuk tab filter
const departemenCategories = ref([
  { id: '', label: 'Semua Divisi', count: 0 },
  { id: 'BPH', label: 'Badan Pengurus Harian', count: 0 },
  { id: 'Akademik', label: 'Akademik & IT', count: 0 },
  { id: 'PSDM', label: 'PSDM', count: 0 },
  { id: 'Humas', label: 'Humas', count: 0 },
  { id: 'Kewirausahaan', label: 'Kewirausahaan', count: 0 },
  { id: 'MinBak', label: 'Minat & Bakat', count: 0 },
  { id: 'Sosmas', label: 'Sosial Masyarakat', count: 0 },
])

// Fetch data
const fetchFungsionaris = async () => {
  try {
    loading.value = true

    // Dalam mode development, selalu gunakan dummy data
    if (isDev) {
      console.log('Development mode: menggunakan data dummy')
      useDummyData()
      return
    }

    // Dalam production, coba ambil dari API
    try {
      const response = await axios.get('/api/fungsionaris')

      // Pastikan data yang diterima adalah array
      if (response.data && Array.isArray(response.data)) {
        fungsionarisList.value = response.data
      } else if (response.data && Array.isArray(response.data.data)) {
        // Jika API mengembalikan data dalam format {data: [...]}
        fungsionarisList.value = response.data.data
      } else {
        // Jika format tidak sesuai, gunakan dummy data
        console.warn('Format data dari server tidak sesuai, menggunakan data dummy')
        useDummyData()
      }
    } catch (err) {
      console.warn('Error fetching data dari API, menggunakan data dummy:', err)
      useDummyData()
    }

    loading.value = false
    // Hitung jumlah anggota per departemen
    updateCategoryCounts()
  } catch (err) {
    error.value = 'Gagal memuat data fungsionaris'
    loading.value = false
    console.error('Error fatal:', err)
    fungsionarisList.value = []
  }
}

// Fungsi untuk memuat data dummy
const useDummyData = () => {
  console.log('Loading dummy data...')

  // Memuat data fungsionaris dari file JSON
  const dummyData = fungsionarisData.fungsionarisList

  // Menambahkan properti fotoPos untuk setiap anggota
  fungsionarisList.value = dummyData.map((member) => ({
    ...member,
    fotoPos: getFotoPosition(member.nim),
  }))

  // Update kategori counts
  updateCategoryCounts()
  loading.value = false
}

// Computed untuk filtering
const filteredFungsionaris = computed(() => {
  // Pastikan fungsionarisList.value adalah array
  if (!Array.isArray(fungsionarisList.value)) {
    console.error('fungsionarisList.value bukan array di computed filteredFungsionaris')
    return []
  }

  const searchLower = searchQuery.value.toLowerCase()

  // Debug
  if (filterDepartemen.value) {
    console.log(`Filtering by departemen: "${filterDepartemen.value}"`)
  }

  return fungsionarisList.value.filter((member) => {
    // Pastikan member adalah objek yang valid
    if (!member) return false

    // Filter berdasarkan pencarian
    const matchesSearch =
      searchLower === '' ||
      (member.nama && member.nama.toLowerCase().includes(searchLower)) ||
      (member.jabatan && member.jabatan.toLowerCase().includes(searchLower)) ||
      (member.nim && member.nim.toLowerCase().includes(searchLower)) ||
      (member.departemen && member.departemen.toLowerCase().includes(searchLower))

    // Filter berdasarkan angkatan
    const matchesAngkatan = filterAngkatan.value === '' || member.angkatan === filterAngkatan.value

    // Filter berdasarkan departemen
    const matchesDepartemen =
      filterDepartemen.value === '' ||
      (member.departemen && member.departemen === filterDepartemen.value)

    const result = matchesSearch && matchesAngkatan && matchesDepartemen

    // Debug untuk item yang tidak cocok
    if (filterDepartemen.value && member.departemen !== filterDepartemen.value) {
      console.log(
        `Item ${member.id} (${member.nama}) tidak cocok karena departemen: "${member.departemen}" != "${filterDepartemen.value}"`,
      )
    }

    return result
  })
})

// Total pages based on filtered data
const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredFungsionaris.value.length / itemsPerPage.value))
})

// Computed untuk pagination
const paginatedFungsionaris = computed(() => {
  // Ensure current page is within valid range after filtering
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
  }

  const startIndex = (currentPage.value - 1) * itemsPerPage.value
  const endIndex = Math.min(startIndex + itemsPerPage.value, filteredFungsionaris.value.length)
  return filteredFungsionaris.value.slice(startIndex, endIndex)
})

// Pagination methods
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    changePage(page)
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    changePage(currentPage.value + 1)
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    changePage(currentPage.value - 1)
  }
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

// Search handler
const handleSearch = () => {
  currentPage.value = 1 // Reset ke halaman pertama saat searching
}

// Reset filters
const resetFilters = () => {
  searchQuery.value = ''
  filterAngkatan.value = ''
  filterDepartemen.value = ''
  currentPage.value = 1
}

// Hitung jumlah anggota per departemen
const updateCategoryCounts = () => {
  // Pastikan fungsionarisList.value adalah array
  if (!Array.isArray(fungsionarisList.value)) {
    console.error('fungsionarisList.value bukan array:', fungsionarisList.value)
    return
  }

  // Debug output
  console.log('Menghitung jumlah anggota per departemen...')

  departemenCategories.value.forEach((category) => {
    if (category.id === '') {
      // Untuk "Semua Divisi", hitung total anggota
      category.count = fungsionarisList.value.length
    } else {
      // Untuk departemen spesifik, hitung anggota dengan departemen yang cocok
      const count = fungsionarisList.value.filter(
        (member) => member && member.departemen === category.id,
      ).length

      category.count = count
      console.log(`Departemen "${category.label}" (${category.id}): ${count} anggota`)
    }
  })
}

const changePage = (newPage: number) => {
  if (newPage === currentPage.value) return
  currentPage.value = newPage

  // Scroll ke atas konten saat ganti halaman
  const categorySection = document.querySelector('.category-section') as HTMLElement
  if (categorySection) {
    window.scrollTo({
      top: categorySection.offsetTop - 50,
      behavior: 'smooth',
    })
  }
}

// Watch for filter changes to reset pagination
watch([searchQuery, filterAngkatan, filterDepartemen], () => {
  currentPage.value = 1
})

// Load data saat komponen dimount
onMounted(() => {
  // Coba fetch data dari API backend
  fetchFungsionaris()

  // Set up animasi scroll
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

// Watch perubahan halaman untuk memproses gambar baru
watch(currentPage, () => {
  nextTick(() => {
    // No need to process images on page change
  })
})

// New function to set filterDepartemen
const setFilterDepartemen = (id: string) => {
  console.log(`Setting filter departemen: "${id}"`)
  filterDepartemen.value = id

  // Debug filteredFungsionaris after changing the filter
  setTimeout(() => {
    console.log(`Filter set to "${filterDepartemen.value}"`)
    console.log(`Filtered results: ${filteredFungsionaris.value.length} items`)

    // Log departemen yang dimiliki anggota
    const depts = fungsionarisList.value.map((m) => m.departemen)
    const uniqueDepts = [...new Set(depts)].sort()
    console.log('Departemen yang tersedia:', uniqueDepts)
  }, 100)
}

// Fungsi untuk menampilkan popup profil
const openProfilePopup = (member: Fungsionaris) => {
  selectedMember.value = member
  showProfilePopup.value = true
}

// Fungsi untuk menutup popup profil
const closeProfilePopup = () => {
  showProfilePopup.value = false
}
</script>

<template>
  <div class="fungsionaris-container">
    <!-- Hero Section -->
    <section class="fungsionaris-hero">
      <div class="fungsionaris-hero-content">
        <h1>Fungsionaris HMP TI</h1>
        <p>
          Mengenal pengurus Himpunan Mahasiswa Prodi Teknik Informatika UNESA yang berkomitmen untuk
          memajukan mahasiswa dan organisasi
        </p>
      </div>
    </section>

    <div class="page-content">
      <!-- Filter dan Stats -->
      <section class="filter-section">
        <div class="filter-container">
          <div class="stats-items">
            <div class="stat-item">
              <div class="stat-number">{{ fungsionarisList.length }}</div>
              <div class="stat-label">Total Pengurus</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ departemenCategories.length - 1 }}</div>
              <div class="stat-label">Departemen</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">2</div>
              <div class="stat-label">Periode Kepengurusan</div>
            </div>
          </div>

          <!-- Search Box -->
          <div class="search-box">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Cari fungsionaris..."
              class="search-input"
              @input="handleSearch"
            />
            <span class="search-icon">🔍</span>
          </div>

          <!-- Filter Options -->
          <div class="filter-options">
            <select v-model="filterAngkatan" class="filter-select">
              <option value="">Semua Angkatan</option>
              <option value="2024">Angkatan 2024</option>
              <option value="2023">Angkatan 2023</option>
            </select>
            <button class="reset-btn" @click="resetFilters">Reset Filter</button>
          </div>
        </div>
      </section>

      <!-- Kategori Departemen -->
      <section class="category-section animate-on-scroll">
        <div class="section-header">
          <h2 class="section-title">Pengurus Himpunan</h2>
          <div class="section-line"></div>
        </div>

        <div class="category-tabs">
          <button
            v-for="category in departemenCategories"
            :key="category.id"
            :class="['category-btn', { active: filterDepartemen === category.id }]"
            @click="setFilterDepartemen(category.id)"
          >
            {{ category.label }}
            <span class="category-count">{{ category.count }}</span>
          </button>
        </div>
      </section>

      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Memuat data fungsionaris...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-container">
        <div class="message">{{ error }}</div>
        <button @click="fetchFungsionaris" class="retry-btn">Coba Lagi</button>
      </div>

      <!-- Fungsionaris List -->
      <section v-else class="fungsionaris-grid-section animate-on-scroll">
        <!-- Empty State -->
        <div v-if="filteredFungsionaris.length === 0" class="empty-state">
          <div class="empty-icon">👨‍💼</div>
          <h3>Tidak ada fungsionaris</h3>
          <p>Tidak ada fungsionaris yang sesuai dengan kriteria pencarian.</p>
          <button @click="resetFilters" class="reset-btn">Reset Filter</button>
        </div>

        <!-- Fungsionaris Grid -->
        <div class="fungsionaris-grid">
          <!-- Fungsionaris Card -->
          <div class="fungsionaris-card" v-for="member in paginatedFungsionaris" :key="member.id">
            <div class="fungsionaris-image">
              <img
                :src="member.foto"
                :alt="member.nama"
                :style="{ objectPosition: member.fotoPos || 'center 25%' }"
                loading="lazy"
              />
              <div class="fungsionaris-overlay">
                <span class="fungsionaris-category" :title="member.departemen">{{
                  member.departemen
                }}</span>
              </div>
            </div>
            <div class="fungsionaris-content">
              <h3>{{ member.nama }}</h3>
              <p class="fungsionaris-position">{{ member.jabatan }}</p>
              <p class="fungsionaris-email">{{ member.email }}</p>

              <div class="fungsionaris-info-grid">
                <div class="info-item">
                  <h4>NIM</h4>
                  <p>{{ member.nim }}</p>
                </div>
                <div class="info-item">
                  <h4>Angkatan</h4>
                  <p>{{ member.angkatan }}</p>
                </div>
                <div class="info-item">
                  <h4>Departemen</h4>
                  <p>
                    {{
                      departemenCategories.find((c) => c.id === member.departemen)?.label ||
                      member.departemen
                    }}
                  </p>
                </div>
              </div>

              <div class="fungsionaris-links">
                <button @click="openProfilePopup(member)" class="action-btn">Profil</button>
                <a
                  :href="member.sosmed || 'https://linkedin.com'"
                  target="_blank"
                  class="action-btn secondary"
                  >LinkedIn</a
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

          <div class="fungsionaris-info-text" v-if="filteredFungsionaris.length > 0">
            Menampilkan {{ (currentPage - 1) * itemsPerPage + 1 }}-{{
              Math.min(currentPage * itemsPerPage, filteredFungsionaris.length)
            }}
            dari {{ filteredFungsionaris.length }} fungsionaris
          </div>
        </div>
      </section>
    </div>

    <!-- Popup Profil Sederhana -->
    <div v-if="showProfilePopup" class="profile-popup-backdrop" @click="closeProfilePopup">
      <div class="profile-popup" @click.stop>
        <button class="close-popup" @click="closeProfilePopup">&times;</button>

        <div v-if="selectedMember" class="profile-popup-content">
          <div class="profile-popup-header">
            <div class="profile-popup-image">
              <img
                :src="selectedMember?.foto"
                :alt="selectedMember?.nama"
                :style="{ objectPosition: selectedMember?.fotoPos || 'center 25%' }"
              />
            </div>
            <div class="profile-popup-info">
              <h2>{{ selectedMember?.nama }}</h2>
              <p class="profile-popup-position">{{ selectedMember?.jabatan }}</p>
              <p class="profile-popup-department">
                {{
                  departemenCategories.find((c) => c.id === selectedMember?.departemen)?.label ||
                  selectedMember?.departemen
                }}
              </p>

              <div class="profile-popup-badges">
                <span class="badge">Angkatan {{ selectedMember?.angkatan }}</span>
                <span class="badge">{{ selectedMember?.nim }}</span>
              </div>

              <div v-if="selectedMember?.deskripsi" class="profile-popup-desc">
                <p>"{{ selectedMember?.deskripsi }}"</p>
              </div>

              <div class="profile-popup-contact">
                <p><strong>Email:</strong> {{ selectedMember?.email }}</p>
                <p v-if="selectedMember?.kontak">
                  <strong>Kontak:</strong> {{ selectedMember?.kontak }}
                </p>
              </div>

              <div class="profile-popup-socials">
                <a
                  v-if="selectedMember?.instagram"
                  :href="selectedMember?.instagram"
                  target="_blank"
                  class="social-link"
                >
                  <span>📸 Instagram</span>
                </a>
                <a
                  v-if="selectedMember?.linkedin"
                  :href="selectedMember?.linkedin"
                  target="_blank"
                  class="social-link"
                >
                  <span>👔 LinkedIn</span>
                </a>
                <a
                  v-if="selectedMember?.github"
                  :href="selectedMember?.github"
                  target="_blank"
                  class="social-link"
                >
                  <span>💻 GitHub</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Container */
.fungsionaris-container {
  width: 100%;
  background-color: var(--background-light, #f8fafc);
  color: var(--text-color, #1e293b);
}

/* Hero Section */
.fungsionaris-hero {
  background: linear-gradient(135deg, #002e54, #004680, #001830);
  color: white;
  padding: 5rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.fungsionaris-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc0MCcgaGVpZ2h0PSc0MCcgdmlld0JveD0nMCAwIDQwIDQwJz48cGF0aCBkPSdNMTkuOTk1IDBDOC43MSAwIDAgOC43MSAwIDE5Ljk5NVMzMy42NiA0MCAxOS45OTUgNDBTNDAgOC43MSA0MCAxOS45OTUgMjQuNTcgMCAxOS45OTUgMHptLjAwNSAyQTM1IDM1IDAgMCAxIDM4IDE5Ljk5IDE4IDE4IDAgMSAxIDIgMTkuOTkgMzUgMzUgMCAwIDEgMjAgMnonIGZpbGw9JyNmZmYnIGZpbGwtb3BhY2l0eT0nMC4wMycgZmlsbC1ydWxlPSdldmVub2RkJy8+PC9zdmc+');
  background-size: 100px 100px;
  opacity: 0.2;
}

.fungsionaris-hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
}

.fungsionaris-hero h1 {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;
}

.fungsionaris-hero h1::after {
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

.fungsionaris-hero p {
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

.filter-select {
  padding: 0.75rem 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  background-color: white;
  font-size: 0.95rem;
  color: #1e293b;
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-select:focus {
  border-color: #004680;
  box-shadow: 0 4px 12px -1px rgba(0, 70, 128, 0.15);
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

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top-color: #004680;
  border-radius: 50%;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background-color: #004680;
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background-color: #00396a;
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 70, 128, 0.2);
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

/* Fungsionaris Grid Section */
.fungsionaris-grid-section {
  padding: 1rem 0 3rem;
}

.fungsionaris-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  width: 100%;
  position: relative;
  margin-bottom: 2rem;
}

.fungsionaris-card {
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

.fungsionaris-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.1);
}

.fungsionaris-image {
  height: 360px;
  position: relative;
  overflow: hidden;
}

.fungsionaris-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  transition: transform 0.5s ease;
}

.fungsionaris-card:hover .fungsionaris-image img {
  transform: scale(1.05);
}

.fungsionaris-overlay {
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.5rem;
  z-index: 2;
}

.fungsionaris-category {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: #004680;
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.fungsionaris-category::before {
  content: '🏆';
  font-size: 0.9rem;
}

.fungsionaris-category[title='BPH']::before {
  content: '👑';
}

.fungsionaris-category[title='Akademik']::before {
  content: '📚';
}

.fungsionaris-category[title='PSDM']::before {
  content: '👥';
}

.fungsionaris-category[title='Humas']::before {
  content: '🌐';
}

.fungsionaris-category[title='Kewirausahaan']::before {
  content: '💰';
}

.fungsionaris-category[title='MinBak']::before {
  content: '🎭';
}

.fungsionaris-category[title='Sosmas']::before {
  content: '🤝';
}

.fungsionaris-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.fungsionaris-content h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.fungsionaris-position {
  color: #004680;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.fungsionaris-email {
  color: #94a3b8;
  font-size: 0.85rem;
  margin-bottom: 1.5rem;
}

.fungsionaris-info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
  margin-bottom: 1.5rem;
  flex: 1;
}

.fungsionaris-info-grid .info-item:last-child {
  grid-column: span 2;
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

.fungsionaris-links {
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

.fungsionaris-info-text {
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
  .fungsionaris-grid {
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
  .fungsionaris-hero h1 {
    font-size: 2.5rem;
  }

  .fungsionaris-hero p {
    font-size: 1.1rem;
  }

  .filter-container {
    padding: 1.5rem 1rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .fungsionaris-grid {
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
  .fungsionaris-hero h1 {
    font-size: 2rem;
  }

  .fungsionaris-hero p {
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

  .fungsionaris-grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }

  .filter-options {
    flex-direction: column;
    gap: 0.75rem;
  }

  .filter-select,
  .reset-btn {
    width: 100%;
  }
}

/* Tambahkan styling untuk memastikan foto dalam org-photo juga terpusat dengan wajah */
.org-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 30%;
  border-radius: 50%;
  transition: transform 0.5s ease;
}

/* Popup Styles */
.profile-popup-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
}

.profile-popup {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: popupFadeIn 0.3s ease;
}

@keyframes popupFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.close-popup {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: #f1f5f9;
  border: none;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s ease;
}

.close-popup:hover {
  background-color: #e2e8f0;
  transform: rotate(90deg);
}

.profile-popup-content {
  padding: 1.5rem;
}

.profile-popup-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
}

.profile-popup-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid white;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.profile-popup-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-popup-info {
  width: 100%;
}

.profile-popup-info h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.profile-popup-position {
  font-size: 1.1rem;
  font-weight: 600;
  color: #004680;
  margin-bottom: 0.25rem;
}

.profile-popup-department {
  font-size: 0.95rem;
  color: #64748b;
  margin-bottom: 1rem;
}

.profile-popup-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
  justify-content: center;
}

.profile-popup-desc {
  margin: 1rem 0;
  padding: 0.75rem;
  background-color: #f1f5f9;
  border-radius: 0.5rem;
  font-style: italic;
  color: #64748b;
  text-align: center;
}

.profile-popup-contact {
  margin-top: 1rem;
  font-size: 0.9rem;
}

.profile-popup-socials {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.5rem;
  justify-content: center;
}

.social-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  background-color: #f8fafc;
  color: #1e293b;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
}

.social-link:hover {
  background-color: #e2e8f0;
  transform: translateY(-2px);
}
</style>
