<template>
  <q-page padding>
    <div class="row q-mb-md items-center">
      <div class="col">
        <div class="text-h4">Editar Benefício</div>
        <div class="text-subtitle1 text-grey-7">Editar informações do benefício</div>
      </div>
      <div class="col-auto">
        <q-btn
          flat
          label="Voltar"
          @click="$router.push('/beneficios')"
        />
      </div>
    </div>

    <q-card v-if="loading && !beneficio">
      <q-card-section>
        <q-spinner color="primary" size="3em" />
      </q-card-section>
    </q-card>

    <q-card v-else>
      <q-card-section>
        <q-form @submit="handleSubmit" class="q-gutter-md">
          <div class="row q-gutter-md">
            <div class="col-12">
              <q-select
                v-model="form.parceiro_id"
                :options="parceiroOptions"
                label="Parceiro *"
                outlined
                emit-value
                map-options
                :rules="[val => !!val || 'Parceiro é obrigatório']"
                :loading="loadingParceiros"
                :disable="true"
              />
            </div>
          </div>

          <div class="row q-gutter-md">
            <div class="col-12">
              <q-input
                v-model="form.titulo"
                label="Título *"
                outlined
                :rules="[val => !!val || 'Título é obrigatório']"
              />
            </div>
          </div>

          <div class="row q-gutter-md">
            <div class="col-12 col-md-6">
              <q-select
                v-model="form.tipo"
                :options="tipoOptions"
                label="Tipo *"
                outlined
                emit-value
                map-options
                :rules="[val => !!val || 'Tipo é obrigatório']"
              />
            </div>
          </div>

          <div class="row q-gutter-md">
            <div class="col-12">
              <q-input
                v-model="form.descricao"
                label="Descrição"
                type="textarea"
                outlined
                rows="4"
              />
            </div>
          </div>

          <div class="row q-gutter-md">
            <div class="col-12">
              <q-input
                v-model="form.regra_uso"
                label="Regra de Uso"
                type="textarea"
                outlined
                rows="4"
                hint="Instruções sobre como usar o benefício"
              />
            </div>
          </div>

          <q-separator />

          <div class="row q-gutter-md">
            <div class="col-12">
              <q-btn
                type="submit"
                color="primary"
                label="Salvar Alterações"
                :loading="loading"
                icon="save"
              />
              <q-btn
                flat
                label="Cancelar"
                @click="$router.push('/beneficios')"
                class="q-ml-sm"
              />
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBeneficioStore } from 'src/stores/beneficio'
import { useParceiroStore } from 'src/stores/parceiro'
import { BENEFICIO_TYPES } from 'src/utils/constants'

const route = useRoute()
const router = useRouter()
const beneficioStore = useBeneficioStore()
const parceiroStore = useParceiroStore()

const beneficioId = route.params.id
const loading = ref(false)
const loadingParceiros = ref(false)
const beneficio = ref(null)
const parceiroOptions = ref([])

const form = ref({
  parceiro_id: '',
  titulo: '',
  descricao: '',
  tipo: '',
  regra_uso: ''
})

const tipoOptions = Object.values(BENEFICIO_TYPES).map(tipo => ({
  label: tipo,
  value: tipo
}))

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

const loadBeneficio = async () => {
  loading.value = true
  try {
    const result = await beneficioStore.fetchById(beneficioId)
    if (result.success) {
      beneficio.value = beneficioStore.currentBeneficio
      form.value = {
        parceiro_id: beneficio.value.parceiro_id || '',
        titulo: beneficio.value.titulo || '',
        descricao: beneficio.value.descricao || '',
        tipo: beneficio.value.tipo || '',
        regra_uso: beneficio.value.regra_uso || ''
      }
    }
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  loading.value = true
  try {
    const result = await beneficioStore.update(beneficioId, form.value)
    if (result.success) {
      router.push('/beneficios')
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadParceiros()
  loadBeneficio()
})
</script>

