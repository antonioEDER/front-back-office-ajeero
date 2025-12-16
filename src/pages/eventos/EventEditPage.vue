<template>
  <q-page padding>
    <div class="row q-mb-md items-center">
      <div class="col">
        <div class="text-h4">Editar Evento</div>
        <div class="text-subtitle1 text-grey-7">Editar informações do evento</div>
      </div>
      <div class="col-auto">
        <q-btn
          flat
          label="Voltar"
          @click="$router.push('/eventos')"
        />
      </div>
    </div>

    <q-card v-if="loading && !evento">
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
                v-model="form.titulo"
                label="Título *"
                outlined
                :rules="[val => !!val || 'Título é obrigatório']"
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
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.data"
                label="Data e Hora *"
                type="datetime-local"
                outlined
                :rules="[val => !!val || 'Data é obrigatória']"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.local"
                label="Local *"
                outlined
                :rules="[val => !!val || 'Local é obrigatório']"
              />
            </div>
          </div>

          <div class="row q-gutter-md">
            <div class="col-12">
              <div class="text-h6 q-mb-md">Capa do Evento</div>
              <div class="row q-gutter-md items-center">
                <div class="col-auto">
                  <q-avatar v-if="capaImageUrl" size="100px">
                    <img :src="capaImageUrl" alt="Preview Capa" />
                  </q-avatar>
                  <q-avatar v-else size="100px" color="grey" text-color="white">
                    <q-icon name="image" size="50px" />
                  </q-avatar>
                </div>
                <div class="col">
                  <q-file
                    v-model="capaFile"
                    label="Selecionar nova capa"
                    accept="image/*"
                    outlined
                    @update:model-value="handleCapaSelect"
                  >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                  </q-file>
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
                @click="$router.push('/eventos')"
                class="q-ml-sm"
              />
              <q-btn
                flat
                color="info"
                label="Ver Inscritos"
                icon="people"
                @click="$router.push(`/eventos/${eventoId}/inscritos`)"
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
import { useEventoStore } from 'src/stores/evento'
import { validateImageFile } from 'src/utils/validators'
import { useQuasar } from 'quasar'
import { API_BASE_URL } from 'src/utils/constants'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const eventoStore = useEventoStore()

const eventoId = route.params.id
const loading = ref(false)
const saving = ref(false)
const evento = ref(null)
const form = ref({
  titulo: '',
  descricao: '',
  data: '',
  local: ''
})

const capaFile = ref(null)
const capaPreview = ref(null)
const currentCapa = ref(null)

// Computed para URL da capa: prioriza preview local, senão adiciona API_BASE_URL se vier da lista
const capaImageUrl = computed(() => {
  if (capaPreview.value) {
    // Nova seleção local - usar preview
    return capaPreview.value
  }
  if (currentCapa.value) {
    // Imagem da lista - adicionar API_BASE_URL
    return API_BASE_URL + currentCapa.value
  }
  return null
})

const formatDateForInput = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

const handleCapaSelect = (file) => {
  if (file) {
    const validation = validateImageFile(file)
    if (!validation.valid) {
      $q.notify({
        type: 'negative',
        message: validation.error,
        position: 'top'
      })
      capaFile.value = null
      capaPreview.value = null
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      capaPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  } else {
    capaPreview.value = null
  }
}

const loadEvento = async () => {
  loading.value = true
  try {
    const result = await eventoStore.fetchById(eventoId)
    if (result.success) {
      evento.value = eventoStore.currentEvento
      form.value = {
        titulo: evento.value.titulo || '',
        descricao: evento.value.descricao || '',
        data: formatDateForInput(evento.value.data),
        local: evento.value.local || ''
      }
      currentCapa.value = evento.value.capa || null
    }
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  saving.value = true
  try {
    // Converter data para formato ISO
    const dataISO = form.value.data ? new Date(form.value.data).toISOString() : ''

    const result = await eventoStore.update(eventoId, {
      ...form.value,
      data: dataISO
    })
    if (result.success) {
      // Upload capa se houver
      if (capaFile.value) {
        await eventoStore.uploadCapa(eventoId, capaFile.value)
      }
      router.push('/eventos')
    }
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadEvento()
})
</script>
