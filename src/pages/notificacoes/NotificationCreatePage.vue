<template>
  <q-page padding>
    <div class="row q-mb-md items-center">
      <div class="col">
        <div class="text-h4">Nova Notificação</div>
        <div class="text-subtitle1 text-grey-7">Criar e enviar nova notificação</div>
      </div>
      <div class="col-auto">
        <q-btn
          flat
          label="Cancelar"
          @click="$router.push('/notificacoes')"
        />
      </div>
    </div>

    <q-card>
      <q-card-section>
        <q-form @submit="handleSubmit" class="q-gutter-md">
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
            <div class="col-12">
              <q-input
                v-model="form.mensagem"
                label="Mensagem *"
                type="textarea"
                outlined
                rows="5"
                :rules="[val => !!val || 'Mensagem é obrigatória']"
              />
            </div>
          </div>

          <div class="row q-gutter-md">
            <div class="col-12">
              <q-radio
                v-model="tipoEnvio"
                val="todos"
                label="Todos os associados"
                @update:model-value="handleTipoEnvioChange"
              />
              <q-radio
                v-model="tipoEnvio"
                val="especifico"
                label="Associado específico"
                @update:model-value="handleTipoEnvioChange"
                class="q-ml-md"
              />
            </div>
          </div>

          <div class="row q-gutter-md" v-if="tipoEnvio === 'especifico'">
            <div class="col-12">
              <q-select
                v-model="form.associado_id"
                :options="associadoOptions"
                label="Selecionar Associado *"
                outlined
                emit-value
                map-options
                use-input
                input-debounce="300"
                @filter="filterAssociados"
                :loading="loadingAssociados"
                :rules="tipoEnvio === 'especifico' ? [val => !!val || 'Associado é obrigatório'] : []"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Nenhum associado encontrado
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
          </div>

          <q-separator />

          <div class="row q-gutter-md" v-if="form.titulo && form.mensagem">
            <div class="col-12">
              <div class="text-h6 q-mb-md">Preview da Notificação</div>
              <q-card>
                <q-card-section>
                  <div class="text-h5 q-mb-md">{{ form.titulo }}</div>
                  <div class="text-body1 q-mb-md">{{ form.mensagem }}</div>
                  <div class="text-body2 text-grey-7">
                    <strong>Destinatário:</strong> 
                    {{ tipoEnvio === 'todos' ? 'Todos os associados' : 'Associado específico' }}
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <q-separator />

          <div class="row q-gutter-md">
            <div class="col-12">
              <q-btn
                type="submit"
                color="primary"
                label="Enviar Notificação"
                :loading="loading"
                icon="send"
              />
              <q-btn
                flat
                label="Cancelar"
                @click="$router.push('/notificacoes')"
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
import { useRouter } from 'vue-router'
import { useNotificacaoStore } from 'src/stores/notificacao'
import { useAssociadoStore } from 'src/stores/associado'

const router = useRouter()
const notificacaoStore = useNotificacaoStore()
const associadoStore = useAssociadoStore()

const loading = ref(false)
const loadingAssociados = ref(false)
const tipoEnvio = ref('todos')
const associadoOptions = ref([])
const allAssociados = ref([])

const form = ref({
  titulo: '',
  mensagem: '',
  associado_id: null
})

const loadAssociados = async () => {
  loadingAssociados.value = true
  try {
    const result = await associadoStore.fetchAssociados({ limit: 1000 })
    if (result.success) {
      allAssociados.value = associadoStore.associados
      associadoOptions.value = allAssociados.value.map(a => ({
        label: `${a.name} - ${a.email}`,
        value: a.id
      }))
    }
  } finally {
    loadingAssociados.value = false
  }
}

const filterAssociados = (val, update) => {
  if (val === '') {
    update(() => {
      associadoOptions.value = allAssociados.value.map(a => ({
        label: `${a.name} - ${a.email}`,
        value: a.id
      }))
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    associadoOptions.value = allAssociados.value
      .filter(a => 
        a.name.toLowerCase().includes(needle) || 
        a.email.toLowerCase().includes(needle)
      )
      .map(a => ({
        label: `${a.name} - ${a.email}`,
        value: a.id
      }))
  })
}

const handleTipoEnvioChange = () => {
  if (tipoEnvio.value === 'todos') {
    form.value.associado_id = null
  }
}

const handleSubmit = async () => {
  loading.value = true
  try {
    const data = {
      titulo: form.value.titulo,
      mensagem: form.value.mensagem
    }

    if (tipoEnvio.value === 'especifico' && form.value.associado_id) {
      data.associado_id = form.value.associado_id
    }

    const result = await notificacaoStore.create(data)
    if (result.success) {
      router.push('/notificacoes')
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadAssociados()
})
</script>
