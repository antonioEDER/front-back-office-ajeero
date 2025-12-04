import { defineStore } from 'pinia'
import { notificacaoService } from 'src/services/notificacao.service'
import { Notify } from 'quasar'

export const useNotificacaoStore = defineStore('notificacao', {
  state: () => ({
    notificacoes: [],
    loading: false,
    pagination: {
      page: 1,
      rowsPerPage: 20,
      rowsNumber: 0
    }
  }),

  getters: {
    recentNotificacoes: (state) => {
      return [...state.notificacoes].sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at)
      }).slice(0, 10)
    }
  },

  actions: {
    async fetchNotificacoes(params = {}) {
      this.loading = true
      try {
        const response = await notificacaoService.getNotificacoes(params)
        
        // A resposta pode ser um array direto ou um objeto com data e pagination
        if (Array.isArray(response)) {
          this.notificacoes = response
        } else if (response?.data && Array.isArray(response.data)) {
          this.notificacoes = response.data
          if (response.pagination) {
            this.pagination = {
              page: response.pagination.page || 1,
              rowsPerPage: response.pagination.limit || 20,
              rowsNumber: response.pagination.total || 0
            }
          }
        } else {
          this.notificacoes = []
        }
        
        return { success: true }
      } catch (error) {
        console.error('Erro ao buscar notificações:', error)
        return { success: false, error }
      } finally {
        this.loading = false
      }
    },

    async create(data) {
      this.loading = true
      try {
        const response = await notificacaoService.createNotificacao(data)
        Notify.create({
          type: 'positive',
          message: 'Notificação enviada com sucesso!',
          position: 'top'
        })
        return { success: true, data: response }
      } catch (error) {
        const message = error.response?.data?.message || 'Erro ao enviar notificação'
        Notify.create({
          type: 'negative',
          message,
          position: 'top'
        })
        return { success: false, error: message }
      } finally {
        this.loading = false
      }
    }
  }
})

