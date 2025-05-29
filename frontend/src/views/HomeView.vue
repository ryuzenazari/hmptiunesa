<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import homeData from '@/data/home.json'
import { useRouter } from 'vue-router'

const router = useRouter()

// Interface untuk struktur data
interface Event {
  id: number
  date: string
  title: string
  description: string
  image?: string
  slug?: string // Menambahkan slug untuk detail halaman
}

interface Announcement {
  id: number
  date: string
  title: string
  tag?: string
  slug?: string // Menambahkan slug untuk detail halaman
}

interface Partner {
  id: number
  name: string
  logo: string
  type: string
  bidang?: string // Menambahkan bidang kerjasama sebagai opsional
  website?: string // Menambahkan website sebagai opsional
}

interface Project {
  id: number
  title: string
  description: string
  image: string
  tags: string[]
  slug?: string // Menambahkan slug untuk detail halaman
}

interface Skill {
  id: number
  name: string
  icon: string
  description: string
}

// Data dinamis dari file JSON
const latestEvents = ref<Event[]>(homeData.latestEvents)
const announcements = ref<Announcement[]>(homeData.announcements)
const collaborations = ref<Partner[]>(homeData.collaborations)
const galleryImages = ref(homeData.galleryImages)
const stats = ref(homeData.stats)
const featuredProjects = ref<Project[]>(homeData.featuredProjects)
const skills = ref<Skill[]>(homeData.skills)
const partners = ref<Partner[]>(homeData.partners)

// Partner carousel functions
let partnerSliderInterval: ReturnType<typeof setInterval> | null = null
const currentPartnerIndex = ref(0)
const partnersPerView = ref(4) // Defaultnya 4 card di desktop

// Variabel untuk tracking drag yang lebih sederhana
const isDragging = ref(false)
const startPosition = ref(0)
const dragAmount = ref(0)
const containerRef = ref<HTMLElement | null>(null)

const totalSlides = computed(() => partners.value.length)

// Variabel untuk menampung partner yang ditampilkan dengan loop
const loopedPartners = computed(() => {
  // Buat salinan array partners untuk ditampilkan dengan loop
  // Tambahkan partner dari awal ke akhir dan dari akhir ke awal untuk loop yang mulus
  const startBuffer = [...partners.value].slice(-partnersPerView.value).map((partner) => ({
    ...partner,
    uniqueKey: `start-${partner.id}`, // Tambahkan key unik untuk partner di buffer awal
  }))

  const endBuffer = [...partners.value].slice(0, partnersPerView.value).map((partner) => ({
    ...partner,
    uniqueKey: `end-${partner.id}`, // Tambahkan key unik untuk partner di buffer akhir
  }))

  const mainPartners = partners.value.map((partner) => ({
    ...partner,
    uniqueKey: `main-${partner.id}`, // Tambahkan key unik untuk partner di bagian utama
  }))

  return [...startBuffer, ...mainPartners, ...endBuffer]
})

// Offset untuk perhitungan transformasi
const loopOffset = computed(() => partnersPerView.value)

// Update partnersPerView berdasarkan lebar layar
const updatePartnersPerView = () => {
  const width = window.innerWidth
  if (width <= 576) {
    partnersPerView.value = 1
  } else if (width <= 992) {
    partnersPerView.value = 2
  } else if (width <= 1200) {
    partnersPerView.value = 3
  } else {
    partnersPerView.value = 4
  }
}

// Mendapatkan lebar container untuk perhitungan
const getContainerWidth = (): number => {
  return containerRef.value ? containerRef.value.offsetWidth : window.innerWidth
}

// Fungsi untuk menangani transisi saat loop
const handleLoop = () => {
  // Deteksi jika di awal atau akhir untuk loop
  if (currentPartnerIndex.value === -1) {
    // Loop ke akhir
    setTimeout(() => {
      // Nonaktifkan transisi untuk langsung pindah
      document.querySelector('.partners-track')?.classList.add('no-transition')
      currentPartnerIndex.value = totalSlides.value - 1
      // Aktifkan kembali transisi setelah posisi direset
      setTimeout(() => {
        document.querySelector('.partners-track')?.classList.remove('no-transition')
      }, 50)
    }, 300)
  } else if (currentPartnerIndex.value === totalSlides.value) {
    // Loop ke awal
    setTimeout(() => {
      // Nonaktifkan transisi untuk langsung pindah
      document.querySelector('.partners-track')?.classList.add('no-transition')
      currentPartnerIndex.value = 0
      // Aktifkan kembali transisi setelah posisi direset
      setTimeout(() => {
        document.querySelector('.partners-track')?.classList.remove('no-transition')
      }, 50)
    }, 300)
  }
}

const nextPartnerSlide = () => {
  currentPartnerIndex.value++
  handleLoop()
}

const prevPartnerSlide = () => {
  currentPartnerIndex.value--
  handleLoop()
}

// Pendekatan drag yang lebih sederhana
const handleDragStart = (e: MouseEvent | TouchEvent) => {
  isDragging.value = true
  startPosition.value = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX
  dragAmount.value = 0

  // Hentikan autoplay saat interaksi
  if (partnerSliderInterval) {
    clearInterval(partnerSliderInterval)
    partnerSliderInterval = null
  }
}

const handleDragMove = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return

  const currentPosition = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX
  const rawDragAmount = currentPosition - startPosition.value

  // Mengurangi sensitivitas drag pada desktop
  if (e instanceof MouseEvent) {
    // Untuk mouse: gerakan dikurangi menjadi 50% dari aslinya untuk mengurangi sensitivitas
    // Meningkatkan dari 20% ke 50% agar lebih responsif
    dragAmount.value = rawDragAmount * 0.5
  } else {
    // Untuk touch: tetap 100% sensitivitas
    dragAmount.value = rawDragAmount
  }

  // Batasi pergerakan drag
  const containerWidth = getContainerWidth()
  const maxDrag = containerWidth * 0.5 // Meningkatkan dari 25% ke 50% lebar container
  if (dragAmount.value > maxDrag) dragAmount.value = maxDrag
  if (dragAmount.value < -maxDrag) dragAmount.value = -maxDrag
}

const handleDragEnd = () => {
  if (!isDragging.value) return

  isDragging.value = false

  // Tentukan slide tujuan berdasarkan arah dan jarak drag
  // Menurunkan threshold untuk memudahkan perpindahan slide
  const isMouse = window.matchMedia('(pointer: fine)').matches
  const moveThreshold = isMouse ? 50 : 40 // Menurunkan dari 200 ke 50 untuk mouse

  // Hitung persentase perpindahan relatif terhadap lebar card
  const containerWidth = getContainerWidth()
  const cardWidth = containerWidth / partnersPerView.value

  // Jika drag amount lebih dari 15% lebar card, pindah slide
  if (dragAmount.value > moveThreshold || dragAmount.value > cardWidth * 0.15) {
    prevPartnerSlide() // Drag kanan = prev slide
  } else if (dragAmount.value < -moveThreshold || dragAmount.value < -(cardWidth * 0.15)) {
    nextPartnerSlide() // Drag kiri = next slide
  }

  // Reset drag amount
  dragAmount.value = 0

  // Restart autoplay
  if (!partnerSliderInterval) {
    partnerSliderInterval = setInterval(() => {
      nextPartnerSlide()
    }, 5000)
  }
}

// Hitung transformasi berdasarkan index dan drag
const slideTransform = computed(() => {
  const containerWidth = getContainerWidth()
  // Gunakan partnersPerView.value untuk menghitung slide width
  const slideWidth = 100 / partnersPerView.value

  // Base transform berdasarkan index saat ini dan lebar slide, dengan offset untuk loop
  const baseTransform = -((currentPartnerIndex.value + loopOffset.value) * slideWidth)

  // Persentase drag dari total lebar
  const dragPercent = (dragAmount.value / containerWidth) * 100

  return `translateX(${baseTransform + dragPercent}%)`
})

