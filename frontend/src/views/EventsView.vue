<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import eventsData from '@/data/events.json'

// Interface untuk data kegiatan
interface EventItem {
  id: number
  title: string
  category: string
  description: string
  location: string
  time: string
  date: {
    day: string
    month: string
    year: string
  }
  imageUrl: string
  slots: {
    registered: number
    total: number
  }
  speaker?: string
  level?: string // Mengubah dari union type ke string untuk kompatibilitas dengan JSON
  htm?: string // Format: "Rp XX.XXX (Internal) / Rp XX.XXX (Eksternal)"
  formUrl?: string // URL Google Form untuk pendaftaran
  contacts?: {
    phone: string
    name: string
  }[]
}

interface Category {
  id: string
  name: string
  icon?: string
}

// Data kategori dari file JSON
const categories = ref<Category[]>(eventsData.categories)

// Data kegiatan dari file JSON
const originalEventItems = ref<EventItem[]>(eventsData.eventItems)

// Stats untuk kegiatan dari file JSON
const eventStats = ref(eventsData.eventStats)

// State untuk aktif kategori
const activeCategory = ref('all')

// State untuk pencarian
const searchQuery = ref('')

// Filtered events items
const filteredEvents = computed(() => {
  let result = [...originalEventItems.value]

  // Filter berdasarkan kategori
  if (activeCategory.value !== 'all') {
    result = result.filter((item) => item.category === activeCategory.value)
  }

  // Filter berdasarkan pencarian
  if (searchQuery.value.trim() !== '') {
    const query = searchQuery.value.toLowerCase().trim()
    result = result.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query),
    )
  }

  return result
})

// Paginasi
const currentPage = ref(1)
const itemsPerPage = ref(6)

// Computed untuk item yang ditampilkan berdasarkan paginasi
const paginatedEvents = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value
  const endIndex = startIndex + itemsPerPage.value
  return filteredEvents.value.slice(startIndex, endIndex)
})

// Computed total halaman
const totalPages = computed(() => {
  return Math.ceil(filteredEvents.value.length / itemsPerPage.value)
})

// Fungsi untuk mengganti halaman dan scroll ke posisi yang tepat
const changePage = (newPage: number) => {
  if (newPage === currentPage.value) return
  currentPage.value = newPage

  // Scroll ke atas konten saat ganti halaman
  const eventsSection = document.querySelector('.events-section') as HTMLElement
  if (eventsSection) {
    window.scrollTo({
      top: eventsSection.offsetTop - 60,
      behavior: 'smooth',
    })
  }
}

// Method untuk navigasi paginasi
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    changePage(page)
  }
}

// Pagination methods
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
  const maxPagesToShow = 6
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

// Method untuk mengubah kategori
const setCategory = (categoryId: string) => {
  activeCategory.value = categoryId
  // Reset ke halaman pertama saat kategori berubah
  currentPage.value = 1
}

// Fungsi untuk melakukan pencarian
const handleSearch = () => {
  // Reset halaman ke halaman pertama saat pencarian berubah
  currentPage.value = 1
}

// Fungsi untuk reset semua filter
const resetFilters = () => {
  activeCategory.value = 'all'
  searchQuery.value = ''
  currentPage.value = 1
}

// Helper function untuk mengkonversi nama bulan menjadi nomor bulan (0-11)
const getMonthNumber = (monthName: string): number => {
  const months: { [key: string]: number } = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    Mei: 4,
    Jun: 5,
    Jul: 6,
    Ags: 7,
    Sep: 8,
    Okt: 9,
    Nov: 10,
    Des: 11,
  }
  return months[monthName] || 0
}

// Data countdown event mendatang
const upcomingEvent = ref({
  title: '',
  imageUrl: '',
  id: 0,
  formUrl: '',
  countdown: {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  },
})

// Interval untuk countdown
let countdownInterval: ReturnType<typeof setInterval> | null = null

// Fungsi untuk mendapatkan event berdasarkan ID
const findEventById = (id: number): EventItem | undefined => {
  return originalEventItems.value.find((event) => event.id === id)
}

