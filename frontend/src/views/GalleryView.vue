<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import galleryData from '@/data/gallery.json'

interface GalleryItem {
  id: number
  imageUrl: string
  title: string
  category: string
  date: string
  description: string
  eventId: number
}

interface Category {
  id: string
  name: string
  icon: string
}

// Data galeri dari file JSON
const galleryItems = ref<GalleryItem[]>(galleryData.galleryItems)

// Filter dan state
const categories = ref<Category[]>(galleryData.categories)
const selectedCategory = ref('all')
const searchQuery = ref('')
const selectedItem = ref<GalleryItem | null>(null)
const isModalOpen = ref(false)
const currentView = ref('grid')

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(12) // Meningkatkan jumlah item per halaman untuk galeri foto

// Mengelompokkan galeri berdasarkan event
const eventGroups = computed(() => {
  const groups: Record<number, GalleryItem[]> = {}
  
  galleryItems.value.forEach(item => {
    if (!groups[item.eventId]) {
      groups[item.eventId] = []
    }
    groups[item.eventId].push(item)
  })
  
  return groups
})

// Mendapatkan event utama untuk ditampilkan
const eventsToDisplay = computed(() => {
  const events: Array<{eventId: number, mainItem: GalleryItem, photoCount: number}> = []
  
  Object.entries(eventGroups.value).forEach(([eventId, items]) => {
    if (items.length > 0) {
      // Menggunakan item pertama sebagai representasi kegiatan
      events.push({
        eventId: Number(eventId),
        mainItem: items[0],
        photoCount: items.length
      })
    }
  })
  
  return events
})

// Computed untuk item yang difilter
const filteredEvents = computed(() => {
  let filtered = eventsToDisplay.value
  
  // Filter berdasarkan kategori
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter((event) => event.mainItem.category === selectedCategory.value)
  }
  
  // Filter berdasarkan pencarian
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (event) =>
        event.mainItem.title.toLowerCase().includes(query) ||
        event.mainItem.description.toLowerCase().includes(query) ||
        event.mainItem.date.toLowerCase().includes(query)
    )
  }
  
  return filtered
})

// Computed untuk total halaman
const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredEvents.value.length / itemsPerPage.value))
})

// Computed untuk items yang ditampilkan dengan pagination
const paginatedEvents = computed(() => {
  // Ensure current page is within valid range after filtering
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
  }
  
  const startIndex = (currentPage.value - 1) * itemsPerPage.value
  const endIndex = Math.min(startIndex + itemsPerPage.value, filteredEvents.value.length)
  return filteredEvents.value.slice(startIndex, endIndex)
})

// Statistik galeri
const galleryStats = ref(galleryData.galleryStats)

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

const changePage = (newPage: number) => {
  if (newPage === currentPage.value) return
  currentPage.value = newPage

  // Scroll ke section title saat ganti halaman
  const sectionTitle = document.querySelector('.section-title') as HTMLElement
  if (sectionTitle) {
    window.scrollTo({
      top: sectionTitle.offsetTop + 500,
      behavior: 'smooth',
    })
  }
}

// Tampilkan detail item dan foto terkait
const showItemDetails = (item: GalleryItem) => {
  selectedItem.value = item
  isModalOpen.value = true
  
  // Log untuk debugging
  console.log('Selected item:', item)
  console.log('Event ID:', item.eventId)
  console.log('Related photos:', eventGroups.value[item.eventId])
}

// Tutup modal
const closeModal = () => {
  isModalOpen.value = false
}

// Filter item berdasarkan kategori
const filterByCategory = (categoryId: string) => {
  selectedCategory.value = categoryId
  currentPage.value = 1 // Reset ke halaman 1 saat filter berubah
}

// Fungsi untuk mendapatkan nama kategori berdasarkan id
const getCategoryName = (categoryId: string): string => {
  const category = categories.value.find(cat => cat.id === categoryId);
  return category ? category.name : '';
}

// Fungsi untuk mendapatkan icon kategori berdasarkan id
const getCategoryIcon = (categoryId: string): string => {
  const category = categories.value.find(cat => cat.id === categoryId);
  return category ? category.icon || '' : '';
}

onMounted(() => {
  // Scroll ke posisi paling atas saat halaman dimuat
  window.scrollTo(0, 0)

  // Log URL gambar untuk debugging
  galleryItems.value.forEach(item => {
    console.log('Image URL:', item.imageUrl);
  });

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
  document.querySelectorAll('.animate-on-scroll, .project-card').forEach((el) => {
    observer.observe(el)
  })
})

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  console.error('Error loading image:', target.src);
  if (target) {
    // Gunakan gambar fallback yang valid
    target.src = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60';
  }
}

