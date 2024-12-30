<script setup lang="ts">
import AddPlayerModal from '@/components/AddPlayerModal.vue'
import AppPlayerPhoto from '@/components/AppPlayerPhoto.vue'
import { useAuth } from '@/composables/useAuth'
import { type Player } from '@/types/player'
import type { Team } from '@/types/team'
import { Permissions } from '@/types/user'
import { collection } from 'firebase/firestore'
import { useCollection, useFirestore } from 'vuefire'

const { can } = useAuth()
const db = useFirestore()
const { data: players, pending } = useCollection<Player>(collection(db, 'players'))

const positions = {
  g: 'Guard',
  f: 'Forward',
  c: 'Center',
}
const teams: Team[] = []
const deletePlayer = (id: string) => {
  console.log(id)
}
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
          <th class="text-left">Teams</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="player in players" :key="player.id">
          <td class="w-75">
            <AppPlayerPhoto :photo="player.photo" class="me-2" />
            {{ player.name }}
          </td>
          <td>{{ player.position ? positions[player.position] : '&ndash;' }}</td>
          <td>
            <RouterLink
              v-for="team in teams"
              :key="team.id"
              :to="{ name: 'team-edit', params: { id: team.id } }"
            >
              {{ team.name }}
            </RouterLink>
          </td>
          <td class="text-right">
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
              @click="deletePlayer(player.id)"
            />
          </td>
        </tr>
      </tbody>
    </v-table>
  </section>
</template>
