<script setup lang="ts">
import AddTeamForm from './AddTeamForm.vue'
</script>

<template>
  <v-dialog max-width="500">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn v-bind="activatorProps" text="Create Team" prepend-icon="mdi-plus" variant="tonal" />
    </template>

    <template v-slot:default="{ isActive }">
      <v-card>
        <v-card-title>
          <div class="d-flex justify-space-between align-center ps-2">
            <h3>Create New Team</h3>
            <v-btn icon="mdi-close" variant="text" @click="isActive.value = false" />
          </div>
        </v-card-title>

        <v-card-text>
          <AddTeamForm />
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>
