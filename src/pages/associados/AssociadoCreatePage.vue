<template>
  <q-page padding>
    <div class="row q-mb-md items-center">
      <div class="col">
        <div class="text-h4">Novo Associado</div>
        <div class="text-subtitle1 text-grey-7">Cadastrar novo associado no sistema</div>
      </div>
      <div class="col-auto">
        <q-btn
          flat
          label="Cancelar"
          @click="$router.push('/associados')"
        />
      </div>
    </div>

    <q-card>
      <q-card-section>
        <q-form @submit="handleSubmit" class="q-gutter-md">
          <div class="row q-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.name"
                label="Nome *"
                outlined
                :rules="[val => !!val || 'Nome é obrigatório']"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.cpf"
                label="CPF *"
                outlined
                mask="###.###.###-##"
                :rules="[val => !!val || 'CPF é obrigatório', val => validateCPF(val) || 'CPF inválido']"
                @blur="validateCPFField"
              />
            </div>
          </div>

          <div class="row q-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.email"
                label="Email *"
                type="email"
                outlined
                :rules="[val => !!val || 'Email é obrigatório', val => validateEmail(val) || 'Email inválido']"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.phone"
                label="Telefone"
                outlined
                mask="(##) #####-####"
              />
            </div>
          </div>

          <div class="row q-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.password"
                label="Senha *"
                :type="showPassword ? 'text' : 'password'"
                outlined
                :rules="[val => !!val || 'Senha é obrigatória', val => val.length >= 6 || 'Senha deve ter no mínimo 6 caracteres']"
              >
                <template v-slot:append>
                  <q-icon
                    :name="showPassword ? 'visibility' : 'visibility_off'"
                    class="cursor-pointer"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.confirmPassword"
                label="Confirmar Senha *"
                :type="showPassword ? 'text' : 'password'"
                outlined
                :rules="[val => !!val || 'Confirmação de senha é obrigatória', val => val === form.password || 'Senhas não coincidem']"
              />
            </div>
          </div>

          <q-separator />

          <div class="text-h6 q-mb-md">Endereço</div>

          <div class="row q-gutter-md">
            <div class="col-12 col-md-4">
              <q-input
                v-model="form.address.cep"
                label="CEP"
                outlined
                mask="#####-###"
                @blur="searchCEP"
              >
                <template v-slot:append>
                  <q-icon name="search" class="cursor-pointer" @click="searchCEP" />
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-8">
              <q-input
                v-model="form.address.street"
                label="Rua"
                outlined
              />
            </div>
          </div>

          <div class="row q-gutter-md">
            <div class="col-12 col-md-3">
              <q-input
                v-model="form.address.number"
                label="Número"
                outlined
              />
            </div>
            <div class="col-12 col-md-5">
              <q-input
                v-model="form.address.complement"
                label="Complemento"
                outlined
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="form.address.neighborhood"
                label="Bairro"
                outlined
              />
            </div>
          </div>

          <div class="row q-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.address.city"
                label="Cidade"
                outlined
              />
            </div>
            <div class="col-12 col-md-3">
              <q-select
                v-model="form.address.state"
                :options="states"
                label="Estado"
                outlined
                emit-value
                map-options
              />
            </div>
            <div class="col-12 col-md-3">
              <q-select
                v-model="form.status"
                :options="statusOptions"
                label="Status *"
                outlined
                emit-value
                map-options
                :rules="[val => !!val || 'Status é obrigatório']"
              />
            </div>
          </div>

          <q-separator />

          <div class="text-h6 q-mb-md">Foto de Perfil</div>

          <div class="row q-gutter-md items-center">
            <div class="col-auto">
              <q-avatar v-if="photoPreview" size="100px">
                <img :src="photoPreview" alt="Preview" />
              </q-avatar>
              <q-avatar v-else size="100px" color="grey" text-color="white">
                <q-icon name="person" size="50px" />
              </q-avatar>
            </div>
            <div class="col">
              <q-file
                v-model="photoFile"
                label="Selecionar foto"
                accept="image/*"
                outlined
                @update:model-value="handlePhotoSelect"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
            </div>
          </div>

          <div class="row justify-end q-mt-lg">
            <q-btn
              label="Cancelar"
              flat
              @click="$router.push('/associados')"
              class="q-mr-sm"
            />
            <q-btn
              label="Salvar"
              type="submit"
              color="primary"
              :loading="loading"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAssociadoStore } from 'src/stores/associado'
