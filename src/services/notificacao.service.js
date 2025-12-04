import api from './api'
import { extractApiData } from 'src/utils/apiHelpers'

export const notificacaoService = {
  async getNotificacoes(params) {
    const response = await api.get('/admin/notificacoes', { params })
    return extractApiData(response.data)
  },

  async createNotificacao(data) {
    const response = await api.post('/admin/notificacoes', data)
    return extractApiData(response.data)
  }
}

