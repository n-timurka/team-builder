<script setup lang="ts">
import { type Player } from '@/types/player'
import { collection } from 'firebase/firestore'
import { computed, ref } from 'vue'
import { useCollection, useFirestore } from 'vuefire'

const db = useFirestore()
const { data: players, pending } = useCollection<Player[]>(collection(db, 'players'))

const playersData = computed(() => {
  if (!players.value) return []

  return players.value.map((player) => ({
    ...player,
    id: player.id,
  }))
})
const headers = [
  { key: 'name', title: 'Team' },
  { key: 'number', title: 'Number', width: '150px' },
  { key: 'position', title: 'Position', width: '200px' },
  { key: 'team', title: 'Team', width: '200px' },
  { key: 'id', width: '120px' },
]
const positions = {
  g: 'Guard',
  f: 'Forward',
  c: 'Center',
}

const isLoading = ref(false)
const deletePlayer = async (id: string) => {
  console.log(id)
}
</script>

<template>
  <section>
    <div v-if="pending">Loading...</div>
    <div v-else-if="players.length">
      <v-data-table :items="playersData" :headers="headers">
        <template #item.position="{ item }">
          {{ item.position ? positions[item.position] : '&ndash;' }}
        </template>
        <template #item.team="{ item }">
          {{ item.team?.name || '&ndash;' }}
        </template>
        <template #item.id="{ item }">
          <v-btn
            size="x-small"
            icon="mdi-pencil"
            class="me-2"
            :loading="isLoading"
            :to="{ name: 'team-edit', params: { id: item.id } }"
          />
          <v-btn
            color="error"
            size="x-small"
            icon="mdi-delete"
            :loading="isLoading"
            @click="deletePlayer(item.id)"
          />
        </template>
      </v-data-table>
    </div>
  </section>
</template>
