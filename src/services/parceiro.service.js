import api from './api'

export const parceiroService = {
  async getParceiros(params) {
    const response = await api.get('/admin/parceiros', { params })
    return response.data
  },

  async getParceiroById(id) {
    const response = await api.get(`/admin/parceiros/${id}`)
    return response.data
  },

  async createParceiro(data) {
    const response = await api.post('/admin/parceiros', data)
    return response.data
  },

  async updateParceiro(id, data) {
    const response = await api.put(`/admin/parceiros/${id}`, data)
    return response.data
  },

  async deleteParceiro(id) {
    const response = await api.delete(`/admin/parceiros/${id}`)
    return response.data
  },

  async getBeneficios(params) {
    const response = await api.get('/admin/beneficios', { params })
    return response.data
  },

  async getBeneficioById(id) {
    const response = await api.get(`/admin/beneficios/${id}`)
    return response.data
  },

  async getBeneficiosByParceiro(parceiroId) {
    const response = await api.get(`/admin/beneficios/parceiro/${parceiroId}`)
    return response.data
  },

  async createBeneficio(data) {
    const response = await api.post('/admin/beneficios', data)
    return response.data
  },

  async updateBeneficio(id, data) {
    const response = await api.put(`/admin/beneficios/${id}`, data)
    return response.data
  },

  async deleteBeneficio(id) {
    const response = await api.delete(`/admin/beneficios/${id}`)
    return response.data
  }
}

