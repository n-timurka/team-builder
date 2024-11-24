<script setup lang="ts">
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { addDoc, collection, Timestamp } from 'firebase/firestore'
import { ref, reactive } from 'vue'
import { useCurrentUser, useFirestore } from 'vuefire'

const db = useFirestore()
const user = useCurrentUser()

const error = ref<string | null>(null)
const isLoading = ref(false)
const initialState = {
  name: '',
}
const state = reactive({
  ...initialState,
})
const rules = {
  name: { required },
}
const v$ = useVuelidate(rules, state)

const doSubmit = async () => {
  error.value = null
  isLoading.value = true
  const isFormCorrect = await v$.value.$validate()
  if (!isFormCorrect) return

  try {
    await addDoc(collection(db, 'teams'), {
      name: state.name,
      status: 'new',
      createdAt: Timestamp.fromDate(new Date()),
      createdBy: user.value?.uid,
    })
  } catch (e) {
    console.error(e)
    error.value = e
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <v-form @submit.prevent="doSubmit">
    <v-text-field
      v-model="state.name"
      :error-messages="v$.name.$errors.map((e) => e.$message).join('. ')"
      required
      label="Name"
      @blur="v$.name.$touch"
      @input="v$.name.$touch"
    />
    <v-btn class="mt-2" type="submit" block color="indigo-darken-3" :loading="isLoading">
      Create
    </v-btn>
    <v-alert v-if="error" color="error" class="mt-4">
      {{ error }}
    </v-alert>
  </v-form>
</template>
