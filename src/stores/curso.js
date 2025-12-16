import { defineStore } from 'pinia'
import { cursoService } from 'src/services/curso.service'
import { Notify } from 'quasar'

export const useCursoStore = defineStore('curso', {
  state: () => ({
    courses: [],
    currentCourse: null,
    lessons: [],
    loading: false,
    pagination: {
      page: 1,
      rowsPerPage: 20,
      rowsNumber: 0
    }
  }),

  getters: {
    coursesWithLessons: (state) => {
      return state.courses.map(course => ({
        ...course,
        lessonsCount: state.lessons.filter(l => l.course_id === course.id).length
      }))
    }
  },

  actions: {
    async fetchCourses(params = {}) {
      this.loading = true
      try {
        const response = await cursoService.getCourses(params)
        
        // A resposta pode ser um array direto ou um objeto com data e pagination
        if (Array.isArray(response)) {
          this.courses = response
        } else if (response?.data && Array.isArray(response.data)) {
          this.courses = response.data
          if (response.pagination) {
            this.pagination = {
              page: response.pagination.page || 1,
              rowsPerPage: response.pagination.limit || 20,
              rowsNumber: response.pagination.total || 0
            }
          }
        } else {
          this.courses = []
        }
        
        return { success: true }
      } catch (error) {
        console.error('Erro ao buscar cursos:', error)
        return { success: false, error }
      } finally {
        this.loading = false
      }
    },

    async fetchById(id) {
      this.loading = true
      try {
        const data = await cursoService.getCourseById(id)
        this.currentCourse = data
        return { success: true, data }
      } catch (error) {
        console.error('Erro ao buscar curso:', error)
        return { success: false, error }
      } finally {
        this.loading = false
      }
    },

    async create(data) {
      this.loading = true
      try {
        const response = await cursoService.createCourse(data)
        Notify.create({
          type: 'positive',
          message: 'Curso criado com sucesso!',
          position: 'top'
        })
        return { success: true, data: response }
      } catch (error) {
        const message = error.response?.data?.message || 'Erro ao criar curso'
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
        const response = await cursoService.updateCourse(id, data)
        Notify.create({
          type: 'positive',
          message: 'Curso atualizado com sucesso!',
          position: 'top'
        })
        return { success: true, data: response }
      } catch (error) {
        const message = error.response?.data?.message || 'Erro ao atualizar curso'
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
        await cursoService.deleteCourse(id)
        Notify.create({
          type: 'positive',
          message: 'Curso removido com sucesso!',
          position: 'top'
        })
        return { success: true }
      } catch (error) {
        const message = error.response?.data?.message || 'Erro ao remover curso'
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

    async createLesson(data) {
      this.loading = true
      try {
        const response = await cursoService.createLesson(data)
        Notify.create({
          type: 'positive',
          message: 'Aula criada com sucesso!',
          position: 'top'
        })
        return { success: true, data: response }
      } catch (error) {
        const message = error.response?.data?.message || 'Erro ao criar aula'
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

    async updateLesson(id, data) {
      this.loading = true
      try {
        const response = await cursoService.updateLesson(id, data)
        Notify.create({
          type: 'positive',
          message: 'Aula atualizada com sucesso!',
          position: 'top'
        })
        return { success: true, data: response }
      } catch (error) {
        const message = error.response?.data?.message || 'Erro ao atualizar aula'
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

    async deleteLesson(id) {
      this.loading = true
      try {
        await cursoService.deleteLesson(id)
        Notify.create({
          type: 'positive',
          message: 'Aula removida com sucesso!',
          position: 'top'
        })
        return { success: true }
      } catch (error) {
        const message = error.response?.data?.message || 'Erro ao remover aula'
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

    async uploadCapa(id, file) {
      this.loading = true
      try {
        const response = await cursoService.uploadCapa(id, file)
        Notify.create({
          type: 'positive',
          message: 'Capa atualizada com sucesso!',
          position: 'top'
        })
        return { success: true, data: response }
      } catch (error) {
        const message = error.response?.data?.message || 'Erro ao fazer upload da capa'
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

    async uploadThumbnail(id, file) {
      this.loading = true
      try {
        const response = await cursoService.uploadThumbnail(id, file)
        Notify.create({
          type: 'positive',
          message: 'Thumbnail atualizado com sucesso!',
          position: 'top'
        })
        return { success: true, data: response }
      } catch (error) {
        const message = error.response?.data?.message || 'Erro ao fazer upload do thumbnail'
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