// Di dalam script, saya akan menambahkan fungsi untuk mengenkode URL gambar dengan benar
const getSafeImageUrl = (url: string): string => {
  try {
    // Coba parse URL dan enkode ulang untuk memastikan format yang benar
    return encodeURI(decodeURI(url));
  } catch (e) {
    console.error('Invalid URL:', url, e);
    return 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60';
  }
}


</script>

<template>
  <div class="projects-container">
    <!-- Hero Section -->
    <section class="gallery-hero">
      <div class="gallery-hero-content">
        <h1>Galeri Kegiatan</h1>
        <p>
          Dokumentasi kegiatan dan acara HMP Teknik Informatika UNESA yang telah dilaksanakan untuk membangun kebersamaan dan profesionalitas mahasiswa.
        </p>
      </div>
    </section>

    <div class="page-content">
      <!-- Filter dan Stats -->
      <section class="filter-section">
        <div class="filter-container">
          <div class="stats-items">
            <div class="stat-item" v-for="stat in galleryStats" :key="stat.id">
              <div class="stat-number">{{ stat.number }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>

          <div class="search-box">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Cari foto..."
              class="search-input"
              @input="currentPage = 1"
            />
            <span class="search-icon">🔍</span>
          </div>

          <div class="filter-options">
            <button
              v-for="category in categories"
              :key="category.id"
              @click="filterByCategory(category.id)"
              :class="['category-btn', { active: selectedCategory === category.id }]"
            >
              <span v-if="category.icon" class="category-icon">{{ category.icon }}</span>
              {{ category.name }}
            </button>
          </div>
        </div>
      </section>

      <!-- Gallery Grid Section -->
      <section class="projects-grid-section animate-on-scroll">
        <div class="section-header">
          <h2 class="section-title">Galeri Kegiatan</h2>
          <div class="section-line"></div>
        </div>

        <div class="gallery-view-options">
          <button 
            class="view-option-btn grid-view" 
            title="Tampilan Grid"
            @click="currentView = 'grid'"
            :class="{ active: currentView === 'grid' }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
          </button>
          <button 
            class="view-option-btn list-view"
            title="Tampilan Masonry"
            @click="currentView = 'masonry'"
            :class="{ active: currentView === 'masonry' }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="21" y1="6" x2="3" y2="6"></line>
              <line x1="21" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="18" x2="3" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="projects-grid" :class="{ 'masonry-layout': currentView === 'masonry' }">
          <div
            v-for="item in paginatedEvents"
            :key="item.eventId"
            class="event-card"
            @click="showItemDetails(item.mainItem)"
          >
            <div class="event-image">
              <img :src="getSafeImageUrl(item.mainItem.imageUrl)" :alt="item.mainItem.title" @error="handleImageError" />
              <div class="event-date">
                <span class="date">{{ item.mainItem.date }}</span>
              </div>
            </div>
            <div class="event-content">
              <div class="event-badge">
                {{ getCategoryName(item.mainItem.category) }}
              </div>
              <h3 class="event-title">{{ item.mainItem.title.split(' - ')[0] }}</h3>
              <p class="event-description">
                {{ item.mainItem.description.substring(0, 75) }}{{ item.mainItem.description.length > 75 ? '...' : '' }}
              </p>
              <div class="photo-count">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="2" width="16" height="16" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="m17 21-5-5-7 7" />
                </svg>
                {{ item.photoCount }} foto
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredEvents.length === 0" class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>Tidak ada kegiatan yang ditemukan</h3>
          <p>Coba ubah filter atau kata kunci pencarian Anda</p>
          <button
            @click="
              () => {
                selectedCategory = 'all'
                searchQuery = ''
              }
            "
            class="reset-btn"
          >
            Reset Filter
          </button>
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

          <div class="projects-info-text" v-if="filteredEvents.length > 0">
            Menampilkan {{ (currentPage - 1) * itemsPerPage + 1 }}-{{
              Math.min(currentPage * itemsPerPage, filteredEvents.length)
            }}
            dari {{ filteredEvents.length }} foto
          </div>
        </div>
      </section>

      <!-- Gallery Item Detail Modal -->
      <div v-if="isModalOpen" class="project-modal-overlay" @click="closeModal">
        <div class="project-modal" @click.stop>
          <button class="close-modal-btn" @click="closeModal">×</button>

          <div v-if="selectedItem" class="project-modal-content">
            <div
              class="project-modal-image"
              :style="{
                backgroundImage: `url('${getSafeImageUrl(selectedItem.imageUrl)}')`,
              }"
            >
              <div class="modal-category-badge">{{ getCategoryName(selectedItem.category) }}</div>
              <div class="modal-date-badge">{{ selectedItem.date }}</div>
            </div>

            <div class="project-modal-info">
              <h2>{{ selectedItem.title.split(' - ')[0] }}</h2>
              <p class="project-description">{{ selectedItem.description }}</p>

              <!-- Gallery photos from the same event -->
              <div v-if="selectedItem && selectedItem.eventId && eventGroups[selectedItem.eventId]" class="event-photos">
                <h3>Semua Foto ({{ eventGroups[selectedItem.eventId].length }})</h3>
                <div class="event-photos-grid">
                  <div 
                    v-for="photo in eventGroups[selectedItem.eventId]" 
                    :key="photo.id"
                    :class="['event-photo-item', { active: photo.id === selectedItem.id }]"
                    @click="selectedItem = photo"
                  >
                    <div class="event-photo-image" :style="{ backgroundImage: `url('${getSafeImageUrl(photo.imageUrl)}')` }"></div>
                  </div>
                </div>
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
.projects-container {
  width: 100%;
  background-color: var(--background-light);
  color: var(--text-color);
}

