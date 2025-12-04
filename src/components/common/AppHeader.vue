<template>
  <q-header elevated class="bg-primary text-white">
    <q-toolbar>
      <q-btn
        flat
        dense
        round
        icon="menu"
        @click="toggleDrawer"
        aria-label="Menu"
      />

      <q-toolbar-title class="row items-center q-gutter-sm">
        <q-avatar>
          <img src="/favicon.ico" alt="AJEERO" />
        </q-avatar>
        <span class="text-h6">AJEERO - Backoffice</span>
        <q-separator vertical dark />
        <span class="text-subtitle1">{{ pageTitle }}</span>
      </q-toolbar-title>

      <q-space />

      <q-btn
        flat
        dense
        round
        icon="notifications"
        class="q-mr-sm"
      >
        <q-badge color="red" floating>0</q-badge>
      </q-btn>

      <q-btn-dropdown
        flat
        dense
        :label="userName"
        icon="account_circle"
      >
        <q-list>
          <q-item clickable v-close-popup>
            <q-item-section avatar>
              <q-avatar>
                <q-icon name="person" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>Perfil</q-item-label>
              <q-item-label caption>{{ userEmail }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator />

          <q-item clickable v-close-popup @click="handleLogout">
            <q-item-section avatar>
              <q-icon name="logout" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Sair</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </q-toolbar>
  </q-header>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'

const props = defineProps({
  pageTitle: {
    type: String,
    default: 'Dashboard'
  },
  drawerOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle-drawer'])

const router = useRouter()
const authStore = useAuthStore()

const userName = computed(() => {
  return authStore.user?.name || 'Admin'
})

const userEmail = computed(() => {
  return authStore.user?.email || ''
})

const toggleDrawer = () => {
  emit('toggle-drawer')
}

const handleLogout = () => {
  authStore.logout()
  router.push('/auth/login')
}
</script>

