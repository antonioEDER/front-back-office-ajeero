<template>
  <q-page padding>
    <div class="row q-mb-md items-center">
      <div class="col">
        <div class="text-h4">Novo Parceiro</div>
        <div class="text-subtitle1 text-grey-7">Cadastrar novo parceiro no sistema</div>
      </div>
      <div class="col-auto">
        <q-btn
          flat
          label="Cancelar"
          @click="$router.push('/parceiros')"
        />
      </div>
    </div>

    <q-card>
      <q-card-section>
        <q-form @submit="handleSubmit" class="q-gutter-md">
          <div class="row q-gutter-md">
            <div class="col-12">
              <q-input
                v-model="form.nome"
                label="Nome *"
                outlined
                :rules="[val => !!val || 'Nome é obrigatório', val => val.length >= 3 || 'Nome deve ter no mínimo 3 caracteres']"
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
              <div class="text-h6 q-mb-md">Logo do Parceiro</div>
              <div class="row q-gutter-md items-center">
                <div class="col-auto">
                  <q-avatar v-if="logoPreview" size="100px" square>
                    <img :src="logoPreview" alt="Preview Logo" />
                  </q-avatar>
                  <q-avatar v-else size="100px" square color="grey" text-color="white">
                    <q-icon name="image" size="50px" />
                  </q-avatar>
                </div>
                <div class="col">
                  <q-file
                    v-model="logoFile"
                    label="Selecionar logo"
                    accept="image/*"
                    outlined
                    @update:model-value="handleLogoSelect"
                  >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                  </q-file>
                  <div class="text-caption text-grey-7 q-mt-xs">
                    Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 10MB
                  </div>
                </div>
              </div>
            </div>
          </div>

          <q-separator />

          <div class="row q-gutter-md">
            <div class="col-12">
              <q-btn
                type="submit"
                color="primary"
                label="Salvar Parceiro"
                :loading="loading"
                icon="save"
              />
              <q-btn
                flat
                label="Cancelar"
                @click="$router.push('/parceiros')"
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useParceiroStore } from 'src/stores/parceiro'
import { validateImageFile } from 'src/utils/validators'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()
const parceiroStore = useParceiroStore()

const loading = ref(false)
const form = ref({
  nome: '',
  descricao: ''
})

const logoFile = ref(null)
const logoPreview = ref(null)

const handleLogoSelect = (file) => {
  if (file) {
    const validation = validateImageFile(file)
    if (!validation.valid) {
      $q.notify({
        type: 'negative',
        message: validation.error,
        position: 'top'
      })
      logoFile.value = null
      logoPreview.value = null
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      logoPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  } else {
    logoPreview.value = null
  }
}

const handleSubmit = async () => {
  loading.value = true
  try {
    const result = await parceiroStore.create(form.value)
    if (result.success) {
      // Upload logo se houver
      if (logoFile.value && result.data?.id) {
        await parceiroStore.uploadLogo(result.data.id, logoFile.value)
      }
      router.push('/parceiros')
    }
  } finally {
    loading.value = false
  }
}
</script>
