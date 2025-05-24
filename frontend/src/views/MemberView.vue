<template>
  <div class="member-container">
    <!-- Hero Section -->
    <section class="member-hero">
      <div class="member-hero-content">
        <h1>Anggota HMP TI</h1>
        <p>
          Mengenal anggota Himpunan Mahasiswa Prodi Teknik Informatika UNESA yang berkomitmen untuk
          terus berkembang dan berprestasi
        </p>
      </div>
    </section>

    <div class="page-content">
      <!-- Filter dan Stats -->
      <section class="filter-section">
        <div class="filter-container">
          <div class="stats-items">
            <div class="stat-item">
              <div class="stat-number">{{ membersList.length }}</div>
              <div class="stat-label">Total Anggota</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">
                {{ membersList.filter((member) => member.status === 'aktif').length }}
              </div>
              <div class="stat-label">Anggota Aktif</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">
                {{
                  membersList.filter(
                    (member) => member.status === 'lulus' || member.status === 'alumni',
                  ).length
                }}
              </div>
              <div class="stat-label">Anggota Lulus</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ new Set(membersList.map((m) => m.angkatan)).size }}</div>
              <div class="stat-label">Angkatan</div>
            </div>
          </div>

          <!-- Search Box -->
          <div class="search-box">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Cari anggota berdasarkan nama, NIM, atau angkatan..."
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
              <option value="2022">Angkatan 2022</option>
              <option value="2021">Angkatan 2021</option>
              <option value="2020">Angkatan 2020</option>
              <option value="2019">Angkatan 2019</option>
              <option value="2018">Angkatan 2018</option>
              <option value="2017">Angkatan 2017</option>
              <option value="2016">Angkatan 2016</option>
              <option value="2015">Angkatan 2015</option>
            </select>
            <select v-model="filterStatus" class="filter-select">
              <option value="">Semua Status</option>
              <option value="aktif">Aktif</option>
              <option value="lulus">Lulus</option>
              <option value="dikeluarkan">Dikeluarkan</option>
              <option value="mengundurkan diri">Mengundurkan Diri</option>
            </select>
            <button class="reset-btn" @click="resetFilters">Reset Filter</button>
          </div>
        </div>
      </section>

      <!-- Member Section -->
      <section class="member-section animate-on-scroll">
        <div class="section-header">
          <h2 class="section-title">Daftar Anggota</h2>
          <div class="section-line"></div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>Memuat data anggota...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-container">
          <div class="error-icon">⚠️</div>
          <div class="message">{{ error }}</div>
          <button @click="fetchMembers" class="retry-btn">Coba Lagi</button>
        </div>

        <!-- Member List -->
        <section v-else class="member-grid-section animate-on-scroll">
          <!-- Empty State -->
          <div v-if="filteredMembers.length === 0" class="empty-state">
            <div class="empty-icon">👨‍🎓</div>
            <h3>Tidak ada anggota</h3>
            <p>Tidak ada anggota yang sesuai dengan kriteria pencarian.</p>
            <button @click="resetFilters" class="reset-btn">Reset Filter</button>
          </div>

          <!-- Member Grid -->
          <div class="member-grid">
            <!-- Member Card -->
            <div class="member-card" v-for="member in paginatedMembers" :key="member.id">
              <div class="member-image">
                <img
                  :src="member.foto"
                  :alt="member.nama"
                  :style="{ objectPosition: member.fotoPos || 'center 25%' }"
                  loading="lazy"
                />
              </div>
              <div class="member-content">
                <div class="member-header">
                  <h3>{{ member.nama }}</h3>
                  <span :class="['status-badge', member.status]">{{ member.status }}</span>
                </div>
                <p class="member-nim">{{ member.nim }}</p>
                <p class="member-email">{{ member.email }}</p>

                <div class="member-info-grid">
                  <div class="info-item">
                    <h4>Program Studi</h4>
                    <p>S1 Teknik Informatika</p>
                  </div>
                  <div class="info-item">
                    <h4>Angkatan</h4>
                    <p>{{ member.angkatan }}</p>
                  </div>
                  <div class="info-item">
                    <h4>Jenis Kelamin</h4>
                    <p>{{ member.jenisKelamin || '-' }}</p>
                  </div>
                </div>

                <div class="member-links">
                  <button @click="openProfilePopup(member)" class="action-btn">Profil</button>
                  <a
                    :href="member.linkedin || 'https://linkedin.com'"
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

            <div class="pagination-info-text" v-if="filteredMembers.length > 0">
              Menampilkan {{ (currentPage - 1) * itemsPerPage + 1 }}-{{
                Math.min(currentPage * itemsPerPage, filteredMembers.length)
              }}
              dari {{ filteredMembers.length }} anggota
            </div>
          </div>
        </section>
      </section>
    </div>

    <!-- Profile Popup -->
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
              <p class="profile-popup-nim">{{ selectedMember?.nim }}</p>

              <div class="profile-popup-badges">
                <span class="badge">Angkatan {{ selectedMember?.angkatan }}</span>
                <span class="badge">S1 Teknik Informatika</span>
                <span class="badge">{{ selectedMember?.jenisKelamin || '-' }}</span>
                <span :class="['status-badge', selectedMember?.status]">{{
                  selectedMember?.status
                }}</span>
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

              <div v-if="selectedMember?.prestasi?.length" class="profile-popup-achievements">
                <h3>Prestasi</h3>
                <ul>
                  <li v-for="(prestasi, index) in selectedMember.prestasi" :key="index">
                    {{ prestasi }}
                  </li>
                </ul>
              </div>

              <div v-if="selectedMember?.keahlian?.length" class="profile-popup-skills">
                <h3>Keahlian</h3>
                <div class="skill-tags">
                  <span
                    v-for="(skill, index) in selectedMember.keahlian"
                    :key="index"
                    class="skill-tag"
                  >
                    {{ skill }}
                  </span>
                </div>
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

