import api from './api'
import { extractApiData } from 'src/utils/apiHelpers'

export const beneficioService = {
  async getBeneficios(params) {
    const response = await api.get('/admin/beneficios', { params })
    return extractApiData(response.data)
  },

  async getBeneficioById(id) {
    const response = await api.get(`/admin/beneficios/${id}`)
    return extractApiData(response.data)
  },

  async getBeneficiosByParceiro(parceiroId, params) {
    const response = await api.get(`/admin/beneficios/parceiro/${parceiroId}`, { params })
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
  }
}

