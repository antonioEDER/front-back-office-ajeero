<template>
  <q-card class="stat-card" :class="cardClass">
    <q-card-section class="row items-center no-wrap">
      <div class="col">
        <div class="text-h6">{{ value }}</div>
        <div class="text-subtitle2 text-grey-7">{{ label }}</div>
      </div>
      <div class="col-auto">
        <q-avatar
          :color="iconColor"
          text-color="white"
          :icon="icon"
          size="56px"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  icon: {
    type: String,
    default: 'info'
  },
  iconColor: {
    type: String,
    default: 'primary'
  },
  cardClass: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.stat-card {
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
}
</style>

