<script lang="ts" setup>
import { useUserStore } from '@/stores/userStore'
import type { Team } from '@/types/team'
import { UserRole } from '@/types/user'
import { doc, collection } from 'firebase/firestore'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useDocument, useFirestore } from 'vuefire'

const route = useRoute()
const db = useFirestore()

const userStore = useUserStore()

const teamSource = computed(() => doc(collection(db, 'teams'), String(route.params.id)))
const { data: team, pending } = useDocument<Team>(teamSource)

const canEdit = computed(
  () => userStore.user?.role === UserRole.ADMIN || userStore.user?.id === team.value?.createdBy,
)
</script>

<template>
  <section>
    <div v-if="pending">Loading...</div>
    <div v-else-if="team">
      <v-row>
        <v-col cols="10">
          <h1>{{ team.name }}</h1>
        </v-col>
        <v-spacer />
        <v-col>
          <v-btn v-if="canEdit" :to="{ name: 'team-edit', params: { id: team.id } }">Edit</v-btn>
        </v-col>
      </v-row>
      {{ team }}
    </div>
    <v-empty-state
      v-else
      icon="mdi-magnify"
      text="Try adjusting your search terms or filters. Sometimes less specific terms or broader queries can help you find what you're looking for."
      title="We couldn't find a team."
    />
  </section>
</template>
