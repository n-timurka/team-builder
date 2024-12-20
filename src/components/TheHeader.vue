<script setup lang="ts">
import TheProfileMenu from './TheProfileMenu.vue'
import TheLoginForm from './TheLoginForm.vue'
import TheSignUpForm from './TheSignUpForm.vue'
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const links = [
  { name: 'users', label: 'Users', role: 'admin' },
  { name: 'teams', label: 'Teams', role: 'admin' },
  { name: 'players', label: 'Players', role: 'admin' },
]
const filteredLinks = computed(() =>
  links.filter((link) => !link.role || link.role === user.value?.role),
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
          <v-btn
            v-for="link in filteredLinks"
            :key="link.name"
            :to="{ name: link.name }"
            class="me-4"
          >
            {{ link.label }}
          </v-btn>
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