onMounted(() => {
  fetchData()

  // Update partnersPerView dan collaborationsPerView saat komponen dimuat
  updatePartnersPerView()
  updateCollaborationsPerView()

  // Tambahkan event listener untuk resize
  window.addEventListener('resize', updatePartnersPerView)
  window.addEventListener('resize', updateCollaborationsPerView)

  // Inisiasi autoplay untuk partner slider dan collaboration slider
  partnerSliderInterval = setInterval(() => {
    nextPartnerSlide()
  }, 5000)

  collaborationSliderInterval = setInterval(() => {
    nextCollabSlide()
  }, 4000)

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

onBeforeUnmount(() => {
  // Bersihkan semua interval
  if (partnerSliderInterval) {
    clearInterval(partnerSliderInterval)
  }

  if (collaborationSliderInterval) {
    clearInterval(collaborationSliderInterval)
  }

  // Hapus semua event listener
  window.removeEventListener('resize', updatePartnersPerView)
  window.removeEventListener('resize', updateCollaborationsPerView)
})

// Dalam aplikasi nyata, ini akan menjadi panggilan API
const fetchData = () => {
  // Di sini Anda dapat menambahkan kode untuk mengambil data dari API
  console.log('Data berhasil dimuat')
}

// Variabel untuk carousel kerjasama prodi
let collaborationSliderInterval: ReturnType<typeof setInterval> | null = null
const currentCollaborationIndex = ref(0)
const collaborationsPerView = ref(3) // Default 3 card di desktop

// Variabel untuk tracking drag yang lebih sederhana
const isDraggingCollab = ref(false)
const startPositionCollab = ref(0)
const dragAmountCollab = ref(0)
const containerCollabRef = ref<HTMLElement | null>(null)

const totalCollabSlides = computed(() => collaborations.value.length)

// Variabel untuk menampung collaboration yang ditampilkan dengan loop
const loopedCollaborations = computed(() => {
  // Buat salinan array collaborations untuk ditampilkan dengan loop
  // Tambahkan collaboration dari awal ke akhir dan dari akhir ke awal untuk loop yang mulus
  const startBuffer = [...collaborations.value]
    .slice(-collaborationsPerView.value)
    .map((collab) => ({
      ...collab,
      uniqueKey: `start-${collab.id}`, // Tambahkan key unik untuk collab di buffer awal
    }))

  const endBuffer = [...collaborations.value]
    .slice(0, collaborationsPerView.value)
    .map((collab) => ({
      ...collab,
      uniqueKey: `end-${collab.id}`, // Tambahkan key unik untuk collab di buffer akhir
    }))

  const mainCollabs = collaborations.value.map((collab) => ({
    ...collab,
    uniqueKey: `main-${collab.id}`, // Tambahkan key unik untuk collab di bagian utama
  }))

  return [...startBuffer, ...mainCollabs, ...endBuffer]
})

// Offset untuk perhitungan transformasi
const loopCollabOffset = computed(() => collaborationsPerView.value)

// Update collaborationsPerView berdasarkan lebar layar
const updateCollaborationsPerView = () => {
  const width = window.innerWidth
  if (width <= 576) {
    collaborationsPerView.value = 1
  } else if (width <= 992) {
    collaborationsPerView.value = 2
  } else {
    collaborationsPerView.value = 3
  }
}

// Mendapatkan lebar container untuk perhitungan
const getCollabContainerWidth = (): number => {
  return containerCollabRef.value ? containerCollabRef.value.offsetWidth : window.innerWidth
}

// Fungsi untuk menangani transisi saat loop
const handleCollabLoop = () => {
  // Deteksi jika di awal atau akhir untuk loop
  if (currentCollaborationIndex.value === -1) {
    // Loop ke akhir
    setTimeout(() => {
      // Nonaktifkan transisi untuk langsung pindah
      document.querySelector('.collaborations-track')?.classList.add('no-transition')
      currentCollaborationIndex.value = totalCollabSlides.value - 1
      // Aktifkan kembali transisi setelah posisi direset
      setTimeout(() => {
        document.querySelector('.collaborations-track')?.classList.remove('no-transition')
      }, 50)
    }, 300)
  } else if (currentCollaborationIndex.value === totalCollabSlides.value) {
    // Loop ke awal
    setTimeout(() => {
      // Nonaktifkan transisi untuk langsung pindah
      document.querySelector('.collaborations-track')?.classList.add('no-transition')
      currentCollaborationIndex.value = 0
      // Aktifkan kembali transisi setelah posisi direset
      setTimeout(() => {
        document.querySelector('.collaborations-track')?.classList.remove('no-transition')
      }, 50)
    }, 300)
  }
}

const nextCollabSlide = () => {
  currentCollaborationIndex.value++
  handleCollabLoop()
}

const prevCollabSlide = () => {
  currentCollaborationIndex.value--
  handleCollabLoop()
}

// Pendekatan drag yang lebih sederhana
const handleCollabDragStart = (e: MouseEvent | TouchEvent) => {
  isDraggingCollab.value = true
  startPositionCollab.value = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX
  dragAmountCollab.value = 0

  // Hentikan autoplay saat interaksi
  if (collaborationSliderInterval) {
    clearInterval(collaborationSliderInterval)
    collaborationSliderInterval = null
  }
}

const handleCollabDragMove = (e: MouseEvent | TouchEvent) => {
  if (!isDraggingCollab.value) return

  const currentPosition = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX
  const rawDragAmount = currentPosition - startPositionCollab.value

  // Mengurangi sensitivitas drag pada desktop
  if (e instanceof MouseEvent) {
    // Untuk mouse: gerakan dikurangi menjadi 50% dari aslinya
    dragAmountCollab.value = rawDragAmount * 0.5
  } else {
    // Untuk touch: tetap 100% sensitivitas
    dragAmountCollab.value = rawDragAmount
  }

  // Batasi pergerakan drag
  const containerWidth = getCollabContainerWidth()
  const maxDrag = containerWidth * 0.5
  if (dragAmountCollab.value > maxDrag) dragAmountCollab.value = maxDrag
  if (dragAmountCollab.value < -maxDrag) dragAmountCollab.value = -maxDrag
}

const handleCollabDragEnd = () => {
  if (!isDraggingCollab.value) return

  isDraggingCollab.value = false

  // Tentukan slide tujuan berdasarkan arah dan jarak drag
  const isMouse = window.matchMedia('(pointer: fine)').matches
  const moveThreshold = isMouse ? 50 : 40

  // Hitung persentase perpindahan relatif terhadap lebar card
  const containerWidth = getCollabContainerWidth()
  const cardWidth = containerWidth / collaborationsPerView.value

  // Jika drag amount lebih dari 15% lebar card, pindah slide
  if (dragAmountCollab.value > moveThreshold || dragAmountCollab.value > cardWidth * 0.15) {
    prevCollabSlide() // Drag kanan = prev slide
  } else if (
    dragAmountCollab.value < -moveThreshold ||
    dragAmountCollab.value < -(cardWidth * 0.15)
  ) {
    nextCollabSlide() // Drag kiri = next slide
  }

  // Reset drag amount
  dragAmountCollab.value = 0

  // Restart autoplay
  if (!collaborationSliderInterval) {
    collaborationSliderInterval = setInterval(() => {
      nextCollabSlide()
    }, 4000)
  }
}

// Hitung transformasi berdasarkan index dan drag
const slideCollabTransform = computed(() => {
  const containerWidth = getCollabContainerWidth()
  // Gunakan collaborationsPerView.value untuk menghitung slide width
  const slideWidth = 100 / collaborationsPerView.value

  // Base transform berdasarkan index saat ini dan lebar slide, dengan offset untuk loop
  const baseTransform = -((currentCollaborationIndex.value + loopCollabOffset.value) * slideWidth)

  // Persentase drag dari total lebar
  const dragPercent = (dragAmountCollab.value / containerWidth) * 100

  return `translateX(${baseTransform + dragPercent}%)`
})

onMounted(() => {
  // ... existing code ...

  // Update collaborationsPerView saat komponen dimuat
  updateCollaborationsPerView()

  // Tambahkan event listener untuk resize
  window.addEventListener('resize', updateCollaborationsPerView)

  // Inisiasi autoplay untuk collaboration slider
  collaborationSliderInterval = setInterval(() => {
    nextCollabSlide()
  }, 4000)

  // ... existing code ...
})

onBeforeUnmount(() => {
  // ... existing code ...

  // Bersihkan interval kerjasama prodi
  if (collaborationSliderInterval) {
    clearInterval(collaborationSliderInterval)
  }

  // Hapus event listener saat komponen dihancurkan
  window.removeEventListener('resize', updateCollaborationsPerView)

  // ... existing code ...
})

// ... existing code ...

// Fungsi untuk navigasi ke website kerjasama
const navigateToCollab = (website?: string) => {
  if (website) {
    window.open(website, '_blank')
  }
}

// Fungsi untuk navigasi ke detail kegiatan
const navigateToEvent = (slug?: string) => {
  if (slug) {
    router.push(`/kegiatan/${slug}`)
  } else {
    router.push('/kegiatan')
  }
}

// Fungsi untuk navigasi ke detail proyek
const navigateToProject = (slug?: string) => {
  if (slug) {
    router.push(`/projects/${slug}`)
  } else {
    router.push('/projects')
  }
}

// Fungsi untuk navigasi ke detail pengumuman
const navigateToAnnouncement = (slug?: string) => {
  if (slug) {
    router.push(`/berita/${slug}`)
  } else {
    router.push('/berita')
  }
}

// Fungsi untuk navigasi ke detail galeri
const navigateToGallery = (id?: number) => {
  if (id) {
    router.push(`/galeri/${id}`)
  } else {
    router.push('/galeri')
  }
}

// Fungsi untuk navigasi ke website partner
const navigateToPartner = (website?: string) => {
  if (website) {
    window.open(website, '_blank')
  }
}
</script>

<template>
  <div class="home-container">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-overlay"></div>
      <div class="hero-container">
        <div class="hero-content">
          <h1 class="hero-title">Halo Informatics!</h1>
          <p class="hero-subtitle">
            Selamat Datang di HMP TI UNESA, wadah inspiratif tempat mahasiswa berkarya, berinovasi, dan berkolaborasi 
            untuk mewujudkan masa depan teknologi yang gemilang!
          </p>
          <div class="hero-cta">
            <router-link to="/profil" class="btn-secondary">Kenalan Yuk!</router-link>
          </div>
        </div>
        <div class="hero-image">
          <img src="@/assets/hero/1.png" alt="hero" class="pengurus-image" />
          <div class="pengurus-overlay"></div>
        </div>
      </div>
    </section>

    <div class="page-content">
      <!-- Stats Section -->
      <section class="stats-section">
        <div class="stats-container">
          <div v-for="stat in stats" :key="stat.id" class="stat-item">
            <div class="stat-number">{{ stat.number }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </section>

      <!-- Main Content -->
      <main class="main-content">
        <!-- About Section -->
        <section class="about-section animate-on-scroll">
          <div class="section-header">
            <h2 class="section-title">Kami</h2>
            <div class="section-line"></div>
          </div>
          <div class="about-wrapper">
            <div class="about-main">
              <div class="about-text about-card featured-card">
                <div class="card-icon">🚀</div>
                <h3>Tentang Kami</h3>
                <p>
                  Himpunan Mahasiswa Prodi Teknik Informatika Universitas Negeri Surabaya adalah
                  organisasi yang berfokus pada pengembangan softskill dan hardskill mahasiswa di
                  bidang teknologi informasi.
                </p>
                <router-link to="/profil" class="btn-outline">Pelajari Selengkapnya</router-link>
              </div>
            </div>
            <div class="about-content">
              <div class="about-card">
                <div class="card-icon">💡</div>
                <h3>Visi Kami</h3>
                <p>
                  Menjadi wadah pengembangan mahasiswa Teknik Informatika yang unggul dan berdaya
                  saing global.
                </p>
              </div>
              <div class="about-card">
                <div class="card-icon">🎯</div>
                <h3>Misi Kami</h3>
                <p>
                  Menciptakan lingkungan belajar yang inovatif dan kolaboratif untuk mengasah
                  kemampuan teknis dan kepemimpinan mahasiswa.
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Skills Section -->
        <section class="skills-section animate-on-scroll">
          <div class="section-header">
            <h2 class="section-title">Fokus Pengembangan</h2>
            <div class="section-line"></div>
          </div>
          <div class="skills-container">
            <div v-for="skill in skills" :key="skill.id" class="skill-card">
              <div class="skill-icon">{{ skill.icon }}</div>
              <h3>{{ skill.name }}</h3>
              <p>{{ skill.description }}</p>
            </div>
          </div>
        </section>

        <!-- Events Section -->
        <section class="events-section animate-on-scroll">
          <div class="section-header">
            <h2 class="section-title">Kegiatan Terbaru</h2>
            <div class="section-line"></div>
          </div>
          <div class="events-grid">
            <div v-for="event in latestEvents" :key="event.id" class="event-card" @click="navigateToEvent(event.slug)">
              <div class="event-image" :style="{ backgroundImage: `url('${event.image}')` }">
                <div class="event-date">{{ event.date }}</div>
              </div>
              <div class="event-content">
                <h3>{{ event.title }}</h3>
                <p>{{ event.description }}</p>
                <router-link to="/kegiatan" class="event-link">Detail Kegiatan →</router-link>
              </div>
            </div>
            <div class="events-more">
              <router-link to="/kegiatan" class="btn-primary">Lihat Semua Kegiatan</router-link>
            </div>
          </div>
        </section>

        <!-- Featured Projects -->
        <section class="projects-section animate-on-scroll">
          <div class="section-header">
            <h2 class="section-title">Proyek Unggulan</h2>
            <div class="section-line"></div>
          </div>
          <div class="projects-grid">
            <div v-for="project in featuredProjects" :key="project.id" class="project-card" @click="navigateToProject(project.slug)">
              <div class="project-image" :style="{ backgroundImage: `url('${project.image}')` }">
                <div class="project-overlay">
                  <h3>{{ project.title }}</h3>
                </div>
              </div>
              <div class="project-content">
                <div class="project-tags">
                  <span v-for="(tag, index) in project.tags" :key="index" class="project-tag">{{
                    tag
                  }}</span>
                </div>
                <p>{{ project.description }}</p>
                <router-link to="/projects" class="project-link">Lihat Detail →</router-link>
              </div>
            </div>
          </div>
          <div class="section-footer">
            <router-link to="/projects" class="btn-primary">Lihat Semua Proyek</router-link>
          </div>
        </section>

        <!-- Announcements & Gallery Section -->
        <div class="dual-section">
          <section class="announcements-section animate-on-scroll">
            <div class="section-header">
              <h2 class="section-title">Pengumuman</h2>
              <div class="section-line"></div>
            </div>
            <div class="announcements-list">
              <div
                v-for="announcement in announcements"
                :key="announcement.id"
                class="announcement-card"
                @click="navigateToAnnouncement(announcement.slug)"
              >
                <div class="announcement-tag" v-if="announcement.tag">{{ announcement.tag }}</div>
                <h3>{{ announcement.title }}</h3>
                <div class="announcement-date">{{ announcement.date }}</div>
                <div class="announcement-more">
                  <router-link to="/berita" class="announcement-link"
                    >Baca Selengkapnya →</router-link
                  >
                </div>
              </div>
            </div>
            <div class="section-footer">
              <router-link to="/berita" class="btn-outline">Semua Pengumuman</router-link>
            </div>
          </section>

          <section class="gallery-section animate-on-scroll">
            <div class="section-header">
              <h2 class="section-title">Galeri Kegiatan</h2>
              <div class="section-line"></div>
            </div>
            <div class="gallery-masonry">
              <div v-for="(image, index) in galleryImages" :key="image.id" class="gallery-item" @click="navigateToGallery(image.id)">
                <div
                  class="gallery-image"
                  :style="{ backgroundImage: `url('${image.url}')` }"
                ></div>
              </div>
            </div>
            <div class="section-footer">
              <router-link to="/galeri" class="btn-outline">Lihat Semua Galeri</router-link>
            </div>
          </section>
        </div>

        <!-- Collaborations Section -->
        <section class="collaborations-section animate-on-scroll">
          <div class="section-header">
            <h2 class="section-title">Kerjasama Prodi Kami</h2>
            <div class="section-line"></div>
          </div>
          <div class="collaborations-slider">
            <button class="slider-nav slider-prev" @click="prevCollabSlide">
              <span>&#10094;</span>
            </button>
            <div
              class="collaborations-container"
              ref="containerCollabRef"
              @mousedown="handleCollabDragStart"
              @touchstart="handleCollabDragStart"
              @mousemove="handleCollabDragMove"
              @touchmove="handleCollabDragMove"
              @mouseup="handleCollabDragEnd"
              @mouseleave="handleCollabDragEnd"
              @touchend="handleCollabDragEnd"
            >
              <div
                class="collaborations-track"
                :class="{ dragging: isDraggingCollab, 'no-transition': isDraggingCollab }"
                :style="{ transform: slideCollabTransform }"
              >
                <div
                  v-for="collab in loopedCollaborations"
                  :key="collab.uniqueKey"
                  class="collaboration-card"
                  @click="navigateToCollab(collab.website)"
                >
                  <div class="collaboration-logo">
                    <img :src="collab.logo" :alt="collab.name" loading="lazy" />
                  </div>
                  <div class="collaboration-info">
                    <h3>{{ collab.name }}</h3>
                    <span
                      class="collaboration-type"
                      :class="{
                        'type-akademik': collab.type === 'akademik',
                        'type-industri': collab.type === 'industri',
                      }"
                    >
                      {{ collab.type === 'akademik' ? 'Kerjasama Akademik' : 'Kerjasama Industri' }}
                    </span>
                    <div v-if="collab.bidang" class="collaboration-bidang">
                      <i class="bidang-icon">🔍</i>
                      <span>{{ collab.bidang }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button class="slider-nav slider-next" @click="nextCollabSlide">
              <span>&#10095;</span>
            </button>
          </div>
        </section>

        <!-- Partners Section -->
        <section class="partners-section animate-on-scroll">
          <div class="section-header">
            <h2 class="section-title">Mitra Prodi Kami</h2>
            <div class="section-line"></div>
          </div>
          <div class="partners-slider">
            <button class="slider-nav slider-prev" @click="prevPartnerSlide">
              <span>&#10094;</span>
            </button>
            <div
              class="partners-container"
              ref="containerRef"
              @mousedown="handleDragStart"
              @touchstart="handleDragStart"
              @mousemove="handleDragMove"
              @touchmove="handleDragMove"
              @mouseup="handleDragEnd"
              @mouseleave="handleDragEnd"
              @touchend="handleDragEnd"
            >
              <div
                class="partners-track"
                :class="{ dragging: isDragging, 'no-transition': isDragging }"
                :style="{ transform: slideTransform }"
              >
                <div
                  v-for="partner in loopedPartners"
                  :key="partner.uniqueKey"
                  class="partner-card"
                  @click="navigateToPartner(partner.website)"
                >
                  <div class="partner-logo">
                    <img :src="partner.logo" :alt="partner.name" loading="lazy" />
                  </div>
                  <div class="partner-info">
                    <h3>{{ partner.name }}</h3>
                    <span
                      class="partner-type"
                      :class="{
                        'type-industri': partner.type === 'industri',
                        'type-akademik': partner.type === 'akademik',
                        'type-sponsor': partner.type === 'sponsor',
                      }"
                    >
                      {{
                        partner.type === 'industri'
                          ? 'Mitra Industri'
                          : partner.type === 'akademik'
                            ? 'Mitra Akademik'
                            : 'Sponsor'
                      }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <button class="slider-nav slider-next" @click="nextPartnerSlide">
              <span>&#10095;</span>
            </button>
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

.home-container {
  width: 100%;
  background-color: var(--background);
  color: var(--text-primary);
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* ---------- Hero Section ---------- */
.hero {
  position: relative;
  min-height: 600px;
  height: 100vh;
  max-height: 900px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0;
  background: linear-gradient(135deg, #002e54, #004680, #001830);
  overflow: visible;
  margin-bottom: 5rem;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc0MCcgaGVpZ2h0PSc0MCcgdmlld0JveD0nMCAwIDQwIDQwJz48cGF0aCBkPSdNMTkuOTk1IDBDOC43MSAwIDAgOC43MSAwIDE5Ljk5NVMzMy42NiA0MCAxOS45OTUgNDBTNDAgOC43MSA0MCAxOS45OTUgMjQuNTcgMCAxOS45OTUgMHptLjAwNSAyQTM1IDM1IDAgMCAxIDM4IDE5Ljk5IDE4IDE4IDAgMSAxIDIgMTkuOTkgMzUgMzUgMCAwIDEgMjAgMnonIGZpbGw9JyNmZmYnIGZpbGwtb3BhY2l0eT0nMC4wMycgZmlsbC1ydWxlPSdldmVub2RkJy8+PC9zdmc+');
  opacity: 0.3;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('@/assets/kegiatan/mm/mmhmpti.png') center/cover;
  opacity: 0.08;
  z-index: 1;
}

.hero-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  height: 100%;
  position: relative;
  z-index: 3;
}

.hero-content {
  position: relative;
  max-width: 650px;
  text-align: left;
  color: white;
  z-index: 2;
  padding: 0 1rem;
  animation: fadeInUp 1s ease-out;
  flex: 1;
}

.hero-title {
  font-size: 4.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.1;
  color: white;
  -webkit-text-stroke: 0px transparent;
  text-shadow: none;
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
  background: linear-gradient(to right, orangered, #ff7e47);
  border-radius: 2px;
}

.hero-subtitle {
  font-size: 1.5rem;
  line-height: 1.5;
  margin-bottom: 2.5rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.hero-cta {
  display: flex;
  gap: 1rem;
  justify-content: flex-start;
  margin-bottom: 4rem;
}

.btn-primary,
.btn-secondary,
.btn-outline {
  padding: 0.875rem 1.75rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background-color: var(--accent-color);
  color: white;
  box-shadow: 0 10px 15px -3px rgba(249, 115, 22, 0.3);
}

.btn-primary:hover {
  background-color: #ea580c;
  transform: translateY(-2px);
  box-shadow: 0 20px 25px -5px rgba(249, 115, 22, 0.4);
}

.btn-secondary {
  background-color: rgba(255, 69, 0, 0.15);
  backdrop-filter: blur(4px);
  color: white;
  border: 1px solid rgba(255, 69, 0, 0.3);
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.btn-secondary::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, orangered, #ff7e47);
  z-index: -1;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.btn-secondary:hover {
  background-color: transparent;
  border-color: orangered;
  transform: translateY(-2px);
}

.btn-secondary:hover::before {
  transform: scaleX(1);
}

.btn-outline {
  background-color: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
}

.btn-outline:hover {
  background-color: var(--primary-color);
  color: white;
  transform: translateY(-2px);
}

/* ---------- Stats Section ---------- */
.stats-section {
  position: absolute;
  top: -9.4rem;
  left: 0;
  right: 0;
  z-index: 4;
}

.stats-container {
  display: flex;
  gap: 2.5rem;
  justify-content: center;
  background-color: white;
  border-radius: 1rem;
  padding: 2rem 3rem;
  box-shadow: 0 20px 40px -5px rgba(0, 0, 0, 0.15);
  background: linear-gradient(135deg, #fff, #f4f7fd);
}

.stat-item {
  text-align: center;
  position: relative;
  transition: transform 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-5px);
}

.stat-item:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 15%;
  right: -1.25rem;
  height: 70%;
  width: 1px;
  background: linear-gradient(to bottom, transparent, #e2e8f0, transparent);
}

.stat-number {
  font-size: 2.25rem;
  font-weight: 800;
  color: orangered;
  margin-bottom: 0.25rem;
  position: relative;
  display: inline-block;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

/* ---------- Main Content ---------- */
.main-content {
  margin-top: 1rem;
  padding-top: 0;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
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

.section-footer {
  text-align: center;
  margin-top: 2rem;
}

/* ---------- About Section ---------- */
.about-section {
  margin-bottom: 6rem;
  padding-top: 0;
  width: 100%;
}

.about-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.about-main {
  width: 100%;
  margin-bottom: 2rem;
}

.about-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  width: 100%;
}

.about-text.about-card {
  margin-bottom: 0;
  background: linear-gradient(135deg, #004680, #0072b1);
  color: white;
  display: flex;
  flex-direction: column;
  position: relative;
  height: auto;
  min-height: 240px;
  padding: 2.5rem;
}

.about-text.about-card h3,
.about-text.about-card p {
  color: white;
}

.about-text.about-card .btn-outline {
  color: white;
  border-color: white;
  align-self: flex-start;
}

.about-text.about-card .btn-outline:hover {
  background-color: white;
  color: #004680;
}

.about-text.about-card::before {
  background: linear-gradient(to right, white, rgba(255, 255, 255, 0.5));
}

.featured-card {
  position: relative;
  overflow: hidden;
  border-radius: 1.5rem;
}

.featured-card::after {
  content: '';
  position: absolute;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2), transparent);
  border-radius: 50%;
  top: -100px;
  right: -100px;
  z-index: 1;
}

.featured-card::before {
  content: '';
  position: absolute;
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.15), transparent);
  border-radius: 50%;
  bottom: -70px;
  left: -70px;
  z-index: 1;
}

.about-text p {
  font-size: 1.125rem;
  line-height: 1.8;
  color: var(--text-secondary);
  margin-bottom: 2rem;
  max-width: 800px;
}

.about-card {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  word-wrap: break-word;
  display: flex;
  flex-direction: column;
  min-height: 220px;
  height: 100%;
  justify-content: flex-start;
  text-align: center;
}

.about-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 25px -8px rgba(0, 0, 0, 0.15);
}

.about-text.about-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 30px -8px rgba(0, 0, 0, 0.3);
}

.about-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
}

.about-card p {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0;
  margin-top: 0.5rem;
  flex-grow: 1;
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  margin-top: 0.5rem;
}

.about-card h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: var(--text-primary);
  position: relative;
  z-index: 2;
}

/* Media queries for about section */
@media (min-width: 768px) {
  .about-wrapper {
    flex-direction: row;
    gap: 2rem;
  }
  
  .about-main {
    flex: 0 0 35%;
    margin-bottom: 0;
  }
  
  .about-content {
    flex: 1;
  }
  
  .about-text.about-card {
    height: 100%;
  }
}

@media (max-width: 992px) {
  .about-content {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.25rem;
  }
  
  .about-card {
    padding: 1.75rem;
    min-height: 200px;
  }
  
  .about-text.about-card {
    padding: 2rem;
    min-height: 220px;
  }
}

@media (max-width: 767px) {
  .about-wrapper {
    gap: 1.5rem;
  }
  
  .about-content {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1rem;
  }
  
  .about-text.about-card {
    padding: 1.75rem;
  }
  
  .about-text p {
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }
}

@media (max-width: 576px) {
  .about-content {
    grid-template-columns: 1fr;
  }
  
  .card-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  .about-card h3 {
    font-size: 1.2rem;
  }
  
  .about-card p {
    font-size: 0.9rem;
  }
  
  .about-card, .about-text.about-card {
    min-height: auto;
    padding: 1.5rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
}

@media (max-width: 375px) {
  .about-card, .about-text.about-card {
    padding: 1.25rem;
  }
  
  .card-icon {
    font-size: 2.25rem;
    margin-bottom: 0.75rem;
  }
  
  .about-card h3 {
    font-size: 1.1rem;
  }
  
  .about-card p {
    font-size: 0.85rem;
    line-height: 1.4;
  }
  
  .about-text.about-card .btn-outline {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 310px) {
  .about-card, .about-text.about-card {
    padding: 1rem;
  }
  
  .card-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  
  .about-card h3 {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
  
  .about-card p {
    font-size: 0.8rem;
    line-height: 1.35;
  }
  
  .about-text.about-card .btn-outline {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }
}

/* ---------- Skills Section ---------- */
.skills-section {
  margin-bottom: 6rem;
}

.skills-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  align-items: stretch;
}

@media (max-width: 992px) {
  .skills-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .skills-container {
    grid-template-columns: 1fr;
  }
}

.skill-card {
  background: white;
  padding: 1.75rem;
  border-radius: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  word-wrap: break-word;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 240px;
  height: 100%;
}

.skill-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.15);
}

.skill-icon {
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
  display: inline-block;
}

.skill-card h3, .about-card h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  margin-top: 0.5rem;
  color: var(--text-primary);
}

