<template>
  <q-page padding>
    <div class="row q-mb-md items-center">
      <div class="col">
        <div class="text-h4">Editar Parceiro</div>
        <div class="text-subtitle1 text-grey-7">Editar informações do parceiro</div>
      </div>
      <div class="col-auto">
        <q-btn
          flat
          label="Voltar"
          @click="$router.push('/parceiros')"
        />
      </div>
    </div>

    <q-card v-if="loading && !parceiro">
      <q-card-section>
        <q-spinner color="primary" size="3em" />
      </q-card-section>
    </q-card>

    <q-card v-else>
      <q-card-section>
        <q-form @submit="handleSubmit" class="q-gutter-md">
          <div class="row q-gutter-md">
            <div class="col-12">
              <q-input
                v-model="form.nome"
                label="Nome *"
                outlined
                :rules="[val => !!val || 'Nome é obrigatório', val => val.length >= 3 || 'Nome deve ter no mínimo 3 caracteres']"
              />
            </div>
          </div>

          <div class="row q-gutter-md">
            <div class="col-12">
              <q-input
                v-model="form.descricao"
                label="Descrição"
                type="textarea"
                outlined
                rows="4"
              />
            </div>
          </div>

          <div class="row q-gutter-md">
            <div class="col-12">
              <div class="text-h6 q-mb-md">Logo do Parceiro</div>
              <div class="row q-gutter-md items-center">
                <div class="col-auto">
                  <q-avatar v-if="logoImageUrl" size="100px" square>
                    <img :src="logoImageUrl" alt="Preview Logo" />
                  </q-avatar>
                  <q-avatar v-else size="100px" square color="grey" text-color="white">
                    <q-icon name="image" size="50px" />
                  </q-avatar>
                </div>
                <div class="col">
                  <q-file
                    v-model="logoFile"
                    label="Selecionar nova logo"
                    accept="image/*"
                    outlined
                    @update:model-value="handleLogoSelect"
                  >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                  </q-file>
                  <div class="text-caption text-grey-7 q-mt-xs">
                    Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 10MB
                  </div>
                </div>
              </div>
            </div>
          </div>

          <q-separator />

          <div class="row q-gutter-md">
            <div class="col-12">
              <q-btn
                type="submit"
                color="primary"
                label="Salvar Alterações"
                :loading="saving"
                icon="save"
              />
              <q-btn
                flat
                label="Cancelar"
                @click="$router.push('/parceiros')"
                class="q-ml-sm"
              />
              <q-btn
                flat
                color="info"
                label="Gerenciar Benefícios"
                icon="card_giftcard"
                @click="$router.push(`/parceiros/${parceiroId}/beneficios`)"
                class="q-ml-sm"
              />
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useParceiroStore } from 'src/stores/parceiro'
import { validateImageFile } from 'src/utils/validators'
import { useQuasar } from 'quasar'
import { API_BASE_URL } from 'src/utils/constants'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const parceiroStore = useParceiroStore()

const parceiroId = route.params.id
const loading = ref(false)
const saving = ref(false)
const parceiro = ref(null)
const form = ref({
  nome: '',
  descricao: ''
})

const logoFile = ref(null)
const logoPreview = ref(null)
const currentLogo = ref(null)

// Computed para URL da logo: prioriza preview local, senão adiciona API_BASE_URL se vier da lista
const logoImageUrl = computed(() => {
  if (logoPreview.value) {
    // Nova seleção local - usar preview
    return logoPreview.value
  }
  if (currentLogo.value) {
    // Imagem da lista - verificar se já é URL completa ou base64
    if (currentLogo.value.startsWith('http://') || currentLogo.value.startsWith('https://')) {
      return currentLogo.value
    }
    if (currentLogo.value.startsWith('data:')) {
      return currentLogo.value
    }
    // Caso contrário, adicionar API_BASE_URL
    return API_BASE_URL + currentLogo.value
  }
  return null
})

const handleLogoSelect = (file) => {
  if (file) {
    const validation = validateImageFile(file)
    if (!validation.valid) {
      $q.notify({
        type: 'negative',
        message: validation.error,
        position: 'top'
      })
      logoFile.value = null
      logoPreview.value = null
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      logoPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  } else {
    logoPreview.value = null
  }
}

const loadParceiro = async () => {
  loading.value = true
  try {
    const result = await parceiroStore.fetchById(parceiroId)
    if (result.success) {
      parceiro.value = parceiroStore.currentParceiro
      form.value = {
        nome: parceiro.value.nome || '',
        descricao: parceiro.value.descricao || ''
      }
      currentLogo.value = parceiro.value.logo || null
    }
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  saving.value = true
  try {
    const dataToSend = {
      ...form.value
    }

    // Se há nova logo selecionada, incluir como base64
    if (logoPreview.value) {
      dataToSend.logo = logoPreview.value
    }

    const result = await parceiroStore.update(parceiroId, dataToSend)
    if (result.success) {
      router.push('/parceiros')
    }
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadParceiro()
})
</script>
