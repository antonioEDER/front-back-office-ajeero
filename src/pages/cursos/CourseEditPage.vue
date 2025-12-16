<template>
  <q-page padding>
    <div class="row q-mb-md items-center">
      <div class="col">
        <div class="text-h4">Editar Curso</div>
        <div class="text-subtitle1 text-grey-7">Editar informações do curso</div>
      </div>
      <div class="col-auto">
        <q-btn
          flat
          label="Voltar"
          @click="$router.push('/cursos')"
        />
      </div>
    </div>

    <q-card v-if="loading && !course">
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
              <div class="text-h6 q-mb-md">Capa do Curso</div>
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
            <div class="col-12 col-md-6">
              <div class="text-h6 q-mb-md">Thumbnail do Curso</div>
              <div class="row q-gutter-md items-center">
                <div class="col-auto">
                  <q-avatar v-if="thumbnailImageUrl" size="100px">
                    <img :src="thumbnailImageUrl" alt="Preview Thumbnail" />
                  </q-avatar>
                  <q-avatar v-else size="100px" color="grey" text-color="white">
                    <q-icon name="image" size="50px" />
                  </q-avatar>
                </div>
                <div class="col">
                  <q-file
                    v-model="thumbnailFile"
                    label="Selecionar novo thumbnail"
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
                label="Salvar Alterações"
                :loading="saving"
                icon="save"
              />
              <q-btn
                flat
                label="Cancelar"
                @click="$router.push('/cursos')"
                class="q-ml-sm"
              />
              <q-btn
                flat
                color="primary"
                label="Gerenciar Aulas"
                icon="play_lesson"
                @click="$router.push(`/cursos/${courseId}/aulas`)"
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
import { useCursoStore } from 'src/stores/curso'
import { validateImageFile } from 'src/utils/validators'
import { useQuasar } from 'quasar'
import { API_BASE_URL } from 'src/utils/constants'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const cursoStore = useCursoStore()

const courseId = route.params.id
const loading = ref(false)
const saving = ref(false)
const course = ref(null)
const form = ref({
  titulo: '',
  descricao: ''
})

const capaFile = ref(null)
const capaPreview = ref(null)
const currentCapa = ref(null)
const thumbnailFile = ref(null)
const thumbnailPreview = ref(null)
const currentThumbnail = ref(null)

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

// Computed para URL do thumbnail: prioriza preview local, senão adiciona API_BASE_URL se vier da lista
const thumbnailImageUrl = computed(() => {
  if (thumbnailPreview.value) {
    // Nova seleção local - usar preview
    return thumbnailPreview.value
  }
  if (currentThumbnail.value) {
    // Imagem da lista - adicionar API_BASE_URL
    return API_BASE_URL + currentThumbnail.value
  }
  return null
})

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

const loadCourse = async () => {
  loading.value = true
  try {
    const result = await cursoStore.fetchById(courseId)
    if (result.success) {
      course.value = cursoStore.currentCourse
      form.value = {
        titulo: course.value.titulo || '',
        descricao: course.value.descricao || ''
      }
      currentCapa.value = course.value.capa || null
      currentThumbnail.value = course.value.thumbnail || null
    }
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  saving.value = true
  try {
    const result = await cursoStore.update(courseId, form.value)
    if (result.success) {
      // Upload capa se houver
      if (capaFile.value) {
        await cursoStore.uploadCapa(courseId, capaFile.value)
      }
      // Upload thumbnail se houver
      if (thumbnailFile.value) {
        await cursoStore.uploadThumbnail(courseId, thumbnailFile.value)
      }
      router.push('/cursos')
    }
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadCourse()
})
</script>
