import api from './api'

export const eventoService = {
  async getEventos(params) {
    const response = await api.get('/eventos', { params })
    return response.data
  },

  async getEventoById(id) {
    const response = await api.get(`/eventos/${id}`)
    return response.data
  },

  async createEvento(data) {
    const response = await api.post('/admin/eventos', data)
    return response.data
  },

  async updateEvento(id, data) {
    const response = await api.put(`/admin/eventos/${id}`, data)
    return response.data
  },

  async deleteEvento(id) {
    const response = await api.delete(`/admin/eventos/${id}`)
    return response.data
  },

  async getInscritos(eventoId, params) {
    const response = await api.get(`/admin/eventos/${eventoId}/inscritos`, { params })
    return response.data
  }
}

