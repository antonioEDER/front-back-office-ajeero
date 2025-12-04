<template>
  <q-layout view="hHh lpR fFf">
    <AppHeader
      :page-title="pageTitle"
      :drawer-open="leftDrawerOpen"
      @toggle-drawer="toggleLeftDrawer"
    />

    <AppSidebar v-model="leftDrawerOpen" />

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from 'src/components/common/AppHeader.vue'
import AppSidebar from 'src/components/common/AppSidebar.vue'

const route = useRoute()
const leftDrawerOpen = ref(true)

const pageTitle = computed(() => {
  const titles = {
    '/dashboard': 'Dashboard',
    '/associados': 'Associados',
    '/cursos': 'Cursos',
    '/eventos': 'Eventos',
    '/parceiros': 'Parceiros',
    '/noticias': 'Notícias',
    '/notificacoes': 'Notificações'
  }
  
  for (const [path, title] of Object.entries(titles)) {
    if (route.path.startsWith(path)) {
      return title
    }
  }
  
  return 'Dashboard'
})

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

