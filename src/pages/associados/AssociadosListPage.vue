<template>
  <q-page padding>
    <div class="row q-mb-md items-center">
      <div class="col">
        <div class="text-h4">Associados</div>
        <div class="text-subtitle1 text-grey-7">Gerenciar associados do sistema</div>
      </div>
      <div class="col-auto">
        <q-btn
          color="primary"
          icon="add"
          label="Novo Associado"
          @click="$router.push('/associados/novo')"
        />
      </div>
    </div>

    <q-card>
      <q-card-section>
        <div class="row q-gutter-md q-mb-md">
          <div class="col-12 col-sm-6 col-md-4">
            <SearchBar
              v-model="search"
              placeholder="Buscar por nome, CPF ou email..."
              @search="handleSearch"
            />
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <q-select
              v-model="statusFilter"
              :options="statusOptions"
              label="Filtrar por status"
              outlined
              dense
              clearable
              emit-value
              map-options
              @update:model-value="loadAssociados"
            />
          </div>
        </div>

        <q-table
          :rows="associados"
          :columns="columns"
          :loading="loading"
          :pagination="pagination"
          row-key="id"
          @request="onRequest"
          :rows-per-page-options="[10, 20, 50, 100]"
        >
          <template v-slot:body-cell-photo="props">
            <q-td :props="props">
              <q-avatar v-if="props.row.photo_url" size="40px">
                <img :src="props.row.photo_url" :alt="props.row.name" />
              </q-avatar>
              <q-avatar v-else size="40px" color="grey" text-color="white">
                <q-icon name="person" />
              </q-avatar>
            </q-td>
          </template>

          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <StatusBadge :status="props.row.status" />
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                flat
                dense
                round
                icon="edit"
                color="primary"
                @click="editAssociado(props.row.id)"
                class="q-mr-xs"
              />
              <q-btn
                v-if="props.row.status === 'active'"
                flat
                dense
                round
                icon="block"
                color="negative"
                @click="deactivateAssociado(props.row.id)"
                class="q-mr-xs"
              />
              <q-btn
                v-else
                flat
                dense
                round
                icon="check_circle"
                color="positive"
                @click="activateAssociado(props.row.id)"
                class="q-mr-xs"
              />
              <q-btn
                flat
                dense
                round
                icon="delete"
                color="negative"
                @click="deleteAssociado(props.row.id)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <ConfirmDialog
      v-model="confirmDialog"
      title="Confirmar exclusão"
      message="Tem certeza que deseja remover este associado? Esta ação não pode ser desfeita."
      @confirm="confirmDelete"
    />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAssociadoStore } from 'src/stores/associado'
import { formatDate, formatCPF, formatPhone } from 'src/utils/formatters'
import { buildPaginationParams } from 'src/utils/tableHelpers'
import SearchBar from 'src/components/common/SearchBar.vue'
import StatusBadge from 'src/components/common/StatusBadge.vue'
import ConfirmDialog from 'src/components/common/ConfirmDialog.vue'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()
const associadoStore = useAssociadoStore()

const associados = ref([])
const loading = ref(false)
const search = ref('')
const statusFilter = ref(null)
const confirmDialog = ref(false)
const deleteId = ref(null)

const statusOptions = [
  { label: 'Ativo', value: 'active' },
  { label: 'Inativo', value: 'inactive' }
]

const columns = [
  {
    name: 'photo',
    label: 'Foto',
    field: 'photo',
    align: 'left'
  },
  {
    name: 'name',
    label: 'Nome',
    field: 'name',
    align: 'left',
    sortable: true
  },
  {
    name: 'cpf',
    label: 'CPF',
    field: 'cpf',
    align: 'left',
    format: (val) => formatCPF(val)
  },
  {
    name: 'email',
    label: 'Email',
    field: 'email',
    align: 'left'
  },
  {
    name: 'phone',
    label: 'Telefone',
    field: 'phone',
    align: 'left',
    format: (val) => formatPhone(val)
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    align: 'center'
  },
  {
    name: 'created_at',
    label: 'Data de Cadastro',
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

const loadAssociados = async () => {
  loading.value = true
  try {
    const params = buildPaginationParams(pagination.value, {
      search: search.value || undefined,
      status: statusFilter.value || undefined
    })
    
    const result = await associadoStore.fetchAssociados(params)
    if (result.success) {
      associados.value = associadoStore.associados
      pagination.value.rowsNumber = associadoStore.pagination.rowsNumber
    }
  } finally {
    loading.value = false
  }
}

const onRequest = (props) => {
  pagination.value = props.pagination
  loadAssociados()
}

const handleSearch = () => {
  pagination.value.page = 1
  loadAssociados()
}

const editAssociado = (id) => {
  router.push(`/associados/${id}`)
}

const activateAssociado = async (id) => {
  const result = await associadoStore.activate(id)
  if (result.success) {
    loadAssociados()
  }
}

const deactivateAssociado = async (id) => {
  const result = await associadoStore.deactivate(id)
  if (result.success) {
    loadAssociados()
  }
}

const deleteAssociado = (id) => {
  deleteId.value = id
  confirmDialog.value = true
}

const confirmDelete = async () => {
  if (deleteId.value) {
    const result = await associadoStore.delete(deleteId.value)
    if (result.success) {
      loadAssociados()
    }
    deleteId.value = null
  }
}

onMounted(() => {
  loadAssociados()
})
</script>

