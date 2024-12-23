<script setup lang="ts">
import AddPlayerForm from './AddPlayerForm.vue'

defineEmits(['created'])
</script>

<template>
  <v-dialog max-width="600">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn v-bind="activatorProps" text="New Player" prepend-icon="mdi-plus" variant="tonal" />
    </template>

    <template v-slot:default="{ isActive }">
      <v-card>
        <v-card-title>
          <div class="d-flex justify-space-between align-center ps-2">
            <h3>Create New Player</h3>
            <v-btn icon="mdi-close" variant="text" @click="isActive.value = false" />
          </div>
        </v-card-title>

        <v-card-text>
          <AddPlayerForm
            @created="
              (player) => {
                $emit('created', player)
                isActive.value = false
              }
            "
          />
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>
