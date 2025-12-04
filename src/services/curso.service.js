import api from './api'
import { extractApiData } from 'src/utils/apiHelpers'

export const cursoService = {
  async getCourses(params) {
    const response = await api.get('/courses', { params })
    return extractApiData(response.data)
  },

  async getCourseById(id) {
    const response = await api.get(`/courses/${id}`)
    return extractApiData(response.data)
  },

  async createCourse(data) {
    const response = await api.post('/admin/courses', data)
    return extractApiData(response.data)
  },

  async updateCourse(id, data) {
    const response = await api.put(`/admin/courses/${id}`, data)
    return extractApiData(response.data)
  },

  async deleteCourse(id) {
    const response = await api.delete(`/admin/courses/${id}`)
    return extractApiData(response.data)
  },

  async createLesson(data) {
    const response = await api.post('/admin/courses/lessons', data)
    return extractApiData(response.data)
  },

  async updateLesson(id, data) {
    const response = await api.put(`/admin/courses/lessons/${id}`, data)
    return extractApiData(response.data)
  },

  async deleteLesson(id) {
    const response = await api.delete(`/admin/courses/lessons/${id}`)
    return extractApiData(response.data)
  }
}

