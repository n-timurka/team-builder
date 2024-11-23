<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useFirebaseAuth, useCurrentUser } from 'vuefire'
import { signOut } from 'firebase/auth'

const auth = useFirebaseAuth()
const router = useRouter()
const user = useCurrentUser()

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
      <v-list-item>
        <template v-slot:prepend>
          <v-icon icon="mdi-account" />
        </template>
        <v-list-item-title>Account</v-list-item-title>
      </v-list-item>
      <v-list-item @click="handleSignOut">
        <v-list-item-title>Sign Out</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