.skill-card p {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
  flex-grow: 1;
}

@media (max-width: 375px) {
  .about-card, .skill-card {
    padding: 1.25rem;
    min-height: 190px;
  }
  
  .card-icon, .skill-icon {
    font-size: 2.25rem;
    margin-bottom: 0.75rem;
  }
  
  .about-card h3, .skill-card h3 {
    font-size: 1.2rem;
  }
  
  .about-card p, .skill-card p {
    font-size: 0.9rem;
    line-height: 1.4;
  }
}

@media (max-width: 310px) {
  .about-card, .skill-card {
    padding: 1rem;
    min-height: 180px;
  }
  
  .skills-container {
    grid-template-columns: 1fr;
  }

  .skill-card {
    padding: 1.25rem;
  }

  .skill-icon, .card-icon {
    font-size: 2.5rem;
    margin-bottom: 0.75rem;
  }

  .skill-card h3, .about-card h3 {
    font-size: 1.1rem;
    margin-top: 0.35rem;
    margin-bottom: 0.5rem;
  }

  .skill-card p {
    font-size: 0.9rem;
  }
}

/* ---------- Events Section ---------- */
.events-section {
  margin-bottom: 6rem;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 2rem;
}

.event-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  cursor: pointer; /* Tambahkan pointer cursor */
}

