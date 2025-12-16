import api from './api'
import { extractApiData } from 'src/utils/apiHelpers'

export const parceiroService = {
  async getParceiros(params) {
    const response = await api.get('/admin/parceiros', { params })
    return extractApiData(response.data)
  },

  async getParceiroById(id) {
    const response = await api.get(`/admin/parceiros/${id}`)
    return extractApiData(response.data)
  },

  async createParceiro(data) {
    const response = await api.post('/admin/parceiros', data)
    return extractApiData(response.data)
  },

  async updateParceiro(id, data) {
    const response = await api.put(`/admin/parceiros/${id}`, data)
    return extractApiData(response.data)
  },

  async deleteParceiro(id) {
    const response = await api.delete(`/admin/parceiros/${id}`)
    return extractApiData(response.data)
  },

  async getBeneficios(params) {
    const response = await api.get('/admin/beneficios', { params })
    return extractApiData(response.data)
  },

  async getBeneficioById(id) {
    const response = await api.get(`/admin/beneficios/${id}`)
    return extractApiData(response.data)
  },

  async getBeneficiosByParceiro(parceiroId) {
    const response = await api.get(`/admin/beneficios/parceiro/${parceiroId}`)
    return extractApiData(response.data)
  },

  async createBeneficio(data) {
    const response = await api.post('/admin/beneficios', data)
    return extractApiData(response.data)
  },

  async updateBeneficio(id, data) {
    const response = await api.put(`/admin/beneficios/${id}`, data)
    return extractApiData(response.data)
  },

  async deleteBeneficio(id) {
    const response = await api.delete(`/admin/beneficios/${id}`)
    return extractApiData(response.data)
  },

  async uploadLogo(id, file) {
    const formData = new FormData()
    formData.append('logo', file)
    const response = await api.post(`/admin/parceiros/${id}/logo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return extractApiData(response.data)
  }
}

