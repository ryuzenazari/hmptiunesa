<template>
  <main class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <img src="../assets/logo.svg" alt="Logo HMP TI" class="auth-logo" />
        <h1>Login HMP TI UNESA</h1>
        <p>Masuk ke akun Anda untuk mengakses fitur anggota</p>
      </div>

      <form class="auth-form" @submit.prevent="handleLogin">
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
          <label for="password">Password</label>
          <div class="input-wrapper">
            <i class="fas fa-lock"></i>
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="password"
              placeholder="Masukkan password Anda"
              required
            />
            <button type="button" class="password-toggle" @click="showPassword = !showPassword">
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
        </div>

        <div class="form-options">
          <div class="remember-me">
            <input type="checkbox" id="remember" v-model="remember" />
            <label for="remember">Ingat saya</label>
          </div>
          <router-link to="/lupa-password" class="forgot-password">Lupa password?</router-link>
        </div>

        <button type="submit" class="auth-button"><i class="fas fa-sign-in-alt"></i> Masuk</button>

        <div class="auth-divider">
          <span>Atau</span>
        </div>

        <router-link to="/register" class="auth-link">
          Belum punya akun? Daftar sekarang
        </router-link>
      </form>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const remember = ref(false)
const showPassword = ref(false)

const handleLogin = () => {
  // Implementasi login akan dilakukan nanti
  console.log('Login dengan:', {
    email: email.value,
    password: password.value,
    remember: remember.value,
  })
}
</script>

<style scoped>
.auth-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
}

.auth-card {
  background-color: white;
  border-radius: 1.5rem;
  box-shadow: 0 10px 25px var(--shadow-color);
  padding: 3rem;
  width: 100%;
  max-width: 500px;
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

.input-wrapper input {
  flex-grow: 1;
  padding: 0.875rem 1rem 0.875rem 2.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;
}

.input-wrapper input:focus {
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

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.remember-me input {
  accent-color: var(--primary-color);
}

.forgot-password {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.forgot-password:hover {
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

.auth-button:hover {
  background-color: var(--primary-hover);
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

@media (max-width: 768px) {
  .auth-container {
    padding: 2rem 1rem;
  }

  .auth-card {
    padding: 2rem;
  }
}
</style>