.event-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.15);
}

.event-image {
  height: 200px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.event-date {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: var(--accent-color);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
}

.event-content {
  padding: 1.5rem;
}

.event-content h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: var(--text-primary);
}

.event-content p {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.event-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2; /* Pastikan link tetap bisa diklik */
}

.event-link:hover {
  color: var(--primary-dark);
  transform: translateX(5px);
}

.events-more {
  grid-column: 1 / -1;
  text-align: center;
  margin-top: 2rem;
}

@media (max-width: 390px) {
  .events-grid {
    grid-template-columns: 1fr;
  }

  .event-card {
    width: 100%;
    margin: 0 auto;
  }

  .event-content {
    padding: 1rem;
  }

  .event-content h3 {
    font-size: 1.1rem;
  }

  .event-content p {
    font-size: 0.9rem;
  }

  .event-image {
    height: 180px;
  }
}

/* ---------- Projects Section ---------- */
.projects-section {
  margin-bottom: 6rem;
  padding: 0 1rem; /* Tambahkan padding horizontal agar ada ruang di kanan dan kiri */
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  gap: 2.5rem;
}

.project-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  width: 100%; /* Pastikan card mengambil lebar penuh */
  cursor: pointer; /* Tambahkan pointer cursor */
}

.project-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.15);
}

