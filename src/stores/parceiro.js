import { defineStore } from 'pinia'
import { parceiroService } from 'src/services/parceiro.service'
import { Notify } from 'quasar'

export const useParceiroStore = defineStore('parceiro', {
  state: () => ({
    parceiros: [],
    currentParceiro: null,
    beneficios: [],
    loading: false,
    pagination: {
      page: 1,
      rowsPerPage: 20,
      rowsNumber: 0
    }
  }),

  getters: {
    parceirosWithBenefits: (state) => {
      return state.parceiros.map(parceiro => ({
        ...parceiro,
        beneficiosCount: state.beneficios.filter(b => b.parceiro_id === parceiro.id).length
      }))
    }
  },

  actions: {
    async fetchParceiros(params = {}) {
      this.loading = true
      try {
        const response = await parceiroService.getParceiros(params)
        
        // A resposta pode ser um array direto ou um objeto com data e pagination
        if (Array.isArray(response)) {
          this.parceiros = response
        } else if (response?.data && Array.isArray(response.data)) {
          this.parceiros = response.data
          if (response.pagination) {
            this.pagination = {
              page: response.pagination.page || 1,
              rowsPerPage: response.pagination.limit || 20,
              rowsNumber: response.pagination.total || 0
            }
          }
        } else {
          this.parceiros = []
        }
        
        return { success: true }
      } catch (error) {
        console.error('Erro ao buscar parceiros:', error)
        return { success: false, error }
      } finally {
        this.loading = false
      }
    },

    async fetchById(id) {
      this.loading = true
      try {
        const data = await parceiroService.getParceiroById(id)
        this.currentParceiro = data
        return { success: true, data }
      } catch (error) {
        console.error('Erro ao buscar parceiro:', error)
        return { success: false, error }
      } finally {
        this.loading = false
      }
    },

    async create(data) {
      this.loading = true
      try {
        const response = await parceiroService.createParceiro(data)
        Notify.create({
          type: 'positive',
          message: 'Parceiro criado com sucesso!',
          position: 'top'
        })
        return { success: true, data: response }
      } catch (error) {
        const message = error.response?.data?.message || 'Erro ao criar parceiro'
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
        const response = await parceiroService.updateParceiro(id, data)
        Notify.create({
          type: 'positive',
          message: 'Parceiro atualizado com sucesso!',
          position: 'top'
        })
        return { success: true, data: response }
      } catch (error) {
        const message = error.response?.data?.message || 'Erro ao atualizar parceiro'
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
        await parceiroService.deleteParceiro(id)
        Notify.create({
          type: 'positive',
          message: 'Parceiro removido com sucesso!',
          position: 'top'
        })
        return { success: true }
      } catch (error) {
        const message = error.response?.data?.message || 'Erro ao remover parceiro'
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

    async fetchBeneficios(parceiroId) {
      this.loading = true
      try {
        const response = await parceiroService.getBeneficiosByParceiro(parceiroId)
        
        // A resposta pode ser um array direto ou um objeto com data
        if (Array.isArray(response)) {
          this.beneficios = response
        } else if (response?.data && Array.isArray(response.data)) {
          this.beneficios = response.data
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

    async createBeneficio(data) {
      this.loading = true
      try {
        const response = await parceiroService.createBeneficio(data)
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

    async updateBeneficio(id, data) {
      this.loading = true
      try {
        const response = await parceiroService.updateBeneficio(id, data)
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

    async deleteBeneficio(id) {
      this.loading = true
      try {
        await parceiroService.deleteBeneficio(id)
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

