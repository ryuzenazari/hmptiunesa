<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import eventsData from '@/data/events.json'

// Mendefinisikan interface
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
  level?: 'Pemula' | 'Menengah' | 'Mahir' | 'Semua Level'
  htm?: string // Format: "Rp XX.XXX (Internal) / Rp XX.XXX (Eksternal)"
  htm_note?: string // Format: "*Internal: Prodi TI, SI, PTI, dan MI"
  formUrl?: string // URL Google Form untuk pendaftaran
  contacts?: {
    phone: string
    name: string
  }[]
}

const route = useRoute()
const router = useRouter()

// Data dari file JSON
const eventList = ref<EventItem[]>(eventsData.eventItems as EventItem[])

// State untuk menyimpan detail kegiatan
const event = ref<EventItem | null>(null)
const loading = ref(true)
const error = ref('')
const serverDate = ref<Date | null>(null)

// State untuk lightbox/modal
const showImageModal = ref(false)

// State untuk zoom di modal
const isZoomed = ref(false)
// State untuk posisi kursor relatif terhadap gambar
const cursorPosition = ref({ x: 0.5, y: 0.5 }) // Default ke tengah

// Computed untuk mendapatkan event ID dari parameter route
const eventId = computed(() => Number(route.params.id))

// Format nomor telepon untuk WhatsApp link
const formatWhatsAppLink = (phoneNumber: string): string => {
  // Hilangkan semua karakter non-digit
  const digits = phoneNumber.replace(/\D/g, '')

  // Jika nomor dimulai dengan 0, ganti dengan 62
  let formattedNumber = digits
  if (digits.startsWith('0')) {
    formattedNumber = '62' + digits.substring(1)
  }

  return `https://wa.me/${formattedNumber}`
}

// Fungsi untuk menampilkan modal gambar
const openImageModal = () => {
  showImageModal.value = true
}

// Fungsi untuk menutup modal gambar
const closeImageModal = () => {
  showImageModal.value = false
  isZoomed.value = false
}

// Fungsi untuk menutup modal gambar ketika mengklik di luar gambar
const handleOutsideClick = (event: MouseEvent) => {
  const modalContent = document.querySelector('.image-modal-content')
  if (modalContent && !modalContent.contains(event.target as Node)) {
    closeImageModal()
  }
}

// Fungsi untuk menutup modal dengan tombol ESC
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && showImageModal.value) {
    closeImageModal()
  }
}

// Fungsi untuk toggle zoom pada gambar di modal
const toggleZoom = (event: MouseEvent) => {
  // Set posisi kursor sebelum toggle zoom
  if (!isZoomed.value) {
    // Ambil posisi kursor saat akan zoom
    const imgElement = event.target as HTMLImageElement
    const rect = imgElement.getBoundingClientRect()
    
    // Hitung posisi relatif
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    
    // Update posisi kursor
    cursorPosition.value = { x, y }
  }
  
  isZoomed.value = !isZoomed.value
  event.stopPropagation() // Mencegah modal tertutup saat mengklik gambar
}

// Fungsi untuk mengikuti pergerakan kursor saat zoom aktif
const followCursor = (event: MouseEvent) => {
  if (!isZoomed.value) return
  
  // Dapatkan referensi ke elemen gambar
  const imgElement = event.target as HTMLImageElement
  const rect = imgElement.getBoundingClientRect()
  
  // Hitung posisi kursor relatif dalam persentase (0-1)
  const x = (event.clientX - rect.left) / rect.width
  const y = (event.clientY - rect.top) / rect.height
  
  // Simpan posisi
  cursorPosition.value = { x, y }
}

// Ambil data kegiatan berdasarkan ID
const fetchEventDetail = () => {
  loading.value = true
  error.value = ''

  try {
    // Cari kegiatan berdasarkan ID
    const foundEvent = eventList.value.find((e) => e.id === eventId.value)

    if (foundEvent) {
      event.value = foundEvent
    } else {
      error.value = 'Kegiatan tidak ditemukan'
      // Redirect ke halaman kegiatan jika event tidak ditemukan
      setTimeout(() => {
        router.push('/kegiatan')
      }, 3000)
    }
  } catch (err) {
    error.value = 'Terjadi kesalahan saat memuat data kegiatan'
    console.error('Error fetching event details:', err)
  } finally {
    loading.value = false
  }
}

// Registrasi peserta
const isRegistered = ref(false)
const registerForEvent = () => {
  // Simulasi pendaftaran
  setTimeout(() => {
    isRegistered.value = true
  }, 1000)
}

// Stats untuk event detail
const attendanceStats = ref([{ id: 3, label: 'Hari Tersisa', value: 0 }])

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