.project-image {
  height: 250px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.project-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  color: white;
}

.project-overlay h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.project-content {
  padding: 1.5rem;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.project-tag {
  background-color: var(--primary-color);
  color: white;
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-weight: 600;
}

.project-content p {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.project-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2; /* Pastikan link tetap bisa diklik */
}

.project-link:hover {
  color: var(--primary-dark);
  transform: translateX(5px);
}

/* Tambahkan media query untuk layar berukuran kecil dan mobile */
@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr; /* Hanya 1 kolom pada mobile */
    gap: 1.5rem; /* Kurangi gap pada mobile */
  }

  .project-image {
    height: 200px; /* Kurangi tinggi gambar pada mobile */
  }

  .project-overlay h3 {
    font-size: 1.3rem; /* Kurangi ukuran font judul pada mobile */
  }
}

@media (max-width: 480px) {
  .projects-grid {
    margin: 0 -0.5rem; /* Kompensasi padding container pada mobile */
    width: calc(100% + 1rem); /* Memastikan lebar grid tepat */
  }

  .project-card {
    margin: 0;
  }

  .project-image {
    height: 180px; /* Kurangi lagi tinggi gambar pada mobile kecil */
  }

  .project-overlay h3 {
    font-size: 1.2rem;
  }

  .project-content {
    padding: 1rem; /* Kurangi padding konten pada mobile */
  }
}



