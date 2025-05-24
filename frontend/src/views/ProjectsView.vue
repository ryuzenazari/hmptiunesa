<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import projectsData from '@/data/projects.json'

interface Project {
  id: number
  title: string
  description: string
  image: string
  detailImage?: string
  category: string
  tags: string[]
  year: string
  team: string[]
  link?: string
  github?: string
  benefits?: string[]
}

// Data proyek dari file JSON
const projects = ref<Project[]>(projectsData.projectItems)

// Filter dan state
const categories = ref<string[]>(projectsData.categories)
const selectedCategory = ref('All')
const searchQuery = ref('')
const selectedProject = ref<Project | null>(null)
const isModalOpen = ref(false)
const isSubmitFormOpen = ref(false)

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(6)

// State untuk formulir submit proyek
const newProject = ref({
  title: '',
  description: '',
  category: '',
  tagsInput: '',
  teamInput: '',
  year: '',
  image: '',
  detailImage: '',
  link: '',
  github: '',
  benefitsInput: '',
})

// Toggle untuk opsi upload
const imageUploadMethod = ref({
  main: 'url', // 'url' or 'file'
  detail: 'url', // 'url' or 'file'
})

// File references
const mainImageFile = ref<File | null>(null)
const detailImageFile = ref<File | null>(null)

// Untuk preview image yang diupload
const mainImagePreview = ref('')
const detailImagePreview = ref('')

// Fungsi untuk handle file upload
const handleFileUpload = (event: Event, type: 'main' | 'detail') => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    const reader = new FileReader()

    reader.onload = (e) => {
      if (type === 'main') {
        mainImageFile.value = file
        mainImagePreview.value = (e.target?.result as string) || ''
      } else {
        detailImageFile.value = file
        detailImagePreview.value = (e.target?.result as string) || ''
      }
    }

    reader.readAsDataURL(file)
  }
}

// State untuk menampilkan pesan sukses
const submissionSuccess = ref(false)

// Computed untuk proyek yang difilter
const filteredProjects = computed(() => {
  let filtered = projects.value

  // Filter berdasarkan kategori
  if (selectedCategory.value !== 'All') {
    filtered = filtered.filter((project) => project.category === selectedCategory.value)
  }

  // Filter berdasarkan pencarian
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (project) =>
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.tags.some((tag) => tag.toLowerCase().includes(query)),
    )
  }

  return filtered
})

// Computed untuk total halaman
const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredProjects.value.length / itemsPerPage.value))
})

