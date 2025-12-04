import { defineStore } from 'pinia'
import { eventoService } from 'src/services/evento.service'
import { Notify } from 'quasar'

export const useEventoStore = defineStore('evento', {
  state: () => ({
    eventos: [],
    currentEvento: null,
    inscritos: [],
    loading: false,
    pagination: {
      page: 1,
      rowsPerPage: 20,
      rowsNumber: 0
    }
  }),

  getters: {
    upcomingEventos: (state) => {
      const now = new Date()
      return state.eventos.filter(e => new Date(e.date) > now)
    },
    pastEventos: (state) => {
      const now = new Date()
      return state.eventos.filter(e => new Date(e.date) <= now)
    }
  },

  actions: {
    async fetchEventos(params = {}) {
      this.loading = true
      try {
        const response = await eventoService.getEventos(params)
        this.eventos = response.data || response
        if (response.pagination) {
          this.pagination = {
            page: response.pagination.page || 1,
            rowsPerPage: response.pagination.limit || 20,
            rowsNumber: response.pagination.total || 0
          }
        }
        return { success: true }
      } catch (error) {
        console.error('Erro ao buscar eventos:', error)
        return { success: false, error }
      } finally {
        this.loading = false
      }
    },

    async fetchById(id) {
      this.loading = true
      try {
        const data = await eventoService.getEventoById(id)
        this.currentEvento = data
        return { success: true, data }
      } catch (error) {
        console.error('Erro ao buscar evento:', error)
        return { success: false, error }
      } finally {
        this.loading = false
      }
    },

    async create(data) {
      this.loading = true
      try {
        const response = await eventoService.createEvento(data)
        Notify.create({
          type: 'positive',
          message: 'Evento criado com sucesso!',
          position: 'top'
        })
        return { success: true, data: response }
      } catch (error) {
        const message = error.response?.data?.message || 'Erro ao criar evento'
        Notify.create({
          type: 'negative',
          message,
          position: 'top'
        })
        return { success: false, error: message }
      } finally {
        this.loading = false
      }
    },

    async update(id, data) {
      this.loading = true
      try {
        const response = await eventoService.updateEvento(id, data)
        Notify.create({
          type: 'positive',
          message: 'Evento atualizado com sucesso!',
          position: 'top'
        })
        return { success: true, data: response }
      } catch (error) {
        const message = error.response?.data?.message || 'Erro ao atualizar evento'
        Notify.create({
          type: 'negative',
          message,
          position: 'top'
        })
        return { success: false, error: message }
      } finally {
        this.loading = false
      }
    },

    async delete(id) {
      this.loading = true
      try {
        await eventoService.deleteEvento(id)
        Notify.create({
          type: 'positive',
          message: 'Evento removido com sucesso!',
          position: 'top'
        })
        return { success: true }
      } catch (error) {
        const message = error.response?.data?.message || 'Erro ao remover evento'
        Notify.create({
          type: 'negative',
          message,
          position: 'top'
        })
        return { success: false, error: message }
      } finally {
        this.loading = false
      }
    },

    async fetchInscritos(eventoId, params = {}) {
      this.loading = true
      try {
        const response = await eventoService.getInscritos(eventoId, params)
        this.inscritos = response.data || response
        if (response.pagination) {
          this.pagination = {
            page: response.pagination.page || 1,
            rowsPerPage: response.pagination.limit || 20,
            rowsNumber: response.pagination.total || 0
          }
        }
        return { success: true }
      } catch (error) {
        console.error('Erro ao buscar inscritos:', error)
        return { success: false, error }
      } finally {
        this.loading = false
      }
    }
  }
})

