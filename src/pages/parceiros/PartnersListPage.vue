<template>
  <q-page padding>
    <div class="row q-mb-md items-center">
      <div class="col">
        <div class="text-h4">Parceiros</div>
        <div class="text-subtitle1 text-grey-7">Gerenciar parceiros do sistema</div>
      </div>
      <div class="col-auto">
        <q-btn
          color="primary"
          icon="add"
          label="Novo Parceiro"
          @click="$router.push('/parceiros/novo')"
        />
      </div>
    </div>

    <q-card>
      <q-card-section>
        <div class="row q-gutter-md q-mb-md">
          <div class="col-12 col-sm-6 col-md-4">
            <SearchBar
              v-model="search"
              placeholder="Buscar por nome..."
              @search="handleSearch"
            />
          </div>
        </div>

        <q-table
          :rows="parceiros"
          :columns="columns"
          :loading="loading"
          :pagination="pagination"
          row-key="id"
          @request="onRequest"
          :rows-per-page-options="[10, 20, 50, 100]"
        >
          <template v-slot:body-cell-logo="props">
            <q-td :props="props">
              <q-avatar v-if="props.row.logo" size="60px" square>
                <img :src="getLogoUrl(props.row.logo)" :alt="props.row.nome" />
              </q-avatar>
              <q-avatar v-else size="60px" square color="grey" text-color="white">
                <q-icon name="business" />
              </q-avatar>
            </q-td>
          </template>

          <template v-slot:body-cell-descricao="props">
            <q-td :props="props">
              <div class="text-body2" style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                {{ props.row.descricao || '-' }}
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-beneficios_count="props">
            <q-td :props="props" class="text-center">
              <q-badge 
                color="primary" 
                :label="props.row.beneficios_count || props.row.beneficios?.length || 0" 
              />
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
                @click="editParceiro(props.row.id)"
                class="q-mr-xs"
              />
              <q-btn
                flat
                dense
                round
                icon="card_giftcard"
                color="info"
                @click="viewBeneficios(props.row.id)"
                class="q-mr-xs"
              />
              <q-btn
                flat
                dense
                round
                icon="delete"
                color="negative"
                @click="deleteParceiro(props.row.id)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <ConfirmDialog
      v-model="confirmDialog"
      title="Confirmar exclusão"
      message="Tem certeza que deseja remover este parceiro? Esta ação não pode ser desfeita."
      @confirm="confirmDelete"
    />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useParceiroStore } from 'src/stores/parceiro'
import { formatDate } from 'src/utils/formatters'
import { buildPaginationParams } from 'src/utils/tableHelpers'
import SearchBar from 'src/components/common/SearchBar.vue'
import ConfirmDialog from 'src/components/common/ConfirmDialog.vue'
import { API_BASE_URL } from 'src/utils/constants'

const router = useRouter()
const parceiroStore = useParceiroStore()

const parceiros = ref([])
const loading = ref(false)
const search = ref('')
const confirmDialog = ref(false)
const deleteId = ref(null)

const columns = [
  {
    name: 'logo',
    label: 'Logo',
    field: 'logo',
    align: 'left'
  },
  {
    name: 'nome',
    label: 'Nome',
    field: 'nome',
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
    name: 'beneficios_count',
    label: 'Benefícios',
    field: 'beneficios_count',
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
  sortBy: 'nome',
  descending: false
})

const getLogoUrl = (logo) => {
  if (!logo) return null
  // Se já é uma URL completa, retorna direto
  if (logo.startsWith('http://') || logo.startsWith('https://')) {
    return logo
  }
  // Se é base64, retorna direto
  if (logo.startsWith('data:')) {
    return logo
  }
  // Caso contrário, adiciona API_BASE_URL
  return API_BASE_URL + logo
}

const loadParceiros = async () => {
  loading.value = true
  try {
    const params = buildPaginationParams(pagination.value, {
      search: search.value || undefined
    })

    const result = await parceiroStore.fetchParceiros(params)
    if (result.success) {
      parceiros.value = parceiroStore.parceiros
      pagination.value.rowsNumber = parceiroStore.pagination.rowsNumber
    }
  } finally {
    loading.value = false
  }
}

const onRequest = (props) => {
  pagination.value = props.pagination
  loadParceiros()
}

const handleSearch = () => {
  pagination.value.page = 1
  loadParceiros()
}

const editParceiro = (id) => {
  router.push(`/parceiros/${id}/editar`)
}

const viewBeneficios = (id) => {
  router.push(`/parceiros/${id}/beneficios`)
}

const deleteParceiro = (id) => {
  deleteId.value = id
  confirmDialog.value = true
}

const confirmDelete = async () => {
  if (deleteId.value) {
    const result = await parceiroStore.delete(deleteId.value)
    if (result.success) {
      loadParceiros()
    }
    deleteId.value = null
  }
}

onMounted(() => {
  loadParceiros()
})
</script>
