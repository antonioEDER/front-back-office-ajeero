import api from './api'

export const noticiaService = {
  async getNoticias(params) {
    const response = await api.get('/noticias', { params })
    return response.data
  },

  async getNoticiaById(id) {
    const response = await api.get(`/noticias/${id}`)
    return response.data
  },

  async createNoticia(data) {
    const response = await api.post('/admin/noticias', data)
    return response.data
  },

  async updateNoticia(id, data) {
    const response = await api.put(`/admin/noticias/${id}`, data)
    return response.data
  },

  async deleteNoticia(id) {
    const response = await api.delete(`/admin/noticias/${id}`)
    return response.data
  }
}

