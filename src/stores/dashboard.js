import { defineStore } from 'pinia'
import { dashboardService } from 'src/services/dashboard.service'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    stats: {
      total_associados: 0,
      total_eventos: 0,
      total_inscritos: 0,
      total_cursos: 0,
      total_cursos_acessados: 0,
      total_parceiros: 0,
      total_noticias: 0
    },
    loading: false
  }),

  getters: {
    formattedStats: (state) => state.stats
  },

  actions: {
    async fetchStats() {
      this.loading = true
      try {
        const data = await dashboardService.getStats()
        this.stats = data
        return { success: true }
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error)
        return { success: false, error }
      } finally {
        this.loading = false
      }
    }
  }
})

