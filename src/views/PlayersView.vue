<script setup lang="ts">
import AddPlayerModal from '@/components/AddPlayerModal.vue'
import PlayersListItem from '@/components/PlayersListItem.vue'
import { useAuth } from '@/composables/useAuth'
import { type Player } from '@/types/player'
import { Permissions } from '@/types/user'
import { collection } from 'firebase/firestore'
import { computed } from 'vue'
import { useCollection, useFirestore } from 'vuefire'

const { can } = useAuth()
const db = useFirestore()
const { data: players, pending } = useCollection<Player[]>(collection(db, 'players'))

const playersData = computed(() => {
  if (!players.value) return []

  return players.value.map((player) => ({
    ...player,
    id: player.id,
  }))
})
</script>

<template>
  <section>
    <v-row>
      <v-col>
        <h1>Players</h1>
      </v-col>
      <v-spacer />
      <v-col cols="2" class="text-end">
        <AddPlayerModal v-if="can(Permissions.PLAYER_CREATE)" />
      </v-col>
    </v-row>
    <div v-if="pending">Loading...</div>
    <v-table v-else-if="players.length">
      <thead>
        <tr>
          <th class="text-left">Name</th>
          <th class="text-left">Position</th>
          <th class="text-left">Team</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <PlayersListItem v-for="player in playersData" :key="player.id" :player="player" />
      </tbody>
    </v-table>
  </section>
</template>
