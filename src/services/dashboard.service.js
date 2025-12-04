import api from './api'
import { extractApiData } from 'src/utils/apiHelpers'

export const dashboardService = {
  async getStats() {
    const response = await api.get('/admin/dashboard')
    return extractApiData(response.data)
  }
}

