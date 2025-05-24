import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import EventDetailView from '../views/EventDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/profil',
      name: 'profile',
      component: () => import('../views/OrganizationView.vue'),
    },
    {
      path: '/galeri',
      name: 'gallery',
      component: () => import('../views/GalleryView.vue'),
    },
    {
      path: '/kegiatan',
      name: 'events',
      component: () => import('../views/EventsView.vue'),
    },
    {
      path: '/kegiatan/:id',
      name: 'event-detail',
      component: EventDetailView,
    },
    {
      path: '/berita',
      name: 'news',
      component: () => import('../views/NewsView.vue'),
    },
    {
      path: '/berita/:id',
      name: 'news-detail',
      component: () => import('../views/NewsDetailView.vue'),
    },
    {
      path: '/fungsionaris',
      name: 'fungsionaris',
      component: () => import('../views/FungsionarisView.vue'),
    },
    {
      path: '/anggota',
      name: 'members',
      component: () => import('../views/MemberView.vue'),
    },
    {
      path: '/dosen',
      name: 'dosen',
      component: () => import('../views/DosenView.vue'),
    },
    {
      path: '/dosen/:id',
      name: 'dosen-detail',
      component: () => import('../views/DosenDetailView.vue'),
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import('../views/ProjectsView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    }
  ],
})

// Navigation guard untuk route yang memerlukan autentikasi
router.beforeEach((to, from, next) => {
  // Scroll to top pada setiap navigasi
  window.scrollTo(0, 0)
  next()
})

export default router
