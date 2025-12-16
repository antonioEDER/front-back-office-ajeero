<template>
  <q-page padding>
    <div class="row q-mb-md items-center">
      <div class="col">
        <div class="text-h4">Editar Notícia</div>
        <div class="text-subtitle1 text-grey-7">Editar informações da notícia</div>
      </div>
      <div class="col-auto">
        <q-btn
          flat
          label="Voltar"
          @click="$router.push('/noticias')"
        />
      </div>
    </div>

    <q-card v-if="loading && !noticia">
      <q-card-section>
        <q-spinner color="primary" size="3em" />
      </q-card-section>
    </q-card>

    <q-card v-else>
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
              <div class="text-h6 q-mb-md">Imagem da Notícia</div>
              <div class="row q-gutter-md items-center">
                <div class="col-auto">
                  <q-avatar v-if="imagemImageUrl" size="100px">
                    <img :src="imagemImageUrl" alt="Preview Imagem" />
                  </q-avatar>
                  <q-avatar v-else size="100px" color="grey" text-color="white">
                    <q-icon name="image" size="50px" />
                  </q-avatar>
                </div>
                <div class="col">
                  <q-file
                    v-model="imagemFile"
                    label="Selecionar nova imagem"
                    accept="image/*"
                    outlined
                    @update:model-value="handleImagemSelect"
                  >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                  </q-file>
                </div>
              </div>
            </div>
          </div>

          <div class="row q-gutter-md">
            <div class="col-12">
              <div class="text-body2 q-mb-sm">Conteúdo HTML *</div>
              <q-editor
                v-model="form.conteudo_html"
                min-height="5rem"
                :toolbar="editorToolbar"
                :rules="[val => !!val || 'Conteúdo é obrigatório']"
              />
            </div>
          </div>

          <q-separator />

          <div class="row q-gutter-md" v-if="form.conteudo_html">
            <div class="col-12">
              <div class="text-h6 q-mb-md">Preview da Notícia</div>
              <q-card>
                <q-card-section>
                  <div class="text-h5 q-mb-md">{{ form.titulo }}</div>
                  <q-img
                    v-if="imagemImageUrl"
                    :src="imagemImageUrl"
                    style="max-width: 100%; max-height: 400px;"
                    fit="contain"
                    class="q-mb-md"
                  />
                  <div v-html="form.conteudo_html"></div>
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
                label="Salvar Alterações"
                :loading="saving"
                icon="save"
              />
              <q-btn
                flat
                label="Cancelar"
                @click="$router.push('/noticias')"
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
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNoticiaStore } from 'src/stores/noticia'
import { validateImageFile } from 'src/utils/validators'
import { useQuasar } from 'quasar'
import { API_BASE_URL } from 'src/utils/constants'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const noticiaStore = useNoticiaStore()

const noticiaId = route.params.id
const loading = ref(false)
const saving = ref(false)
const noticia = ref(null)
const form = ref({
  titulo: '',
  conteudo_html: ''
})

const imagemFile = ref(null)
const imagemPreview = ref(null)
const currentImagem = ref(null)

// Computed para URL da imagem: prioriza preview local, senão adiciona API_BASE_URL se vier da lista
const imagemImageUrl = computed(() => {
  if (imagemPreview.value) {
    // Nova seleção local - usar preview
    return imagemPreview.value
  }
  if (currentImagem.value) {
    // Imagem da lista - adicionar API_BASE_URL
    return API_BASE_URL + currentImagem.value
  }
  return null
})

const editorToolbar = [
  [
    {
      label: 'Formatação',
      icon: 'format_size',
      list: 'no-icons',
      options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code']
    }
  ],
  ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
  ['token', 'hr', 'link', 'custom_btn'],
  ['print', 'fullscreen'],
  [
    {
      label: 'Lista',
      icon: 'format_list_bulleted',
      list: 'no-icons',
      options: ['unordered', 'ordered', 'outdent', 'indent']
    }
  ],
  ['quote', 'unordered', 'ordered', 'outdent', 'indent'],
  [
    {
      label: 'Alinhamento',
      icon: 'format_align_left',
      fixedLabel: true,
      list: 'only-icons',
      options: ['left', 'center', 'right', 'justify']
    }
  ],
  ['removeFormat']
]

const handleImagemSelect = (file) => {
  if (file) {
    const validation = validateImageFile(file)
    if (!validation.valid) {
      $q.notify({
        type: 'negative',
        message: validation.error,
        position: 'top'
      })
      imagemFile.value = null
      imagemPreview.value = null
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      imagemPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  } else {
    imagemPreview.value = null
  }
}

const loadNoticia = async () => {
  loading.value = true
  try {
    const result = await noticiaStore.fetchById(noticiaId)
    if (result.success) {
      noticia.value = noticiaStore.currentNoticia
      form.value = {
        titulo: noticia.value.titulo || '',
        conteudo_html: noticia.value.conteudo_html || ''
      }
      currentImagem.value = noticia.value.imagem_url || null
    }
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  if (!form.value.conteudo_html) {
    return
  }

  saving.value = true
  try {
    const result = await noticiaStore.update(noticiaId, form.value)
    if (result.success) {
      // Upload imagem se houver
      if (imagemFile.value) {
        await noticiaStore.uploadImagem(noticiaId, imagemFile.value)
      }
      router.push('/noticias')
    }
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadNoticia()
})
</script>