<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import axios from 'axios'
import membersData from '@/data/members.json'

// @ts-ignore
const isDev = process.env.NODE_ENV === 'development'

// Interface untuk data anggota
interface Member {
  id: number
  nama: string
  nim: string
  angkatan: string
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
  fotoPos?: string
  status: string
  jenisKelamin?: string
}

// State
const membersList = ref<Member[]>([])
const loading = ref(true)
const error = ref('')
const searchQuery = ref('')
const filterAngkatan = ref('')
const filterStatus = ref('')

// State untuk popup profil
const selectedMember = ref<Member | null>(null)
const showProfilePopup = ref(false)

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(12)

// Posisi foto untuk setiap anggota
const fotoPosConfig: Record<string, string> = {
  // Posisi default untuk semua foto
  default: 'center 20%',
  // Tambahkan konfigurasi khusus jika diperlukan
}

// Function to get position for each member
const getFotoPosition = (nim: string): string => {
  return fotoPosConfig[nim] || fotoPosConfig['default']
}

// Fetch data
const fetchMembers = async () => {
  try {
    loading.value = true

    // Dalam mode development, gunakan data dummy
    if (isDev) {
      console.log('Development mode: menggunakan data dummy')
      useDummyData()
      return
    }

    // Dalam production, coba ambil dari API
    try {
      const response = await axios.get('/api/members')
      if (response.data && Array.isArray(response.data)) {
        membersList.value = response.data
      } else if (response.data && Array.isArray(response.data.data)) {
        membersList.value = response.data.data
      } else {
        console.warn('Format data dari server tidak sesuai, menggunakan data dummy')
        useDummyData()
      }
    } catch (err) {
      console.warn('Error fetching data dari API, menggunakan data dummy:', err)
      useDummyData()
    }

    loading.value = false
  } catch (err) {
    error.value = 'Gagal memuat data anggota'
    loading.value = false
    console.error('Error fatal:', err)
    membersList.value = []
  }
}

// Fungsi untuk memuat data dummy
const useDummyData = () => {
  console.log('Loading dummy data...')
  try {
    // Debug data
    console.log('Data members yang diimpor:', membersData)

    // Cek apakah data memiliki properti membersList
    if (membersData && Array.isArray(membersData.membersList)) {
      membersList.value = membersData.membersList.map((member) => ({
        ...member,
        fotoPos: getFotoPosition(member.nim),
        status: member.status || 'aktif',
      }))
    } else {
      // Fallback jika data tidak sesuai format yang diharapkan
      console.error('Format data members.json tidak sesuai:', membersData)
      membersList.value = []
      error.value = 'Data tidak tersedia dalam format yang benar'
    }
  } catch (err) {
    console.error('Error saat memproses data members:', err)
    membersList.value = []
    error.value = 'Error saat memproses data anggota'
  }

  loading.value = false
}

// Computed untuk filtering
const filteredMembers = computed(() => {
  if (!Array.isArray(membersList.value)) {
    console.error('membersList.value bukan array')
    return []
  }

  const searchLower = searchQuery.value.toLowerCase()

  return membersList.value.filter((member) => {
    if (!member) return false

    const matchesSearch =
      searchLower === '' ||
      (member.nama && member.nama.toLowerCase().includes(searchLower)) ||
      (member.nim && member.nim.toLowerCase().includes(searchLower)) ||
      (member.angkatan && member.angkatan.toLowerCase().includes(searchLower))

    const matchesAngkatan = filterAngkatan.value === '' || member.angkatan === filterAngkatan.value
    const matchesStatus = filterStatus.value === '' || member.status === filterStatus.value

    return matchesSearch && matchesAngkatan && matchesStatus
  })
})

