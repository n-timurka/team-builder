<script setup lang="ts">
import { useDocument, useFirestore } from 'vuefire'
import { collection, doc, Timestamp, updateDoc } from 'firebase/firestore'
import { computed, ref, watch, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { TeamStatus, type Team } from '@/types/team'
import { useUserStore } from '@/stores/userStore'
import { UserRole } from '@/types/user'

const route = useRoute()
const db = useFirestore()
const userStore = useUserStore()

const teamSource = computed(() => doc(collection(db, 'teams'), route.params.id))
const { data: team, pending } = useDocument<Team>(teamSource)
const error = ref(false)

watchEffect(() => {
  if (!userStore.user || !team.value) return

  if (userStore.user?.role !== UserRole.ADMIN && team.value?.createdBy !== userStore.user?.id) {
    error.value = true
  } else {
    error.value = false
  }
})

const isSaving = ref(false)
const updateTeam = async () => {
  isSaving.value = true
  try {
    await updateDoc(teamSource.value, {
      ...team.value,
      updatedAt: Timestamp.fromDate(new Date()),
    })
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <v-skeleton-loader v-if="pending"></v-skeleton-loader>
  <div v-else-if="error">You don't have rights to see this page</div>
  <v-sheet v-else-if="team">
    <v-row>
      <v-col cols="9">
        <v-text-field v-model="team.name" label="Team Name" variant="solo" />
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="team.status"
          label="Status"
          :items="Object.values(TeamStatus)"
          variant="solo"
          class="w-100"
        />
      </v-col>
      <v-col>
        <v-btn class="v-col-auto" color="primary" block :loading="isSaving" @click="updateTeam"
          >Save</v-btn
        >
      </v-col>
    </v-row>
    {{ team }}
  </v-sheet>
  <v-empty-state
    v-else
    headline="Whoops, 404"
    title="Page not found"
    text="The page you were looking for does not exist"
  />
</template>