/* ---------- Dual Section ---------- */
.dual-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 6rem;
}

/* Media query untuk layar mobile */
@media (max-width: 768px) {
  .dual-section {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

@media (max-width: 480px) {
  .dual-section {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

/* ---------- Announcements Section ---------- */
.announcements-section {
  position: relative;
  overflow: visible !important;
}

.announcements-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-top: 0.5rem;
  position: relative;
  overflow: visible !important;
}

.announcement-card {
  background: white;
  padding: 1.5rem;
  padding-top: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  position: relative;
  border-left: 4px solid var(--primary-color);
  transition: transform 0.3s ease;
  margin-top: 0.5rem;
  overflow: visible !important;
  cursor: pointer; /* Tambahkan pointer cursor */
}

.announcement-card:hover {
  transform: translateX(5px);
  box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.15);
}

.announcement-tag {
  position: absolute;
  top: 0;
  transform: translateY(-50%);
  right: 1rem;
  background-color: var(--accent-color);
  color: white;
  font-size: 0.75rem;
  padding: 0.4rem 1rem;
  border-radius: 1.5rem;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  transition: all 0.3s ease;
  z-index: 20;
}

.announcement-card:hover .announcement-tag {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.announcement-card h3 {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  padding-right: 3rem;
  margin-top: 0.5rem;
}

.announcement-date {
  font-size: 0.875rem;
  color: var(--text-light);
  margin-bottom: 1rem;
}

.announcement-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2; /* Pastikan link tetap bisa diklik */
}

.announcement-link:hover {
  color: var(--primary-dark);
  text-decoration: underline;
}

/* ---------- Gallery Section ---------- */
.gallery-masonry {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.gallery-item {
  position: relative;
  border-radius: 0.75rem;
  overflow: hidden;
  height: 180px;
  cursor: pointer; /* Tambahkan pointer cursor */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.gallery-item:hover {
  transform: scale(1.03);
  box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.gallery-image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: transform 0.5s ease;
}

.gallery-item:hover .gallery-image {
  transform: scale(1.1);
}

/* ---------- Achievements Section ---------- */
.achievements-section {
  margin-bottom: 6rem;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.achievement-card {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.achievement-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.achievement-icon {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
}

.achievement-card h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.achievement-card p {
  color: var(--text-secondary);
  line-height: 1.6;
}

/* ---------- Partners Section ---------- */
.partners-section {
  margin-bottom: 6rem;
}

.partners-slider {
  position: relative;
  display: flex;
  align-items: center;
  margin-top: 2rem;
  overflow: hidden;
}

.partners-container {
  width: 100%;
  overflow: hidden;
  position: relative;
  cursor: grab;
  user-select: none;
  touch-action: pan-y;
}

.partners-container:active {
  cursor: grabbing;
}

.partners-track {
  display: flex;
  transition: transform 0.3s ease;
  will-change: transform;
  width: auto !important; /* Override any other width setting */
}

.partners-track.dragging {
  transition: none;
}

.partners-track.no-transition {
  transition: none !important;
}

.partner-card {
  flex: 0 0 25%; /* 25% untuk menampilkan 4 card pada desktop */
  padding: 1rem;
  text-align: center;
  box-sizing: border-box;
  min-width: 0; /* Prevent content overflow */
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer; /* Tambahkan pointer cursor */
}

.partner-logo {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  background-color: #f8fafc;
  border-radius: 12px;
  padding: 1.5rem;
  max-width: 90%;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 70, 128, 0.1);
  overflow: hidden;
  position: relative;
}

.partner-logo::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: all 0.5s ease;
}

.partner-card:hover .partner-logo::after {
  left: 100%;
}

.partner-card:hover .partner-logo {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 70, 128, 0.1);
  border-color: rgba(0, 70, 128, 0.2);
}

.partner-logo img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  filter: grayscale(20%);
  transition: all 0.3s ease;
  opacity: 0.9;
}

.partner-card:hover .partner-logo img {
  filter: grayscale(0%);
  opacity: 1;
  transform: scale(1.05);
}

.partner-info {
  text-align: center;
  padding: 0.5rem;
  background-color: white;
  border-radius: 12px;
  margin-top: 0.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.03);
}

.partner-card:hover .partner-info {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.07);
}

.partner-info h3 {
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.3s ease;
}

.partner-card:hover .partner-info h3 {
  color: #004680;
}

.partner-type {
  display: inline-block;
  padding: 0.3rem 0.9rem;
  border-radius: 30px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 0.75rem;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.partner-card:hover .partner-type {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.07);
}

.type-industri {
  background-color: #dbeafe;
  color: #1d4ed8;
  box-shadow: 0 2px 8px rgba(29, 78, 216, 0.1);
}

.partner-card:hover .type-industri {
  background-color: #bfdbfe;
  box-shadow: 0 4px 12px rgba(29, 78, 216, 0.15);
}

.type-akademik {
  background-color: #fae8ff;
  color: #9333ea;
  box-shadow: 0 2px 8px rgba(147, 51, 234, 0.1);
}

