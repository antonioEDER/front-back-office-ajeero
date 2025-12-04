<template>
  <q-input
    v-model="searchValue"
    :placeholder="placeholder"
    outlined
    dense
    debounce="300"
    @update:model-value="handleSearch"
  >
    <template v-slot:prepend>
      <q-icon name="search" />
    </template>
    <template v-if="searchValue" v-slot:append>
      <q-icon
        name="close"
        @click="clearSearch"
        class="cursor-pointer"
      />
    </template>
  </q-input>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Buscar...'
  }
})

const emit = defineEmits(['update:modelValue', 'search'])

const searchValue = ref(props.modelValue)

watch(() => props.modelValue, (newValue) => {
  searchValue.value = newValue
})

const handleSearch = (value) => {
  emit('update:modelValue', value)
  emit('search', value)
}

const clearSearch = () => {
  searchValue.value = ''
  handleSearch('')
}
</script>

