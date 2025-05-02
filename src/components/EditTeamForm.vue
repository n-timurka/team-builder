<script setup lang="ts">
import type { Team } from '@/types/team'
import { computed } from 'vue'
import { useFirebaseStorage, useStorageFileUrl } from 'vuefire'
import { ref as storageRef } from 'firebase/storage'
import type { EditTeamFormType } from '@/types/editTeamForm'

const formData = defineModel<EditTeamFormType>({ required: true })
const props = defineProps<{
  team: Team
}>()

const storage = useFirebaseStorage()
const logoFileRef = computed(() => (props.team.logo ? storageRef(storage, props.team.logo) : null))
const { url } = useStorageFileUrl(logoFileRef)
</script>

<template>
  <section>
    <div v-if="url" class="d-flex justify-center">
      <v-img :src="url" width="200" height="200" />
    </div>

    <v-file-input
      v-model="formData.logo"
      label="Logo"
      prepend-inner-icon="mdi-file"
      prepend-icon=""
      accept="image/*"
      show-size
    />
    <v-text-field
      v-model="formData.slug"
      label="Team Slug"
      :hint="`http://site.com/${formData.slug}`"
    />
    <v-text-field v-model="formData.city" label="City" />
    <v-text-field v-model="formData.arena" label="Arena" />
    <v-row>
      <v-col cols="6">
        <v-text-field v-model="formData.colors.primary" label="Primary Color" />
      </v-col>
      <v-col cols="6">
        <v-text-field v-model="formData.colors.secondary" label="Secondary Color" />
      </v-col>
    </v-row>
  </section>
</template>
