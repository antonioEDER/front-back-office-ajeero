<template>
  <q-page padding>
    <div class="row q-mb-md">
      <div class="col">
        <div class="text-h4">Dashboard</div>
        <div class="text-subtitle1 text-grey-7">Visão geral do sistema</div>
      </div>
    </div>

    <div v-if="loading" class="row justify-center q-pa-xl">
      <q-spinner color="primary" size="3em" />
    </div>

    <div v-else class="row q-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-4 col-lg-3">
        <StatCard
          label="Total de Associados"
          :value="stats.total_associados"
          icon="people"
          icon-color="blue"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-4 col-lg-3">
        <StatCard
          label="Total de Eventos"
          :value="stats.total_eventos"
          icon="event"
          icon-color="purple"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-4 col-lg-3">
        <StatCard
          label="Total de Inscritos"
          :value="stats.total_inscritos"
          icon="how_to_reg"
          icon-color="green"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-4 col-lg-3">
        <StatCard
          label="Total de Cursos"
          :value="stats.total_cursos"
          icon="school"
          icon-color="orange"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-4 col-lg-3">
        <StatCard
          label="Cursos Acessados"
          :value="stats.total_cursos_acessados"
          icon="play_circle"
          icon-color="teal"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-4 col-lg-3">
        <StatCard
          label="Total de Parceiros"
          :value="stats.total_parceiros"
          icon="handshake"
          icon-color="indigo"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-4 col-lg-3">
        <StatCard
          label="Total de Notícias"
          :value="stats.total_noticias"
          icon="article"
          icon-color="red"
        />
      </div>
    </div>

    <div class="row q-gutter-md">
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6">Links Rápidos</div>
          </q-card-section>
          <q-card-section>
            <div class="row q-gutter-sm">
              <q-btn
                color="primary"
                icon="people"
                label="Associados"
                @click="$router.push('/associados')"
              />
              <q-btn
                color="secondary"
                icon="school"
                label="Cursos"
                @click="$router.push('/cursos')"
              />
              <q-btn
                color="accent"
                icon="event"
                label="Eventos"
                @click="$router.push('/eventos')"
              />
              <q-btn
                color="positive"
                icon="handshake"
                label="Parceiros"
                @click="$router.push('/parceiros')"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useDashboardStore } from 'src/stores/dashboard'
import StatCard from 'src/components/dashboard/StatCard.vue'

const dashboardStore = useDashboardStore()

const loading = computed(() => dashboardStore.loading)
const stats = computed(() => dashboardStore.stats)

onMounted(async () => {
  await dashboardStore.fetchStats()
})
</script>

