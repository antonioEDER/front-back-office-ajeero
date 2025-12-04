<template>
  <q-page padding>
    <div class="row q-mb-md items-center">
      <div class="col">
        <div class="text-h4">Parceiros</div>
        <div class="text-subtitle1 text-grey-7">Gerenciar parceiros do sistema</div>
      </div>
      <div class="col-auto">
        <q-btn
          color="primary"
          icon="add"
          label="Novo Parceiro"
          @click="$router.push('/parceiros/novo')"
        />
      </div>
    </div>

    <q-card>
      <q-card-section>
        <div class="text-body1">Página em desenvolvimento</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

