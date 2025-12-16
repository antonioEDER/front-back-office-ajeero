<template>
  <q-page padding>
    <div class="row q-mb-md items-center">
      <div class="col">
        <div class="text-h4">Novo Evento</div>
        <div class="text-subtitle1 text-grey-7">Cadastrar novo evento no sistema</div>
      </div>
      <div class="col-auto">
        <q-btn
          flat
          label="Cancelar"
          @click="$router.push('/eventos')"
        />
      </div>
    </div>

    <q-card>
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
                label="Salvar Evento"
                :loading="loading"
                icon="save"
              />
              <q-btn
                flat
                label="Cancelar"
                @click="$router.push('/eventos')"
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useEventoStore } from 'src/stores/evento'

const router = useRouter()
const eventoStore = useEventoStore()

const loading = ref(false)
const form = ref({
  titulo: '',
  descricao: '',
  data: '',
  local: '',
  capa: ''
})

const handleSubmit = async () => {
  loading.value = true
  try {
    // Converter data para formato ISO
    const dataISO = form.value.data ? new Date(form.value.data).toISOString() : ''
    
    const result = await eventoStore.create({
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
</script>
