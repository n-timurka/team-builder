<script lang="ts" setup>
import { useAuth } from '@/composables/useAuth'
import type { Team } from '@/types/team'
import { Permissions } from '@/types/user'
import { doc, collection } from 'firebase/firestore'
import { ref as storageRef } from 'firebase/storage'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useDocument, useFirebaseStorage, useFirestore, useStorageFileUrl } from 'vuefire'

const route = useRoute()
const db = useFirestore()
const { user, can } = useAuth()

const teamSource = computed(() => doc(collection(db, 'teams'), String(route.params.id)))
const { data: team, pending } = useDocument<Team>(teamSource)

const canEdit = computed(
  () => can(Permissions.TEAM_UPDATE) || user.value?.id === team.value?.createdBy.id,
)

const storage = useFirebaseStorage()
const logoFileRef = computed(() =>
  team.value?.logo ? storageRef(storage, team.value?.logo) : null,
)
const { url } = useStorageFileUrl(logoFileRef)
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
        <v-col class="text-end">
          <v-btn
            v-if="canEdit"
            text="Edit"
            size="small"
            :to="{ name: 'team-edit', params: { id: team.id } }"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="3">
          <v-img
            v-if="url"
            :width="300"
            aspect-ratio="1/1"
            cover
            :src="url"
            class="bg-grey-lighten-2"
          />
        </v-col>
        <v-col>
          <h2>Squad</h2>
          <v-table>
            <thead>
              <tr>
                <th class="text-left w-10">#</th>
                <th class="text-left">Name</th>
                <th class="text-left">Position</th>
                <th class="text-left">Birthdate</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="player in team.roster" :key="player.id">
                <td>{{ player.number }}</td>
                <td>
                  <v-avatar :src="player.photo" icon="mdi-account" />
                  {{ player.name }}
                </td>
                <td>{{ player.position }}</td>
                <td>{{ player.birthDate }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
    </div>
    <v-empty-state
      v-else
      icon="mdi-magnify"
      text="Try adjusting your search terms or filters. Sometimes less specific terms or broader queries can help you find what you're looking for."
      title="We couldn't find a team."
    />
  </section>
</template>
