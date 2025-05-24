<template>
  <main class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <img src="../assets/logo.svg" alt="Logo HMP TI" class="auth-logo" />
        <h1>Daftar Akun HMP TI</h1>
        <p>Buat akun untuk bergabung dengan komunitas HMP TI UNESA</p>
      </div>

      <form class="auth-form" @submit.prevent="handleRegister">
        <div class="form-row">
          <div class="form-group">
            <label for="nama">Nama Lengkap</label>
            <div class="input-wrapper">
              <i class="fas fa-user"></i>
              <input
                type="text"
                id="nama"
                v-model="nama"
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label for="nim">NIM</label>
            <div class="input-wrapper">
              <i class="fas fa-id-card"></i>
              <input type="text" id="nim" v-model="nim" placeholder="Masukkan NIM" required />
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <div class="input-wrapper">
            <i class="fas fa-envelope"></i>
            <input
              type="email"
              id="email"
              v-model="email"
              placeholder="Masukkan email Anda"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label for="jurusan">Program Studi</label>
          <div class="input-wrapper">
            <i class="fas fa-graduation-cap"></i>
            <input
              type="text"
              id="jurusan"
              value="Teknik Informatika"
              disabled
              class="disabled-input"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="angkatan">Angkatan</label>
          <div class="input-wrapper">
            <i class="fas fa-calendar-alt"></i>
            <select id="angkatan" v-model="angkatan" required>
              <option value="" disabled selected>Pilih Tahun Angkatan</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
              <option value="2019">2019</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <div class="input-wrapper">
            <i class="fas fa-lock"></i>
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="password"
              placeholder="Masukkan password"
              required
            />
            <button type="button" class="password-toggle" @click="showPassword = !showPassword">
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
          <div class="password-strength" v-if="password">
            <div class="strength-bar">
              <div :class="['strength-indicator', passwordStrengthClass]"></div>
            </div>
            <span class="strength-text">{{ passwordStrengthText }}</span>
          </div>
        </div>

        <div class="form-group">
          <label for="confirmPassword">Konfirmasi Password</label>
          <div class="input-wrapper">
            <i class="fas fa-lock"></i>
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              id="confirmPassword"
              v-model="confirmPassword"
              placeholder="Masukkan kembali password Anda"
              required
            />
            <button
              type="button"
              class="password-toggle"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
          <span class="password-match" v-if="password && confirmPassword">
            {{ passwordsMatch ? '✓ Password cocok' : '✗ Password tidak cocok' }}
          </span>
        </div>

        <div class="form-check">
          <input type="checkbox" id="terms" v-model="termsAccepted" required />
          <label for="terms"
            >Saya menyetujui <a href="#" class="terms-link">Syarat dan Ketentuan</a> HMP TI
            UNESA</label
          >
        </div>

        <button type="submit" class="auth-button" :disabled="!formIsValid">
          <i class="fas fa-user-plus"></i> Daftar
        </button>

        <div class="auth-divider">
          <span>Atau</span>
        </div>

        <router-link to="/login" class="auth-link"> Sudah punya akun? Login sekarang </router-link>
      </form>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const nama = ref('')
const nim = ref('')
const email = ref('')
const jurusan = ref('Teknik Informatika')
const angkatan = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const termsAccepted = ref(false)

// Validasi kekuatan password
const passwordStrength = computed(() => {
  if (!password.value) return 0

  let strength = 0
  // Minimal 8 karakter
  if (password.value.length >= 8) strength += 1
  // Memiliki huruf kecil dan huruf besar
  if (/[a-z]/.test(password.value) && /[A-Z]/.test(password.value)) strength += 1
  // Memiliki angka
  if (/[0-9]/.test(password.value)) strength += 1
  // Memiliki karakter spesial
  if (/[^a-zA-Z0-9]/.test(password.value)) strength += 1

  return strength
})

const passwordStrengthClass = computed(() => {
  const strength = passwordStrength.value
  if (strength <= 1) return 'weak'
  if (strength === 2) return 'medium'
  if (strength === 3) return 'good'
  return 'strong'
})

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value
  if (strength <= 1) return 'Lemah'
  if (strength === 2) return 'Sedang'
  if (strength === 3) return 'Baik'
  return 'Kuat'
})

