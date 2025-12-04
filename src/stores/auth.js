import { defineStore } from 'pinia'
import { STORAGE_KEYS, USER_ROLES } from 'src/utils/constants'
import { authService } from 'src/services/auth.service'
import { Notify } from 'quasar'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false
  }),

  getters: {
    userInfo: (state) => state.user,
    isAdmin: (state) => state.user?.role === USER_ROLES.ADMIN
  },

  actions: {
    async login(email, password) {
      try {
        const response = await authService.login(email, password)
        const { access_token, refresh_token, user } = response

        this.token = access_token
        this.refreshToken = refresh_token
        this.user = user
        this.isAuthenticated = true

        // Salva no localStorage
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token)
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh_token)
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))

        return { success: true }
      } catch (error) {
        const message = error.response?.data?.message || 'Erro ao fazer login'
        Notify.create({
          type: 'negative',
          message,
          position: 'top'
        })
        return { success: false, error: message }
      }
    },

    async refreshToken() {
      try {
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
        if (!refreshToken) {
          this.logout()
          return
        }

        const response = await authService.refreshToken(refreshToken)
        const { access_token } = response

        this.token = access_token
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token)

        return { success: true }
      } catch (error) {
        this.logout()
        return { success: false }
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.refreshToken = null
      this.isAuthenticated = false

      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)
    },

    checkAuth() {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
      const userStr = localStorage.getItem(STORAGE_KEYS.USER)

      if (token && userStr) {
        this.token = token
        this.user = JSON.parse(userStr)
        this.isAuthenticated = true
        return true
      }

      return false
    }
  }
})

