import api from './api'

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password })
    // A resposta já vem como response.data do Axios
    // E a estrutura é: { success, message, data: { access_token, refresh_token, user } }
    return response.data
  },

  async refreshToken(refreshToken) {
    const response = await api.post('/auth/refresh', { refresh_token: refreshToken })
    // A resposta pode ter a mesma estrutura: { success, message, data: { access_token } }
    const responseData = response.data
    if (responseData.success && responseData.data) {
      return responseData.data
    }
    return responseData
  }
}