const passwordsMatch = computed(() => {
  return password.value && confirmPassword.value && password.value === confirmPassword.value
})

const formIsValid = computed(() => {
  return (
    nama.value &&
    nim.value &&
    email.value &&
    jurusan.value &&
    angkatan.value &&
    password.value &&
    confirmPassword.value &&
    passwordsMatch.value &&
    termsAccepted.value
  )
})

const handleRegister = () => {
  // Implementasi pendaftaran akan dilakukan nanti
  console.log('Register dengan:', {
    nama: nama.value,
    nim: nim.value,
    email: email.value,
    jurusan: jurusan.value,
    angkatan: angkatan.value,
    password: password.value,
  })
}
</script>

<style scoped>
.auth-container {
  width: 100%;
  max-width: 1200px;
  margin: 3rem auto;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.auth-card {
  background-color: white;
  border-radius: 1.5rem;
  box-shadow: 0 10px 25px var(--shadow-color);
  padding: 3rem;
  width: 100%;
  max-width: 600px;
}

.auth-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.auth-logo {
  height: 80px;
  margin-bottom: 1.5rem;
}

.auth-header h1 {
  color: var(--primary-color);
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.auth-header p {
  color: var(--text-light);
  font-size: 1rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: var(--text-color);
  font-size: 0.95rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper i {
  position: absolute;
  left: 1rem;
  color: var(--text-light);
}

.input-wrapper input,
.input-wrapper select {
  flex-grow: 1;
  padding: 0.875rem 1rem 0.875rem 2.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;
  background-color: white;
}

.input-wrapper select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1rem;
}

.input-wrapper input:focus,
.input-wrapper select:focus {
  border-color: var(--primary-color);
}

.password-toggle {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: var(--text-light);
  cursor: pointer;
}

.password-toggle:hover {
  color: var(--primary-color);
}

.password-strength {
  margin-top: 0.5rem;
  font-size: 0.75rem;
}

.strength-bar {
  height: 4px;
  background-color: #e5e7eb;
  border-radius: 2px;
  margin-bottom: 0.25rem;
}

.strength-indicator {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s;
}

.strength-indicator.weak {
  width: 25%;
  background-color: #ef4444;
}

.strength-indicator.medium {
  width: 50%;
  background-color: #f59e0b;
}

.strength-indicator.good {
  width: 75%;
  background-color: #10b981;
}

.strength-indicator.strong {
  width: 100%;
  background-color: #22c55e;
}

.strength-text {
  color: var(--text-light);
}

.password-match {
  font-size: 0.75rem;
  color: var(--text-light);
}

.form-check {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
}

.form-check input {
  accent-color: var(--primary-color);
  width: 16px;
  height: 16px;
}

.terms-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

.terms-link:hover {
  text-decoration: underline;
}

.auth-button {
  padding: 0.875rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.auth-button:hover:not(:disabled) {
  background-color: var(--primary-hover);
}

.auth-button:disabled {
  background-color: #cbd5e1;
  cursor: not-allowed;
}

.auth-divider {
  position: relative;
  text-align: center;
  margin: 0.5rem 0;
}

.auth-divider::before,
.auth-divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: calc(50% - 30px);
  height: 1px;
  background-color: var(--border-color);
}

.auth-divider::before {
  left: 0;
}

.auth-divider::after {
  right: 0;
}

.auth-divider span {
  display: inline-block;
  padding: 0 10px;
  color: var(--text-light);
  font-size: 0.875rem;
  background-color: white;
  position: relative;
  z-index: 1;
}

.auth-link {
  display: block;
  text-align: center;
  color: var(--primary-color);
  font-weight: 500;
  text-decoration: none;
  transition: color 0.3s;
}

.auth-link:hover {
  text-decoration: underline;
}

.disabled-input {
  background-color: #f9fafb !important;
  color: var(--text-light);
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .auth-container {
    padding: 1.5rem 1rem;
  }

  .auth-card {
    padding: 2rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
