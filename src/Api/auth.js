import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Flag to prevent multiple refresh attempts
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  
  failedQueue = []
}

// Login API
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', {
      email,
      password,
    })
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

// Store user session in localStorage
export const setSession = (sessionData, loginType = 'all') => {
  if (sessionData?.session?.access_token) {
    localStorage.setItem('access_token', sessionData.session.access_token)
    localStorage.setItem('refresh_token', sessionData.session.refresh_token)
    localStorage.setItem('user', JSON.stringify(sessionData.user))
    localStorage.setItem('session', JSON.stringify(sessionData.session))
    localStorage.setItem('loginType', loginType)
  }
}

// Get login type from localStorage
export const getLoginType = () => {
  return localStorage.getItem('loginType') || 'all'
}

// Get user from localStorage
export const getUser = () => {
  const userStr = localStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : null
}

// Get access token from localStorage
export const getAccessToken = () => {
  return localStorage.getItem('access_token')
}

// Get refresh token from localStorage
export const getRefreshToken = () => {
  return localStorage.getItem('refresh_token')
}

// Refresh access token using refresh token
export const refreshAccessToken = async () => {
  try {
    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await api.post('/auth/refresh', {
      refresh_token: refreshToken,
    })

    if (response.data?.success && response.data?.session?.access_token) {
      // Update tokens in localStorage
      localStorage.setItem('access_token', response.data.session.access_token)
      if (response.data.session.refresh_token) {
        localStorage.setItem('refresh_token', response.data.session.refresh_token)
      }
      return response.data.session.access_token
    }

    throw new Error('Failed to refresh token')
  } catch (error) {
    // If refresh fails, clear session and redirect to login
    clearSession()
    // Redirect to login page
    if (window.location.pathname !== '/login' && window.location.pathname !== '/student-login') {
      window.location.href = '/login'
    }
    throw error.response?.data || error.message
  }
}

// Logout API
export const logout = async () => {
  try {
    const token = getAccessToken()
    if (!token) {
      // If no token, just clear local session
      clearSession()
      return { success: true, message: 'Logged out successfully' }
    }

    const response = await api.post(
      '/auth/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return response.data
  } catch (error) {
    // Even if API call fails, clear local session
    clearSession()
    throw error.response?.data || error.message
  }
}

// Save login credentials
export const saveCredentials = (email, password) => {
  const savedCredentials = getSavedCredentials()
  // Check if email already exists
  const existingIndex = savedCredentials.findIndex(cred => cred.email === email)
  
  if (existingIndex >= 0) {
    // Update existing credentials
    savedCredentials[existingIndex] = { email, password }
  } else {
    // Add new credentials
    savedCredentials.push({ email, password })
  }
  
  localStorage.setItem('savedCredentials', JSON.stringify(savedCredentials))
}

// Get saved credentials
export const getSavedCredentials = () => {
  const savedStr = localStorage.getItem('savedCredentials')
  return savedStr ? JSON.parse(savedStr) : []
}

// Remove saved credentials
export const removeSavedCredentials = (email) => {
  const savedCredentials = getSavedCredentials()
  const filtered = savedCredentials.filter(cred => cred.email !== email)
  localStorage.setItem('savedCredentials', JSON.stringify(filtered))
}

// Clear session
export const clearSession = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user')
  localStorage.removeItem('session')
  localStorage.removeItem('loginType')
}

// Request interceptor to add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh on 401 errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch(err => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const newToken = await refreshAccessToken()
        processQueue(null, newToken)
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api