// Computed untuk proyek yang ditampilkan dengan pagination
const paginatedProjects = computed(() => {
  // Ensure current page is within valid range after filtering
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
  }

  const startIndex = (currentPage.value - 1) * itemsPerPage.value
  const endIndex = Math.min(startIndex + itemsPerPage.value, filteredProjects.value.length)
  return filteredProjects.value.slice(startIndex, endIndex)
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

// Tampilkan detail proyek
const showProjectDetails = (project: Project) => {
  selectedProject.value = project
  isModalOpen.value = true
}

// Tutup modal
const closeModal = () => {
  isModalOpen.value = false
}

// Filter proyek berdasarkan kategori
const filterByCategory = (category: string) => {
  selectedCategory.value = category
  currentPage.value = 1 // Reset ke halaman 1 saat filter berubah
}

// Submit proyek baru
const submitProject = () => {
  // Di produksi, kode ini akan mengirim data ke API
  // Untuk saat ini, kita hanya mensimulasikan proses submit dan menampilkan pesan sukses

  // Konversi string tag dan tim menjadi array
  const tags = newProject.value.tagsInput.split(',').map((tag: string) => tag.trim())
  const team = newProject.value.teamInput.split(',').map((member: string) => member.trim())

  // Konversi string benefits menjadi array (split by new line)
  const benefits = newProject.value.benefitsInput
    .split('\n')
    .filter((benefit: string) => benefit.trim().length > 0)
    .map((benefit: string) => benefit.trim())

  // Dalam implementasi nyata, kita akan upload file gambar jika ada
  // dan menggunakan URL gambar dari hasil upload
  let mainImageUrl = newProject.value.image
  let detailImageUrl = newProject.value.detailImage

  // Simulasikan URL dari file yang diupload (menggunakan preview data URL)
  if (imageUploadMethod.value.main === 'file' && mainImagePreview.value) {
    // Di produksi, kita akan mengirim file ke server dan mendapatkan URL
    mainImageUrl = mainImagePreview.value // Temporary, gunakan preview sebagai simulasi
  }

  if (imageUploadMethod.value.detail === 'file' && detailImagePreview.value) {
    // Di produksi, kita akan mengirim file ke server dan mendapatkan URL
    detailImageUrl = detailImagePreview.value // Temporary, gunakan preview sebagai simulasi
  }

  const projectToSubmit = {
    id: projects.value.length + 1, // Sederhananya, ID baru adalah panjang array + 1
    title: newProject.value.title,
    description: newProject.value.description,
    category: newProject.value.category,
    image: mainImageUrl,
    detailImage: detailImageUrl || mainImageUrl,
    tags,
    year: newProject.value.year,
    team,
    link: newProject.value.link || undefined,
    github: newProject.value.github || undefined,
    benefits,
  }

  console.log('Submitting project:', projectToSubmit)

  // Di implementasi nyata, kode di bawah ini akan ditempatkan dalam callback sukses dari API
  submissionSuccess.value = true
  resetForm()

  // Simulasi menambahkan ke array lokal (dalam produksi akan diambil dari API)
  // projects.value.push(projectToSubmit)
}

// Reset form
const resetForm = () => {
  newProject.value = {
    title: '',
    description: '',
    category: '',
    tagsInput: '',
    teamInput: '',
    year: '',
    image: '',
    detailImage: '',
    link: '',
    github: '',
    benefitsInput: '',
  }

  // Reset file dan preview
  mainImageFile.value = null
  detailImageFile.value = null
  mainImagePreview.value = ''
  detailImagePreview.value = ''

  // Reset upload method
  imageUploadMethod.value = {
    main: 'url',
    detail: 'url',
  }
}

// Show submit form
const showSubmitForm = () => {
  isSubmitFormOpen.value = true
}

// Close submit form
const closeSubmitForm = () => {
  isSubmitFormOpen.value = false
}

onMounted(() => {
  // Scroll ke posisi paling atas saat halaman dimuat
  window.scrollTo(0, 0)

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
  <div class="projects-container">
    <!-- Hero Section -->
    <section class="projects-hero">
      <div class="projects-hero-content">
        <h1>Proyek Unggulan</h1>
        <p>
          Karya inovasi dari mahasiswa Teknik Informatika UNESA yang menggabungkan kreativitas,
          teknologi, dan solusi praktis.
        </p>
      </div>
    </section>

    <div class="page-content">
      <!-- Filter dan Search -->
      <section class="filter-section">
        <div class="filter-container">
          <div class="category-filters">
            <button
              v-for="category in categories"
              :key="category"
              @click="filterByCategory(category)"
              :class="{ active: selectedCategory === category }"
              class="category-btn"
            >
              {{ category }}
            </button>
          </div>

          <div class="search-box">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Cari proyek..."
              class="search-input"
              @input="currentPage = 1"
            />
            <span class="search-icon">🔍</span>
          </div>
        </div>
      </section>

      <!-- Projects Grid -->
      <section class="projects-grid-section animate-on-scroll">
        <div class="section-header">
          <h2 class="section-title">Daftar Proyek</h2>
          <div class="section-line"></div>
        </div>

        <div class="projects-grid">
          <div
            v-for="project in paginatedProjects"
            :key="project.id"
            class="project-card"
            @click="showProjectDetails(project)"
          >
            <div class="project-image" :style="{ backgroundImage: `url('${project.image}')` }">
              <div class="project-overlay">
                <span class="project-category">{{ project.category }}</span>
              </div>
            </div>
            <div class="project-content">
              <h3>{{ project.title }}</h3>
              <p>
                {{ project.description.substring(0, 120)
                }}{{ project.description.length > 120 ? '...' : '' }}
              </p>
              <div class="project-tags">
                <span
                  v-for="(tag, index) in project.tags.slice(0, 3)"
                  :key="index"
                  class="project-tag"
                  >{{ tag }}</span
                >
                <span v-if="project.tags.length > 3" class="project-tag more"
                  >+{{ project.tags.length - 3 }}</span
                >
              </div>
              <button class="view-details-btn">Lihat Detail</button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredProjects.length === 0" class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>Tidak ada proyek yang ditemukan</h3>
          <p>Coba ubah filter atau kata kunci pencarian Anda</p>
          <button
            @click="
              () => {
                selectedCategory = 'All'
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

          <div class="projects-info-text" v-if="filteredProjects.length > 0">
            Menampilkan {{ (currentPage - 1) * itemsPerPage + 1 }}-{{
              Math.min(currentPage * itemsPerPage, filteredProjects.length)
            }}
            dari {{ filteredProjects.length }} proyek
          </div>
        </div>
      </section>

      <!-- Project Detail Modal -->
      <div v-if="isModalOpen" class="project-modal-overlay" @click="closeModal">
        <div class="project-modal" @click.stop>
          <button class="close-modal-btn" @click="closeModal">×</button>

          <div v-if="selectedProject" class="project-modal-content">
            <div
              class="project-modal-image"
              :style="{
                backgroundImage: `url('${selectedProject.detailImage || selectedProject.image}')`,
              }"
            >
              <div class="modal-category-badge">{{ selectedProject.category }}</div>
            </div>

            <div class="project-modal-info">
              <h2>{{ selectedProject.title }}</h2>

              <div class="project-modal-grid">
                <div class="project-modal-left">
                  <div class="project-year">
                    <div class="year-badge">{{ selectedProject.year }}</div>
                  </div>

                  <div class="project-info-box">
                    <h4>Tim Pengembang</h4>
                    <ul class="team-list">
                      <li v-for="(member, index) in selectedProject.team" :key="index">
                        {{ member }}
                      </li>
                    </ul>
                  </div>

                  <div class="project-info-box">
                    <h4>Teknologi</h4>
                    <div class="project-tags-detail">
                      <span
                        v-for="(tag, index) in selectedProject.tags"
                        :key="index"
                        class="project-tag"
                        >{{ tag }}</span
                      >
                    </div>
                  </div>

                  <div v-if="selectedProject.link || selectedProject.github" class="project-links">
                    <a
                      v-if="selectedProject.link"
                      :href="selectedProject.link"
                      target="_blank"
                      class="project-link-btn primary"
                      >Live Demo</a
                    >
                    <a
                      v-if="selectedProject.github"
                      :href="selectedProject.github"
                      target="_blank"
                      class="project-link-btn secondary"
                      >GitHub</a
                    >
                  </div>
                </div>

                <div class="project-modal-right">
                  <h3>Tentang Proyek</h3>
                  <p class="project-description">{{ selectedProject.description }}</p>

                  <div class="project-benefits">
                    <h3>Manfaat {{ selectedProject.category }}</h3>
                    <ul class="benefits-list">
                      <li v-for="(benefit, index) in selectedProject.benefits" :key="index">
                        <i class="check-icon">✓</i> {{ benefit }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Submit Proyek Banner -->
      <section class="submit-banner-section animate-on-scroll">
        <div class="submit-banner">
          <div class="submit-banner-content">
            <h2>Punya Proyek yang Ingin Ditampilkan?</h2>
            <p>
              Bagikan karya inovatif kamu untuk ditampilkan di galeri proyek HMP TI UNESA dan
              inspirasi mahasiswa lain
            </p>
            <button @click="showSubmitForm" class="banner-submit-btn">
              Kirim Proyek Sekarang
              <span class="btn-icon">→</span>
            </button>
          </div>
          <div class="submit-banner-image">
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
              alt="Submit Project"
            />
          </div>
        </div>
      </section>

      <!-- Submit Form Modal -->
      <div v-if="isSubmitFormOpen" class="submit-form-overlay" @click="closeSubmitForm">
        <div class="submit-form-modal" @click.stop>
          <button class="close-form-btn" @click="closeSubmitForm">×</button>

          <div class="submit-form-header">
            <h2>Kirim Proyek Kamu</h2>
            <p>
              Lengkapi formulir berikut untuk mengirimkan proyek kamu. Semua field bertanda * wajib
              diisi.
            </p>
          </div>

          <form class="submit-project-form" @submit.prevent="submitProject">
            <div class="form-grid">
              <div class="form-group">
                <label for="projectTitle">Judul Proyek <span class="required">*</span></label>
                <input
                  type="text"
                  id="projectTitle"
                  v-model="newProject.title"
                  required
                  placeholder="Masukkan judul proyek"
                />
              </div>

              <div class="form-group">
                <label for="projectCategory">Kategori <span class="required">*</span></label>
                <select id="projectCategory" v-model="newProject.category" required>
                  <option value="" disabled selected>Pilih kategori</option>
                  <option
                    v-for="category in categories.filter((cat) => cat !== 'All')"
                    :key="category"
                    :value="category"
                  >
                    {{ category }}
                  </option>
                </select>
              </div>

              <div class="form-group form-group-full">
                <label for="projectDescription">Deskripsi <span class="required">*</span></label>
                <textarea
                  id="projectDescription"
                  v-model="newProject.description"
                  required
                  placeholder="Jelaskan tentang proyek kamu"
                  rows="4"
                ></textarea>
              </div>

              <div class="form-group">
                <label for="projectYear">Tahun <span class="required">*</span></label>
                <select id="projectYear" v-model="newProject.year" required>
                  <option value="" disabled selected>Pilih tahun</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                </select>
              </div>

              <div class="form-group">
                <label for="projectTags">Tag Teknologi <span class="required">*</span></label>
                <input
                  type="text"
                  id="projectTags"
                  v-model="newProject.tagsInput"
                  required
                  placeholder="React, Node.js, MongoDB (pisahkan dengan koma)"
                />
              </div>

              <div class="form-group">
                <label for="projectTeam">Tim Pengembang <span class="required">*</span></label>
                <input
                  type="text"
                  id="projectTeam"
                  v-model="newProject.teamInput"
                  required
                  placeholder="Nama anggota (pisahkan dengan koma)"
                />
              </div>

              <div class="form-group">
                <label for="projectImage">Gambar Proyek <span class="required">*</span></label>
                <div class="input-toggle">
                  <div class="toggle-buttons">
                    <button
                      type="button"
                      :class="['toggle-btn', { active: imageUploadMethod.main === 'url' }]"
                      @click="imageUploadMethod.main = 'url'"
                    >
                      URL
                    </button>
                    <button
                      type="button"
                      :class="['toggle-btn', { active: imageUploadMethod.main === 'file' }]"
                      @click="imageUploadMethod.main = 'file'"
                    >
                      Upload
                    </button>
                  </div>

                  <div v-if="imageUploadMethod.main === 'url'" class="input-field">
                    <input
                      type="url"
                      id="projectImage"
                      v-model="newProject.image"
                      required
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div v-else class="input-field">
                    <label for="projectImageFile" class="file-input-label">
                      <span v-if="!mainImagePreview">Pilih File Gambar</span>
                      <span v-else class="file-selected"
                        >File dipilih: {{ mainImageFile?.name }}</span
                      >
                      <input
                        type="file"
                        id="projectImageFile"
                        accept="image/*"
                        @change="handleFileUpload($event, 'main')"
                        class="file-input"
                        required
                      />
                    </label>
                    <div v-if="mainImagePreview" class="image-preview">
                      <img :src="mainImagePreview" alt="Preview" />
                    </div>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label for="projectDetailImage">Gambar Detail</label>
                <div class="input-toggle">
                  <div class="toggle-buttons">
                    <button
                      type="button"
                      :class="['toggle-btn', { active: imageUploadMethod.detail === 'url' }]"
                      @click="imageUploadMethod.detail = 'url'"
                    >
                      URL
                    </button>
                    <button
                      type="button"
                      :class="['toggle-btn', { active: imageUploadMethod.detail === 'file' }]"
                      @click="imageUploadMethod.detail = 'file'"
                    >
                      Upload
                    </button>
                  </div>

                  <div v-if="imageUploadMethod.detail === 'url'" class="input-field">
                    <input
                      type="url"
                      id="projectDetailImage"
                      v-model="newProject.detailImage"
                      placeholder="https://example.com/detail-image.jpg"
                    />
                  </div>

                  <div v-else class="input-field">
                    <label for="projectDetailImageFile" class="file-input-label">
                      <span v-if="!detailImagePreview">Pilih File Gambar</span>
                      <span v-else class="file-selected"
                        >File dipilih: {{ detailImageFile?.name }}</span
                      >
                      <input
                        type="file"
                        id="projectDetailImageFile"
                        accept="image/*"
                        @change="handleFileUpload($event, 'detail')"
                        class="file-input"
                      />
                    </label>
                    <div v-if="detailImagePreview" class="image-preview">
                      <img :src="detailImagePreview" alt="Preview" />
                    </div>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label for="projectLink">Link Demo (Opsional)</label>
                <input
                  type="url"
                  id="projectLink"
                  v-model="newProject.link"
                  placeholder="https://yourdemo.com"
                />
              </div>

              <div class="form-group">
                <label for="projectGithub">Link GitHub (Opsional)</label>
                <input
                  type="url"
                  id="projectGithub"
                  v-model="newProject.github"
                  placeholder="https://github.com/yourusername/project"
                />
              </div>

              <div class="form-group form-group-full">
                <label for="projectBenefits">Manfaat Proyek <span class="required">*</span></label>
                <textarea
                  id="projectBenefits"
                  v-model="newProject.benefitsInput"
                  required
                  placeholder="Manfaat 1&#10;Manfaat 2&#10;Manfaat 3&#10;Manfaat 4"
                  rows="4"
                ></textarea>
                <small class="form-hint">Masukkan setiap manfaat pada baris baru</small>
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="submit-btn">Kirim Proyek</button>
              <button type="button" class="reset-form-btn" @click="resetForm">Reset Form</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="submissionSuccess" class="submission-success">
        <div class="success-icon">✓</div>
        <h3>Proyek Berhasil Dikirim!</h3>
        <p>
          Terima kasih telah mengirimkan proyek kamu. Tim kami akan mereview dan mempublikasikan
          proyek yang sudah disetujui.
        </p>
        <button @click="submissionSuccess = false" class="close-success-btn">Tutup</button>
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
.projects-hero {
  background: linear-gradient(135deg, #002e54, #004680, #001830);
  color: white;
  padding: 5rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.projects-hero::before {
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

.projects-hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
}

.projects-hero h1 {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;
}

.projects-hero h1::after {
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

.projects-hero p {
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

.category-filters {
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

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.project-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  cursor: pointer;
  position: relative;
  border: 1px solid #f0f0f0;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.project-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.1);
}

.project-image {
  height: 200px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.project-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.6));
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 1rem;
}

.project-category {
  background-color: #004680;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 2rem;
}

.project-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.project-content h3 {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: #1e293b;
  line-height: 1.4;
}

.project-content p {
  color: #64748b;
  line-height: 1.6;
  flex: 1;
  margin-bottom: 1.5rem;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.project-tag {
  background-color: #f1f5f9;
  color: #334155;
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-weight: 500;
}

.project-tag.more {
  background-color: #e2e8f0;
  color: #64748b;
}

.view-details-btn {
  display: inline-block;
  background-color: #004680;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-start;
  margin-top: auto;
}

.view-details-btn:hover {
  background-color: #00396a;
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 70, 128, 0.2);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 15px -5px rgba(0, 0, 0, 0.05);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: #1e293b;
}

.empty-state p {
  color: #64748b;
  margin-bottom: 2rem;
}

.reset-btn {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #64748b;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  background-color: #f1f5f9;
  color: #334155;
}

/* Modal Styles */
.project-modal-overlay {
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

.project-modal {
  background: white;
  border-radius: 1rem;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
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

.project-modal-image {
  height: 300px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.modal-category-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background-color: #004680;
  color: white;
  border-radius: 2rem;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
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
</style>
