<script setup lang="ts">
import AppPlayerPhoto from '@/components/AppPlayerPhoto.vue'
import { useAuth } from '@/composables/useAuth'
import { PlayerPosition, type Player } from '@/types/player'
import type { Team } from '@/types/team'
import { Permissions } from '@/types/user'
import { collection } from 'firebase/firestore'
import { computed } from 'vue'
import { useCollection, useFirestore } from 'vuefire'

const { can } = useAuth()
const db = useFirestore()
const { data: players, pending } = useCollection<Player>(collection(db, 'players'))

const playersData = computed(() => {
  if (!players.value) return []

  return players.value.map((player) => ({
    ...player,
    id: player.id,
  })) as Player[]
})
const headers = [
  { key: 'name', title: 'Player' },
  { key: 'position', title: 'Position', width: '150px' },
  { key: 'birthDate', title: 'Age', width: '150px' },
  { key: 'createdBy', title: 'Creator', width: '200px' },
  { key: 'id', width: '120px', sortable: false },
]
const positions = {
  [PlayerPosition.GUARD]: 'Guard',
  [PlayerPosition.FORWARD]: 'Forward',
  [PlayerPosition.CENTER]: 'Center',
}
const deletePlayer = (id: string) => {
  console.log(id)
}
</script>

<template>
  <v-sheet border rounded>
    <v-data-table :items="playersData" :headers="headers" :loading="pending">
      <template #top>
        <v-toolbar title="Players" color="transparent" />
      </template>
      <template v-slot:loading>
        <v-skeleton-loader type="table-row@4" />
      </template>

      <template #[`item.name`]="{ item }">
        <div class="d-flex align-center ga-4">
          <AppPlayerPhoto :photo="item.photo" />
          <div>
            <p class="text-body-1">{{ item.name }}</p>
            <p class="text-caption font-weight-thin text-grey-darken-1">#{{ item.id }}</p>
          </div>
        </div>
      </template>
      <template #[`item.position`]="{ value }">
        {{ positions[value as PlayerPosition] }}
      </template>
      <template #[`item.id`]="{ item }">
        <v-btn
          v-if="can(Permissions.PLAYER_UPDATE)"
          size="x-small"
          icon="mdi-pencil"
          class="me-2"
        />
        <v-btn
          v-if="can(Permissions.PLAYER_DELETE)"
          color="error"
          size="x-small"
          icon="mdi-delete"
          @click="deletePlayer(item.id)"
        />
      </template>
    </v-data-table>
  </v-sheet>
</template>
