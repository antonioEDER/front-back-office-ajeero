<template>
  <q-page padding>
    <div class="row q-mb-md items-center">
      <div class="col">
        <div class="text-h4">Gerenciar Benefícios</div>
        <div class="text-subtitle1 text-grey-7" v-if="parceiro">
          Parceiro: {{ parceiro.nome }}
        </div>
      </div>
      <div class="col-auto">
        <q-btn
          flat
          label="Voltar"
          @click="$router.push('/parceiros')"
          class="q-mr-sm"
        />
        <q-btn
          color="primary"
          icon="add"
          label="Adicionar Benefício"
          @click="openBeneficioModal()"
        />
      </div>
    </div>

    <q-card v-if="loading && !parceiro" class="q-mb-md">
      <q-card-section>
        <q-spinner color="primary" size="3em" />
      </q-card-section>
    </q-card>

    <q-card v-else class="q-mb-md">
      <q-card-section v-if="parceiro">
        <div class="row items-center q-gutter-md">
          <div class="col-auto" v-if="parceiro.logo">
            <q-avatar size="80px" square>
              <img :src="getLogoUrl(parceiro.logo)" :alt="parceiro.nome" />
            </q-avatar>
          </div>
          <div class="col">
            <div class="text-h6">{{ parceiro.nome }}</div>
            <div class="text-body2 text-grey-7" v-if="parceiro.descricao">
              {{ parceiro.descricao }}
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card>
      <q-card-section>
        <q-table
          :rows="beneficios"
          :columns="columns"
          :loading="loading"
          row-key="id"
          :rows-per-page-options="[10, 20, 50]"
        >
          <template v-slot:body-cell-tipo="props">
            <q-td :props="props">
              <q-badge :color="getTipoColor(props.row.tipo)" :label="props.row.tipo" />
            </q-td>
          </template>

          <template v-slot:body-cell-descricao="props">
            <q-td :props="props">
              <div class="text-body2" style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                {{ props.row.descricao || '-' }}
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-regra_uso="props">
            <q-td :props="props">
              <div class="text-body2" style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                {{ props.row.regra_uso || '-' }}
              </div>
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
                @click="openBeneficioModal(props.row)"
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

          <template v-slot:no-data>
            <div class="full-width row flex-center text-grey-6 q-gutter-sm q-pa-lg">
              <q-icon name="card_giftcard" size="2em" />
              <span>Nenhum benefício cadastrado para este parceiro</span>
            </div>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Modal de Benefício -->
    <q-dialog v-model="beneficioModal" persistent>
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">{{ isEditBeneficio ? 'Editar Benefício' : 'Novo Benefício' }}</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="handleBeneficioSubmit" class="q-gutter-md">
            <q-input
              v-model="beneficioForm.titulo"
              label="Título *"
              outlined
              :rules="[val => !!val || 'Título é obrigatório', val => val.length >= 3 || 'Título deve ter no mínimo 3 caracteres']"
            />

            <q-select
              v-model="beneficioForm.tipo"
              :options="tipoOptions"
              label="Tipo *"
              outlined
              :rules="[val => !!val || 'Tipo é obrigatório']"
            />

            <q-input
              v-model="beneficioForm.descricao"
              label="Descrição"
              type="textarea"
              outlined
              rows="3"
            />

            <q-input
              v-model="beneficioForm.regra_uso"
              label="Regra de Uso"
              type="textarea"
              outlined
              rows="3"
            />

            <q-card-actions align="right">
              <q-btn
                flat
                label="Cancelar"
                @click="closeBeneficioModal"
              />
              <q-btn
                type="submit"
                color="primary"
                label="Salvar"
                :loading="savingBeneficio"
              />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

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
import { useRoute, useRouter } from 'vue-router'
import { useParceiroStore } from 'src/stores/parceiro'
import { formatDate } from 'src/utils/formatters'
import ConfirmDialog from 'src/components/common/ConfirmDialog.vue'
import { API_BASE_URL } from 'src/utils/constants'

const route = useRoute()
const router = useRouter()
const parceiroStore = useParceiroStore()

const parceiroId = route.params.id
const loading = ref(false)
const parceiro = ref(null)
const beneficios = ref([])
const beneficioModal = ref(false)
const isEditBeneficio = ref(false)
const savingBeneficio = ref(false)
const confirmDialog = ref(false)
const deleteId = ref(null)

const tipoOptions = ['desconto', 'cashback', 'brinde', 'outro']

const beneficioForm = ref({
  titulo: '',
  tipo: '',
  descricao: '',
  regra_uso: ''
})

const columns = [
  {
    name: 'titulo',
    label: 'Título',
    field: 'titulo',
    align: 'left',
    sortable: true
  },
  {
    name: 'tipo',
    label: 'Tipo',
    field: 'tipo',
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
    name: 'regra_uso',
    label: 'Regra de Uso',
    field: 'regra_uso',
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

const getTipoColor = (tipo) => {
  const colors = {
    desconto: 'primary',
    cashback: 'positive',
    brinde: 'warning',
    outro: 'grey'
  }
  return colors[tipo] || 'grey'
}

const loadParceiro = async () => {
  loading.value = true
  try {
    const result = await parceiroStore.fetchById(parceiroId)
    if (result.success) {
      parceiro.value = parceiroStore.currentParceiro
    }
  } finally {
    loading.value = false
  }
}

const loadBeneficios = async () => {
  loading.value = true
  try {
    const result = await parceiroStore.fetchBeneficios(parceiroId)
    if (result.success) {
      beneficios.value = parceiroStore.beneficios
    }
  } finally {
    loading.value = false
  }
}

const openBeneficioModal = (beneficio = null) => {
  if (beneficio) {
    isEditBeneficio.value = true
    beneficioForm.value = {
      titulo: beneficio.titulo || '',
      tipo: beneficio.tipo || '',
      descricao: beneficio.descricao || '',
      regra_uso: beneficio.regra_uso || ''
    }
    deleteId.value = beneficio.id
  } else {
    isEditBeneficio.value = false
    beneficioForm.value = {
      titulo: '',
      tipo: '',
      descricao: '',
      regra_uso: ''
    }
    deleteId.value = null
  }
  beneficioModal.value = true
}

const closeBeneficioModal = () => {
  beneficioModal.value = false
  beneficioForm.value = {
    titulo: '',
    tipo: '',
    descricao: '',
    regra_uso: ''
  }
  isEditBeneficio.value = false
  deleteId.value = null
}

const handleBeneficioSubmit = async () => {
  savingBeneficio.value = true
  try {
    const dataToSend = {
      parceiro_id: parceiroId,
      ...beneficioForm.value
    }

    let result
    if (isEditBeneficio.value) {
      result = await parceiroStore.updateBeneficio(deleteId.value, dataToSend)
    } else {
      result = await parceiroStore.createBeneficio(dataToSend)
    }

    if (result.success) {
      closeBeneficioModal()
      loadBeneficios()
    }
  } finally {
    savingBeneficio.value = false
  }
}

const deleteBeneficio = (id) => {
  deleteId.value = id
  confirmDialog.value = true
}

const confirmDelete = async () => {
  if (deleteId.value) {
    const result = await parceiroStore.deleteBeneficio(deleteId.value)
    if (result.success) {
      loadBeneficios()
    }
    deleteId.value = null
  }
}

onMounted(async () => {
  await loadParceiro()
  await loadBeneficios()
})
</script>
