<template>
  <div class="login-container">
    <div class="login-form">
      <div class="logo-container">
        <img class="logo" src="@/assets/logo.svg" alt="Logo HMPTI" width="80" height="80" />
        <h2 class="organization-name">HMP TI UNESA</h2>
      </div>
      <h1>Login Admin</h1>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Username</label>
          <input type="text" id="username" v-model="username" required>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" required>
        </div>
        <button type="submit" class="login-btn">Masuk</button>
      </form>
      <div class="tagline">Berdaya, Berkarya, dan Bermanfaat</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')

const handleLogin = () => {
  // Implementasi logika login di sini
  console.log('Login dengan:', username.value, password.value)
  
  // Contoh sederhana (ganti dengan logika autentikasi yang sesungguhnya)
  if (username.value && password.value) {
    // Simpan token atau status login
    localStorage.setItem('isLoggedIn', 'true')
    
    // Redirect ke halaman utama atau halaman sebelumnya
    router.push('/')
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background-color: var(--vt-c-white-soft);
}

.login-form {
  background-color: white;
  padding: 2.5rem;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  width: 100%;
  max-width: 450px;
  text-align: center;
}

.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
}

.organization-name {
  margin-top: 0.75rem;
  color: #00A0E3;
  font-weight: 600;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--vt-c-indigo);
  font-weight: 600;
}

.form-group {
  margin-bottom: 1.25rem;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--vt-c-indigo);
}

input {
  width: 100%;
  padding: 0.875rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

input:focus {
  outline: none;
  border-color: #00A0E3;
  box-shadow: 0 0 0 2px rgba(0, 160, 227, 0.1);
}

.login-btn {
  width: 100%;
  padding: 0.875rem;
  margin-top: 1.5rem;
  background-color: #00A0E3;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-btn:hover {
  background-color: #0088c7;
}

.tagline {
  margin-top: 1.5rem;
  font-style: italic;
  color: #777;
  font-size: 0.9rem;
}
</style> 