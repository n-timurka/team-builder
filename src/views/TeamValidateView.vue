<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { collection, doc, query, Timestamp, updateDoc, where } from 'firebase/firestore'
import { useCollection, useDocument, useFirebaseStorage, useFirestore } from 'vuefire'
import type { Team } from '@/types/team'
import EditTeamForm from '@/components/EditTeamForm.vue'
import TeamValidationsList from '@/components/TeamValidationsList.vue'
import type { Validation } from '@/types/validation'
import type { EditTeamFormType } from '@/types/editTeamForm'
import { ref as storageRef, uploadBytes } from 'firebase/storage'
import TeamSquad from '@/components/TeamSquad.vue'
import type { Player } from '@/types/player'

const route = useRoute()
const db = useFirestore()

const teamSource = computed(() => doc(collection(db, 'teams'), String(route.params.id)))
const { data: team, pending } = useDocument<Team>(teamSource)

const q = computed(() =>
  team.value ? query(collection(db, 'validations'), where('teamId', '==', team.value.id)) : null,
)
const { data: validations } = useCollection<Validation>(q)

const roster = ref<Player[]>()
const formInitData = {
  name: '',
  logo: null,
  slug: '',
  city: '',
  arena: '',
  colors: {
    primary: '',
    secondary: '',
  },
}
const formData = reactive<EditTeamFormType>(formInitData)
const resetForm = () => {
  if (!team.value) return

  Object.assign(formData, {
    name: team.value.name,
    logo: null,
    slug: team.value.slug,
    city: team.value.city,
    arena: team.value.arena,
    colors: {
      primary: team.value.colors?.primary,
      secondary: team.value.colors?.secondary,
    },
  })
  roster.value = team.value.roster ? [...team.value.roster] : []
}

watch(
  () => team.value,
  () => {
    resetForm()
  },
  { immediate: true },
)

const isSaving = ref(false)
const storage = useFirebaseStorage()
// Handle file upload
const uploadLogo = async () => {
  if (!formData.logo || !team.value) return

  try {
    const { metadata } = await uploadBytes(
      storageRef(storage, `teams/${team.value.id}`),
      formData.logo,
    )

    return metadata.fullPath
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}
const saveTeam = async () => {
  isSaving.value = true
  try {
    const logo = await uploadLogo()

    await updateDoc(teamSource.value, {
      ...formData,
      ...(logo && { logo }),
      roster: roster.value?.map(({ id }) => doc(collection(db, 'players'), id)) || [],
      updatedAt: Timestamp.fromDate(new Date()),
    })
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="9">
        <v-card>
          <v-card-title class="d-flex justify-space-between ma-4">
            <span>
              Update Team Data: <strong>{{ team?.name }}</strong>
            </span>
            <div class="d-flex align-center">
              <div class="text-caption me-2">
                Last update: {{ team?.createdAt.toDate().toLocaleDateString() }}
              </div>
              <v-btn color="primary" :loading="isSaving" @click="saveTeam">Save</v-btn>
            </div>
          </v-card-title>
          <v-card-text v-if="pending" class="d-flex justify-center align-center height-screen">
            <v-progress-circular indeterminate color="primary" size="large" />
          </v-card-text>
          <v-card-text v-else-if="team">
            <v-text-field v-model="formData.name" label="Team Name" />

            <v-row>
              <v-col cols="4">
                <EditTeamForm v-model="formData" :team="team" />
              </v-col>
              <v-col cols="8">
                <TeamSquad v-if="roster" v-model="roster" :team="team" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="3">
        <v-card>
          <v-card-title class="mt-4 d-flex justify-space-between align-center">
            <span>Validations</span>

            <v-btn @click="saveTeam">Validate</v-btn>
          </v-card-title>

          <v-card-text>
            <TeamValidationsList :validations="validations" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
