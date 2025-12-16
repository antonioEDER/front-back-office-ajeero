<template>
  <q-page padding>
    <div class="row q-mb-md items-center">
      <div class="col">
        <div class="text-h4">Inscritos no Evento</div>
        <div class="text-subtitle1 text-grey-7">{{ evento?.titulo || 'Evento' }}</div>
      </div>
      <div class="col-auto">
        <q-btn
          flat
          label="Voltar"
          @click="$router.push('/eventos')"
        />
      </div>
    </div>

    <q-card v-if="loading && !evento">
      <q-card-section>
        <q-spinner color="primary" size="3em" />
      </q-card-section>
    </q-card>

    <template v-else>
      <q-card class="q-mb-md">
        <q-card-section>
          <div class="row q-gutter-md items-center">
            <div class="col">
              <div class="text-h6">{{ evento?.titulo }}</div>
              <div class="text-body2 text-grey-7">
                {{ inscritos.length }} inscrito(s) | 
                Data: {{ formatDateTime(evento?.data) }} | 
                Local: {{ evento?.local }}
              </div>
            </div>
            <div class="col-auto">
              <q-btn
                color="primary"
                icon="download"
                label="Exportar CSV"
                @click="exportCSV"
                :disable="inscritos.length === 0"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card>
        <q-card-section>
          <q-table
            :rows="inscritos"
            :columns="columns"
            :loading="loading"
            :pagination="pagination"
            row-key="id"
            @request="onRequest"
            :rows-per-page-options="[10, 20, 50, 100]"
          >
            <template v-slot:body-cell-cpf="props">
              <q-td :props="props">
                {{ formatCPF(props.row.cpf) }}
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </template>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEventoStore } from 'src/stores/evento'
import { formatDate, formatDateTime, formatCPF } from 'src/utils/formatters'
import { buildPaginationParams, exportToCSV } from 'src/utils/tableHelpers'

const route = useRoute()
const router = useRouter()
const eventoStore = useEventoStore()

const eventoId = route.params.id
const loading = ref(false)
const evento = ref(null)
const inscritos = ref([])

const columns = [
  {
    name: 'name',
    label: 'Nome',
    field: 'name',
    align: 'left',
    sortable: true
  },
  {
    name: 'email',
    label: 'Email',
    field: 'email',
    align: 'left',
    sortable: true
  },
  {
    name: 'cpf',
    label: 'CPF',
    field: 'cpf',
    align: 'left'
  },
  {
    name: 'created_at',
    label: 'Data de Inscrição',
    field: 'created_at',
    align: 'left',
    format: (val) => formatDate(val),
    sortable: true
  }
]

const pagination = ref({
  page: 1,
  rowsPerPage: 20,
  rowsNumber: 0,
  sortBy: 'created_at',
  descending: true
})

const loadEvento = async () => {
  loading.value = true
  try {
    const result = await eventoStore.fetchById(eventoId)
    if (result.success) {
      evento.value = eventoStore.currentEvento
    }
  } finally {
    loading.value = false
  }
}

const loadInscritos = async () => {
  loading.value = true
  try {
    const params = buildPaginationParams(pagination.value)
    const result = await eventoStore.fetchInscritos(eventoId, params)
    if (result.success) {
      inscritos.value = eventoStore.inscritos
      pagination.value.rowsNumber = eventoStore.pagination.rowsNumber
    }
  } finally {
    loading.value = false
  }
}

const onRequest = (props) => {
  pagination.value = props.pagination
  loadInscritos()
}

const exportCSV = () => {
  const dataToExport = inscritos.value.map(inscrito => ({
    Nome: inscrito.name,
    Email: inscrito.email,
    CPF: inscrito.cpf,
    'Data de Inscrição': formatDate(inscrito.created_at)
  }))
  
  const filename = `inscritos_${evento.value?.titulo?.replace(/\s+/g, '_') || 'evento'}_${new Date().toISOString().split('T')[0]}.csv`
  exportToCSV(dataToExport, filename)
}

onMounted(() => {
  loadEvento()
  loadInscritos()
})
</script>