import { validateCPF, validateEmail, validateImageFile } from 'src/utils/validators'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()
const associadoStore = useAssociadoStore()

const form = ref({
  name: '',
  cpf: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  status: 'active',
  address: {
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: ''
  }
})

const photoFile = ref(null)
const photoPreview = ref(null)
const showPassword = ref(false)
const loading = ref(false)

const states = [
  { label: 'Acre', value: 'AC' },
  { label: 'Alagoas', value: 'AL' },
  { label: 'Amapá', value: 'AP' },
  { label: 'Amazonas', value: 'AM' },
  { label: 'Bahia', value: 'BA' },
  { label: 'Ceará', value: 'CE' },
  { label: 'Distrito Federal', value: 'DF' },
  { label: 'Espírito Santo', value: 'ES' },
  { label: 'Goiás', value: 'GO' },
  { label: 'Maranhão', value: 'MA' },
  { label: 'Mato Grosso', value: 'MT' },
  { label: 'Mato Grosso do Sul', value: 'MS' },
  { label: 'Minas Gerais', value: 'MG' },
  { label: 'Pará', value: 'PA' },
  { label: 'Paraíba', value: 'PB' },
  { label: 'Paraná', value: 'PR' },
  { label: 'Pernambuco', value: 'PE' },
  { label: 'Piauí', value: 'PI' },
  { label: 'Rio de Janeiro', value: 'RJ' },
  { label: 'Rio Grande do Norte', value: 'RN' },
  { label: 'Rio Grande do Sul', value: 'RS' },
  { label: 'Rondônia', value: 'RO' },
  { label: 'Roraima', value: 'RR' },
  { label: 'Santa Catarina', value: 'SC' },
  { label: 'São Paulo', value: 'SP' },
  { label: 'Sergipe', value: 'SE' },
  { label: 'Tocantins', value: 'TO' }
]

const statusOptions = [
  { label: 'Ativo', value: 'active' },
  { label: 'Inativo', value: 'inactive' }
]

const validateCPFField = () => {
  if (form.value.cpf && !validateCPF(form.value.cpf)) {
    $q.notify({
      type: 'negative',
      message: 'CPF inválido',
      position: 'top'
    })
  }
}

const searchCEP = async () => {
  const cep = form.value.address.cep.replace(/\D/g, '')
  if (cep.length !== 8) return

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
    const data = await response.json()
    
    if (!data.erro) {
      form.value.address.street = data.logradouro || ''
      form.value.address.neighborhood = data.bairro || ''
      form.value.address.city = data.localidade || ''
      form.value.address.state = data.uf || ''
    }
  } catch (error) {
    console.error('Erro ao buscar CEP:', error)
  }
}

const handlePhotoSelect = (file) => {
  if (file) {
    const validation = validateImageFile(file)
    if (!validation.valid) {
      $q.notify({
        type: 'negative',
        message: validation.error,
        position: 'top'
      })
      photoFile.value = null
      photoPreview.value = null
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      photoPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  } else {
    photoPreview.value = null
  }
}

const handleSubmit = async () => {
  loading.value = true
  try {
    const { confirmPassword, ...dataToSend } = form.value
    
    const result = await associadoStore.create(dataToSend)
    if (result.success) {
      // Upload foto se houver
      if (photoFile.value && result.data?.id) {
        await associadoStore.uploadPhoto(result.data.id, photoFile.value)
      }
      router.push('/associados')
    }
  } finally {
    loading.value = false
  }
}
</script>

