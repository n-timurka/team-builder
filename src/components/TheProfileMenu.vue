<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useFirebaseAuth } from 'vuefire'
import { signOut } from 'firebase/auth'
import AddTeamModal from './AddTeamModal.vue'
import type { User } from '@/types/user'
import type { Team } from '@/types/team'

defineProps<{
  user: User
  teams: Team[]
}>()

const auth = useFirebaseAuth()
const router = useRouter()

const handleSignOut = async () => {
  if (!auth) return

  await signOut(auth)
  router.push({ name: 'home' })
}
</script>

<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn v-if="user" icon="mdi-dots-vertical" variant="text" v-bind="props">
        <v-avatar :src="user.photo">
          <v-icon icon="mdi-account-circle" color="white" />
        </v-avatar>
      </v-btn>
    </template>

    <v-list>
      <v-list-item v-if="user" :subtitle="user.email" :title="user.name || 'User Name'">
        <template #prepend>
          <v-avatar :src="user.photo" icon="mdi-account-circle" />
        </template>
      </v-list-item>
      <v-divider />
      <v-list-subheader title="Your Teams" />
      <template v-if="teams.length > 0">
        <v-list-item v-for="team in teams" :key="team.id">
          {{ team.name }}
          <template #prepend>
            <v-avatar :src="team.logo" icon="mdi-cancel" />
          </template>
          <template #append>
            <v-btn
              icon="mdi-pencil"
              size="x-small"
              variant="text"
              :to="{ name: 'team-edit', params: { id: team.id } }"
            />
          </template>
        </v-list-item>
      </template>
      <v-list-item class="text-center">
        <AddTeamModal />
      </v-list-item>
      <v-divider />
      <v-list-item prepend-icon="mdi-account">
        <v-list-item-title>Account</v-list-item-title>
      </v-list-item>
      <v-list-item prepend-icon="mdi-logout" @click="handleSignOut">
        <v-list-item-title>Sign Out</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
