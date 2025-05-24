<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref, onMounted } from 'vue'

const isMenuOpen = ref(false)

// Fungsi untuk toggle menu mobile
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  // Jika menu terbuka, nonaktifkan scroll
  document.body.style.overflow = isMenuOpen.value ? 'hidden' : ''
}

// Fungsi untuk menutup menu saat klik link
const closeMenu = () => {
  isMenuOpen.value = false
  document.body.style.overflow = ''
}
</script>

<template>
  <div class="app-container">
    <!-- Navbar -->
    <header class="navbar">
      <a href="/" class="navbar-logo" style="text-decoration: none">
        <img alt="Logo HIMTI" class="logo" src="@/assets/logo.svg" width="40" height="40" />
        <div class="logo-text">HMP TI UNESA</div>
      </a>

      <!-- Desktop Navigation -->
      <nav class="navbar-links desktop-menu">
        <RouterLink to="/">Beranda</RouterLink>
        <RouterLink to="/profil">Profil</RouterLink>
        <RouterLink to="/fungsionaris">Fungsionaris</RouterLink>
        <RouterLink to="/anggota">Anggota</RouterLink>
        <RouterLink to="/dosen">Dosen</RouterLink>
        <RouterLink to="/kegiatan">Kegiatan</RouterLink>
        <RouterLink to="/projects">Proyek</RouterLink>
        <RouterLink to="/galeri">Galeri</RouterLink>
        <RouterLink to="/berita">Berita</RouterLink>
      </nav>

      <div class="navbar-right">
        <!-- Hamburger Menu Button -->
        <button
          class="hamburger-btn"
          @click="toggleMenu"
          :class="{ 'is-active': isMenuOpen }"
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <!-- Mobile Navigation Menu -->
      <div class="mobile-menu" :class="{ 'is-open': isMenuOpen }">
        <nav class="mobile-nav">
          <RouterLink @click="closeMenu" to="/">Beranda</RouterLink>
          <RouterLink @click="closeMenu" to="/profil">Profil</RouterLink>
          <RouterLink @click="closeMenu" to="/fungsionaris">Fungsionaris</RouterLink>
          <RouterLink @click="closeMenu" to="/anggota">Anggota</RouterLink>
          <RouterLink @click="closeMenu" to="/dosen">Dosen</RouterLink>
          <RouterLink @click="closeMenu" to="/kegiatan">Kegiatan</RouterLink>
          <RouterLink @click="closeMenu" to="/projects">Proyek</RouterLink>
          <RouterLink @click="closeMenu" to="/galeri">Galeri</RouterLink>
          <RouterLink @click="closeMenu" to="/berita">Berita</RouterLink>
        </nav>
      </div>
    </header>

    <main>
      <RouterView />
    </main>

    <footer class="full-width-footer">
      <div class="footer-container">
        <div class="footer-main">
          <div class="footer-brand">
            <div class="footer-logo">
              <img alt="Logo HIMTI" src="@/assets/logo.svg" width="50" height="50" />
              <h3>Himpunan Mahasiswa<br />Prodi Teknik Informatika<br />UNESA</h3>
            </div>
            <p class="footer-tagline">Berdaya, Berkarya, dan Bermanfaat</p>
          </div>

          <div class="footer-links">
            <div class="footer-section">
              <h4>Navigasi</h4>
              <div class="footer-nav">
                <RouterLink to="/">Beranda</RouterLink>
                <RouterLink to="/profil">Profil</RouterLink>
                <RouterLink to="/kegiatan">Kegiatan</RouterLink>
                <RouterLink to="/projects">Proyek</RouterLink>
                <RouterLink to="/galeri">Galeri</RouterLink>
                <RouterLink to="/berita">Berita</RouterLink>
              </div>
            </div>

            <div class="footer-section">
              <h4>Organisasi</h4>
              <div class="footer-nav">
                <RouterLink to="/fungsionaris">Fungsionaris</RouterLink>
                <RouterLink to="/anggota">Anggota</RouterLink>
                <RouterLink to="/dosen">Dosen</RouterLink>
              </div>
            </div>

            <div class="footer-section">
              <h4>Kontak Kami</h4>
              <address class="contact-info">
                <div class="contact-item">
                  <i class="contact-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#00A0E3"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </i>
                  <span>Gedung A10 Jurusan Teknik Informatika<br />Kampus Ketintang, Surabaya</span>
                </div>
                <div class="contact-item">
                  <i class="contact-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#00A0E3"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path
                        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                      ></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </i>
                  <a href="mailto:himati.unesa@gmail.com">himati.unesa@gmail.com</a>
                </div>
                <div class="contact-item">
                  <i class="contact-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#00A0E3"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path
                        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                      ></path>
                    </svg>
                  </i>
                  <a href="tel:+6281585616615">+62 815-8561-6615</a>
                </div>
              </address>
            </div>
          </div>
        </div>

        <div class="footer-social">
          <h4>Ikuti Kami</h4>
          <div class="social-icons">
            <a href="https://instagram.com/hmpti.unesa" target="_blank" aria-label="Instagram">
              <div class="social-icon instagram">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </div>
            </a>
            <a href="https://twitter.com/himtiunesa" target="_blank" aria-label="Twitter">
              <div class="social-icon twitter">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"
                  ></path>
                </svg>
              </div>
            </a>
            <a href="https://youtube.com/himtiunesa" target="_blank" aria-label="YouTube">
              <div class="social-icon youtube">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"
                  ></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
              </div>
            </a>
            <a href="#" target="_blank" aria-label="LinkedIn">
              <div class="social-icon linkedin">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
                  ></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </div>
            </a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="copyright">
          <p>&copy; 2025 Himpunan Mahasiswa Prodi Teknik Informatika UNESA.</p>
          <p>All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
