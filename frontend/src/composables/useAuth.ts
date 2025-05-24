import { ref } from 'vue'

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export function useAuth() {
  const user = ref<UserData | null>(null)
  const isAuthenticated = ref(false)
  const token = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Cek apakah user sudah login
  const checkAuth = () => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      token.value = storedToken
      isAuthenticated.value = true
      // Dalam kondisi development, kita simulasikan data user
      if (process.env.NODE_ENV === 'development') {
        user.value = {
          id: 1,
          name: 'Admin Himpunan',
          email: 'admin@example.com',
          role: 'admin',
          avatar: 'https://via.placeholder.com/150'
        }
      } else {
        // Di production, load user data dari API berdasarkan token
        loadUserData()
      }
      return true
    }
    return false
  }

  // Login function
  const login = async (email: string, password: string) => {
    loading.value = true
    error.value = null
    
    try {
      // Di development mode, simulasi login
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 800)) // Simulate API delay
        
        // Hardcoded credentials untuk development
        if (email === 'admin@example.com' && password === 'admin123') {
          const dummyToken = 'dummy-jwt-token-' + Date.now()
          localStorage.setItem('token', dummyToken)
          token.value = dummyToken
          isAuthenticated.value = true
          user.value = {
            id: 1,
            name: 'Admin Himpunan',
            email: 'admin@example.com',
            role: 'admin',
            avatar: 'https://via.placeholder.com/150'
          }
          return true
        } else {
          error.value = 'Email atau password salah'
          return false
        }
      }
      
      // Di production, panggil API login
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        error.value = data.message || 'Login gagal'
        return false
      }
      
      localStorage.setItem('token', data.token)
      token.value = data.token
      isAuthenticated.value = true
      user.value = data.user
      return true
    } catch (err) {
      console.error('Login error:', err)
      error.value = 'Terjadi kesalahan saat login'
      return false
    } finally {
      loading.value = false
    }
  }

  // Load user data from API (for production)
  const loadUserData = async () => {
    if (!token.value) return
    
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token.value}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        user.value = data.user
      } else {
        // Token invalid, logout
        logout()
      }
    } catch (err) {
      console.error('Error loading user data:', err)
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem('token')
    token.value = null
    user.value = null
    isAuthenticated.value = false
  }

  // Check auth when composable is first used
  checkAuth()

  return {
    user,
    isAuthenticated,
    token,
    loading,
    error,
    login,
    logout,
    checkAuth
  }
} 