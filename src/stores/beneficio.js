import { defineStore } from 'pinia'
import { beneficioService } from 'src/services/beneficio.service'
import { Notify } from 'quasar'

export const useBeneficioStore = defineStore('beneficio', {
  state: () => ({
    beneficios: [],
    currentBeneficio: null,
    loading: false,
    pagination: {
      page: 1,
      rowsPerPage: 20,
      rowsNumber: 0
    }
  }),

  actions: {
    async fetchBeneficios(params = {}) {
      this.loading = true
      try {
        const response = await beneficioService.getBeneficios(params)
        
        if (Array.isArray(response)) {
          this.beneficios = response
        } else if (response?.data && Array.isArray(response.data)) {
          this.beneficios = response.data
          if (response.pagination) {
            this.pagination = {
              page: response.pagination.page || 1,
              rowsPerPage: response.pagination.limit || 20,
              rowsNumber: response.pagination.total || 0
            }
          }
        } else {
          this.beneficios = []
        }
        
        return { success: true }
      } catch (error) {
        console.error('Erro ao buscar benefícios:', error)
        return { success: false, error }
      } finally {
        this.loading = false
      }
    },

    async fetchById(id) {
      this.loading = true
      try {
        const data = await beneficioService.getBeneficioById(id)
        this.currentBeneficio = data
        return { success: true, data }
      } catch (error) {
        console.error('Erro ao buscar benefício:', error)
        return { success: false, error }
      } finally {
        this.loading = false
      }
    },

    async create(data) {
      this.loading = true
      try {
        const response = await beneficioService.createBeneficio(data)
        Notify.create({
          type: 'positive',
          message: 'Benefício criado com sucesso!',
          position: 'top'
        })
        return { success: true, data: response }
      } catch (error) {
        const message = error.response?.data?.message || 'Erro ao criar benefício'
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
        const response = await beneficioService.updateBeneficio(id, data)
        Notify.create({
          type: 'positive',
          message: 'Benefício atualizado com sucesso!',
          position: 'top'
        })
        return { success: true, data: response }
      } catch (error) {
        const message = error.response?.data?.message || 'Erro ao atualizar benefício'
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
        await beneficioService.deleteBeneficio(id)
        Notify.create({
          type: 'positive',
          message: 'Benefício removido com sucesso!',
          position: 'top'
        })
        return { success: true }
      } catch (error) {
        const message = error.response?.data?.message || 'Erro ao remover benefício'
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

