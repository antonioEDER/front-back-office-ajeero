<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="warning" color="warning" text-color="white" />
        <span class="q-ml-sm text-h6">{{ title }}</span>
      </q-card-section>

      <q-card-section>
        <div class="text-body1">{{ message }}</div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          label="Cancelar"
          color="grey"
          @click="cancel"
        />
        <q-btn
          flat
          :label="confirmLabel"
          :color="confirmColor"
          @click="confirm"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Confirmar ação'
  },
  message: {
    type: String,
    default: 'Tem certeza que deseja realizar esta ação?'
  },
  confirmLabel: {
    type: String,
    default: 'Confirmar'
  },
  confirmColor: {
    type: String,
    default: 'primary'
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const showDialog = ref(props.modelValue)

watch(() => props.modelValue, (newValue) => {
  showDialog.value = newValue
})

watch(showDialog, (newValue) => {
  emit('update:modelValue', newValue)
})

const confirm = () => {
  emit('confirm')
  showDialog.value = false
}

const cancel = () => {
  emit('cancel')
  showDialog.value = false
}
</script>