/* Page Content */
.page-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* Hero Section */
.gallery-hero {
  background: linear-gradient(135deg, #002e54, #004680, #001830);
  color: white;
  padding: 5rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.gallery-hero::before {
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

.gallery-hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
}

.gallery-hero h1 {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;
}

.gallery-hero h1::after {
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

.gallery-hero p {
  font-size: 1.25rem;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Filter Section */
.filter-section {
  margin-top: -4rem;
  margin-bottom: 3rem;
  position: relative;
  z-index: 10;
}

.filter-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 0;
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 1rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
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

/* Projects Grid */
.projects-grid-section {
  margin-bottom: 4rem;
}

.projects-grid-section::before {
  content: '';
  display: block;
  width: 80px;
  height: 4px;
  background: linear-gradient(to right, #004680, #00a0e3);
  margin: 0 auto 2rem;
  border-radius: 2px;
}

.gallery-view-options {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.view-option-btn {
  width: 40px;
  height: 40px;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #64748b;
}

.view-option-btn:hover {
  border-color: #004680;
  color: #004680;
}

.view-option-btn.active {
  background-color: #004680;
  color: white;
  border-color: #004680;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.2rem;
  margin-bottom: 2rem;
}

@media (min-width: 768px) {
  .projects-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.2rem;
  }
}

/* Event Card styles */
.event-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid #f0f0f0;
  cursor: pointer;
  position: relative;
}

.event-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.1);
}

.event-card:hover .event-image img {
  transform: scale(1.05);
}

.event-image {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 220px; /* Fixed height instead of aspect-ratio */
  display: block;
  background-color: #f0f0f0;
}

.event-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
  display: block;
}

.event-date {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background-color: #ff6b00;
  color: white;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.85rem;
  font-weight: 600;
  z-index: 2;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 50%;
  background-color: #004680;
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  font-size: 1rem;
  border: 2px solid white;
}

.event-content {
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: white;
}

.event-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 2rem;
  background-color: #004680;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  align-self: flex-start;
}

.event-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #1e293b;
  line-height: 1.3;
}

.event-description {
  font-size: 0.85rem;
  color: #64748b;
  margin-bottom: 1rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.view-details-btn {
  display: inline-block;
  background-color: #004680;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-start;
}

.project-card:hover .view-details-btn {
  background-color: #00396a;
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 70, 128, 0.2);
  opacity: 1;
}

/* Modal Styles */
.project-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(5px);
}

.project-modal {
  background: white;
  border-radius: 1rem;
  max-width: 1000px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3);
  animation: modalZoomIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes modalZoomIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.project-modal-image {
  height: 400px;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
}

.project-modal-image::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.5));
  z-index: 1;
}

.modal-category-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background-color: #004680;
  color: white;
  border-radius: 2rem;
  padding: 0.5rem 1.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  z-index: 2;
}

.close-modal-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.5rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.project-link-btn.primary {
  background-color: #ff6b00;
  color: white;
  box-shadow: 0 10px 15px -5px rgba(255, 107, 0, 0.2);
}

.project-link-btn.primary:hover {
  background-color: #e05d00;
}

.project-link-btn.secondary {
  background-color: #004680;
  color: white;
}

.project-link-btn.secondary:hover {
  background-color: #00396a;
}

