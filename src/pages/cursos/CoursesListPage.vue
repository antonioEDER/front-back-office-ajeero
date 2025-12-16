<template>
  <q-page padding>
    <div class="row q-mb-md items-center">
      <div class="col">
        <div class="text-h4">Cursos</div>
        <div class="text-subtitle1 text-grey-7">Gerenciar cursos do sistema</div>
      </div>
      <div class="col-auto">
        <q-btn
          color="primary"
          icon="add"
          label="Novo Curso"
          @click="$router.push('/cursos/novo')"
        />
      </div>
    </div>

    <q-card>
      <q-card-section>
        <div class="row q-gutter-md q-mb-md">
          <div class="col-12 col-sm-6 col-md-4">
            <SearchBar
              v-model="search"
              placeholder="Buscar por título..."
              @search="handleSearch"
            />
          </div>
        </div>

        <q-table
          :rows="courses"
          :columns="columns"
          :loading="loading"
          :pagination="pagination"
          row-key="id"
          @request="onRequest"
          :rows-per-page-options="[10, 20, 50, 100]"
        >
          <template v-slot:body-cell-thumbnail="props">
            <q-td :props="props">
              <q-avatar v-if="props.row.thumbnail" size="60px" square>
                <img :src="thumbnailUrl + props.row.thumbnail" :alt="props.row.titulo" />
              </q-avatar>
              <q-avatar v-else size="60px" square color="grey" text-color="white">
                <q-icon name="image" />
              </q-avatar>
            </q-td>
          </template>

          <template v-slot:body-cell-descricao="props">
            <q-td :props="props">
              <div class="text-body2" style="max-width: 300px;">
                {{ truncate(props.row.descricao || '', 100) }}
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                flat
                dense
                round
                icon="visibility"
                color="primary"
                @click="viewCourse(props.row.id)"
                class="q-mr-xs"
              />
              <q-btn
                flat
                dense
                round
                icon="edit"
                color="primary"
                @click="editCourse(props.row.id)"
                class="q-mr-xs"
              />
              <q-btn
                flat
                dense
                round
                icon="delete"
                color="negative"
                @click="deleteCourse(props.row.id)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <ConfirmDialog
      v-model="confirmDialog"
      title="Confirmar exclusão"
      message="Tem certeza que deseja remover este curso? Esta ação não pode ser desfeita."
      @confirm="confirmDelete"
    />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCursoStore } from 'src/stores/curso'
import { formatDate, truncate } from 'src/utils/formatters'
import { buildPaginationParams } from 'src/utils/tableHelpers'
import SearchBar from 'src/components/common/SearchBar.vue'
import ConfirmDialog from 'src/components/common/ConfirmDialog.vue'
import { API_BASE_URL } from 'src/utils/constants'

const thumbnailUrl = API_BASE_URL

const router = useRouter()
const cursoStore = useCursoStore()

const courses = ref([])
const loading = ref(false)
const search = ref('')
const confirmDialog = ref(false)
const deleteId = ref(null)

const columns = [
  {
    name: 'thumbnail',
    label: 'Thumbnail',
    field: 'thumbnail',
    align: 'left'
  },
  {
    name: 'titulo',
    label: 'Título',
    field: 'titulo',
    align: 'left',
    sortable: true
  },
  {
    name: 'descricao',
    label: 'Descrição',
    field: 'descricao',
    align: 'left'
  },
  {
    name: 'created_at',
    label: 'Data de Criação',
    field: 'created_at',
    align: 'left',
    format: (val) => formatDate(val),
    sortable: true
  },
  {
    name: 'actions',
    label: 'Ações',
    field: 'actions',
    align: 'center'
  }
]

const pagination = ref({
  page: 1,
  rowsPerPage: 20,
  rowsNumber: 0,
  sortBy: 'created_at',
  descending: true
})

const loadCourses = async () => {
  loading.value = true
  try {
    const params = buildPaginationParams(pagination.value, {
      search: search.value || undefined
    })

    const result = await cursoStore.fetchCourses(params)
    if (result.success) {
      courses.value = cursoStore.courses
      pagination.value.rowsNumber = cursoStore.pagination.rowsNumber
    }
  } finally {
    loading.value = false
  }
}

const onRequest = (props) => {
  pagination.value = props.pagination
  loadCourses()
}

const handleSearch = () => {
  pagination.value.page = 1
  loadCourses()
}

const viewCourse = (id) => {
  router.push(`/cursos/${id}`)
}

const editCourse = (id) => {
  router.push(`/cursos/${id}`)
}

const deleteCourse = (id) => {
  deleteId.value = id
  confirmDialog.value = true
}

const confirmDelete = async () => {
  if (deleteId.value) {
    const result = await cursoStore.delete(deleteId.value)
    if (result.success) {
      loadCourses()
    }
    deleteId.value = null
  }
}

onMounted(() => {
  loadCourses()
})
</script>
