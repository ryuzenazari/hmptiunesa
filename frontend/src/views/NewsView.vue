<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import newsData from '@/data/news.json'

const router = useRouter()

// Interface untuk data berita
interface NewsItem {
  id: number
  imageUrl: string
  title: string
  category: string
  date: string
  description: string
  content?: string
  featured?: boolean
}

interface Category {
  id: string
  name: string
  count: number
}

// Data kategori dari file JSON
const categories = ref<Category[]>(newsData.categories)

// Data berita untuk ditampilkan dari file JSON
const originalNewsItems = ref<NewsItem[]>(newsData.newsItems)

// Membuat salinan untuk ditampilkan
const newsItems = ref<NewsItem[]>([...originalNewsItems.value])

// Stats dari file JSON
const newsStats = ref(newsData.newsStats)

// Recent posts dari file JSON
const recentPosts = ref(newsData.recentPosts)

// Tags dari file JSON
const tags = ref(newsData.tags)

// Active category
const activeCategory = ref('all')

// Search query
const searchQuery = ref('')

// Filtered news items untuk tampilan
const filteredNews = computed(() => {
  let result = [...originalNewsItems.value]

  // Filter berdasarkan kategori
  if (activeCategory.value !== 'all') {
    result = result.filter((item) => item.category === activeCategory.value)
  }

  // Filter berdasarkan pencarian
  if (searchQuery.value.trim() !== '') {
    const query = searchQuery.value.toLowerCase().trim()
    result = result.filter(
      (item) =>
        item.title.toLowerCase().includes(query) || item.description.toLowerCase().includes(query),
    )
  }

  return result
})

// Function untuk memfilter kategori
const setCategory = (categoryId: string) => {
  activeCategory.value = categoryId
  // Reset halaman ke halaman pertama saat kategori berubah
  currentPage.value = 1
}

// Fungsi untuk melakukan pencarian
const handleSearch = () => {
  // Reset halaman ke halaman pertama saat pencarian berubah
  currentPage.value = 1
}

// Paginasi
const currentPage = ref(1)
const itemsPerPage = ref(6)

// Computed untuk item yang ditampilkan berdasarkan paginasi
const paginatedNews = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value
  const endIndex = startIndex + itemsPerPage.value
  return filteredNews.value.slice(startIndex, endIndex)
})

// Computed untuk berita tanpa featured articles
const nonFeaturedNews = computed(() => {
  return filteredNews.value.filter((item) => !item.featured)
})

// Computed untuk berita featured
const featuredNews = computed(() => {
  return filteredNews.value.filter((item) => item.featured)
})

// Computed untuk paginasi hanya berita non-featured
const paginatedNonFeaturedNews = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value
  const endIndex = startIndex + itemsPerPage.value
  return nonFeaturedNews.value.slice(startIndex, endIndex)
})

// Computed total halaman (hanya untuk berita non-featured)
const totalPages = computed(() => {
  return Math.ceil(nonFeaturedNews.value.length / itemsPerPage.value)
})

// Method untuk navigasi paginasi
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// Method untuk navigasi ke halaman detail berita
const goToNewsDetail = (itemId: number) => {
  router.push(`/berita/${itemId}`)
}

