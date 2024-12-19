<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useFirebaseAuth, useCurrentUser } from 'vuefire'
import { signOut } from 'firebase/auth'
import AddTeamModal from './AddTeamModal.vue'
import { useUserStore } from '@/stores/userStore'

const auth = useFirebaseAuth()
const router = useRouter()
const user = useCurrentUser()
const userStore = useUserStore()

const handleSignOut = async () => {
  if (!auth) return

  await signOut(auth)
  router.push({ name: 'home' })
}
</script>

<template>
  <v-menu v-if="user">
    <template v-slot:activator="{ props }">
      <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props">
        <v-avatar>
          <v-img v-if="user.photoURL" alt="John" :src="user.photoURL" />
          <v-icon v-else icon="mdi-account-circle" color="white" />
        </v-avatar>
      </v-btn>
    </template>

    <v-list>
      <v-list-item
        v-if="userStore.team"
        subtitle="Your Team"
        prepend-avatar="https://cdn.vuetifyjs.com/images/john.png"
      >
        {{ userStore.team.name }}
        <template v-slot:append>
          <v-btn
            icon="mdi-pencil"
            size="small"
            variant="text"
            :to="{ name: 'team-edit', params: { id: userStore.team.id } }"
          />
        </template>
      </v-list-item>
      <v-list-item v-else>
        <AddTeamModal />
      </v-list-item>
      <v-divider />
      <v-list-item prepend-icon="mdi-account">
        <v-list-item-title>Account</v-list-item-title>
      </v-list-item>
      <v-list-item prepend-icon="mdi-account" @click="handleSignOut">
        <v-list-item-title>Sign Out</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
