import api from './api'
import { extractApiData } from 'src/utils/apiHelpers'

export const noticiaService = {
  async getNoticias(params) {
    const response = await api.get('/noticias', { params })
    return extractApiData(response.data)
  },

  async getNoticiaById(id) {
    const response = await api.get(`/noticias/${id}`)
    return extractApiData(response.data)
  },

  async createNoticia(data) {
    const response = await api.post('/admin/noticias', data)
    return extractApiData(response.data)
  },

  async updateNoticia(id, data) {
    const response = await api.put(`/admin/noticias/${id}`, data)
    return extractApiData(response.data)
  },

  async deleteNoticia(id) {
    const response = await api.delete(`/admin/noticias/${id}`)
    return extractApiData(response.data)
  }
}

