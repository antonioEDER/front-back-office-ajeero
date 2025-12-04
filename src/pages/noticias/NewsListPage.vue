<template>
  <q-page padding>
    <div class="row q-mb-md items-center">
      <div class="col">
        <div class="text-h4">Notícias</div>
        <div class="text-subtitle1 text-grey-7">Gerenciar notícias do sistema</div>
      </div>
      <div class="col-auto">
        <q-btn
          color="primary"
          icon="add"
          label="Nova Notícia"
          @click="$router.push('/noticias/novo')"
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