// Fetch waktu server dari API online
const fetchServerTime = async () => {
  try {
    // Menggunakan HTTPS untuk WorldTimeAPI (bukan HTTP)
    const response = await fetch('https://worldtimeapi.org/api/timezone/Asia/Jakarta')
    const data = await response.json()

    // Parse datetime string menjadi objek Date
    serverDate.value = new Date(data.datetime)
    console.log('Server time:', serverDate.value)

    // Update statistik setelah mendapatkan waktu server
    updateStats()
  } catch (error) {
    console.error('Error fetching server time:', error)
    // Fallback ke waktu lokal jika gagal
    console.log('Using local time as fallback')
    serverDate.value = new Date()
    updateStats()
  }
}

// Update attendance stats
const updateStats = () => {
  if (event.value) {
    // Menghitung hari tersisa berdasarkan tanggal event
    const eventDay = parseInt(event.value.date.day)
    const eventMonth = getMonthNumber(event.value.date.month)
    const eventYear = parseInt(event.value.date.year)

    // Tanggal event dengan tahun dari data
    const eventDate = new Date(eventYear, eventMonth, eventDay)

    // Gunakan waktu server sebagai patokan jika tersedia, jika tidak gunakan waktu lokal
    const today = serverDate.value || new Date()
    today.setHours(0, 0, 0, 0) // Reset waktu ke 00:00:00

    // Hitung selisih dalam milidetik, konversi ke hari
    const diffTime = eventDate.getTime() - today.getTime()
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    // Update hari tersisa (jika sudah lewat, tampilkan 0)
    attendanceStats.value[0].value = daysRemaining > 0 ? daysRemaining : 0
  }
}

