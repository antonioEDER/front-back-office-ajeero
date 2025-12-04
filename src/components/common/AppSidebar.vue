<template>
  <q-drawer
    v-model="drawerOpen"
    show-if-above
    bordered
    :width="250"
    class="bg-grey-1"
  >
    <q-list>
      <q-item-label header class="text-grey-8">
        Menu Principal
      </q-item-label>

      <q-item
        v-for="item in menuItems"
        :key="item.path"
        clickable
        v-ripple
        :active="isActive(item.path)"
        active-class="bg-primary text-white"
        @click="navigate(item.path)"
      >
        <q-item-section avatar>
          <q-icon :name="item.icon" />
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ item.label }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-drawer>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue'])

const route = useRoute()
const router = useRouter()

const drawerOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const menuItems = [
  { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
  { label: 'Associados', path: '/associados', icon: 'people' },
  { label: 'Cursos', path: '/cursos', icon: 'school' },
  { label: 'Eventos', path: '/eventos', icon: 'event' },
  { label: 'Parceiros', path: '/parceiros', icon: 'handshake' },
  { label: 'Notícias', path: '/noticias', icon: 'article' },
  { label: 'Notificações', path: '/notificacoes', icon: 'notifications' }
]

const isActive = (path) => {
  return route.path.startsWith(path)
}

const navigate = (path) => {
  router.push(path)
}
</script>

