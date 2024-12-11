<script lang="ts">
import { GoogleAuthProvider } from 'firebase/auth'
import { UserRole } from '@/types/user'
export const googleAuthProvider = new GoogleAuthProvider()
</script>

<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { email, required } from '@vuelidate/validators'
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { setDoc, doc } from 'firebase/firestore'
import { useFirebaseAuth, useFirestore } from 'vuefire'

const router = useRouter()
const error = ref<string | null>(null)
const isLoading = ref(false)
const initialState = {
  password: '',
  confirm: '',
  email: '',
}
const state = reactive({
  ...initialState,
})
const rules = {
  email: { required, email },
  password: { required },
  confirm: { required },
}
const v$ = useVuelidate(rules, state)

const db = useFirestore()
const auth = useFirebaseAuth()

const doSubmit = async () => {
  if (!auth) return

  error.value = null
  const isFormCorrect = await v$.value.$validate()
  if (!isFormCorrect) return

  isLoading.value = true
  try {
    const { user } = await createUserWithEmailAndPassword(auth, state.email, state.password)
    await setDoc(doc(db, 'users', user.uid), {
      email: state.email,
      name: user.displayName,
      photo: user.photoURL,
      role: UserRole.USER,
      createdAt: new Date(),
    })
    router.push({ name: 'home' })
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
    const { user } = await signInWithPopup(auth, googleAuthProvider)
    await setDoc(doc(db, 'users', user.uid), {
      email: state.email,
      name: user.displayName,
      photo: user.photoURL,
      role: UserRole.USER,
      createdAt: new Date(),
    })
    router.push({ name: 'home' })
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <v-dialog max-width="500">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn v-bind="activatorProps" text="Sign Up" variant="text" />
    </template>

    <template v-slot:default="{ isActive }">
      <v-card>
        <v-card-title>
          <div class="d-flex justify-space-between align-center ps-2">
            <h3>Sign Up</h3>
            <v-btn icon="mdi-close" variant="text" @click="isActive.value = false" />
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
            <v-text-field
              v-model="state.confirm"
              :error-messages="v$.confirm.$errors.map((e) => e.$message).join('. ')"
              label="Confirm"
              type="password"
              required
              @blur="v$.confirm.$touch"
              @input="v$.confirm.$touch"
            />
            <v-btn class="mt-2" type="submit" block color="indigo-darken-3" :loading="isLoading">
              Sign Up
            </v-btn>
            <v-divider inset />
            <v-btn class="mt-2" @click.prevent="signInWithGoogle" block>Google</v-btn>
            <v-alert v-if="error" color="error" class="mt-4">
              {{ error }}
            </v-alert>
          </v-form>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>
