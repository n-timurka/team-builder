<script setup lang="ts">
import type { Team } from '@/types/team'
import { collection, deleteDoc, doc } from 'firebase/firestore'
import { computed, ref } from 'vue'
import { useFirestore, useCollection } from 'vuefire'

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
  { key: 'id', width: '120px' },
]
</script>

<template>
  <section>
    <div v-if="pending">Loading...</div>
    <div v-else-if="teams.length">
      <v-data-table :items="teamsData" :headers="headers">
        <template #item.status="{ item }">
          <v-chip size="small">{{ item.status }}</v-chip>
        </template>
        <template #item.createdBy="{ item }">
          {{ item.createdBy?.name || '&ndash;' }}
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
            @click="deleteTeam(item.id)"
          />
        </template>
      </v-data-table>
    </div>
  </section>
</template>
