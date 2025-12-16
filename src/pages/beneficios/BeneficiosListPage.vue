<template>
  <q-page padding>
    <div class="row q-mb-md items-center">
      <div class="col">
        <div class="text-h4">Benefícios</div>
        <div class="text-subtitle1 text-grey-7">Gerenciar benefícios de parceiros</div>
      </div>
      <div class="col-auto">
        <q-btn
          color="primary"
          icon="add"
          label="Novo Benefício"
          @click="$router.push('/beneficios/novo')"
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
          <div class="col-12 col-sm-6 col-md-3">
            <q-select
              v-model="parceiroFilter"
              :options="parceiroOptions"
              label="Filtrar por parceiro"
              outlined
              dense
              clearable
              emit-value
              map-options
              @update:model-value="loadBeneficios"
              :loading="loadingParceiros"
            />
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <q-select
              v-model="tipoFilter"
              :options="tipoOptions"
              label="Filtrar por tipo"
              outlined
              dense
              clearable
              emit-value
              map-options
              @update:model-value="loadBeneficios"
            />
          </div>
        </div>

        <q-table
          :rows="beneficios"
          :columns="columns"
          :loading="loading"
          :pagination="pagination"
          row-key="id"
          @request="onRequest"
          :rows-per-page-options="[10, 20, 50, 100]"
        >
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                flat
                dense
                round
                icon="visibility"
                color="primary"
                @click="viewBeneficio(props.row.id)"
                class="q-mr-xs"
              />
              <q-btn
                flat
                dense
                round
                icon="edit"
                color="primary"
                @click="editBeneficio(props.row.id)"
                class="q-mr-xs"
              />
              <q-btn
                flat
                dense
                round
                icon="delete"
                color="negative"
                @click="deleteBeneficio(props.row.id)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <ConfirmDialog
      v-model="confirmDialog"
      title="Confirmar exclusão"
      message="Tem certeza que deseja remover este benefício? Esta ação não pode ser desfeita."
      @confirm="confirmDelete"
    />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBeneficioStore } from 'src/stores/beneficio'
import { useParceiroStore } from 'src/stores/parceiro'
import { formatDate, truncate } from 'src/utils/formatters'
import { buildPaginationParams } from 'src/utils/tableHelpers'
import SearchBar from 'src/components/common/SearchBar.vue'
import ConfirmDialog from 'src/components/common/ConfirmDialog.vue'
import { BENEFICIO_TYPES } from 'src/utils/constants'

const router = useRouter()
const beneficioStore = useBeneficioStore()
const parceiroStore = useParceiroStore()

const beneficios = ref([])
const loading = ref(false)
const loadingParceiros = ref(false)
const search = ref('')
const parceiroFilter = ref(null)
const tipoFilter = ref(null)
const confirmDialog = ref(false)
const deleteId = ref(null)
const parceiroOptions = ref([])

const tipoOptions = Object.values(BENEFICIO_TYPES).map(tipo => ({
  label: tipo,
  value: tipo
}))

const columns = [
  {
    name: 'titulo',
    label: 'Título',
    field: 'titulo',
    align: 'left',
    sortable: true
  },
  {
    name: 'parceiro_nome',
    label: 'Parceiro',
    field: 'parceiro_nome',
    align: 'left'
  },
  {
    name: 'tipo',
    label: 'Tipo',
    field: 'tipo',
    align: 'left'
  },
  {
    name: 'descricao',
    label: 'Descrição',
    field: 'descricao',
    align: 'left',
    format: (val) => truncate(val || '', 50)
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

const loadParceiros = async () => {
  loadingParceiros.value = true
  try {
    const result = await parceiroStore.fetchParceiros({ limit: 1000 })
    if (result.success) {
      parceiroOptions.value = parceiroStore.parceiros.map(p => ({
        label: p.nome,
        value: p.id
      }))
    }
  } finally {
    loadingParceiros.value = false
  }
}

const loadBeneficios = async () => {
  loading.value = true
  try {
    const params = buildPaginationParams(pagination.value, {
      search: search.value || undefined,
      parceiro_id: parceiroFilter.value || undefined,
      tipo: tipoFilter.value || undefined
    })

    const result = await beneficioStore.fetchBeneficios(params)
    if (result.success) {
      beneficios.value = beneficioStore.beneficios
      pagination.value.rowsNumber = beneficioStore.pagination.rowsNumber
    }
  } finally {
    loading.value = false
  }
}

const onRequest = (props) => {
  pagination.value = props.pagination
  loadBeneficios()
}

const handleSearch = () => {
  pagination.value.page = 1
  loadBeneficios()
}

const viewBeneficio = (id) => {
  router.push(`/beneficios/${id}`)
}

const editBeneficio = (id) => {
  router.push(`/beneficios/${id}`)
}

const deleteBeneficio = (id) => {
  deleteId.value = id
  confirmDialog.value = true
}

const confirmDelete = async () => {
  if (deleteId.value) {
    const result = await beneficioStore.delete(deleteId.value)
    if (result.success) {
      loadBeneficios()
    }
    deleteId.value = null
  }
}

onMounted(() => {
  loadParceiros()
  loadBeneficios()
})
</script>

