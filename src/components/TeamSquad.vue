<script setup lang="ts">
import { PlayerPosition, type Player } from '@/types/player'
import type { Team } from '@/types/team'
import { collection, where, query } from 'firebase/firestore'
import { computed, ref, watch } from 'vue'
import { useCollection, useFirestore } from 'vuefire'
import AddPlayerModal from './AddPlayerModal.vue'

const roster = defineModel<Player[]>({ required: true })
defineProps<{
  team: Team
}>()

const db = useFirestore()
const squad = computed(() => {
  const positions: Record<PlayerPosition, { title: string; players: Player[] }> = {
    [PlayerPosition.GUARD]: { title: 'Guards', players: [] },
    [PlayerPosition.FORWARD]: { title: 'Forwards', players: [] },
    [PlayerPosition.CENTER]: { title: 'Centers', players: [] },
  }

  roster.value.forEach((player) => {
    if (!player.position) return

    positions[player.position].players.push(player)
  })

  return positions
})
const squadData = computed(() => {
  return Object.values(squad.value).reduce(
    (result, item) => {
      result.push(
        { type: 'subheader', title: item.title },
        ...item.players.map((player) => ({
          id: player.id,
          title: player.name,
          subtitle: `#${player.number}`,
          photo: player.photo,
        })),
      )

      return result
    },
    [] as Record<string, string | undefined>[],
  )
})

const addPlayerToTeam = (player: Player) => {
  roster.value.push(player)
}
const removePlayerFromTeam = (id: string) => {
  roster.value = roster.value.filter((player) => player.id !== id)
}

const searchInput = ref<string>('')
const searchTerm = ref<string>('')
const debounceTimeout = ref<number | null>(null)

const debounceSearch = (input: string, delay = 500) => {
  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value)
  }
  debounceTimeout.value = setTimeout(() => {
    searchTerm.value = input ? input.trim().toLowerCase() : ''
  }, delay)
}
watch(
  () => searchInput.value,
  (value) => {
    if (value) debounceSearch(value)
  },
)
const q = computed(() => {
  if (searchTerm.value) {
    return query(collection(db, 'players'), where('fullName', 'array-contains', searchTerm.value))
  }

  return null
})
const { data: players, pending: playersPending } = useCollection<Player>(q)
</script>

<template>
  <v-row>
    <v-col md="6" class="pa-8">
      <v-text-field
        v-model="searchInput"
        append-inner-icon="mdi-magnify"
        variant="solo"
        clearable
        clear-icon="mdi-close"
        placeholder="Start typing to search players..."
        @click:clear="searchTerm = ''"
      />
      <v-progress-circular v-if="playersPending" indeterminate />
      <v-data-iterator v-else-if="players.length > 0" :items="players">
        <template v-slot:default="{ items }">
          <template v-for="(item, i) in items" :key="i">
            <v-list-item :title="item.raw.name" :subtitle="item.raw.position">
              <template #prepend>
                <v-avatar :image="item.raw?.photo" icon="mdi-account-circle" />
              </template>
              <template #append>
                <v-btn
                  icon="mdi-chevron-right"
                  size="small"
                  variant="text"
                  @click="addPlayerToTeam(item.raw)"
                />
              </template>
            </v-list-item>
          </template>
        </template>
      </v-data-iterator>
      <v-alert v-else text="Nothing was found..." />
      <div class="d-flex justify-center mt-4">
        <AddPlayerModal @created="addPlayerToTeam" />
      </div>
    </v-col>

    <v-col md="6">
      <v-list class="cols-6" :items="squadData" item-props>
        <template #prepend="{ item }">
          <v-avatar :image="item.photo" icon="mdi-account-circle" />
        </template>
        <template #append="{ item }">
          <v-btn icon="mdi-pencil" variant="text" size="small" />
          <v-btn
            v-if="item.id"
            color="error"
            icon="mdi-delete"
            variant="text"
            size="small"
            @click="removePlayerFromTeam(item.id)"
          />
        </template>
      </v-list>
    </v-col>
  </v-row>
</template>
