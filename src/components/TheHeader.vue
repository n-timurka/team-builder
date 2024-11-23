<script setup lang="ts">
import { useCurrentUser } from 'vuefire'
import TheProfileMenu from './TheProfileMenu.vue'
import TheLoginForm from './TheLoginForm.vue'
import TheSignUpForm from './TheSignUpForm.vue'

const user = useCurrentUser()
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
          <TheProfileMenu />
        </template>
        <template v-else>
          <TheLoginForm />
          <TheSignUpForm />
        </template>
      </v-row>
    </v-container>
  </v-app-bar>
</template>