// Total pages based on filtered data
const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredMembers.value.length / itemsPerPage.value))
})

// Computed untuk pagination
const paginatedMembers = computed(() => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
  }

  const startIndex = (currentPage.value - 1) * itemsPerPage.value
  const endIndex = Math.min(startIndex + itemsPerPage.value, filteredMembers.value.length)
  return filteredMembers.value.slice(startIndex, endIndex)
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
  currentPage.value = 1
}

// Reset filters
const resetFilters = () => {
  searchQuery.value = ''
  filterAngkatan.value = ''
  filterStatus.value = ''
  currentPage.value = 1
}

const changePage = (newPage: number) => {
  if (newPage === currentPage.value) return
  currentPage.value = newPage

  // Scroll ke atas konten saat ganti halaman
  const categorySection = document.querySelector('.member-section') as HTMLElement
  if (categorySection) {
    window.scrollTo({
      top: categorySection.offsetTop - 50,
      behavior: 'smooth',
    })
  }
}

// Watch for filter changes to reset pagination
watch([searchQuery, filterAngkatan, filterStatus], () => {
  currentPage.value = 1
})

// Fungsi untuk menampilkan popup profil
const openProfilePopup = (member: Member) => {
  selectedMember.value = member
  showProfilePopup.value = true
}

// Fungsi untuk menutup popup profil
const closeProfilePopup = () => {
  showProfilePopup.value = false
}