onMounted(() => {
  // Scroll ke atas halaman
  window.scrollTo(0, 0)

  // Ambil detail kegiatan
  fetchEventDetail()

  // Fetch server time dan update stats
  fetchServerTime()

  // Tambahkan event listener untuk tombol ESC
  document.addEventListener('keydown', handleKeyDown)

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

// Hapus event listener saat komponnen dihapus
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div class="event-detail-container">
    <!-- Hero Section -->
    <section class="event-detail-hero">
      <div class="event-detail-hero-content">
        <h1>Detail Kegiatan</h1>
        <p>Informasi lengkap tentang kegiatan HMP TI UNESA</p>
      </div>
    </section>

    <div class="page-content">
      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Memuat detail kegiatan...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-container">
        <div class="message">{{ error }}</div>
        <p>Kembali ke halaman kegiatan dalam beberapa detik...</p>
      </div>

      <!-- Event Detail Content -->
      <div v-else-if="event" class="event-detail-content animate-on-scroll">
        <!-- Breadcrumb -->
        <div class="breadcrumb">
          <router-link to="/kegiatan">Kegiatan</router-link>
          <span> / </span>
          <span>{{ event.title }}</span>
        </div>

        <!-- Event Header -->
        <div class="event-header">
          <div class="event-category-badge">
            {{
              event.category === 'webinar'
                ? 'Webinar'
                : event.category === 'workshop'
                  ? 'Workshop'
                  : event.category === 'competition'
                    ? 'Kompetisi'
                    : event.category === 'internal'
                      ? 'Internal'
                      : event.category === 'training'
                        ? 'Latihan/Pelatihan'
                        : 'Kegiatan'
            }}
          </div>
          <h2 class="event-title">{{ event.title }}</h2>
        </div>

        <!-- Main Content Grid -->
        <div class="event-detail-grid">
          <!-- Left Column - Image and Stats -->
          <div class="event-detail-left">
            <div class="event-detail-image">
              <img :src="event.imageUrl" :alt="event.title" @click="openImageModal" />
              <div class="event-date">
                <span class="day">{{ event.date.day }}</span>
                <span class="month">{{ event.date.month }}</span>
              </div>
            </div>

            <!-- Stats -->
            <div class="event-stats">
              <div class="stat-item">
                <div class="stat-value">{{ attendanceStats[0].value }}</div>
                <div class="stat-label">{{ attendanceStats[0].label }}</div>
              </div>
            </div>

            <!-- Info tambahan pembicara -->
            <div class="event-additional">
              <div class="additional-item">
                <div class="additional-icon">👨‍🏫</div>
                <div class="additional-content">
                  <h4>Pembicara</h4>
                  <p>{{ event.speaker }}</p>
                </div>
              </div>
              <div class="additional-item">
                <div class="additional-icon">📊</div>
                <div class="additional-content">
                  <h4>Level</h4>
                  <p>{{ event.level }}</p>
                </div>
              </div>
            </div>

            <!-- Registration -->
            <div class="event-registration">
              <a v-if="!isRegistered" :href="event.formUrl" target="_blank" class="register-btn">
                Daftar Sekarang
              </a>
              <div v-else class="registered-message">
                <i class="check-icon">✓</i>
                Anda telah terdaftar pada kegiatan ini
              </div>
            </div>
          </div>

          <!-- Right Column - Details -->
          <div class="event-detail-right">
            <h3>Tentang Kegiatan</h3>
            <p class="event-description">{{ event.description }}</p>

            <div class="event-info-section">
              <h3>Informasi Kegiatan</h3>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-icon">📍</div>
                  <div class="info-content">
                    <h4>Lokasi</h4>
                    <p>{{ event.location }}</p>
                  </div>
                </div>
                <div class="info-item">
                  <div class="info-icon">🕒</div>
                  <div class="info-content">
                    <h4>Waktu</h4>
                    <p>{{ event.time }}</p>
                  </div>
                </div>
                <div class="info-item">
                  <div class="info-icon">📅</div>
                  <div class="info-content">
                    <h4>Tanggal</h4>
                    <p>{{ event.date.day }} {{ event.date.month }} {{ event.date.year }}</p>
                  </div>
                </div>
                <div class="info-item">
                  <div class="info-icon">💰</div>
                  <div class="info-content">
                    <h4>HTM</h4>
                    <p class="htm-info">{{ event.htm }}</p>
                    <p class="htm-note">{{ event.htm_note }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="event-additional-info">
              <h3>Yang Akan Didapatkan</h3>
              <ul class="benefits-list">
                <li><i class="check-icon">✓</i> E-Sertifikat Keikutsertaan</li>
                <li><i class="check-icon">✓</i> Materi Presentasi</li>
                <li><i class="check-icon">✓</i> Konsumsi</li>
                <li><i class="check-icon">✓</i> Networking dengan Peserta Lain</li>
              </ul>
            </div>

            <div class="event-contact">
              <h3>Kontak</h3>
              <p>Untuk informasi lebih lanjut, silakan hubungi:</p>
              <div v-for="(contact, index) in event.contacts" :key="index" class="contact-item">
                <span>📱</span>
                <a :href="formatWhatsAppLink(contact.phone)" target="_blank" class="whatsapp-link">
                  {{ contact.phone }} ({{ contact.name }})
                </a>
              </div>
            </div>

            <div class="event-actions">
              <button class="share-btn">Bagikan Kegiatan</button>
              <router-link to="/kegiatan" class="back-btn">Kembali ke Daftar Kegiatan</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox/Modal -->
    <div v-if="showImageModal" class="image-modal" @click="handleOutsideClick">
      <div class="image-modal-content">
        <span class="close-btn" @click="closeImageModal">&times;</span>
        <div class="image-container" :class="{ 'zoomed': isZoomed }">
          <img 
            :src="event?.imageUrl" 
            :alt="event?.title" 
            class="image-modal-image"
            @click="toggleZoom"
            @mousemove="followCursor"
            :style="isZoomed ? `transform-origin: ${cursorPosition.x * 100}% ${cursorPosition.y * 100}%` : ''"
          />
          <div v-if="!isZoomed" class="zoom-hint">
            <span class="zoom-icon">🔍</span>
            <span>Klik untuk memperbesar</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Container */
.event-detail-container {
  width: 100%;
  background-color: #f8fafc;
  color: #1e293b;
}

/* Hero Section */
.event-detail-hero {
  background: linear-gradient(135deg, #002e54, #004680, #001830);
  color: white;
  padding: 5rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.event-detail-hero::before {
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

.event-detail-hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
}

.event-detail-hero h1 {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;
}

.event-detail-hero h1::after {
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

.event-detail-hero p {
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
  position: relative;
}

/* Loading & Error States */
.loading-container,
.error-container {
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

.error-container .message {
  font-size: 1.25rem;
  font-weight: 600;
  color: #ef4444;
  margin-bottom: 1rem;
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  font-size: 0.9rem;
  color: #64748b;
}

.breadcrumb a {
  color: #004680;
  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

/* Event Detail Content */
.event-detail-content {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  margin-top: -5rem;
  position: relative;
  z-index: 10;
}

.event-header {
  margin-bottom: 2rem;
}

.event-category-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 2rem;
  background-color: #004680;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.event-title {
  font-size: 2rem;
  font-weight: 800;
  color: #1e293b;
  line-height: 1.3;
}

/* Event Detail Grid */
.event-detail-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2.5rem;
}

@media (max-width: 768px) {
  .event-detail-grid {
    grid-template-columns: 1fr;
  }
}

/* Left Column Styles */
.event-detail-left {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.event-detail-image {
  position: relative;
  border-radius: 0.75rem;
  overflow: hidden;
}

.event-detail-image img {
  width: 100%;
  aspect-ratio: 11/16;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.event-detail-image img:hover {
  transform: scale(1.02);
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

.event-stats {
  display: flex;
  justify-content: center;
  background-color: #f8fafc;
  border-radius: 0.75rem;
  padding: 1.25rem;
  text-align: center;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 800;
  color: #004680;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  color: #64748b;
}

.event-additional {
  background-color: #f8fafc;
  border-radius: 0.75rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.additional-item {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.additional-icon {
  font-size: 1.75rem;
  color: #004680;
}

.additional-content h4 {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #1e293b;
}

.additional-content p {
  color: #64748b;
  font-size: 1rem;
  font-weight: 600;
}

.event-registration {
  background-color: #f8fafc;
  border-radius: 0.75rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.register-btn {
  width: 100%;
  padding: 1rem 1.5rem;
  background-color: #ff6b00;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: block;
  text-align: center;
  text-decoration: none;
}

.register-btn:hover {
  background-color: #e05d00;
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(255, 107, 0, 0.2);
  color: white;
  text-decoration: none;
}

.registered-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #059669;
}

.check-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background-color: #059669;
  color: white;
}

/* Right Column Styles */
.event-detail-right {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.event-detail-right h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
}

.event-description {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #64748b;
}

.event-info-section {
  background-color: #f8fafc;
  border-radius: 0.75rem;
  padding: 1.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.info-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.info-icon {
  font-size: 1.5rem;
  color: #004680;
}

.info-content h4 {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #1e293b;
}

.info-content p {
  color: #64748b;
  font-size: 1rem;
}

.info-content .htm-info {
  margin-bottom: 0.25rem;
}

.info-content .htm-note {
  font-size: 0.8rem;
  color: #94a3b8;
  font-style: italic;
}

.event-additional-info {
  background-color: #f8fafc;
  border-radius: 0.75rem;
  padding: 1.5rem;
}

.benefits-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.benefits-list li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #1e293b;
}

.benefits-list li .check-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  font-size: 0.75rem;
  border-radius: 50%;
  background-color: #059669;
  color: white;
}

.event-contact {
  background-color: #f8fafc;
  border-radius: 0.75rem;
  padding: 1.5rem;
}

.event-contact p {
  color: #64748b;
  margin-bottom: 1rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.whatsapp-link {
  color: #1e293b;
  text-decoration: none;
  display: flex;
  align-items: center;
  transition: color 0.3s ease;
}

.whatsapp-link:hover {
  color: #25d366; /* Warna WhatsApp */
  text-decoration: underline;
}

.event-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.share-btn,
.back-btn {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.share-btn {
  background-color: #004680;
  color: white;
  border: none;
}

.share-btn:hover {
  background-color: #00396a;
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 70, 128, 0.2);
}

.back-btn {
  background-color: #f1f5f9;
  color: #004680;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-btn:hover {
  background-color: #e2e8f0;
  transform: translateY(-2px);
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
  .info-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .event-detail-hero h1 {
    font-size: 2.5rem;
  }

  .event-detail-hero p {
    font-size: 1.1rem;
  }

  .event-title {
    font-size: 1.75rem;
  }

  .event-detail-content {
    padding: 1.5rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .event-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .event-detail-hero h1 {
    font-size: 2rem;
  }

  .event-detail-hero p {
    font-size: 1rem;
  }

  .event-stats {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
    padding: 1rem;
  }

  .stat-value {
    font-size: 1.25rem;
  }

  .stat-label {
    font-size: 0.7rem;
  }

  .event-detail-content {
    padding: 1rem;
    margin-top: -3rem;
  }
}

/* Lightbox/Modal Styles */
.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
  animation: fadeIn 0.3s ease;
  overflow: hidden;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.image-modal-content {
  position: relative;
  background-color: transparent;
  max-width: 90%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 2.5rem;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 1;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1010;
}

.close-btn:hover {
  background-color: rgba(255, 0, 0, 0.7);
  transform: scale(1.1);
}

/* Zoom container */
.image-container {
  position: relative;
  overflow: hidden;
  max-width: 100%;
  max-height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
}

/* Zoom effect for modal image */
.image-modal-image {
  display: block;
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 0.5rem;
  animation: zoomIn 0.3s ease;
  cursor: zoom-in;
  transition: transform-origin 0s ease;
}

.image-container.zoomed .image-modal-image {
  transform: scale(2.5);
  cursor: zoom-out;
  transition: transform 0.1s ease-out;
}

@keyframes zoomIn {
  from {
    transform: scale(0.9);
  }
  to {
    transform: scale(1);
  }
}

/* Zoom hint */
.zoom-hint {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.zoom-icon {
  font-size: 1.2rem;
}

.image-container:hover .zoom-hint {
  opacity: 1;
}

/* Responsive adjustments for mobile */
@media (max-width: 768px) {
  .image-modal-content {
    max-width: 95%;
  }
}
</style>