.partner-card:hover .type-akademik {
  background-color: #f5d0fe;
  box-shadow: 0 4px 12px rgba(147, 51, 234, 0.15);
}

.type-sponsor {
  background-color: #fef3c7;
  color: #d97706;
  box-shadow: 0 2px 8px rgba(217, 119, 6, 0.1);
}

.partner-card:hover .type-sponsor {
  background-color: #fde68a;
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.15);
}

.partners-slider {
  position: relative;
  display: flex;
  align-items: center;
  margin-top: 2rem;
  overflow: hidden;
  padding: 1rem 0;
}

.slider-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: white;
  color: var(--primary-color);
  font-size: 1.5rem;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(0, 70, 128, 0.05);
}

.slider-nav:hover {
  background-color: var(--primary-color);
  color: white;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  transform: translateY(-50%) scale(1.1);
}

.slider-prev {
  left: 10px;
}

.slider-next {
  right: 10px;
}

@media (max-width: 1200px) {
  .collaboration-card {
    flex: 0 0 33.33%; /* 33.33% untuk menampilkan 3 card */
  }
}

@media (max-width: 1024px) {
  .hero-container {
    flex-direction: column;
    padding: 1rem;
    height: auto;
  }

  .hero-content {
    text-align: center;
    max-width: 100%;
    margin-bottom: -2rem;
    padding: 2rem 3rem;
    position: relative;
    top: 50px
  }

  .hero-cta {
    justify-content: center;
  }

  .hero-image {
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
    height: auto;
    transform: none;
  }

  .pengurus-image {
    width: 100%;
    height: auto;
    max-height: 500px;
    object-fit: contain;
    object-position: center;
    transform: none;
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 3rem 0 2rem;
    min-height: auto;
    height: auto;
    margin-bottom: 0;
  }

  .hero-container {
    padding: 1rem;
    gap: 1.5rem;
    height: auto;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.15rem;
    margin-bottom: 1.5rem;
  }

  .stat-item:not(:last-child)::after {
    display: none;
  }

  .stats-section {
    position: relative;
    margin-top: 5rem;
    margin-bottom: 0;
    z-index: 5;
  }

  .stats-container {
    padding: 1.5rem;
    padding-top: 2rem;
    gap: 1.5rem;
    background-color: white;
    border-radius: 1rem;
    box-shadow: 0 20px 40px -5px rgba(0, 0, 0, 0.15);
    background: linear-gradient(135deg, #fff, #f4f7fd);
  }

  .about-section {
    margin-top: -8rem;
    margin-bottom: 4rem;
  }

  .about-content {
    flex-direction: column;
  }
  
  .about-card, .skill-card {
    padding: 1.5rem;
    min-height: 200px;
  }

  .about-section .section-header {
    margin-bottom: 1.5rem;
  }

  .about-section .section-title {
    margin-top: 0;
  }

  .hero-image {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    height: auto;
    max-height: 370px;
    overflow: visible;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    margin-bottom: 1.5rem;
    position: relative;
    z-index: 6;
  }

  .pengurus-image {
    width: 100%;
    height: auto;
    max-height: 370px;
    object-fit: contain;
    object-position: bottom;
    margin-bottom: 0;
    transform: translateY(40px);
    position: relative;
    z-index: 6;
  }
}

@media (max-width: 480px) {
  .about-card, .skill-card {
    padding: 1.5rem;
  }
  
  .card-icon, .skill-icon {
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
  margin-top: 0.5rem;
}
  
  .about-card h3, .skill-card h3 {
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
  margin-top: 0.5rem;
}
  
  .about-card p, .skill-card p {
    font-size: 0.95rem;
    line-height: 1.5;
  }

  .hero {
    padding: 2rem 0;
    margin-bottom: 0;
  }

  .hero-container {
    padding: 1rem;
    gap: 1rem;
  }

  .hero-title {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .hero-title::after {
    width: 60px;
    height: 3px;
    bottom: -8px;
  }

  .hero-subtitle {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }

  .hero-image {
    width: 100%;
    max-width: 300px;
    max-height: 300px;
    overflow: visible;
  }

  .pengurus-image {
    width: 100%;
    max-height: 300px;
    object-fit: contain;
    object-position: bottom;
    transform: translateY(15px);
  }

  .pengurus-overlay {
    width: 100%;
    height: 100%;
  }

  .stats-section {
    margin-top: 1.5rem;
    position: relative;
    z-index: 15;
    margin-bottom: 0;
  }

  .stats-container {
    padding: 0.75rem;
    gap: 0.75rem;
  }

  .stat-number {
    font-size: 1.8rem;
  }

  .stat-label {
    font-size: 0.75rem;
  }

  .about-section .section-header {
    margin-bottom: 1rem;
  }

  .about-section .section-title {
    margin-top: 0;
    font-size: 2rem;
  }

  .section-header {
    margin-bottom: 2rem;
  }

  .about-section {
    margin-top: 1.5rem;
    margin-bottom: 3rem;
  }
}

@media (max-width: 576px) {
  .partner-card {
    flex: 0 0 100%; /* 100% untuk menampilkan 1 card */
  }

  .stats-container {
    flex-direction: column;
    align-items: center;
    padding: 1.5rem;
    gap: 1.5rem;
  }

  .stat-item {
    width: 100%;
    margin-bottom: 0.5rem;
  }
}

/* Page Content */
.page-content {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
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

/* Animation keyframes */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse {
  0% {
    opacity: 0.4;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1.05);
  }
  100% {
    opacity: 0.4;
    transform: translate(-50%, -50%) scale(1);
  }
}

/* ---------- Section Styles ---------- */
.section-header {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
}

.section-title {
  margin-top: 3rem;
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 1rem;
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(to right, #004680, #00a0e3);
  border-radius: 2px;
}

.section-line {
  width: 80px;
  height: 4px;
  background: linear-gradient(to right, #004680, #00a0e3);
  margin: 0 auto;
  border-radius: 2px;
  display: none;
}

/* ---------- Button Styles ---------- */
.btn-primary {
  background: linear-gradient(to right, #004680, #00a0e3);
  color: white;
  box-shadow: 0 10px 15px -3px rgba(0, 70, 128, 0.4);
  border: none;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.btn-primary::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, #00a0e3, #004680);
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 20px -5px rgba(0, 70, 128, 0.5);
}

.btn-primary:hover::after {
  opacity: 1;
}

.btn-outline {
  background-color: transparent;
  color: #004680;
  border: 2px solid #004680;
  position: relative;
  overflow: hidden;
  z-index: 1;
  text-align: center;
  margin: 0 auto;
  display: block;
}

.btn-outline::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, #004680, #00a0e3);
  z-index: -1;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.btn-outline:hover {
  color: white;
  border-color: transparent;
}

.btn-outline:hover::after {
  transform: scaleX(1);
}

/* ---------- Card Styles ---------- */
.event-card,
.project-card,
.achievement-card,
.skill-card,
.announcement-card {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
}

.event-card::before,
.project-card::before,
.skill-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(to right, #004680, #00a0e3);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.event-card:hover,
.project-card:hover,
.achievement-card:hover,
.skill-card:hover,
.announcement-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.15);
}

.event-card:hover::before,
.project-card:hover::before,
.skill-card:hover::before {
  transform: scaleX(1);
}

.event-date {
  background: linear-gradient(to right, orangered, #ff7e47);
  box-shadow: 0 4px 10px -2px rgba(255, 69, 0, 0.4);
}

.project-tag {
  background: linear-gradient(to right, #004680, #00a0e3);
}

.announcement-tag {
  background: linear-gradient(to right, orangered, #ff7e47);
  box-shadow: 0 4px 12px -2px rgba(255, 69, 0, 0.5);
  border: 2px solid white;
  width: auto;
  display: inline-block;
}

.announcement-card:hover .announcement-tag {
  transform: translateY(-60%);
  box-shadow: 0 6px 15px -2px rgba(255, 69, 0, 0.6);
}

/* Skill Section */
.skill-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;
}

.skill-icon::after {
  content: '';
  position: absolute;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(45deg, rgba(0, 70, 128, 0.2), rgba(0, 160, 227, 0.2));
  z-index: -1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.3s ease;
}

.skill-card:hover .skill-icon::after {
  width: 60px;
  height: 60px;
}

/* Hero Container */
.hero-container {
  position: relative;
}

.hero-container::before {
  content: '';
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 160, 227, 0.3), rgba(0, 160, 227, 0));
  top: 20%;
  left: -100px;
  z-index: 1;
}

.hero-container::after {
  content: '';
  position: absolute;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 69, 0, 0.2), rgba(255, 69, 0, 0));
  bottom: 15%;
  right: -50px;
  z-index: 1;
}

.hero-image {
  position: relative;
  flex: 0 0 40%;
  height: auto;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 5;
  padding: 0;
  padding-top: 1rem;
  border-radius: 16px;
  overflow: visible;
}

.pengurus-image {
  height: auto;
  width: 100%;
  max-height: 70vh;
  max-width: 100%;
  position: relative;
  z-index: 2;
  object-fit: contain;
  object-position: bottom;
  border-radius: 16px;
  mix-blend-mode: luminosity;
  transition: all 0.3s ease;
  filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.2));
}

