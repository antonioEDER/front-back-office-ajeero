<template>
  <div class="login-page row items-center justify-center">
    <q-card class="login-card" style="width: 400px">
      <q-card-section class="text-center q-pb-none">
        <q-avatar size="80px" class="q-mb-md">
          <img src="/favicon.ico" alt="AJEERO" />
        </q-avatar>
        <div class="text-h5 q-mt-md">AJEERO Backoffice</div>
        <div class="text-subtitle2 text-grey-7">Painel Administrativo</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="handleLogin" class="q-gutter-md">
          <q-input
            v-model="email"
            label="Email"
            type="email"
            outlined
            dense
            :rules="[val => !!val || 'Email é obrigatório', val => validateEmail(val) || 'Email inválido']"
            lazy-rules
          >
            <template v-slot:prepend>
              <q-icon name="email" />
            </template>
          </q-input>

          <q-input
            v-model="password"
            label="Senha"
            :type="showPassword ? 'text' : 'password'"
            outlined
            dense
            :rules="[val => !!val || 'Senha é obrigatória']"
            lazy-rules
          >
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="showPassword ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>

          <div>
            <q-btn
              label="Entrar"
              type="submit"
              color="primary"
              class="full-width"
              :loading="loading"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'
import { validateEmail } from 'src/utils/validators'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)

onMounted(() => {
  // Se já está autenticado, redireciona para dashboard
  if (authStore.isAuthenticated) {
    router.push('/dashboard')
  }
})

const handleLogin = async () => {
  loading.value = true
  try {
    const result = await authStore.login(email.value, password.value)
    if (result.success) {
      router.push('/dashboard')
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}
</style>

