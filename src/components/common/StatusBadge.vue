<template>
  <q-badge
    :color="badgeColor"
    :label="label"
    :class="badgeClass"
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true
  }
})

const label = computed(() => {
  return props.status === 'active' ? 'Ativo' : 'Inativo'
})

const badgeColor = computed(() => {
  return props.status === 'active' ? 'positive' : 'negative'
})

const badgeClass = computed(() => {
  return 'q-pa-xs'
})
</script>