// Fungsi untuk mendapatkan event yang paling dekat waktunya
const findNextUpcomingEvent = (): EventItem | null => {
  if (originalEventItems.value.length === 0) return null

  const now = new Date()
  let closestEvent: EventItem | null = null
  let minTimeDiff = Number.MAX_SAFE_INTEGER

  originalEventItems.value.forEach((event) => {
    const eventDay = parseInt(event.date.day)
    const eventMonth = getMonthNumber(event.date.month)
    const eventYear = parseInt(event.date.year)

    // Ambil waktu dari string waktu event
    let timeString = event.time.split(' ')[0] // Default ambil bagian pertama
    let eventHours = 0
    let eventMinutes = 0

    // Cek jika formatnya "07:00 - Selesai WIB" atau "07:00 s/d Selesai WIB"
    if (event.time.toLowerCase().includes('selesai')) {
      // Jika acara sampai selesai, gunakan waktu mulai acara untuk countdown
      timeString = event.time.split(/\s*[-s/d]\s*/)[0].trim()
      ;[eventHours, eventMinutes] = timeString.split(':').map((num) => parseInt(num))
    } else {
      // Jika ada waktu spesifik
      ;[eventHours, eventMinutes] = timeString.split(':').map((num) => parseInt(num))
    }

    // Buat objek Date dari tanggal dan waktu event
    const eventDate = new Date(eventYear, eventMonth, eventDay, eventHours, eventMinutes)

    // Hitung selisih waktu dalam milidetik
    const timeDiff = eventDate.getTime() - now.getTime()

    // Pilih event yang belum terjadi dan paling dekat
    if (timeDiff > 0 && timeDiff < minTimeDiff) {
      minTimeDiff = timeDiff
      closestEvent = event
    }
  })

  return closestEvent
}

// Fungsi untuk update countdown
const updateCountdown = () => {
  const nextEvent = findNextUpcomingEvent()

  if (!nextEvent) {
    // Tidak ada event mendatang
    upcomingEvent.value = {
      title: 'Tidak ada event mendatang',
      imageUrl: 'https://picsum.photos/id/239/600/300',
      id: 0,
      formUrl: '',
      countdown: { days: 0, hours: 0, minutes: 0, seconds: 0 },
    }
    return
  }

  // Update info event
  upcomingEvent.value.title = nextEvent.title
  upcomingEvent.value.imageUrl = nextEvent.imageUrl
  upcomingEvent.value.id = nextEvent.id
  upcomingEvent.value.formUrl = nextEvent.formUrl || ''

  // Hitung countdown
  const now = new Date()
  const eventDay = parseInt(nextEvent.date.day)
  const eventMonth = getMonthNumber(nextEvent.date.month)
  const eventYear = parseInt(nextEvent.date.year)

  // Ambil waktu dari string waktu event
  let timeString = nextEvent.time.split(' ')[0] // Default ambil bagian pertama
  let eventHours = 0
  let eventMinutes = 0

  // Cek jika formatnya "07:00 - Selesai WIB" atau "07:00 s/d Selesai WIB"
  if (nextEvent.time.toLowerCase().includes('selesai')) {
    // Jika acara sampai selesai, gunakan waktu mulai acara untuk countdown
    timeString = nextEvent.time.split(/\s*[-s/d]\s*/)[0].trim()
    ;[eventHours, eventMinutes] = timeString.split(':').map((num) => parseInt(num))
  } else {
    // Jika ada waktu spesifik
    ;[eventHours, eventMinutes] = timeString.split(':').map((num) => parseInt(num))
  }

  // Buat objek Date dari tanggal dan waktu event
  const eventDate = new Date(eventYear, eventMonth, eventDay, eventHours, eventMinutes)

  // Selisih waktu dalam milidetik
  const timeDiff = eventDate.getTime() - now.getTime()

  // Jika event sudah lewat, tampilkan 0
  if (timeDiff <= 0) {
    upcomingEvent.value.countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 }
    return
  }

  // Konversi ke hari, jam, menit, detik
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000)

  // Update countdown
  upcomingEvent.value.countdown = { days, hours, minutes, seconds }
}