/* Animation */
@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Animation on scroll */
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
@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }

  .filter-container {
    flex-direction: column;
    align-items: stretch;
  }

  .category-filters {
    overflow-x: auto;
    padding-bottom: 0.5rem;
    justify-content: flex-start;
    width: 100%;
  }

  .search-box {
    width: 100%;
  }

  .project-modal {
    width: 95%;
    max-height: 85vh;
  }

  .project-modal-image {
    height: 200px;
  }

  .project-modal-info {
    padding: 1.5rem;
  }

  .project-modal-info h2 {
    font-size: 1.75rem;
  }

  .project-info-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .project-links {
    flex-direction: column;
  }
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

/* Project Detail Modal Content */
.project-modal-content {
  display: flex;
  flex-direction: column;
}

.project-modal-info {
  padding: 2rem;
}

.project-modal-info h2 {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  color: #1e293b;
}

.project-modal-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
}

.project-modal-left {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.project-year {
  text-align: center;
  margin-bottom: 1rem;
}

.year-badge {
  display: inline-block;
  background-color: #ff6b00;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 2rem;
  font-weight: 700;
  font-size: 1.25rem;
}

.project-info-box {
  background-color: #f8fafc;
  border-radius: 0.75rem;
  padding: 1.25rem;
}

.project-info-box h4 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1e293b;
}

.team-list {
  list-style: none;
  padding: 0;
}

.team-list li {
  padding: 0.5rem 0;
  color: #64748b;
  border-bottom: 1px solid #e2e8f0;
}

.team-list li:last-child {
  border-bottom: none;
}

