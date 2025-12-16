const routes = [
  {
    path: '/auth',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'login', component: () => import('pages/auth/LoginPage.vue') }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/AdminLayout.vue'),
    children: [
      { path: '', redirect: '/dashboard' },
      { path: 'dashboard', component: () => import('pages/dashboard/DashboardPage.vue') },
      
      // Associados
      { path: 'associados', component: () => import('pages/associados/AssociadosListPage.vue') },
      { path: 'associados/novo', component: () => import('pages/associados/AssociadoCreatePage.vue') },
      { path: 'associados/:id', component: () => import('pages/associados/AssociadoEditPage.vue') },
      
      // Cursos
      { path: 'cursos', component: () => import('pages/cursos/CoursesListPage.vue') },
      { path: 'cursos/novo', component: () => import('pages/cursos/CourseCreatePage.vue') },
      { path: 'cursos/:id', component: () => import('pages/cursos/CourseEditPage.vue') },
      { path: 'cursos/:id/aulas', component: () => import('pages/cursos/LessonsManagePage.vue') },
      
      // Eventos
      { path: 'eventos', component: () => import('pages/eventos/EventsListPage.vue') },
      { path: 'eventos/novo', component: () => import('pages/eventos/EventCreatePage.vue') },
      { path: 'eventos/:id', component: () => import('pages/eventos/EventEditPage.vue') },
      { path: 'eventos/:id/inscritos', component: () => import('pages/eventos/EventInscritosPage.vue') },
      
      // Parceiros
      { path: 'parceiros', component: () => import('pages/parceiros/PartnersListPage.vue') },
      { path: 'parceiros/novo', component: () => import('pages/parceiros/PartnerCreatePage.vue') },
      { path: 'parceiros/:id', component: () => import('pages/parceiros/PartnerEditPage.vue') },
      { path: 'parceiros/:id/beneficios', component: () => import('pages/parceiros/BenefitsManagePage.vue') },
      
      // Benefícios
      { path: 'beneficios', component: () => import('pages/beneficios/BeneficiosListPage.vue') },
      { path: 'beneficios/novo', component: () => import('pages/beneficios/BeneficioCreatePage.vue') },
      { path: 'beneficios/:id', component: () => import('pages/beneficios/BeneficioEditPage.vue') },
      
      // Notícias
      { path: 'noticias', component: () => import('pages/noticias/NewsListPage.vue') },
      { path: 'noticias/novo', component: () => import('pages/noticias/NewsCreatePage.vue') },
      { path: 'noticias/:id', component: () => import('pages/noticias/NewsEditPage.vue') },
      
      // Notificações
      { path: 'notificacoes', component: () => import('pages/notificacoes/NotificationsListPage.vue') },
      { path: 'notificacoes/nova', component: () => import('pages/notificacoes/NotificationCreatePage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
