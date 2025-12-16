<template>
  <q-page padding>
    <div class="row q-mb-md items-center">
      <div class="col">
        <div class="text-h4">Gerenciar Aulas</div>
        <div class="text-subtitle1 text-grey-7">{{ course?.titulo || 'Curso' }}</div>
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

    <template v-else>
      <q-card class="q-mb-md">
        <q-card-section>
          <div class="row q-gutter-md items-center">
            <div class="col">
              <div class="text-h6">{{ course?.titulo }}</div>
              <div class="text-body2 text-grey-7">{{ lessons.length }} aula(s) cadastrada(s)</div>
            </div>
            <div class="col-auto">
              <q-btn
                color="primary"
                icon="add"
                label="Nova Aula"
                @click="showLessonDialog = true"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card>
        <q-card-section>
          <q-list v-if="lessons.length > 0" separator>
            <q-item
              v-for="lesson in sortedLessons"
              :key="lesson.id"
              class="q-pa-md"
            >
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white">
                  {{ lesson.ordem }}
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ lesson.titulo }}</q-item-label>
                <q-item-label caption>{{ lesson.descricao || 'Sem descrição' }}</q-item-label>
                <q-item-label caption>
                  <q-icon name="link" size="xs" />
                  <a :href="lesson.link_youtube" target="_blank" class="text-primary">
                    {{ lesson.link_youtube }}
                  </a>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  flat
                  dense
                  round
                  icon="edit"
                  color="primary"
                  @click="editLesson(lesson)"
                  class="q-mr-xs"
                />
                <q-btn
                  flat
                  dense
                  round
                  icon="delete"
                  color="negative"
                  @click="deleteLesson(lesson.id)"
                />
              </q-item-section>
            </q-item>
          </q-list>
          <div v-else class="text-center q-pa-lg text-grey-7">
            Nenhuma aula cadastrada. Clique em "Nova Aula" para adicionar.
          </div>
        </q-card-section>
      </q-card>

      <!-- Dialog para criar/editar aula -->
      <q-dialog v-model="showLessonDialog" persistent>
        <q-card style="min-width: 500px">
          <q-card-section>
            <div class="text-h6">{{ editingLesson ? 'Editar Aula' : 'Nova Aula' }}</div>
          </q-card-section>

          <q-card-section>
            <q-form @submit="saveLesson" class="q-gutter-md">
              <q-input
                v-model="lessonForm.titulo"
                label="Título *"
                outlined
                :rules="[val => !!val || 'Título é obrigatório']"
              />

              <q-input
                v-model="lessonForm.descricao"
                label="Descrição"
                type="textarea"
                outlined
                rows="3"
              />

              <q-input
                v-model="lessonForm.link_youtube"
                label="Link do YouTube *"
                outlined
                hint="URL completa do vídeo do YouTube"
                :rules="[
                  val => !!val || 'Link do YouTube é obrigatório',
                  val => isValidUrl(val) || 'URL inválida'
                ]"
              />

              <q-input
                v-model.number="lessonForm.ordem"
                label="Ordem *"
                type="number"
                outlined
                hint="Número da ordem da aula (mínimo: 1)"
                :rules="[
                  val => !!val || 'Ordem é obrigatória',
                  val => val >= 1 || 'Ordem deve ser no mínimo 1'
                ]"
              />

              <q-card-actions align="right">
                <q-btn
                  flat
                  label="Cancelar"
                  @click="closeLessonDialog"
                />
                <q-btn
                  type="submit"
                  color="primary"
                  label="Salvar"
                  :loading="savingLesson"
                />
              </q-card-actions>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>

      <ConfirmDialog
        v-model="confirmDialog"
        title="Confirmar exclusão"
        message="Tem certeza que deseja remover esta aula? Esta ação não pode ser desfeita."
        @confirm="confirmDelete"
      />
    </template>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCursoStore } from 'src/stores/curso'
import ConfirmDialog from 'src/components/common/ConfirmDialog.vue'

const route = useRoute()
const router = useRouter()
const cursoStore = useCursoStore()

const courseId = route.params.id
const loading = ref(false)
const course = ref(null)
const lessons = ref([])
const showLessonDialog = ref(false)
const editingLesson = ref(null)
const savingLesson = ref(false)
const confirmDialog = ref(false)
const deleteId = ref(null)

const lessonForm = ref({
  titulo: '',
  descricao: '',
  link_youtube: '',
  ordem: 1
})

const sortedLessons = computed(() => {
  return [...lessons.value].sort((a, b) => a.ordem - b.ordem)
})

const isValidUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

const loadCourse = async () => {
  loading.value = true
  try {
    const result = await cursoStore.fetchById(courseId)
    if (result.success) {
      course.value = cursoStore.currentCourse
      lessons.value = course.value.lessons || []
    }
  } finally {
    loading.value = false
  }
}

const editLesson = (lesson) => {
  editingLesson.value = lesson
  lessonForm.value = {
    titulo: lesson.titulo || '',
    descricao: lesson.descricao || '',
    link_youtube: lesson.link_youtube || '',
    ordem: lesson.ordem || 1
  }
  showLessonDialog.value = true
}

const closeLessonDialog = () => {
  showLessonDialog.value = false
  editingLesson.value = null
  lessonForm.value = {
    titulo: '',
    descricao: '',
    link_youtube: '',
    ordem: 1
  }
}

const saveLesson = async () => {
  savingLesson.value = true
  try {
    const data = {
      curso_id: courseId,
      ...lessonForm.value
    }

    let result
    if (editingLesson.value) {
      result = await cursoStore.updateLesson(editingLesson.value.id, data)
    } else {
      result = await cursoStore.createLesson(data)
    }

    if (result.success) {
      closeLessonDialog()
      loadCourse()
    }
  } finally {
    savingLesson.value = false
  }
}

const deleteLesson = (id) => {
  deleteId.value = id
  confirmDialog.value = true
}

const confirmDelete = async () => {
  if (deleteId.value) {
    const result = await cursoStore.deleteLesson(deleteId.value)
    if (result.success) {
      loadCourse()
    }
    deleteId.value = null
  }
}

onMounted(() => {
  loadCourse()
})
</script>
