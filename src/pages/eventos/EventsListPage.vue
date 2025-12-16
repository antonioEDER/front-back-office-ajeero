<template>
  <q-page padding>
    <div class="row q-mb-md items-center">
      <div class="col">
        <div class="text-h4">Eventos</div>
        <div class="text-subtitle1 text-grey-7">Gerenciar eventos do sistema</div>
      </div>
      <div class="col-auto">
        <q-btn
          color="primary"
          icon="add"
          label="Novo Evento"
          @click="$router.push('/eventos/novo')"
        />
      </div>
    </div>

    <q-card>
      <q-card-section>
        <div class="row q-gutter-md q-mb-md">
          <div class="col-12 col-sm-6 col-md-4">
            <SearchBar
              v-model="search"
              placeholder="Buscar por título ou local..."
              @search="handleSearch"
            />
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <q-input
              v-model="dataFilter"
              label="Filtrar por data"
              type="date"
              outlined
              dense
              clearable
              @update:model-value="loadEventos"
            />
          </div>
        </div>

        <q-table
          :rows="eventos"
          :columns="columns"
          :loading="loading"
          :pagination="pagination"
          row-key="id"
          @request="onRequest"
          :rows-per-page-options="[10, 20, 50, 100]"
        >
          <template v-slot:body-cell-capa="props">
            <q-td :props="props">
              <q-avatar v-if="props.row.capa" size="60px" square>
                <img :src="capaUrl + props.row.capa" :alt="props.row.titulo" />
              </q-avatar>
              <q-avatar v-else size="60px" square color="grey" text-color="white">
                <q-icon name="image" />
              </q-avatar>
            </q-td>
          </template>

          <template v-slot:body-cell-data="props">
            <q-td :props="props">
              {{ formatDateTime(props.row.data) }}
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
                @click="viewEvento(props.row.id)"
                class="q-mr-xs"
              />
              <q-btn
                flat
                dense
                round
                icon="edit"
                color="primary"
                @click="editEvento(props.row.id)"
                class="q-mr-xs"
              />
              <q-btn
                flat
                dense
                round
                icon="people"
                color="info"
                @click="viewInscritos(props.row.id)"
                class="q-mr-xs"
              />
              <q-btn
                flat
                dense
                round
                icon="delete"
                color="negative"
                @click="deleteEvento(props.row.id)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <ConfirmDialog
      v-model="confirmDialog"
      title="Confirmar exclusão"
      message="Tem certeza que deseja remover este evento? Esta ação não pode ser desfeita."
      @confirm="confirmDelete"
    />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEventoStore } from 'src/stores/evento'
import { formatDate, formatDateTime } from 'src/utils/formatters'
import { buildPaginationParams } from 'src/utils/tableHelpers'
import SearchBar from 'src/components/common/SearchBar.vue'
import ConfirmDialog from 'src/components/common/ConfirmDialog.vue'
import { API_BASE_URL } from 'src/utils/constants'

const capaUrl = API_BASE_URL

const router = useRouter()
const eventoStore = useEventoStore()

const eventos = ref([])
const loading = ref(false)
const search = ref('')
const dataFilter = ref(null)
const confirmDialog = ref(false)
const deleteId = ref(null)

const columns = [
  {
    name: 'capa',
    label: 'Capa',
    field: 'capa',
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
    name: 'data',
    label: 'Data',
    field: 'data',
    align: 'left',
    sortable: true
  },
  {
    name: 'local',
    label: 'Local',
    field: 'local',
    align: 'left'
  },
  {
    name: 'total_inscritos',
    label: 'Inscritos',
    field: 'total_inscritos',
    align: 'center'
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
  sortBy: 'data',
  descending: false
})

const loadEventos = async () => {
  loading.value = true
  try {
    const params = buildPaginationParams(pagination.value, {
      search: search.value || undefined,
      data: dataFilter.value || undefined
    })

    const result = await eventoStore.fetchEventos(params)
    if (result.success) {
      eventos.value = eventoStore.eventos
      pagination.value.rowsNumber = eventoStore.pagination.rowsNumber
    }
  } finally {
    loading.value = false
  }
}

const onRequest = (props) => {
  pagination.value = props.pagination
  loadEventos()
}

const handleSearch = () => {
  pagination.value.page = 1
  loadEventos()
}

const viewEvento = (id) => {
  router.push(`/eventos/${id}`)
}

const editEvento = (id) => {
  router.push(`/eventos/${id}`)
}

const viewInscritos = (id) => {
  router.push(`/eventos/${id}/inscritos`)
}

const deleteEvento = (id) => {
  deleteId.value = id
  confirmDialog.value = true
}

const confirmDelete = async () => {
  if (deleteId.value) {
    const result = await eventoStore.delete(deleteId.value)
    if (result.success) {
      loadEventos()
    }
    deleteId.value = null
  }
}

onMounted(() => {
  loadEventos()
})
</script>
