<template>
  <q-page padding>
    <div class="row q-mb-md items-center">
      <div class="col">
        <div class="text-h4">Novo Curso</div>
        <div class="text-subtitle1 text-grey-7">Cadastrar novo curso no sistema</div>
      </div>
      <div class="col-auto">
        <q-btn
          flat
          label="Cancelar"
          @click="$router.push('/cursos')"
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
              <div class="text-h6 q-mb-md">Capa do Curso</div>
              <div class="row q-gutter-md items-center">
                <div class="col-auto">
                  <q-avatar v-if="capaPreview" size="100px">
                    <img :src="capaPreview" alt="Preview Capa" />
                  </q-avatar>
                  <q-avatar v-else size="100px" color="grey" text-color="white">
                    <q-icon name="image" size="50px" />
                  </q-avatar>
                </div>
                <div class="col">
                  <q-file
                    v-model="capaFile"
                    label="Selecionar capa"
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
            <div class="col-12 col-md-6">
              <div class="text-h6 q-mb-md">Thumbnail do Curso</div>
              <div class="row q-gutter-md items-center">
                <div class="col-auto">
                  <q-avatar v-if="thumbnailPreview" size="100px">
                    <img :src="thumbnailPreview" alt="Preview Thumbnail" />
                  </q-avatar>
                  <q-avatar v-else size="100px" color="grey" text-color="white">
                    <q-icon name="image" size="50px" />
                  </q-avatar>
                </div>
                <div class="col">
                  <q-file
                    v-model="thumbnailFile"
                    label="Selecionar thumbnail"
                    accept="image/*"
                    outlined
                    @update:model-value="handleThumbnailSelect"
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
                label="Salvar Curso"
                :loading="loading"
                icon="save"
              />
              <q-btn
                flat
                label="Cancelar"
                @click="$router.push('/cursos')"
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
import { useCursoStore } from 'src/stores/curso'
import { validateImageFile } from 'src/utils/validators'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()
const cursoStore = useCursoStore()

const loading = ref(false)
const form = ref({
  titulo: '',
  descricao: ''
})

const capaFile = ref(null)
const capaPreview = ref(null)
const thumbnailFile = ref(null)
const thumbnailPreview = ref(null)

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

const handleThumbnailSelect = (file) => {
  if (file) {
    const validation = validateImageFile(file)
    if (!validation.valid) {
      $q.notify({
        type: 'negative',
        message: validation.error,
        position: 'top'
      })
      thumbnailFile.value = null
      thumbnailPreview.value = null
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      thumbnailPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  } else {
    thumbnailPreview.value = null
  }
}

const handleSubmit = async () => {
  loading.value = true
  try {
    const result = await cursoStore.create(form.value)
    if (result.success) {
      // Upload capa se houver
      if (capaFile.value && result.data?.id) {
        await cursoStore.uploadCapa(result.data.id, capaFile.value)
      }
      // Upload thumbnail se houver
      if (thumbnailFile.value && result.data?.id) {
        await cursoStore.uploadThumbnail(result.data.id, thumbnailFile.value)
      }
      router.push('/cursos')
    }
  } finally {
    loading.value = false
  }
}
</script>