// Load data saat komponen dimount
onMounted(() => {
  fetchMembers()

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

<style scoped>
/* Container */
.member-container {
  width: 100%;
  background-color: var(--background-light, #f8fafc);
  color: var(--text-color, #1e293b);
}

.page-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* Hero Section */
.member-hero {
  background: linear-gradient(135deg, #002e54, #004680, #001830);
  color: white;
  padding: 5rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.member-hero::before {
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

.member-hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
}

.member-hero h1 {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;
}

.member-hero h1::after {
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

.member-hero p {
  font-size: 1.25rem;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
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
  gap: 3rem;
  padding-bottom: 2rem;
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
  min-width: 150px;
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
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  will-change: transform, box-shadow;
}

.reset-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px -1px rgba(0, 0, 0, 0.1);
}

/* Member Section */
.member-section {
  margin-bottom: 3rem;
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

.section-subtitle {
  color: #64748b;
  font-size: 1.1rem;
  margin-top: 1rem;
}

/* Member Grid */
.member-grid-section {
  padding: 1rem 0 3rem;
}

.member-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  width: 100%;
  position: relative;
  margin-bottom: 2rem;
}

.member-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid #f0f0f0;
  will-change: transform, box-shadow;
}

.member-card:hover {
  transform: translateY(-2px) scale(1.005);
  box-shadow: 0 8px 15px -6px rgba(0, 0, 0, 0.06);
}

.member-image {
  height: 360px;
  position: relative;
  overflow: hidden;
}

.member-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  transition: transform 0.5s cubic-bezier(0.215, 0.61, 0.355, 1);
  will-change: transform;
}

.member-card:hover .member-image img {
  transform: scale(1.02);
}

.member-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  border-top: 1px solid #f5f5f5;
}

.member-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.member-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.4;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-flex;
  align-items: center;
}

.status-badge.aktif {
  background-color: #dcfce7;
  color: #166534;
}

.status-badge.aktif::before {
  content: '•';
  display: inline-block;
  margin-right: 0.25rem;
  font-size: 1.5rem;
  line-height: 0;
  position: relative;
  top: 0.1rem;
}

.status-badge.cuti {
  background-color: #fef3c7;
  color: #92400e;
}

.status-badge.cuti::before {
  content: '•';
  display: inline-block;
  margin-right: 0.25rem;
  font-size: 1.5rem;
  line-height: 0;
  position: relative;
  top: 0.1rem;
}

.member-nim {
  color: #004680;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.member-email {
  color: #94a3b8;
  font-size: 0.85rem;
  margin-bottom: 1.5rem;
}

.member-info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
  margin-bottom: 1.5rem;
  flex: 1;
}

@media (min-width: 640px) {
  .member-info-grid {
    grid-template-columns: repeat(3, 1fr);
  }
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

.member-links {
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
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  background-color: #004680;
  color: white;
  border: none;
  cursor: pointer;
  will-change: transform, background-color, box-shadow;
}

.action-btn:hover {
  background-color: #00396a;
  transform: translateY(-2px);
  box-shadow: 0 8px 15px -3px rgba(0, 70, 128, 0.15);
}

.action-btn.secondary {
  background-color: #f1f5f9;
  color: #004680;
}

.action-btn.secondary:hover {
  background-color: #e2e8f0;
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

/* Profile Popup */
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
  max-width: 800px;
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
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, background-color;
}

.close-popup:hover {
  background-color: #e2e8f0;
  transform: rotate(90deg);
}

.profile-popup-content {
  padding: 3rem;
}

.profile-popup-header {
  gap: 3rem;
}

.profile-popup-image {
  width: 100%;
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
}

.profile-popup-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-popup-info h2 {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.profile-popup-nim {
  font-size: 1.1rem;
  color: #64748b;
  margin-bottom: 1rem;
}

.profile-popup-badges {
  margin: 1.5rem 0;
}

.badge {
  background-color: #f1f5f9;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.9rem;
  color: #1e293b;
}

.profile-popup-desc {
  margin: 2rem 0;
  padding: 1.5rem;
}

.profile-popup-contact {
  margin: 2rem 0;
}

.profile-popup-achievements h3,
.profile-popup-skills h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1e293b;
}

.profile-popup-achievements ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.profile-popup-achievements li {
  padding: 0.75rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-tag {
  background-color: #f1f5f9;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.9rem;
  color: #1e293b;
}

.profile-popup-socials {
  margin-top: 2rem;
}

.social-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background-color: #f8fafc;
  border-radius: 0.5rem;
  color: #1e293b;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  will-change: transform, background-color;
}

.social-link:hover {
  background-color: #f1f5f9;
  transform: translateY(-1px);
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

.pagination-info-text {
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
    transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: opacity, transform;
}

.animate-in {
  opacity: 1;
  transform: translateY(0);
}

@keyframes cardAppear {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.member-card {
  animation: cardAppear 0.5s backwards;
}

.member-card:nth-child(1) {
  animation-delay: 0.1s;
}
.member-card:nth-child(2) {
  animation-delay: 0.15s;
}
.member-card:nth-child(3) {
  animation-delay: 0.2s;
}
.member-card:nth-child(4) {
  animation-delay: 0.25s;
}
.member-card:nth-child(5) {
  animation-delay: 0.3s;
}
.member-card:nth-child(6) {
  animation-delay: 0.35s;
}
.member-card:nth-child(7) {
  animation-delay: 0.4s;
}
.member-card:nth-child(8) {
  animation-delay: 0.45s;
}
.member-card:nth-child(9) {
  animation-delay: 0.5s;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .page-content {
    padding: 1.5rem;
  }

  .member-hero {
    padding: 5rem 1.5rem;
  }

  .filter-container {
    padding: 1.5rem;
  }

  .member-grid {
    gap: 2rem;
  }

  .profile-popup-content {
    padding: 2rem;
  }
}

@media (max-width: 768px) {
  .member-hero {
    padding: 4rem 1rem;
  }

  .stats-items {
    gap: 2rem;
    padding-bottom: 1.5rem;
  }

  .member-content {
    padding: 1.5rem;
  }

  .profile-popup-content {
    padding: 1.5rem;
  }

  .profile-popup-header {
    gap: 2rem;
  }
}

@media (max-width: 640px) {
  .page-content {
    padding: 1rem;
  }

  .member-hero {
    padding: 3rem 1rem;
  }

  .filter-container {
    padding: 1rem;
  }

  .stats-items {
    gap: 1.5rem;
    padding-bottom: 1rem;
  }

  .member-content {
    padding: 1.25rem;
  }

  .profile-popup-content {
    padding: 1rem;
  }

  .filter-select {
    width: 100%;
    min-width: unset;
  }

  .filter-options {
    flex-direction: column;
    width: 100%;
  }
}

.member-overlay {
  display: none;
}

.member-category {
  display: none;
}

@media (min-width: 640px) {
  .member-info-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 480px) {
  .member-info-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

/* Button Hover Animation */
.reset-btn {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  will-change: transform, box-shadow;
}

.reset-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px -1px rgba(0, 0, 0, 0.1);
}

/* Close Button Animation */
.close-popup {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, background-color;
}

.close-popup:hover {
  background-color: #e2e8f0;
  transform: rotate(90deg);
}

/* Social Link Animation */
.social-link {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  will-change: transform, background-color;
}

.social-link:hover {
  background-color: #f1f5f9;
  transform: translateY(-1px);
}

/* Pagination Button Animation */
.pagination-btn:not(:disabled),
.page-number {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, background-color, color, border-color;
}

.pagination-btn:not(:disabled):hover {
  background-color: #004680;
  color: white;
  border-color: #004680;
  transform: translateY(-1px);
}

.page-number:hover {
  background-color: #f8fafc;
  transform: translateY(-1px);
}
</style>
