<script setup lang="ts">
import { RouterView } from 'vue-router'
import TheHeader from '@/components/TheHeader.vue'
import { onMounted } from 'vue'
import { useUserStore } from './stores/userStore'

const { fetchTeam } = useUserStore()

onMounted(async () => {
  await fetchTeam()
})
</script>

<template>
  <v-app>
    <v-layout>
      <TheHeader />

      <v-main>
        <v-container>
          <RouterView />
        </v-container>
      </v-main>
    </v-layout>
  </v-app>
</template>
