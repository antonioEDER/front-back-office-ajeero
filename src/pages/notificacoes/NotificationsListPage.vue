<template>
  <q-page padding>
    <div class="row q-mb-md items-center">
      <div class="col">
        <div class="text-h4">Notificações</div>
        <div class="text-subtitle1 text-grey-7">Gerenciar notificações do sistema</div>
      </div>
      <div class="col-auto">
        <q-btn
          color="primary"
          icon="add"
          label="Nova Notificação"
          @click="$router.push('/notificacoes/nova')"
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
              v-model="statusFilter"
              :options="statusOptions"
              label="Filtrar por status"
              outlined
              dense
              clearable
              emit-value
              map-options
              @update:model-value="loadNotificacoes"
            />
          </div>
        </div>

        <q-table
          :rows="notificacoes"
          :columns="columns"
          :loading="loading"
          :pagination="pagination"
          row-key="id"
          @request="onRequest"
          :rows-per-page-options="[10, 20, 50, 100]"
        >
          <template v-slot:body-cell-mensagem="props">
            <q-td :props="props">
              <div class="text-body2" style="max-width: 300px;">
                {{ truncate(props.row.mensagem || '', 100) }}
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-destinatario="props">
            <q-td :props="props">
              <q-badge v-if="props.row.associado_id" color="info">
                Associado específico
              </q-badge>
              <q-badge v-else color="primary">
                Todos os associados
              </q-badge>
            </q-td>
          </template>

          <template v-slot:body-cell-lido="props">
            <q-td :props="props">
              <q-badge :color="props.row.lido ? 'positive' : 'warning'">
                {{ props.row.lido ? 'Lido' : 'Não lido' }}
              </q-badge>
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
                @click="viewNotificacao(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Dialog para visualizar notificação -->
    <q-dialog v-model="showViewDialog">
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">{{ selectedNotificacao?.titulo }}</div>
        </q-card-section>

        <q-card-section>
          <div class="text-body1 q-mb-md">
            <strong>Mensagem:</strong><br />
            {{ selectedNotificacao?.mensagem }}
          </div>
          <div class="text-body2 text-grey-7">
            <strong>Destinatário:</strong> 
            {{ selectedNotificacao?.associado_id ? 'Associado específico' : 'Todos os associados' }}
          </div>
          <div class="text-body2 text-grey-7">
            <strong>Status:</strong> 
            {{ selectedNotificacao?.lido ? 'Lido' : 'Não lido' }}
          </div>
          <div class="text-body2 text-grey-7">
            <strong>Enviado em:</strong> 
            {{ formatDateTime(selectedNotificacao?.enviado_em) }}
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Fechar" @click="showViewDialog = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificacaoStore } from 'src/stores/notificacao'
import { formatDate, formatDateTime, truncate } from 'src/utils/formatters'
import { buildPaginationParams } from 'src/utils/tableHelpers'
import SearchBar from 'src/components/common/SearchBar.vue'

const router = useRouter()
const notificacaoStore = useNotificacaoStore()

const notificacoes = ref([])
const loading = ref(false)
const search = ref('')
const statusFilter = ref(null)
const showViewDialog = ref(false)
const selectedNotificacao = ref(null)

const statusOptions = [
  { label: 'Lido', value: true },
  { label: 'Não lido', value: false }
]

const columns = [
  {
    name: 'titulo',
    label: 'Título',
    field: 'titulo',
    align: 'left',
    sortable: true
  },
  {
    name: 'mensagem',
    label: 'Mensagem',
    field: 'mensagem',
    align: 'left'
  },
  {
    name: 'destinatario',
    label: 'Destinatário',
    field: 'destinatario',
    align: 'center'
  },
  {
    name: 'lido',
    label: 'Status',
    field: 'lido',
    align: 'center'
  },
  {
    name: 'enviado_em',
    label: 'Data de Envio',
    field: 'enviado_em',
    align: 'left',
    format: (val) => formatDateTime(val),
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
  sortBy: 'enviado_em',
  descending: true
})

const loadNotificacoes = async () => {
  loading.value = true
  try {
    const params = buildPaginationParams(pagination.value, {
      search: search.value || undefined,
      lido: statusFilter.value !== null ? statusFilter.value : undefined
    })

    const result = await notificacaoStore.fetchNotificacoes(params)
    if (result.success) {
      notificacoes.value = notificacaoStore.notificacoes
      pagination.value.rowsNumber = notificacaoStore.pagination.rowsNumber
    }
  } finally {
    loading.value = false
  }
}

const onRequest = (props) => {
  pagination.value = props.pagination
  loadNotificacoes()
}

const handleSearch = () => {
  pagination.value.page = 1
  loadNotificacoes()
}

const viewNotificacao = (notificacao) => {
  selectedNotificacao.value = notificacao
  showViewDialog.value = true
}

onMounted(() => {
  loadNotificacoes()
})
</script>