/* Override CSS global */
#app {
  max-width: 100% !important;
  padding: 0 !important;
  margin: 0 !important;
  background-color: var(--background-light) !important;
}

body {
  display: block !important;
  min-height: 100vh !important;
  margin: 0 !important;
  background-color: var(--background-light) !important;
  color: var(--text-color) !important;
}

:root {
  --primary-color: #0064ac;
  --primary-hover: #0056a1;
  --secondary-color: #00a0e3;
  --accent-color: #ff4500;
  --text-color: #333333;
  --text-light: #666666;
  --background-light: #f5f7fa;
  --background-dark: #0f172a;
  --white: #ffffff;
  --border-color: #eeeeee;
  --shadow-color: rgba(0, 0, 0, 0.1);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

a {
  text-decoration: none;
  color: inherit;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

/* Navbar Styling */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  background-color: var(--white);
  border-bottom: 1px solid var(--border-color);
  box-shadow: 0 2px 4px var(--shadow-color);
  z-index: 1000;
  width: 100%;
}

.navbar-logo {
  display: flex;
  align-items: center;
}

.logo {
  margin-right: 0.75rem;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary-color);
}

.navbar-links {
  display: flex;
}

.navbar-links a {
  margin: 0 0.75rem;
  padding: 0.5rem 0;
  font-weight: 500;
  color: var(--text-color);
  position: relative;
}

.navbar-links a.router-link-active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 2px;
  background-color: var(--primary-color);
}

.navbar-right {
  display: flex;
  align-items: center;
}

/* Hamburger Button */
.hamburger-btn {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 24px;
  height: 18px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1001;
}

.hamburger-btn span {
  width: 100%;
  height: 2px;
  background-color: var(--text-color);
  transition: all 0.3s ease;
  transform-origin: center;
}

.hamburger-btn.is-active span:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}

.hamburger-btn.is-active span:nth-child(2) {
  opacity: 0;
}

.hamburger-btn.is-active span:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}

/* Mobile Menu */
.mobile-menu {
  display: none;
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--white);
  z-index: 999;
  transform: translateX(100%);
  transition: transform 0.3s ease;
  overflow-y: auto;
}

.mobile-menu.is-open {
  transform: translateX(0);
}

.mobile-nav {
  display: flex;
  flex-direction: column;
  padding: 2rem;
}

.mobile-nav a {
  font-size: 1.1rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border-color);
  font-weight: 500;
}

.mobile-nav a:last-child {
  border-bottom: none;
}

.mobile-nav a.router-link-active {
  color: var(--primary-color);
}

/* Main Content */
main {
  padding-top: 70px;
  flex: 1;
  width: 100%;
}

