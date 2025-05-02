<script setup lang="ts">
import type { Team } from '@/types/team'
import { collection, deleteDoc, doc } from 'firebase/firestore'
import { computed, ref } from 'vue'
import { useFirestore, useCollection } from 'vuefire'
import { useAuth } from '@/composables/useAuth'
import { Permissions } from '@/types/user'
import { TeamStatus } from '@/types/team'

const { can } = useAuth()
const db = useFirestore()
const { data: teams, pending } = useCollection(collection(db, 'teams'))

const teamsData = computed(() => {
  if (!teams.value) return []

  return teams.value.map((team) => ({
    ...team,
    id: team.id,
    createdBy: team.createdBy,
  })) as Team[]
})

const isLoading = ref(false)
const deleteTeam = async (id: string) => {
  isLoading.value = true

  try {
    const teamDoc = doc(collection(db, 'teams'), id)
    await deleteDoc(teamDoc)
  } finally {
    isLoading.value = false
  }
}

const headers = [
  { key: 'name', title: 'Team' },
  { key: 'status', title: 'Status', width: '150px' },
  { key: 'createdBy', title: 'Creator', width: '200px' },
  { key: 'id', width: '120px', sortable: false },
]

const statusColors = {
  [TeamStatus.NEW]: 'grey',
  [TeamStatus.PENDING]: 'orange',
  [TeamStatus.APPROVED]: 'green',
  [TeamStatus.REJECTED]: 'red',
}
</script>

<template>
  <v-sheet border rounded>
    <v-data-table :items="teamsData" :headers="headers" :loading="pending">
      <template #top>
        <v-toolbar title="Teams" color="transparent" />
      </template>
      <template v-slot:loading>
        <v-skeleton-loader type="table-row@4" />
      </template>
      <template #[`item.status`]="{ item }">
        <v-chip size="small" :color="statusColors[item.status]">{{ item.status }}</v-chip>
      </template>
      <template #[`item.createdBy`]="{ item }">
        {{ item.createdBy?.name || '&ndash;' }}
      </template>
      <template #[`item.id`]="{ item }">
        <div class="d-flex justify-end">
          <v-btn
            v-if="can(Permissions.TEAM_VALIDATE)"
            size="x-small"
            icon="mdi-check"
            class="me-2"
            :loading="isLoading"
            :to="{ name: 'team-validate', params: { id: item.id } }"
          />
          <v-btn
            v-if="can(Permissions.TEAM_UPDATE)"
            size="x-small"
            icon="mdi-pencil"
            class="me-2"
            :loading="isLoading"
            :to="{ name: 'team-edit', params: { id: item.id } }"
          />
          <v-btn
            v-if="can(Permissions.TEAM_DELETE)"
            color="error"
            size="x-small"
            icon="mdi-delete"
            :loading="isLoading"
            @click="deleteTeam(item.id)"
          />
        </div>
      </template>
    </v-data-table>
  </v-sheet>
</template>