.hero-image:hover .pengurus-image {
  mix-blend-mode: normal;
}

.pengurus-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(to top, rgba(0, 46, 84, 0.8), transparent);
  z-index: 3;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  pointer-events: none;
}

/* Untuk iPhone SE dan layar sangat kecil */
@media (max-width: 375px) {
  .hero {
    margin-bottom: 0;
    min-height: 500px;
  }

  .stats-section {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  .stats-container {
    padding: 0.5rem;
    gap: 0.5rem;
  }

  .stat-number {
    font-size: 1.5rem;
  }

  .stat-label {
    font-size: 0.7rem;
  }

  .about-section .section-header {
    margin-bottom: 1rem;
  }

  .about-section .section-title {
    font-size: 1.8rem;
  }

  .about-section {
    margin-top: 1rem;
    margin-bottom: 2.5rem;
  }

  .hero-image {
    max-width: 250px;
    max-height: 200px;
  }

  .pengurus-image {
    max-height: 200px;
  }

  .hero-title {
    font-size: 1.8rem;
  }

  .hero-subtitle {
    font-size: 0.9rem;
  }
}

/* ---------- Collaborations Section ---------- */
.collaborations-section {
  margin-bottom: 6rem;
}

.collaborations-slider {
  position: relative;
  display: flex;
  align-items: center;
  margin-top: 2rem;
  overflow: hidden;
  padding: 1rem 0;
}

.collaborations-container {
  width: 100%;
  overflow: hidden;
  position: relative;
  cursor: grab;
  user-select: none;
  touch-action: pan-y;
}

.collaborations-container:active {
  cursor: grabbing;
}

.collaborations-track {
  display: flex;
  transition: transform 0.3s ease;
  will-change: transform;
  width: auto !important; /* Override any other width setting */
}

.collaborations-track.dragging {
  transition: none;
}

.collaborations-track.no-transition {
  transition: none !important;
}

.collaboration-card {
  flex: 0 0 33.33%; /* 33.33% untuk menampilkan 3 card */
  padding: 1rem;
  text-align: center;
  box-sizing: border-box;
  min-width: 0; /* Prevent content overflow */
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer; /* Tambahkan pointer cursor */
}

.collaboration-card:hover {
  transform: translateY(-5px);
}

.collaboration-card:hover .collaboration-logo {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15);
}

.collaboration-logo {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  background-color: #f8fafc;
  border-radius: 12px;
  padding: 1.5rem;
  max-width: 90%;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 70, 128, 0.1);
  overflow: hidden;
  position: relative;
}

.collaboration-logo img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.collaboration-info {
  text-align: center;
  padding: 0.5rem;
  background-color: white;
  border-radius: 12px;
  margin-top: 0.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.03);
}

.collaboration-card:hover .collaboration-info {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.07);
}

.collaboration-info h3 {
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.3s ease;
}

.collaboration-card:hover .collaboration-info h3 {
  color: #004680;
}

.collaboration-type {
  display: inline-block;
  padding: 0.3rem 0.9rem;
  border-radius: 30px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 0.75rem;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.collaboration-card:hover .collaboration-type {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.07);
}

.type-akademik {
  background-color: #fae8ff;
  color: #9333ea;
  box-shadow: 0 2px 8px rgba(147, 51, 234, 0.1);
}

.collaboration-card:hover .type-akademik {
  background-color: #f5d0fe;
  box-shadow: 0 4px 12px rgba(147, 51, 234, 0.15);
}

.type-industri {
  background-color: #dbeafe;
  color: #1d4ed8;
  box-shadow: 0 2px 8px rgba(29, 78, 216, 0.1);
}

.collaboration-card:hover .type-industri {
  background-color: #bfdbfe;
  box-shadow: 0 4px 12px rgba(29, 78, 216, 0.15);
}

.collaboration-bidang {
  margin-top: 0.75rem;
  font-size: 0.8rem;
  color: #4a5568;
  line-height: 1.4;
  background-color: rgba(236, 236, 240, 0.6);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-left: 3px solid #9333ea;
  transition: all 0.3s ease;
  text-align: left;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}

.collaboration-card:hover .collaboration-bidang {
  background-color: rgba(236, 236, 240, 0.8);
  border-left-width: 5px;
  transform: translateY(-2px);
}

.bidang-icon {
  font-style: normal;
  color: #9333ea;
  font-size: 1rem;
  background-color: rgba(147, 51, 234, 0.1);
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.collaboration-card:hover .bidang-icon {
  background-color: rgba(147, 51, 234, 0.2);
  transform: scale(1.1);
}

@media (max-width: 1200px) {
  .collaboration-card {
    flex: 0 0 33.33%; /* 33.33% untuk menampilkan 3 card */
  }
}

@media (max-width: 992px) {
  .collaboration-card {
    flex: 0 0 50%; /* 50% untuk menampilkan 2 card */
  }
}

@media (max-width: 576px) {
  .collaboration-card {
    flex: 0 0 100%; /* 100% untuk menampilkan 1 card */
  }
}

@media (max-width: 1200px) {
  .partner-card {
    flex: 0 0 33.33%; /* 33.33% untuk menampilkan 3 card */
  }
}

@media (max-width: 992px) {
  .partner-card {
    flex: 0 0 50%; /* 50% untuk menampilkan 2 card */
  }
}

@media (max-width: 576px) {
  .partner-card {
    flex: 0 0 100%; /* 100% untuk menampilkan 1 card */
  }
}

.collaboration-logo::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: all 0.5s ease;
}

.collaboration-card:hover .collaboration-logo::after {
  left: 100%;
}

.collaboration-card:hover .collaboration-logo {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 70, 128, 0.1);
  border-color: rgba(0, 70, 128, 0.2);
}

.collaboration-logo img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  filter: grayscale(20%);
  transition: all 0.3s ease;
  opacity: 0.9;
}

.collaboration-card:hover .collaboration-logo img {
  filter: grayscale(0%);
  opacity: 1;
  transform: scale(1.05);
}

.partner-card:hover {
  transform: translateY(-5px);
}

.partner-card:hover .partner-logo {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15);
}
</style>