onMounted(() => {
  console.log('News page mounted, items:', filteredNews.value.length)

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
  <div class="news-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title">Berita & Artikel</h1>
        <p class="hero-subtitle">
          Informasi terbaru seputar kegiatan dan perkembangan Himpunan Mahasiswa Prodi Teknik
          Informatika UNESA
        </p>
      </div>
    </section>

    <div class="page-content">
      <!-- Stats Section -->
      <section class="stats-section">
        <div class="stats-container">
          <div v-for="stat in newsStats" :key="stat.id" class="stat-item">
            <div class="stat-number">{{ stat.number }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </section>

      <!-- Main Content -->
      <div class="content-wrapper">
        <main class="main-content">
          <!-- Featured News Section (Artikel Unggulan) -->
          <section class="featured-news-container animate-on-scroll">
            <div class="section-header">
              <h2 class="section-title">Artikel Unggulan</h2>
              <div class="section-line"></div>
            </div>

            <div class="featured-section" v-if="featuredNews.length > 0">
              <div
                class="featured-news"
                v-for="item in featuredNews"
                :key="item.id"
                @click="goToNewsDetail(item.id)"
              >
                <div
                  class="featured-image"
                  :style="{ backgroundImage: `url(${item.imageUrl})` }"
                ></div>
                <div class="featured-content">
                  <div class="featured-badge">Featured</div>
                  <h2>{{ item.title }}</h2>
                  <div class="news-meta">
                    <span class="news-category">{{
                      categories.find((c) => c.id === item.category)?.name
                    }}</span>
                    <span class="news-date">{{ item.date }}</span>
                  </div>
                  <p class="featured-description">{{ item.description }}</p>
                  <div class="read-more-btn">Baca Selengkapnya <span class="icon">→</span></div>
                </div>
              </div>
            </div>
          </section>

          <!-- Regular Articles Section (Artikel Terbaru) -->
          <section class="regular-news-container animate-on-scroll">
            <div class="section-header">
              <h2 class="section-title">Artikel Terbaru</h2>
              <div class="section-line"></div>
            </div>

            <!-- Filter Categories -->
            <section class="filter-section animate-on-scroll">
              <div class="filter-options">
                <button
                  class="filter-btn"
                  :class="{ active: activeCategory === 'all' }"
                  @click="setCategory('all')"
                >
                  Semua
                </button>
                <button
                  v-for="category in categories"
                  :key="category.id"
                  class="filter-btn"
                  :class="{ active: activeCategory === category.id }"
                  @click="setCategory(category.id)"
                >
                  {{ category.name }} <span class="count">({{ category.count }})</span>
                </button>
              </div>
            </section>

            <!-- News Grid -->
            <section class="news-section animate-on-scroll">
              <div class="news-grid">
                <div
                  class="news-card"
                  v-for="item in paginatedNonFeaturedNews"
                  :key="item.id"
                  @click="goToNewsDetail(item.id)"
                >
                  <div
                    class="news-card-image"
                    :style="{ backgroundImage: `url(${item.imageUrl})` }"
                  >
                    <div class="news-card-overlay">
                      <div class="news-card-info">
                        <span class="category-badge">{{
                          categories.find((c) => c.id === item.category)?.name
                        }}</span>
                        <div class="read-more-icon">
                          <span class="icon">→</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="news-card-content">
                    <div class="news-meta">
                      <span class="news-category">{{
                        categories.find((c) => c.id === item.category)?.name
                      }}</span>
                      <span class="news-date">{{ item.date }}</span>
                    </div>
                    <h3>{{ item.title }}</h3>
                    <p>{{ item.description }}</p>
                  </div>
                  <div class="read-more-icon">
                    <span class="icon">→</span>
                  </div>
                </div>
              </div>

              <!-- Pagination -->
              <div class="pagination" v-if="totalPages > 1">
                <button
                  class="pagination-btn"
                  :disabled="currentPage === 1"
                  @click="goToPage(currentPage - 1)"
                >
                  &laquo; Sebelumnya
                </button>

                <div class="pagination-numbers">
                  <button
                    v-for="page in totalPages"
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
                  @click="goToPage(currentPage + 1)"
                >
                  Selanjutnya &raquo;
                </button>
              </div>

              <div class="news-info-text">
                Menampilkan {{ (currentPage - 1) * itemsPerPage + 1 }}-{{
                  Math.min(currentPage * itemsPerPage, nonFeaturedNews.length)
                }}
                dari {{ nonFeaturedNews.length }} artikel
              </div>
            </section>
          </section>
        </main>

        <!-- Sidebar -->
        <aside class="news-sidebar">
          <!-- Search Box -->
          <div class="sidebar-section animate-on-scroll">
            <h3>Pencarian</h3>
            <div class="sidebar-search">
              <input
                type="text"
                placeholder="Cari berita..."
                v-model="searchQuery"
                @input="handleSearch"
              />
              <button @click="handleSearch">🔍</button>
            </div>
          </div>

          <!-- Categories -->
          <div class="sidebar-section animate-on-scroll">
            <h3>Kategori</h3>
            <ul class="category-list">
              <li v-for="category in categories" :key="category.id">
                <a
                  href="#"
                  :class="{ active: activeCategory === category.id }"
                  @click.prevent="setCategory(category.id)"
                >
                  {{ category.name }} <span>{{ category.count }}</span>
                </a>
              </li>
            </ul>
          </div>

          <!-- Recent Posts -->
          <div class="sidebar-section animate-on-scroll">
            <h3>Berita Terbaru</h3>
            <div class="recent-posts">
              <div
                class="recent-post"
                v-for="post in recentPosts"
                :key="post.id"
                @click="goToNewsDetail(post.id)"
              >
                <div
                  class="recent-post-image"
                  :style="{ backgroundImage: `url(${post.imageUrl})` }"
                ></div>
                <div class="recent-post-content">
                  <h4>{{ post.title }}</h4>
                  <p>{{ post.date }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Tags -->
          <div class="sidebar-section animate-on-scroll">
            <h3>Tag</h3>
            <div class="tag-cloud">
              <a href="#" class="tag" v-for="(tag, index) in tags" :key="index">{{ tag }}</a>
            </div>
          </div>

          <!-- Newsletter -->
          <div class="sidebar-section animate-on-scroll">
            <h3>Newsletter</h3>
            <p>Dapatkan update berita terbaru langsung ke email Anda</p>
            <form class="newsletter-form">
              <input type="email" placeholder="Email Anda" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Container */
.news-page {
  width: 100%;
  background-color: var(--background-light, #f8fafc);
  color: var(--text-color, #1e293b);
}

/* ---------- Hero Section ---------- */
.hero {
  background: linear-gradient(135deg, #002e54, #004680, #001830);
  color: white;
  padding: 5rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  height: 50vh;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc0MCcgaGVpZ2h0PSc0MCcgdmlld0JveD0nMCAwIDQwIDQwJz48cGF0aCBkPSdNMTkuOTk1IDBDOC43MSAwIDAgOC43MSAwIDE5Ljk5NVMzMy42NiA0MCAxOS45OTUgNDBTNDAgOC43MSA0MCAxOS45OTUgMjQuNTcgMCAxOS45OTUgMHptLjAwNSAyQTM1IDM1IDAgMCAxIDM4IDE5Ljk5IDE4IDE4IDAgMSAxIDIgMTkuOTkgMzUgMzUgMCAwIDEgMjAgMnonIGZpbGw9JyNmZmYnIGZpbGwtb3BhY2l0eT0nMC4wMycgZmlsbC1ydWxlPSdldmVub2RkJy8+PC9zdmc+');
  opacity: 0.15;
  z-index: 1;
}

.hero-content {
  position: relative;
  max-width: 800px;
  text-align: center;
  color: white;
  z-index: 2;
  padding: 0 1rem;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.3;
  position: relative;
  display: inline-block;
}

.hero-title::after {
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

.hero-subtitle {
  font-size: 1.25rem;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
  margin-top: 1.5rem;
}

/* Page Content */
.page-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* ---------- Stats Section ---------- */
.stats-section {
  margin-top: -4rem;
  margin-bottom: 3rem;
  position: relative;
  z-index: 10;
}

.stats-container {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem 2rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
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

/* Content Wrapper for main and sidebar */
.content-wrapper {
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 2.5rem;
  margin-top: 3rem;
}

/* ---------- Main Content ---------- */
.main-content {
  margin-bottom: 2rem;
}

/* Section Headers */
.section-header {
  text-align: center;
  margin-bottom: 2.5rem;
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

/* ---------- Featured News Container ---------- */
.featured-news-container {
  margin-bottom: 4rem;
}

/* ---------- Regular News Container ---------- */
.regular-news-container {
  margin-bottom: 4rem;
}

/* ---------- Filter Section ---------- */
.filter-section {
  margin-bottom: 2rem;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}

.filter-btn {
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

.filter-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.filter-btn.active {
  background-color: #004680;
  color: white;
  border-color: #004680;
}

.filter-btn .count {
  margin-left: 0.25rem;
  opacity: 0.7;
}

/* ---------- Featured Section ---------- */
.featured-section {
  margin-bottom: 2rem;
}

.featured-news {
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: white;
  margin-bottom: 1.5rem;
  border: 1px solid #f0f0f0;
}

.featured-news:hover {
  transform: translateY(-8px);
  box-shadow: 0 25px 35px -12px rgba(0, 0, 0, 0.15);
}

.featured-image {
  width: 100%;
  height: 280px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.featured-content {
  padding: 1.5rem 2rem 2rem;
}

.featured-badge {
  display: inline-block;
  background: linear-gradient(90deg, #004680, #00a0e3);
  color: white;
  font-weight: 600;
  padding: 0.35rem 1rem;
  border-radius: 2rem;
  font-size: 0.8rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 70, 128, 0.2);
}

.featured-content h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.news-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: center;
  font-size: 0.85rem;
  color: #64748b;
}

.news-category {
  color: #004680;
  font-weight: 600;
}

.news-date {
  position: relative;
  padding-left: 1rem;
}

.news-date::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #64748b;
}

.featured-description {
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.read-more-btn {
  display: inline-flex;
  align-items: center;
  color: #004680;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  padding: 0.5rem 1.25rem;
  background-color: rgba(0, 70, 128, 0.08);
  border-radius: 2rem;
}

.featured-news:hover .read-more-btn {
  background-color: #004680;
  color: white;
}

.read-more-btn .icon {
  margin-left: 0.5rem;
  transition: transform 0.3s ease;
}

.featured-news:hover .read-more-btn .icon {
  transform: translateX(4px);
}

/* ---------- News Section ---------- */
.news-section {
  margin-bottom: 4rem;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  width: 100%;
  position: relative;
  margin-bottom: 2rem;
}

.news-card {
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
  cursor: pointer;
  position: relative;
}

.news-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.1);
}

.news-card-image {
  height: 220px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.news-card-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  padding: 1.5rem;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
}

.news-card:hover .news-card-overlay {
  opacity: 1;
  transform: translateY(0);
}

.news-card-info {
  color: white;
}

.category-badge {
  background-color: #ff6b00;
  padding: 0.25rem 0.75rem;
  border-radius: 2rem;
  font-weight: 600;
  color: white;
  font-size: 0.75rem;
}

.news-card-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.news-card-content h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-top: 0.75rem;
  color: #1e293b;
  margin-bottom: 0.75rem;
}

.news-card-content p {
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Read More Icon */
.read-more-icon {
  position: absolute;
  right: 1.5rem;
  bottom: 1.5rem;
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, #ff6b00, #ff9248);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s ease;
  box-shadow: 0 10px 15px -3px rgba(255, 107, 0, 0.2);
}

.news-card:hover .read-more-icon {
  transform: translateY(-5px);
  box-shadow: 0 15px 25px -5px rgba(255, 107, 0, 0.3);
}

.read-more-icon .icon {
  font-size: 1.2rem;
  font-weight: bold;
  transition: transform 0.3s ease;
}

.news-card:hover .read-more-icon .icon {
  transform: translateX(3px);
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 3rem;
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

.news-info-text {
  text-align: center;
  color: #64748b;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

/* Sidebar */
.news-sidebar {
  margin-top: 0;
}

.sidebar-section {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
}

.sidebar-section h3 {
  font-size: 1.25rem;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e2e8f0;
  position: relative;
  font-weight: 700;
  color: #1e293b;
}

.sidebar-section h3:after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 50px;
  height: 2px;
  background-color: #004680;
}

/* Sidebar Search */
.sidebar-search {
  display: flex;
  position: relative;
}

.sidebar-search input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  outline: none;
  transition: border-color 0.3s;
  font-size: 0.95rem;
}

.sidebar-search input:focus {
  border-color: #004680;
  box-shadow: 0 0 0 3px rgba(0, 70, 128, 0.1);
}

.sidebar-search button {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
}

/* Category List */
.category-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-list li {
  margin-bottom: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.75rem;
}

.category-list li:last-child {
  margin-bottom: 0;
  border-bottom: none;
  padding-bottom: 0;
}

.category-list a {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #1e293b;
  transition: color 0.3s;
  text-decoration: none;
}

.category-list a:hover {
  color: #004680;
}

.category-list a.active {
  color: #004680;
  font-weight: 600;
}

.category-list span {
  background-color: #f3f4f6;
  color: #94a3b8;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  transition: all 0.3s;
}

.category-list a:hover span,
.category-list a.active span {
  background-color: #004680;
  color: white;
}

/* Recent Posts */
.recent-posts {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.recent-post {
  display: flex;
  gap: 1rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.recent-post:hover {
  transform: translateX(5px);
}

.recent-post-image {
  width: 70px;
  height: 70px;
  border-radius: 0.5rem;
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
}

.recent-post-content {
  flex: 1;
}

.recent-post-content h4 {
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
  transition: color 0.3s;
  font-weight: 600;
  margin-top: 0;
  color: #1e293b;
}

.recent-post-content p {
  font-size: 0.75rem;
  color: #94a3b8;
  margin: 0;
}

.recent-post:hover .recent-post-content h4 {
  color: #004680;
}

/* Tag Cloud */
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background-color: #f3f4f6;
  color: #1e293b;
  padding: 0.5rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  transition: all 0.3s;
  text-decoration: none;
}

.tag:hover {
  background-color: #004680;
  color: white;
  transform: translateY(-2px);
}

/* Newsletter Form */
.newsletter-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.newsletter-form p {
  margin-bottom: 1rem;
  font-size: 0.95rem;
  color: #64748b;
}

.newsletter-form input {
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  outline: none;
  transition: border-color 0.3s;
}

.newsletter-form input:focus {
  border-color: #004680;
  box-shadow: 0 0 0 3px rgba(0, 70, 128, 0.1);
}

.newsletter-form button {
  padding: 0.75rem 1rem;
  background-color: #004680;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.3s,
    transform 0.3s;
}

.newsletter-form button:hover {
  background-color: #00396a;
  transform: translateY(-2px);
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
@media (max-width: 1200px) {
  .news-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 1024px) {
  .stats-container {
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 1.5rem;
  }

  .stat-item {
    flex: 1 1 45%;
    margin-bottom: 1rem;
  }

  .featured-content h2 {
    font-size: 1.5rem;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .stats-section {
    margin-top: -2rem;
  }

  .news-grid {
    grid-template-columns: 1fr;
  }

  .content-wrapper {
    grid-template-columns: 1fr;
  }

  .featured-image {
    height: 250px;
  }

  .section-title {
    font-size: 2rem;
  }

  .pagination {
    flex-direction: column;
    gap: 0.75rem;
  }
}

@media (max-width: 480px) {
  .hero {
    min-height: 350px;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
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

  .featured-image {
    height: 200px;
  }

  .filter-options {
    overflow-x: auto;
    padding-bottom: 1rem;
    justify-content: flex-start;
  }

  .filter-btn {
    padding: 0.5rem 0.8rem;
    font-size: 0.875rem;
    white-space: nowrap;
  }

  .pagination-numbers {
    flex-wrap: wrap;
    justify-content: center;
    max-width: 200px;
  }

  .page-number {
    width: 2rem;
    height: 2rem;
    font-size: 0.75rem;
  }
}
</style>
