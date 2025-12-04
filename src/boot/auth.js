// Interceptor de autenticação
import { defineBoot } from '#q-app/wrappers'
import { STORAGE_KEYS } from 'src/utils/constants'

export default defineBoot(({ router }) => {
  // Guard de rota para proteger páginas que requerem autenticação
  router.beforeEach((to, from, next) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    const isAuthRoute = to.path.startsWith('/auth')
    
    // Se não está autenticado e não está na rota de login
    if (!token && !isAuthRoute) {
      next('/auth/login')
      return
    }
    
    // Se está autenticado e tenta acessar login, redireciona para dashboard
    if (token && isAuthRoute) {
      next('/dashboard')
      return
    }
    
    next()
  })
})

