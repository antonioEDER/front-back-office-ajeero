import { defineStore } from 'pinia'
import { associadoService } from 'src/services/associado.service'
import { Notify } from 'quasar'

export const useAssociadoStore = defineStore('associado', {
  state: () => ({
    associados: [],
    currentAssociado: null,
    loading: false,
    pagination: {
      page: 1,
      rowsPerPage: 20,
      rowsNumber: 0
    }
  }),

  getters: {
    activeAssociados: (state) => state.associados.filter(a => a.status === 'active'),
    inactiveAssociados: (state) => state.associados.filter(a => a.status === 'inactive')
  },

  actions: {
    async fetchAssociados(params = {}) {
      this.loading = true
      try {
        const response = await associadoService.getAssociados(params)
        this.associados = response.data || response
        if (response.pagination) {
          this.pagination = {
            page: response.pagination.page || 1,
            rowsPerPage: response.pagination.limit || 20,
            rowsNumber: response.pagination.total || 0
          }
        }
        return { success: true }
      } catch (error) {
        console.error('Erro ao buscar associados:', error)
        return { success: false, error }
      } finally {
        this.loading = false
      }
    },

    async fetchById(id) {
      this.loading = true
      try {
        const data = await associadoService.getAssociadoById(id)
        this.currentAssociado = data
        return { success: true, data }
      } catch (error) {
        console.error('Erro ao buscar associado:', error)
        return { success: false, error }
      } finally {
        this.loading = false
      }
    },

    async create(data) {
      this.loading = true
      try {
        const response = await associadoService.createAssociado(data)
        Notify.create({
          type: 'positive',
          message: 'Associado criado com sucesso!',
          position: 'top'
        })
        return { success: true, data: response }
      } catch (error) {
        const message = error.response?.data?.message || 'Erro ao criar associado'
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
        const response = await associadoService.updateAssociado(id, data)
        Notify.create({
          type: 'positive',
          message: 'Associado atualizado com sucesso!',
          position: 'top'
        })
        return { success: true, data: response }
      } catch (error) {
        const message = error.response?.data?.message || 'Erro ao atualizar associado'
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
        await associadoService.deleteAssociado(id)
        Notify.create({
          type: 'positive',
          message: 'Associado removido com sucesso!',
          position: 'top'
        })
        return { success: true }
      } catch (error) {
        const message = error.response?.data?.message || 'Erro ao remover associado'
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

    async activate(id) {
      try {
        await associadoService.activateAssociado(id)
        Notify.create({
          type: 'positive',
          message: 'Associado ativado com sucesso!',
          position: 'top'
        })
        return { success: true }
      } catch (error) {
        const message = error.response?.data?.message || 'Erro ao ativar associado'
        Notify.create({
          type: 'negative',
          message,
          position: 'top'
        })
        return { success: false, error: message }
      }
    },

    async deactivate(id) {
      try {
        await associadoService.deactivateAssociado(id)
        Notify.create({
          type: 'positive',
          message: 'Associado desativado com sucesso!',
          position: 'top'
        })
        return { success: true }
      } catch (error) {
        const message = error.response?.data?.message || 'Erro ao desativar associado'
        Notify.create({
          type: 'negative',
          message,
          position: 'top'
        })
        return { success: false, error: message }
      }
    },

    async uploadPhoto(id, file) {
      this.loading = true
      try {
        const response = await associadoService.uploadPhoto(id, file)
        Notify.create({
          type: 'positive',
          message: 'Foto atualizada com sucesso!',
          position: 'top'
        })
        return { success: true, data: response }
      } catch (error) {
        const message = error.response?.data?.message || 'Erro ao fazer upload da foto'
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