// State untuk modal reminder
const isReminderModalOpen = ref(false)
const reminderEmail = ref('')
const reminderOptions = ref({
  email: true,
  browser: false,
  calendar: false,
})
const reminderSuccess = ref(false)
const reminderLoading = ref(false)

// Fungsi untuk membuka modal reminder
const openReminderModal = () => {
  isReminderModalOpen.value = true
  // Reset state
  reminderEmail.value = ''
  reminderSuccess.value = false
  reminderLoading.value = false

  // Reset opsi reminder
  reminderOptions.value = {
    email: true,
    browser: false,
    calendar: false,
  }
}

// Fungsi untuk menutup modal
const closeReminderModal = () => {
  isReminderModalOpen.value = false
}

// Fungsi untuk submit form reminder
const submitReminder = () => {
  // Validasi email sederhana
  if (!reminderEmail.value || !reminderEmail.value.includes('@')) {
    alert('Mohon masukkan alamat email yang valid')
    return
  }

  // Simulasi loading
  reminderLoading.value = true

  // Simulasi request ke backend (timeout)
  setTimeout(() => {
    reminderLoading.value = false
    reminderSuccess.value = true

    // Tutup modal setelah beberapa detik
    setTimeout(() => {
      closeReminderModal()
    }, 3000)
  }, 1500)
}

