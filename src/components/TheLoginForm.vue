<script lang="ts">
import { GoogleAuthProvider } from 'firebase/auth'
export const googleAuthProvider = new GoogleAuthProvider()
</script>

<script setup lang="ts">
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { reactive, ref } from 'vue'
import { useFirebaseAuth } from 'vuefire'
import { useVuelidate } from '@vuelidate/core'
import { email, required } from '@vuelidate/validators'

const isVisible = ref(false)
const error = ref<string | null>(null)
const isLoading = ref(false)
const initialState = {
  password: '',
  email: '',
}
const state = reactive({
  ...initialState,
})
const rules = {
  email: { required, email },
  password: { required },
}
const v$ = useVuelidate(rules, state)

const auth = useFirebaseAuth()

const doSubmit = async () => {
  if (!auth) return

  error.value = null
  isLoading.value = true
  const isFormCorrect = await v$.value.$validate()
  if (!isFormCorrect) return

  try {
    await signInWithEmailAndPassword(auth, state.email, state.password)
    isVisible.value = false
  } catch (e) {
    console.error(e)
    error.value = String(e)
  } finally {
    isLoading.value = false
  }
}

const signInWithGoogle = async () => {
  if (!auth) return

  try {
    await signInWithPopup(auth, googleAuthProvider)
    isVisible.value = false
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <v-btn text="Sign In" variant="text" @click="isVisible = true" />

  <v-dialog v-model="isVisible" max-width="500">
    <v-card>
      <v-card-title>
        <div class="d-flex justify-space-between align-center ps-2">
          <h3>Sign In</h3>
          <v-btn icon="mdi-close" variant="text" @click="isVisible = false" />
        </div>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="doSubmit">
          <v-text-field
            v-model="state.email"
            :error-messages="v$.email.$errors.map((e) => e.$message).join('. ')"
            required
            label="Email"
            @blur="v$.email.$touch"
            @input="v$.email.$touch"
          />
          <v-text-field
            v-model="state.password"
            :error-messages="v$.password.$errors.map((e) => e.$message).join('. ')"
            label="Password"
            type="password"
            required
            @blur="v$.password.$touch"
            @input="v$.password.$touch"
          />
          <v-btn class="mt-2" type="submit" block color="indigo-darken-3" :loading="isLoading">
            Sign In
          </v-btn>
          <v-divider inset />
          <v-btn class="mt-2" @click.prevent="signInWithGoogle" block>Google</v-btn>
          <v-alert v-if="error" color="error" class="mt-4">
            {{ error }}
          </v-alert>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