.project-tags-detail {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.project-links {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.project-link-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  transition: all 0.3s ease;
}

.project-modal-right {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.project-modal-right h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1e293b;
}

.project-description {
  line-height: 1.8;
  color: #64748b;
}

.project-benefits {
  background-color: #f8fafc;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-top: 1rem;
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

.benefits-list .check-icon {
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

/* Responsive styles for modal */
@media (max-width: 768px) {
  .project-modal-grid {
    grid-template-columns: 1fr;
  }

  .project-modal-image {
    height: 200px;
  }

  .project-links {
    flex-direction: row;
    gap: 1rem;
  }

  .project-link-btn {
    flex: 1;
  }
}

/* Submit Project Section */
.submit-banner-section {
  margin-top: 4rem;
  margin-bottom: 4rem;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;
}

.submit-banner {
  background: linear-gradient(135deg, #004680, #0062b3);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  color: white;
  padding: 3rem 2rem;
}

@media (min-width: 768px) {
  .submit-banner {
    flex-direction: row;
    text-align: left;
    padding: 0;
    min-height: 300px;
  }

  .submit-banner-content {
    flex: 1;
    padding: 2.5rem;
    margin-bottom: 0;
  }

  .submit-banner-image {
    width: 40%;
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;
  }
}

.submit-banner-content {
  position: relative;
  z-index: 2;
  margin-bottom: 2rem;
}

.submit-banner-content h2 {
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.submit-banner-content p {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
  max-width: 500px;
}

.banner-submit-btn {
  padding: 1rem 2rem;
  background-color: #ff6b00;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.banner-submit-btn:hover {
  background-color: #e05d00;
  transform: translateY(-3px);
  box-shadow: 0 15px 25px -5px rgba(0, 0, 0, 0.2);
}

.btn-icon {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.banner-submit-btn:hover .btn-icon {
  transform: translateX(5px);
}

.submit-banner-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

@media (min-width: 768px) {
  .submit-banner-image {
    height: 100%;
  }
}

.submit-banner-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.4;
}

@media (min-width: 768px) {
  .submit-banner-image img {
    opacity: 0.7;
  }
}

/* Submit Form Modal */
.submit-form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
  overflow-y: auto;
}

.submit-form-modal {
  background: white;
  border-radius: 1rem;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.close-form-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 1.5rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
}

.close-form-btn:hover {
  background: rgba(0, 0, 0, 0.2);
}

.submit-form-header {
  background: linear-gradient(135deg, #004680, #0062b3);
  color: white;
  padding: 2rem;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
}

.submit-form-header h2 {
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.submit-form-header p {
  opacity: 0.9;
  margin: 0;
}

.submit-project-form {
  padding: 2rem;
  width: 100%;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group-full {
  grid-column: span 2;
}

.form-group label {
  font-weight: 600;
  color: #1e293b;
  font-size: 0.95rem;
}

.required {
  color: #ef4444;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.875rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.3s ease;
  color: #1e293b;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #004680;
  box-shadow: 0 4px 12px -1px rgba(0, 70, 128, 0.15);
}

.form-hint {
  color: #94a3b8;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: center;
}

.submit-btn {
  padding: 0.875rem 2rem;
  background-color: #004680;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  background-color: #00396a;
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 70, 128, 0.2);
}

.reset-form-btn {
  padding: 0.875rem 2rem;
  background-color: #f1f5f9;
  color: #64748b;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-form-btn:hover {
  background-color: #e2e8f0;
  transform: translateY(-2px);
}

/* Success Message */
.submission-success {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: 90%;
  width: 500px;
  text-align: center;
  z-index: 1100;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -40%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

.success-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #10b981;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 1.5rem;
}

.submission-success h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
}

.submission-success p {
  color: #64748b;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.close-success-btn {
  padding: 0.875rem 2rem;
  background-color: #004680;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-success-btn:hover {
  background-color: #00396a;
}

/* Responsive styles for form */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-group-full {
    grid-column: span 1;
  }

  .form-actions {
    flex-direction: column;
  }

  .submit-btn,
  .reset-form-btn {
    width: 100%;
  }
}

/* Toggle input styles */
.input-toggle {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.toggle-buttons {
  display: flex;
  gap: 0.5rem;
}

.toggle-btn {
  padding: 0.4rem 1rem;
  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-btn.active {
  background-color: #004680;
  color: white;
  border-color: #004680;
}

.input-field {
  margin-top: 0.5rem;
}

/* File input styles */
.file-input {
  display: none;
}

.file-input-label {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.875rem 1rem;
  border: 2px dashed #e2e8f0;
  border-radius: 0.5rem;
  background-color: #f8fafc;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.file-input-label:hover {
  border-color: #004680;
  background-color: #f1f5f9;
  color: #004680;
}

.file-selected {
  color: #004680;
  font-weight: 500;
}

.image-preview {
  margin-top: 0.75rem;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.image-preview img {
  width: 100%;
  height: auto;
  max-height: 150px;
  object-fit: cover;
  display: block;
}

/* Pagination styles dari FungsionarisView.vue */
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

.projects-info-text {
  text-align: center;
  color: #64748b;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.masonry-layout {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-auto-rows: 10px;
  grid-gap: 1.5rem;
}

.masonry-layout .event-card {
  grid-row-end: span 35;
}

.masonry-layout .event-card:nth-child(3n+1) {
  grid-row-end: span 45;
}

.masonry-layout .event-card:nth-child(5n+3) {
  grid-row-end: span 40;
}

.masonry-layout .event-card .event-image {
  height: 70%;
}

@media (max-width: 768px) {
  .projects-grid, .masonry-layout {
    grid-template-columns: 1fr;
  }
  
  .masonry-layout .event-card {
    grid-row-end: span 35 !important;
  }
}

/* Stats section styles */
.gallery-stats-section {
  margin: 4rem 0;
  padding: 2rem 0;
  background-color: #f8fafc;
  border-radius: 1rem;
}

.gallery-stats-container {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
  padding: 1rem;
}

.gallery-stat-item {
  text-align: center;
  padding: 1.5rem;
  min-width: 200px;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.gallery-stat-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.1);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  color: #004680;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1.1rem;
  color: #64748b;
}

/* Modal date badge */
.modal-date-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border-radius: 2rem;
  padding: 0.5rem 1.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  backdrop-filter: blur(5px);
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Related photos */
.related-photos {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;
}

.related-photos h3 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #1e293b;
}

.related-photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.related-photo-item {
  cursor: pointer;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.related-photo-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.related-photo-image {
  height: 120px;
  background-size: cover;
  background-position: center;
}

.related-photo-title {
  padding: 0.75rem;
  font-size: 0.85rem;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: #f8fafc;
}

.gallery-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: #64748b;
}

.photo-count {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #64748b;
  font-size: 0.8rem;
  margin-top: 0.5rem;
}

.photo-count svg {
  color: #004680;
}

.event-photos {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.event-photos h3 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #1e293b;
}

.event-photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.75rem;
}

.event-photo-item {
  cursor: pointer;
  border-radius: 0.5rem;
  overflow: hidden;
  aspect-ratio: 1/1;
  transition: all 0.3s ease;
  position: relative;
  border: 2px solid transparent;
}

.event-photo-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.event-photo-item.active {
  border-color: #004680;
  box-shadow: 0 0 0 2px rgba(0, 70, 128, 0.5);
}

.event-photo-image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}
</style>