onMounted(() => {
  // Scroll ke posisi paling atas saat halaman dimuat
  window.scrollTo(0, 0)

  console.log('Events page mounted, items:', filteredEvents.value.length)

  // Inisialisasi dan mulai countdown
  updateCountdown()

  // Update countdown setiap detik
  countdownInterval = setInterval(updateCountdown, 1000)

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

// Bersihkan interval saat komponen di-unmount
const beforeUnmount = () => {
  if (countdownInterval !== null) {
    clearInterval(countdownInterval)
    countdownInterval = null
  }
}
</script>

<template>
  <div class="events-container">
    <!-- Hero Section (mengikuti style DosenView) -->
    <section class="events-hero">
      <div class="events-hero-content">
        <h1>Kegiatan HMP TI</h1>
        <p>
          Temukan berbagai kegiatan menarik dari Himpunan Mahasiswa Prodi Teknik Informatika UNESA
        </p>
      </div>
    </section>

    <div class="page-content">
      <!-- Filter dan Stats (mengikuti style DosenView) -->
      <section class="filter-section">
        <div class="filter-container">
          <div class="stats-items">
            <div class="stat-item" v-for="stat in eventStats" :key="stat.id">
              <div class="stat-number">{{ stat.number }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>

          <!-- Search Box -->
          <div class="search-box">
            <input
              type="text"
              placeholder="Cari kegiatan..."
              class="search-input"
              v-model="searchQuery"
              @input="handleSearch"
            />
            <span class="search-icon">🔍</span>
          </div>

          <!-- Filter Options -->
          <div class="filter-options">
            <button
              v-for="category in categories"
              :key="category.id"
              :class="['category-btn', { active: activeCategory === category.id }]"
              @click="setCategory(category.id)"
            >
              <span v-if="category.icon" class="category-icon">{{ category.icon }}</span>
              {{ category.name }}
            </button>
          </div>
        </div>
      </section>

      <!-- Main Content -->
      <main class="main-content">
        <!-- Events List Section -->
        <section class="events-section animate-on-scroll">
          <div class="section-header">
            <h2 class="section-title">Kegiatan Terbaru</h2>
            <div class="section-line"></div>
          </div>

          <!-- Empty state -->
          <div v-if="filteredEvents.length === 0" class="empty-state">
            <div class="empty-icon">📅</div>
            <h3>Tidak ada kegiatan</h3>
            <p>Tidak ada kegiatan tersedia untuk kategori ini saat ini.</p>
            <button @click="resetFilters" class="reset-btn">Reset Filter</button>
          </div>

          <!-- Events Grid -->
          <div v-else class="events-grid">
            <!-- Event Card -->
            <div class="event-card" v-for="event in paginatedEvents" :key="event.id">
              <div class="event-image">
                <img :src="event.imageUrl" :alt="event.title" />
                <div class="event-date">
                  <span class="day">{{ event.date.day }}</span>
                  <span class="month">{{ event.date.month }}</span>
                </div>
                <div class="event-overlay">
                  <span class="event-category">{{
                    categories.find((c) => c.id === event.category)?.icon
                  }}</span>
                </div>
              </div>
              <div class="event-content">
                <div class="event-badge">
                  {{ categories.find((c) => c.id === event.category)?.name }}
                </div>
                <h3 class="event-title">{{ event.title }}</h3>
                <div class="event-details">
                  <p><i>📍</i> {{ event.location }}</p>
                  <p><i>🕒</i> {{ event.time }}</p>
                  <p><i>💰</i> {{ event.htm }}</p>
                </div>
                <p class="event-description">{{ event.description }}</p>
                <div class="event-info-grid">
                  <div class="info-item">
                    <h4>Pembicara</h4>
                    <p>{{ event.speaker }}</p>
                  </div>
                  <div class="info-item">
                    <h4>Level</h4>
                    <p>{{ event.level }}</p>
                  </div>
                </div>
                <div class="event-links">
                  <a :href="event.formUrl" target="_blank" class="action-btn">Daftar Sekarang</a>
                  <router-link :to="`/kegiatan/${event.id}`" class="action-btn secondary"
                    >Detail</router-link
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div class="pagination-container" v-if="totalPages > 1">
            <div class="pagination">
              <button class="pagination-btn" :disabled="currentPage === 1" @click="prevPage">
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
                @click="nextPage"
              >
                Selanjutnya &raquo;
              </button>
            </div>

            <div class="events-info-text" v-if="filteredEvents.length > 0">
              Menampilkan {{ (currentPage - 1) * itemsPerPage + 1 }}-{{
                Math.min(currentPage * itemsPerPage, filteredEvents.length)
              }}
              dari {{ filteredEvents.length }} kegiatan
            </div>
          </div>
        </section>

        <!-- Upcoming Event -->
        <section class="upcoming-event-section animate-on-scroll">
          <div class="section-header">
            <h2 class="section-title">Event Mendatang</h2>
            <div class="section-line"></div>
          </div>

          <div class="upcoming-event">
            <div class="upcoming-card">
              <img :src="upcomingEvent.imageUrl" alt="Acara Mendatang" />
              <div class="upcoming-countdown">
                <div class="countdown-item">
                  <span class="count">{{ upcomingEvent.countdown.days }}</span>
                  <span class="label">Hari</span>
                </div>
                <div class="countdown-item">
                  <span class="count">{{ upcomingEvent.countdown.hours }}</span>
                  <span class="label">Jam</span>
                </div>
                <div class="countdown-item">
                  <span class="count">{{ upcomingEvent.countdown.minutes }}</span>
                  <span class="label">Menit</span>
                </div>
                <div class="countdown-item">
                  <span class="count">{{ upcomingEvent.countdown.seconds }}</span>
                  <span class="label">Detik</span>
                </div>
              </div>
              <h3>{{ upcomingEvent.title }}</h3>
              <div class="upcoming-actions">
                <a href="#" class="reminder-btn" @click.prevent="openReminderModal"
                  >Ingatkan Saya</a
                >
                <router-link
                  v-if="upcomingEvent.id > 0"
                  :to="`/kegiatan/${upcomingEvent.id}`"
                  class="detail-btn"
                >
                  Lihat Detail
                </router-link>
                <a
                  v-if="upcomingEvent.id > 0 && upcomingEvent.formUrl"
                  :href="upcomingEvent.formUrl"
                  target="_blank"
                  class="action-btn secondary mt-2"
                >
                  Daftar Sekarang
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>

  <!-- Modal Reminder -->
  <div class="reminder-modal-overlay" v-if="isReminderModalOpen" @click="closeReminderModal">
    <div class="reminder-modal" @click.stop>
      <div class="modal-header">
        <h3>Ingatkan Saya</h3>
        <button class="close-btn" @click="closeReminderModal">&times;</button>
      </div>

      <div v-if="!reminderSuccess" class="modal-content">
        <p>
          Dapatkan pengingat untuk event <strong>{{ upcomingEvent.title }}</strong>
        </p>

        <div class="form-group">
          <label for="reminderEmail">Email</label>
          <input
            type="email"
            id="reminderEmail"
            v-model="reminderEmail"
            placeholder="email@contoh.com"
            :disabled="reminderLoading"
          />
        </div>

        <div class="reminder-options">
          <h4>Jenis Pengingat</h4>

          <div class="option-item">
            <input
              type="checkbox"
              id="emailReminder"
              v-model="reminderOptions.email"
              :disabled="reminderLoading"
            />
            <label for="emailReminder">Email (H-1 kegiatan)</label>
          </div>

          <div class="option-item">
            <input
              type="checkbox"
              id="browserReminder"
              v-model="reminderOptions.browser"
              :disabled="reminderLoading"
            />
            <label for="browserReminder">Notifikasi Browser</label>
          </div>

          <div class="option-item">
            <input
              type="checkbox"
              id="calendarReminder"
              v-model="reminderOptions.calendar"
              :disabled="reminderLoading"
            />
            <label for="calendarReminder">Tambahkan ke Kalender</label>
          </div>
        </div>

        <button class="submit-btn" @click="submitReminder" :disabled="reminderLoading">
          <span v-if="reminderLoading" class="loading-spinner-small"></span>
          <span v-else>Simpan Pengingat</span>
        </button>
      </div>

      <div v-else class="modal-content success-content">
        <div class="success-icon">✓</div>
        <h3>Berhasil!</h3>
        <p>Pengingat telah diatur. Kami akan mengirimkan notifikasi sebelum event dimulai.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Container */
.events-container {
  width: 100%;
  background-color: var(--background-light, #f8fafc);
  color: var(--text-color, #1e293b);
}

/* Hero Section */
.events-hero {
  background: linear-gradient(135deg, #002e54, #004680, #001830);
  color: white;
  padding: 5rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.events-hero::before {
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

.events-hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
}

.events-hero h1 {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;
}

.events-hero h1::after {
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

.events-hero p {
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
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
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

.category-icon {
  font-size: 1.25rem;
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

/* Main Content */
.main-content {
  margin-top: 2rem;
}

/* Section Header */
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

/* Events Section */
.events-section {
  margin-bottom: 4rem;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
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

/* Events Grid */
.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  width: 100%;
  position: relative;
  margin-bottom: 2rem;
}

.event-card {
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

.event-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.1);
}

.event-image {
  position: relative;
  overflow: hidden;
  aspect-ratio: 11/16;
}

.event-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.event-card:hover .event-image img {
  transform: scale(1.05);
}

.event-date {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background-color: #ff6b00;
  color: white;
  border-radius: 0.5rem;
  padding: 0.5rem;
  text-align: center;
  min-width: 60px;
  z-index: 2;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.event-date .day {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
}

.event-date .month {
  display: block;
  font-size: 0.8rem;
  text-transform: uppercase;
}

.event-overlay {
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.5rem;
  z-index: 2;
}

.event-category {
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

.event-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.event-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 2rem;
  background-color: #004680;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  align-self: flex-start;
}

.event-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: #1e293b;
  line-height: 1.3;
}

.event-details {
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  color: #94a3b8;
}

.event-details p {
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.event-description {
  font-size: 0.9rem;
  color: #64748b;
  margin-bottom: 1.5rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.event-info-grid {
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

.event-links {
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
  text-decoration: none;
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

.events-info-text {
  text-align: center;
  color: #64748b;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

/* Upcoming Event Section */
.upcoming-event-section {
  margin-bottom: 4rem;
}

.upcoming-event {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.upcoming-card {
  position: relative;
  padding-bottom: 2rem;
}

.upcoming-card img {
  width: 100%;
  height: auto;
  aspect-ratio: 4/1;
  object-fit: cover;
  object-position: top;
}

.upcoming-countdown {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: -30px auto 1.5rem;
  position: relative;
  max-width: 400px;
}

.countdown-item {
  background-color: #004680;
  color: white;
  border-radius: 0.5rem;
  padding: 0.75rem;
  min-width: 70px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.countdown-item .count {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
}

.countdown-item .label {
  display: block;
  font-size: 0.75rem;
  text-transform: uppercase;
}

.upcoming-card h3 {
  font-size: 1.5rem;
  padding: 0 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #1e293b;
  font-weight: 700;
}

.upcoming-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  padding: 0 1.5rem;
  flex-wrap: wrap;
}

.reminder-btn,
.detail-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  text-align: center;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  flex: 1;
  max-width: 200px;
}

.reminder-btn {
  background-color: #ff6b00;
  color: white;
}

.reminder-btn:hover {
  background-color: #e05d00;
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(255, 107, 0, 0.2);
}

.detail-btn {
  background-color: #004680;
  color: white;
}

.detail-btn:hover {
  background-color: #00396a;
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 70, 128, 0.2);
}

.action-btn.secondary.mt-2 {
  margin-top: 1rem;
  flex-basis: 100%;
  background-color: #ff6b00;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  text-align: center;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.action-btn.secondary.mt-2:hover {
  background-color: #e05d00;
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(255, 107, 0, 0.2);
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
  .events-grid {
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
  .events-hero h1 {
    font-size: 2.5rem;
  }

  .events-hero p {
    font-size: 1.1rem;
  }

  .filter-container {
    padding: 1.5rem 1rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .events-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.25rem;
  }

  .upcoming-countdown {
    gap: 0.5rem;
    padding: 0 1rem;
  }

  .countdown-item {
    min-width: 60px;
    padding: 0.5rem;
  }
}

@media (max-width: 480px) {
  .events-hero h1 {
    font-size: 2rem;
  }

  .events-hero p {
    font-size: 1rem;
  }

  .filter-options {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 1rem;
    justify-content: flex-start;
  }

  .category-btn {
    padding: 0.5rem 0.8rem;
    font-size: 0.875rem;
    white-space: nowrap;
  }

  .stats-items {
    flex-direction: column;
    gap: 1rem;
  }

  .stat-item {
    width: 100%;
  }

  .pagination {
    flex-direction: column;
    gap: 0.75rem;
  }

  .events-grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }

  .upcoming-countdown {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .countdown-item {
    min-width: 60px;
    flex: 1 1 35%;
  }

  .upcoming-actions {
    flex-direction: column;
    align-items: center;
  }

  .reminder-btn,
  .detail-btn {
    width: 100%;
    max-width: 100%;
  }
}

/* Modal styles */
.reminder-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
}

.reminder-modal {
  background: white;
  border-radius: 1rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  padding: 1.25rem 1.5rem;
  background-color: #004680;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.modal-content {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
}

.form-group input:focus {
  outline: none;
  border-color: #004680;
  box-shadow: 0 0 0 3px rgba(0, 70, 128, 0.1);
}

.reminder-options {
  margin-bottom: 1.5rem;
}

.reminder-options h4 {
  font-size: 1rem;
  margin-bottom: 0.75rem;
  color: #1e293b;
}

.option-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.option-item input[type='checkbox'] {
  margin-right: 0.5rem;
}

.submit-btn {
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: #ff6b00;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}

.submit-btn:hover:not(:disabled) {
  background-color: #e05d00;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner-small {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s ease-in-out infinite;
}

.success-content {
  text-align: center;
  padding: 2rem 1.5rem;
}

.success-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background-color: #10b981;
  color: white;
  border-radius: 50%;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.success-content h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.success-content p {
  color: #64748b;
}
</style>
