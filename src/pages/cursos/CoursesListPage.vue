<template>
  <q-page padding>
    <div class="row q-mb-md items-center">
      <div class="col">
        <div class="text-h4">Cursos</div>
        <div class="text-subtitle1 text-grey-7">Gerenciar cursos do sistema</div>
      </div>
      <div class="col-auto">
        <q-btn
          color="primary"
          icon="add"
          label="Novo Curso"
          @click="$router.push('/cursos/novo')"
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

