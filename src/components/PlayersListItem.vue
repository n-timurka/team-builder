<script lang="ts" setup>
import { useAuth } from '@/composables/useAuth'
import type { Player } from '@/types/player'
import { type Team } from '@/types/team'
import { Permissions } from '@/types/user'
import { collection, doc, query, where } from 'firebase/firestore'
import { computed, ref } from 'vue'
import { useFirestore, useCollection, useStorageFileUrl, useFirebaseStorage } from 'vuefire'
import { ref as storageRef } from 'firebase/storage'

const props = defineProps<{
  player: Player
}>()

const { can } = useAuth()

const db = useFirestore()
const playerSource = computed(() => doc(collection(db, 'players'), props.player.id))
const q = query(collection(db, 'teams'), where('roster', 'array-contains', playerSource.value))
const { data: teams } = useCollection<Team>(q)

const storage = useFirebaseStorage()
const playerPhotoRef = computed(() =>
  props.player.photo ? storageRef(storage, props.player.photo) : null,
)
const { url } = useStorageFileUrl(playerPhotoRef)

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
  <tr>
    <td class="w-75">
      <v-avatar
        :image="url || undefined"
        icon="mdi-account-circle"
        class="me-4"
        color="grey-lighten-2"
      />
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
        :loading="isLoading"
        :to="{ name: 'team-edit', params: { id: player.id } }"
      />
      <v-btn
        v-if="can(Permissions.PLAYER_DELETE)"
        color="error"
        size="x-small"
        icon="mdi-delete"
        :loading="isLoading"
        @click="deletePlayer(player.id)"
      />
    </td>
  </tr>
</template>
