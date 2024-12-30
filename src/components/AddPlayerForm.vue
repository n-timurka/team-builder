<script setup lang="ts">
import { PlayerPosition } from '@/types/player'
import useVuelidate, { type ErrorObject } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { addDoc, collection, Timestamp } from 'firebase/firestore'
import { ref, reactive } from 'vue'
import { ref as storageRef } from 'firebase/storage'
import { useCurrentUser, useFirebaseStorage, useFirestore, useStorageFile } from 'vuefire'

const emits = defineEmits(['created'])

const db = useFirestore()
const user = useCurrentUser()

const error = ref<string | null>(null)
const isLoading = ref(false)
type AddPlayerModel = {
  name: string
  position?: PlayerPosition
  number: string
  birthDate?: string
  photo?: File
}
const initialState: AddPlayerModel = {
  name: '',
  position: undefined,
  number: '',
  birthDate: undefined,
  photo: undefined,
}
const state = reactive({
  ...initialState,
})
const rules = {
  name: { required },
  number: { required },
  position: { required },
  birthDate: { required },
}
const v$ = useVuelidate<AddPlayerModel>(rules, state)

const storage = useFirebaseStorage()
const mountainFileRef = storageRef(storage, `players/${state.name}`)
const { url, upload } = useStorageFile(mountainFileRef)

const doSubmit = async () => {
  const isFormCorrect = await v$.value.$validate()
  if (!isFormCorrect) return

  error.value = null
  isLoading.value = true

  try {
    if (state.photo) {
      await upload(state.photo)
    }

    const player = await addDoc(collection(db, 'players'), {
      ...Object.fromEntries(Object.entries(state).filter(([_, v]) => v != null)),
      photo: url.value,
      fullName: state.name.toLocaleLowerCase().split(' '),
      createdAt: Timestamp.fromDate(new Date()),
      createdBy: user.value?.uid,
    })
    emits('created', player)
  } catch (e) {
    console.error(e)
    error.value = String(e)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <v-form @submit.prevent="doSubmit">
    <v-text-field
      v-model="state.name"
      :error-messages="v$.name.$errors.map((e: ErrorObject) => e.$message).join('. ')"
      required
      label="Name"
      @blur="v$.name.$touch"
      @input="v$.name.$touch"
    />

    <v-row>
      <v-col>
        <v-text-field
          v-model="state.number"
          :error-messages="v$.number.$errors.map((e: ErrorObject) => e.$message).join('. ')"
          required
          label="Number"
          @blur="v$.number.$touch"
          @input="v$.number.$touch"
        />
      </v-col>

      <v-col>
        <v-select
          v-model="state.position"
          :items="Object.values(PlayerPosition)"
          :error-messages="v$.position.$errors.map((e: ErrorObject) => e.$message).join('. ')"
          required
          label="Position"
        />
      </v-col>
    </v-row>

    <v-text-field
      v-model="state.birthDate"
      :error-messages="v$.birthDate.$errors.map((e: ErrorObject) => e.$message).join('. ')"
      required
      label="Date of Birth"
      @blur="v$.birthDate.$touch"
      @input="v$.birthDate.$touch"
    />

    <v-file-input
      v-model="state.photo"
      label="Player Photo"
      show-size
      prepend-icon=""
      prepend-inner-icon="mdi-file"
    />

    <v-row>
      <v-col>
        <v-btn text="Reset" />
      </v-col>
      <v-col class="text-end">
        <v-btn text="Create" type="submit" color="indigo-darken-3" :loading="isLoading" />
      </v-col>
    </v-row>

    <v-alert v-if="error" color="error" class="mt-4">
      {{ error }}
    </v-alert>
  </v-form>
</template>
