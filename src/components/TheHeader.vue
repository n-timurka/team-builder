<script setup lang="ts">
import { useCollection, useCurrentUser, useFirestore } from 'vuefire'
import TheProfileMenu from './TheProfileMenu.vue'
import TheLoginForm from './TheLoginForm.vue'
import TheSignUpForm from './TheSignUpForm.vue'
import AddTeamModal from './AddTeamModal.vue'
import { collection, limit, query, where } from 'firebase/firestore'

const user = useCurrentUser()
const db = useFirestore()
const userTeam = useCollection(
  query(collection(db, 'teams'), where('createdBy', '==', user.value?.uid), limit(1)),
  { once: true },
)
</script>

<template>
  <v-app-bar color="indigo-darken-3" prominent>
    <v-container>
      <v-row class="align-center">
        <v-toolbar-title>
          <v-btn variant="plain" :to="{ name: 'home' }">TeamBuilder</v-btn>
        </v-toolbar-title>

        <v-spacer />

        <template v-if="user">
          <v-btn :to="{ name: 'users' }" class="me-4">Users</v-btn>
          <v-btn :to="{ name: 'teams' }" class="me-4">Teams</v-btn>
          <v-btn v-if="userTeam.length">{{ userTeam[0].name }}</v-btn>
          <AddTeamModal v-else />
          <TheProfileMenu class="ms-4" />
        </template>
        <template v-else>
          <TheLoginForm />
          <TheSignUpForm />
        </template>
      </v-row>
    </v-container>
  </v-app-bar>
</template>