/* Footer Styling */
.full-width-footer {
  position: relative;
  background-color: var(--background-dark);
  color: var(--white);
  padding: 4rem 0 0;
  width: 100vw;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  margin-top: 3rem;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.footer-main {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 3rem;
  margin-bottom: 3rem;
}

.footer-brand {
  display: flex;
  flex-direction: column;
}

.footer-logo {
  display: flex;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.footer-logo img {
  margin-right: 1rem;
}

.footer-logo h3 {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.5;
}

.footer-tagline {
  font-size: 1.1rem;
  font-style: italic;
  color: var(--secondary-color);
  margin-top: 0.5rem;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.footer-section h4 {
  color: var(--secondary-color);
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  position: relative;
  padding-bottom: 0.75rem;
}

.footer-section h4::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 2px;
  background-color: var(--secondary-color);
}

.footer-nav {
  display: flex;
  flex-direction: column;
}

.footer-nav a {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
  margin-bottom: 0.75rem;
  transition: all 0.2s ease;
  position: relative;
  padding-left: 0;
}

.footer-nav a:hover {
  color: var(--secondary-color);
  padding-left: 5px;
}

.contact-info {
  font-style: normal;
  margin-top: 0.5rem;
}

.contact-item {
  display: flex;
  margin-bottom: 1.2rem;
  align-items: center;
}

.contact-icon {
  margin-right: 0.75rem;
  font-style: normal;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer .contact-item a,
.footer .contact-item span,
.full-width-footer .contact-item a,
.full-width-footer .contact-item span {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
  line-height: 1.5;
}

.footer .contact-item a:hover,
.full-width-footer .contact-item a:hover {
  color: #00a0e3;
}

.footer-social {
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.footer-social h4 {
  color: var(--secondary-color);
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.9);
}

.social-icon:hover {
  transform: translateY(-5px);
  background-color: var(--secondary-color);
}

.footer-bottom {
  background-color: rgba(0, 0, 0, 0.2);
  padding: 1.5rem 0;
  text-align: center;
  margin-top: 2rem;
}

.copyright {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.5;
}

/* Responsive Footer */
@media (max-width: 992px) {
  .footer-main {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .footer-brand {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .footer-logo {
    justify-content: center;
    text-align: center;
    align-items: center !important;
    flex-direction: column !important;
    width: 100%;
  }

  .footer-logo img {
    margin-right: 0 !important;
    margin-bottom: 1rem !important;
  }

  .footer-logo h3 {
    text-align: center !important;
    width: 100%;
  }

  .footer-tagline {
    text-align: center;
    width: 100%;
  }
}

@media (max-width: 768px) {
  .full-width-footer {
    padding: 3rem 0 0;
  }

  .footer-links {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .footer-section {
    text-align: center;
  }

  .footer-section h4::after {
    left: 50%;
    transform: translateX(-50%);
  }

  .footer-nav a:hover {
    padding-left: 0;
  }

  .contact-item {
    justify-content: center;
  }

  .footer-container {
    padding: 0 1.5rem;
  }

  .footer-nav a {
    text-align: center;
  }

  .contact-info {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .footer-logo {
    flex-direction: column;
    align-items: center;
    width: 100%;
    text-align: center;
  }

  .footer-logo img {
    margin-right: 0;
    margin-bottom: 1rem;
  }

  .footer-logo h3 {
    text-align: center;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .footer-logo {
    flex-direction: column;
    align-items: center;
    width: 100%;
    text-align: center;
  }

  .footer-logo img {
    margin-right: 0;
    margin-bottom: 1rem;
  }

  .footer-logo h3 {
    text-align: center;
    font-size: 0.9rem;
    width: 100%;
  }

  .footer-tagline {
    text-align: center;
    width: 100%;
    font-size: 0.95rem;
  }

  .footer-section h4 {
    font-size: 1rem;
  }

  .footer-nav a {
    font-size: 0.9rem;
    margin-bottom: 0.6rem;
  }

  .contact-item {
    margin-bottom: 1rem;
  }

  .social-icons {
    flex-wrap: wrap;
    justify-content: center;
  }

  .social-icon {
    width: 36px;
    height: 36px;
  }

  .footer-bottom {
    padding: 1rem 0;
  }

  .copyright {
    font-size: 0.8rem;
  }

  .footer-container {
    padding: 0 1rem;
  }
}

/* Minimal screen size for very small devices */
@media (max-width: 360px) {
  .footer-logo h3 {
    font-size: 0.85rem;
  }

  .footer-tagline {
    font-size: 0.9rem;
  }

  .social-icons {
    gap: 1rem;
  }

  .social-icon {
    width: 32px;
    height: 32px;
  }

  .contact-icon svg {
    width: 16px;
    height: 16px;
  }
}

/* Responsive Styles */
@media (max-width: 888px) {
  .navbar {
    padding: 0 1rem;
  }

  .desktop-menu {
    display: none;
  }

  .hamburger-btn {
    display: flex;
  }

  .mobile-menu {
    display: block;
  }

  .footer-container {
    padding: 0 1.5rem;
  }

  .footer-content {
    flex-direction: column;
  }

  .footer-section {
    margin-right: 0;
    margin-bottom: 2rem;
  }

  .social-links {
    flex-direction: column;
  }

  .social-links a {
    margin-right: 0;
    margin-bottom: 0.75rem;
  }

  .copyright {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .navbar {
    height: 60px;
  }

  .logo {
    width: 32px;
    height: 32px;
  }

  .logo-text {
    font-size: 1rem;
  }

  main {
    padding-top: 60px;
  }

  .mobile-menu {
    top: 60px;
  }

  .footer-top {
    margin-bottom: 1.5rem;
  }

  .footer-section h4 {
    margin-bottom: 1rem;
  }
}
</style>
