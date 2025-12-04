import { defineStore } from 'pinia'
import { noticiaService } from 'src/services/noticia.service'
import { Notify } from 'quasar'

export const useNoticiaStore = defineStore('noticia', {
  state: () => ({
    noticias: [],
    currentNoticia: null,
    loading: false,
    pagination: {
      page: 1,
      rowsPerPage: 20,
      rowsNumber: 0
    }
  }),

  getters: {
    latestNoticias: (state) => {
      return [...state.noticias].sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at)
      })
    }
  },

  actions: {
    async fetchNoticias(params = {}) {
      this.loading = true
      try {
        const response = await noticiaService.getNoticias(params)
        this.noticias = response.data || response
        if (response.pagination) {
          this.pagination = {
            page: response.pagination.page || 1,
            rowsPerPage: response.pagination.limit || 20,
            rowsNumber: response.pagination.total || 0
          }
        }
        return { success: true }
      } catch (error) {
        console.error('Erro ao buscar notícias:', error)
        return { success: false, error }
      } finally {
        this.loading = false
      }
    },

    async fetchById(id) {
      this.loading = true
      try {
        const data = await noticiaService.getNoticiaById(id)
        this.currentNoticia = data
        return { success: true, data }
      } catch (error) {
        console.error('Erro ao buscar notícia:', error)
        return { success: false, error }
      } finally {
        this.loading = false
      }
    },

    async create(data) {
      this.loading = true
      try {
        const response = await noticiaService.createNoticia(data)
        Notify.create({
          type: 'positive',
          message: 'Notícia criada com sucesso!',
          position: 'top'
        })
        return { success: true, data: response }
      } catch (error) {
        const message = error.response?.data?.message || 'Erro ao criar notícia'
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
        const response = await noticiaService.updateNoticia(id, data)
        Notify.create({
          type: 'positive',
          message: 'Notícia atualizada com sucesso!',
          position: 'top'
        })
        return { success: true, data: response }
      } catch (error) {
        const message = error.response?.data?.message || 'Erro ao atualizar notícia'
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
        await noticiaService.deleteNoticia(id)
        Notify.create({
          type: 'positive',
          message: 'Notícia removida com sucesso!',
          position: 'top'
        })
        return { success: true }
      } catch (error) {
        const message = error.response?.data?.message || 'Erro ao remover notícia'
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

