import api from './api'
import { extractApiData } from 'src/utils/apiHelpers'

export const associadoService = {
  async getAssociados(params) {
    const response = await api.get('/associados', { params })
    return extractApiData(response.data)
  },

  async getAssociadoByUserId(userId) {
    const response = await api.get(`/associados/${userId}`)
    return extractApiData(response.data)
  },

  // IMPORTANTE: Ao criar associado, também cria user automaticamente
  // Body deve incluir: { name, cpf, email, password, phone, address }
  async createAssociado(data) {
    const response = await api.post('/associados', data)
    // Resposta inclui user_id do associado criado
    return extractApiData(response.data)
  },

  // Ao atualizar, nome e email são sincronizados com user vinculado
  async updateAssociado(id, data) {
    const response = await api.put(`/associados/${id}`, data)
    return extractApiData(response.data)
  },

  async deleteAssociado(id) {
    const response = await api.delete(`/admin/associados/${id}`)
    // Remove também o user vinculado (CASCADE)
    return extractApiData(response.data)
  },

  // Ativa associado e user vinculado
  async activateAssociado(id) {
    const response = await api.patch(`/associados/${id}/activate`)
    return extractApiData(response.data)
  },

  // Desativa associado e user vinculado
  async deactivateAssociado(id) {
    const response = await api.patch(`/associados/${id}/deactivate`)
    return extractApiData(response.data)
  },

  async uploadPhoto(id, file) {
    const formData = new FormData()
    formData.append('photo', file)
    const response = await api.post(`/associados/${id}/photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return extractApiData(response.data)
  }
}

