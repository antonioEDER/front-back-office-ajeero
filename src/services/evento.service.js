import api from './api'
import { extractApiData } from 'src/utils/apiHelpers'

export const eventoService = {
  async getEventos(params) {
    const response = await api.get('/admin/eventos', { params })
    return extractApiData(response.data)
  },

  async getEventoById(id) {
    const response = await api.get(`/admin/eventos/${id}`)
    return extractApiData(response.data)
  },

  async createEvento(data) {
    const response = await api.post('/admin/eventos', data)
    return extractApiData(response.data)
  },

  async updateEvento(id, data) {
    const response = await api.put(`/admin/eventos/${id}`, data)
    return extractApiData(response.data)
  },

  async deleteEvento(id) {
    const response = await api.delete(`/admin/eventos/${id}`)
    return extractApiData(response.data)
  },

  async getInscritos(eventoId, params) {
    const response = await api.get(`/admin/eventos/${eventoId}/inscritos`, { params })
    return extractApiData(response.data)
  }
}

