import api from './api'

export const notificacaoService = {
  async getNotificacoes(params) {
    const response = await api.get('/admin/notificacoes', { params })
    return response.data
  },

  async createNotificacao(data) {
    const response = await api.post('/admin/notificacoes', data)
    return response.data
  }
}

