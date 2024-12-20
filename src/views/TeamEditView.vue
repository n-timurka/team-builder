<script setup lang="ts">
import { useCollection, useDocument, useFirestore } from 'vuefire'
import { collection, doc, query, Timestamp, updateDoc, where } from 'firebase/firestore'
import { computed, ref, watch, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { TeamStatus, type Team } from '@/types/team'
import { useUserStore } from '@/stores/userStore'
import { UserRole } from '@/types/user'
import { storeToRefs } from 'pinia'
import { PlayerPosition, type Player } from '@/types/player'

const route = useRoute()
const db = useFirestore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const teamSource = computed(() => doc(collection(db, 'teams'), String(route.params.id)))
const { data: team, pending } = useDocument<Team>(teamSource)
const author = computed(() => {
  if (!team.value) return

  return {
    ...team.value.createdBy,
    id: team.value.createdBy.id,
  }
})

const error = ref(false)
watchEffect(() => {
  if (!user.value || !team.value) return

  if (user.value?.role !== UserRole.ADMIN && author.value?.id !== user.value?.id) {
    error.value = true
  } else {
    error.value = false
  }
})

const addPlayerToTeam = (player: Player) => {
  team.value?.roster?.push(player)
}
const removePlayerFromTeam = (player: Player) => {
  team.value?.roster?.splice(team.value?.roster?.indexOf(player), 1)
}

const isSaving = ref(false)
const updateTeam = async () => {
  isSaving.value = true
  try {
    await updateDoc(teamSource.value, {
      ...team.value,
      roster: team.value?.roster?.map(({ id }) => doc(collection(db, 'players'), id)),
      createdBy: doc(collection(db, 'users'), team.value?.createdBy.id),
      updatedAt: Timestamp.fromDate(new Date()),
    })
  } finally {
    isSaving.value = false
  }
}

const squad = computed(() => {
  if (!team.value?.roster) return []

  const positions: Record<PlayerPosition, { title: string; players: Player[] }> = {
    [PlayerPosition.GUARD]: { title: 'Guards', players: [] },
    [PlayerPosition.FORWARD]: { title: 'Forwards', players: [] },
    [PlayerPosition.CENTER]: { title: 'Centers', players: [] },
  }

  team.value.roster.forEach((player) => {
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
          title: player.name,
          subtitle: `#${player.number}`,
          prependAvatar: player.photo || 'mdi-account-circle',
        })),
      )

      return result
    },
    [] as Record<string, string>[],
  )
})

const searchInput = ref<string>('')
const searchTerm = ref<string>('')
const debounceTimeout = ref<number | null>(null)

const debounceSearch = (input: string, delay = 500) => {
  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value)
  }
  debounceTimeout.value = setTimeout(() => {
    searchTerm.value = input.trim().toLowerCase()
  }, delay)
}
watch(
  () => searchInput.value,
  (value) => debounceSearch(value),
)
const usersQuery = computed(() => {
  if (searchTerm.value) {
    return query(collection(db, 'players'), where('fullName', 'array-contains', searchTerm.value))
  }

  return null
})
const { data: players, pending: playersPending } = useCollection<Player>(usersQuery)
</script>

<template>
  <v-skeleton-loader v-if="pending"></v-skeleton-loader>
  <div v-else-if="error">You don't have rights to see this page</div>
  <v-sheet v-else-if="team">
    <v-row>
      <v-col cols="8">
        <v-text-field v-model="team.name" label="Team Name" variant="solo" />
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="team.status"
          label="Status"
          :disabled="user?.role !== UserRole.ADMIN"
          :items="Object.values(TeamStatus)"
          variant="solo"
          class="w-100"
        />
      </v-col>
      <v-col cols="2">
        <v-row>
          <v-col>
            <v-btn class="v-col-auto" color="primary" block :loading="isSaving" @click="updateTeam">
              Save
            </v-btn>
          </v-col>
          <v-col>
            <v-btn :to="{ name: 'team', params: { id: team.id } }" target="_blank" block>
              Preview
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row>
      <v-col md="8">
        <v-card class="d-flex">
          <v-row>
            <v-col md="6" class="pa-8">
              <v-text-field
                v-model="searchInput"
                append-inner-icon="mdi-magnify"
                variant="solo"
                clearable
                clear-icon="mdi-close"
                placeholder="Start typing to search players..."
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
                <v-btn size="small" prepend-icon="mdi-plus" text="Create New Player" />
              </div>
            </v-col>

            <v-col md="6">
              <v-list class="cols-6" :items="squadData" item-props>
                <template #append="{ item }">
                  <v-btn v-show="false" icon="mdi-pencil" variant="text" size="small" />
                  <v-btn
                    color="error"
                    icon="mdi-delete"
                    variant="text"
                    size="small"
                    @click="removePlayerFromTeam(item)"
                  />
                </template>
              </v-list>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col md="4">
        <v-card>
          <v-list>
            <v-list-item>
              <v-list-item-subtitle>Created At</v-list-item-subtitle>
              <v-list-item-title>{{
                team.createdAt.toDate().toLocaleDateString()
              }}</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle>Created By</v-list-item-subtitle>
              <v-list-item-title>{{ team.createdBy?.name || '&ndash;' }}</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle>Logo</v-list-item-subtitle>
              <v-file-input prepend-icon="" prepend-inner-icon="mdi-file" />
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-sheet>
  <v-empty-state
    v-else
    headline="Whoops, 404"
    title="Page not found"
    text="The page you were looking for does not exist"
  />
</template>
