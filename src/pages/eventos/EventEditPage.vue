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
              <q-input
                v-model="form.capa"
                label="URL da Capa"
                outlined
                hint="URL da imagem de capa do evento"
              />
            </div>
          </div>

          <div class="row q-gutter-md" v-if="form.capa">
            <div class="col-12">
              <div class="text-body2 q-mb-sm">Preview da Capa:</div>
              <q-img
                :src="form.capa"
                style="max-width: 400px; max-height: 300px;"
                fit="contain"
              />
            </div>
          </div>

          <q-separator />

          <div class="row q-gutter-md">
            <div class="col-12">
              <q-btn
                type="submit"
                color="primary"
                label="Salvar Alterações"
                :loading="loading"
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
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEventoStore } from 'src/stores/evento'

const route = useRoute()
const router = useRouter()
const eventoStore = useEventoStore()

const eventoId = route.params.id
const loading = ref(false)
const evento = ref(null)
const form = ref({
  titulo: '',
  descricao: '',
  data: '',
  local: '',
  capa: ''
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
        local: evento.value.local || '',
        capa: evento.value.capa || ''
      }
    }
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  loading.value = true
  try {
    // Converter data para formato ISO
    const dataISO = form.value.data ? new Date(form.value.data).toISOString() : ''
    
    const result = await eventoStore.update(eventoId, {
      ...form.value,
      data: dataISO
    })
    if (result.success) {
      router.push('/eventos')
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadEvento()
})
</script>
