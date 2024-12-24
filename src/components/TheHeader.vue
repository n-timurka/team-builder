<script setup lang="ts">
import TheProfileMenu from './TheProfileMenu.vue'
import TheLoginForm from './TheLoginForm.vue'
import TheSignUpForm from './TheSignUpForm.vue'
import { computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { Permissions } from '@/types/user'

const { user, teams, can } = useAuth()

const links = computed(() => [
  {
    name: 'users',
    label: 'Users',
    visible: can(Permissions.USER_VIEW),
  },
  {
    name: 'teams',
    label: 'Teams',
    visible: can(Permissions.TEAM_VIEW),
  },
  {
    name: 'players',
    label: 'Players',
    visible: can(Permissions.PLAYER_VIEW),
  },
])
const visibleLinks = computed(() => links.value.filter((link) => link.visible))
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
          <v-btn
            v-for="link in visibleLinks"
            :key="link.name"
            :to="{ name: link.name }"
            class="me-4"
          >
            {{ link.label }}
          </v-btn>
          <TheProfileMenu :user="user" :teams="teams" class="ms-4" />
        </template>
        <template v-else>
          <TheLoginForm />
          <TheSignUpForm />
        </template>
      </v-row>
    </v-container>
  </v-app-bar>
</template>
