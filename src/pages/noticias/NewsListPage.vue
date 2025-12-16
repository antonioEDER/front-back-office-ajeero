<template>
  <q-page padding>
    <div class="row q-mb-md items-center">
      <div class="col">
        <div class="text-h4">Notícias</div>
        <div class="text-subtitle1 text-grey-7">Gerenciar notícias do sistema</div>
      </div>
      <div class="col-auto">
        <q-btn
          color="primary"
          icon="add"
          label="Nova Notícia"
          @click="$router.push('/noticias/novo')"
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
          :rows="noticias"
          :columns="columns"
          :loading="loading"
          :pagination="pagination"
          row-key="id"
          @request="onRequest"
          :rows-per-page-options="[10, 20, 50, 100]"
        >
          <template v-slot:body-cell-imagem_url="props">
            <q-td :props="props">
              <q-avatar v-if="props.row.imagem_url" size="60px" square>
                <img :src="API_BASE_URL + props.row.imagem_url" :alt="props.row.titulo" />
              </q-avatar>
              <q-avatar v-else size="60px" square color="grey" text-color="white">
                <q-icon name="image" />
              </q-avatar>
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
                @click="viewNoticia(props.row.id)"
                class="q-mr-xs"
              />
              <q-btn
                flat
                dense
                round
                icon="edit"
                color="primary"
                @click="editNoticia(props.row.id)"
                class="q-mr-xs"
              />
              <q-btn
                flat
                dense
                round
                icon="delete"
                color="negative"
                @click="deleteNoticia(props.row.id)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <ConfirmDialog
      v-model="confirmDialog"
      title="Confirmar exclusão"
      message="Tem certeza que deseja remover esta notícia? Esta ação não pode ser desfeita."
      @confirm="confirmDelete"
    />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNoticiaStore } from 'src/stores/noticia'
import { formatDate } from 'src/utils/formatters'
import { buildPaginationParams } from 'src/utils/tableHelpers'
import SearchBar from 'src/components/common/SearchBar.vue'
import ConfirmDialog from 'src/components/common/ConfirmDialog.vue'
import { API_BASE_URL } from 'src/utils/constants'

const router = useRouter()
const noticiaStore = useNoticiaStore()

const noticias = ref([])
const loading = ref(false)
const search = ref('')
const confirmDialog = ref(false)
const deleteId = ref(null)

const columns = [
  {
    name: 'imagem_url',
    label: 'Imagem',
    field: 'imagem_url',
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
    name: 'created_at',
    label: 'Data de Criação',
    field: 'created_at',
    align: 'left',
    format: (val) => formatDate(val),
    sortable: true
  },
  {
    name: 'updated_at',
    label: 'Data de Atualização',
    field: 'updated_at',
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

const loadNoticias = async () => {
  loading.value = true
  try {
    const params = buildPaginationParams(pagination.value, {
      search: search.value || undefined
    })

    const result = await noticiaStore.fetchNoticias(params)
    if (result.success) {
      noticias.value = noticiaStore.noticias
      pagination.value.rowsNumber = noticiaStore.pagination.rowsNumber
    }
  } finally {
    loading.value = false
  }
}

const onRequest = (props) => {
  pagination.value = props.pagination
  loadNoticias()
}

const handleSearch = () => {
  pagination.value.page = 1
  loadNoticias()
}

const viewNoticia = (id) => {
  router.push(`/noticias/${id}`)
}

const editNoticia = (id) => {
  router.push(`/noticias/${id}`)
}

const deleteNoticia = (id) => {
  deleteId.value = id
  confirmDialog.value = true
}

const confirmDelete = async () => {
  if (deleteId.value) {
    const result = await noticiaStore.delete(deleteId.value)
    if (result.success) {
      loadNoticias()
    }
    deleteId.value = null
  }
}

onMounted(() => {
  loadNoticias()
})
</script>
