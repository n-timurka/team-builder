<script setup lang="ts">
import { useCollection, useFirestore } from 'vuefire'
import { collection, deleteDoc, doc } from 'firebase/firestore'
import { ref } from 'vue'

const db = useFirestore()
const users = useCollection(collection(db, 'users'))

const isLoading = ref(false)
const deleteUser = async (id: string) => {
  isLoading.value = true

  try {
    const teamDoc = doc(collection(db, 'users'), id)
    await deleteDoc(teamDoc)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <v-table>
    <thead>
      <tr>
        <th class="text-left">Name</th>
        <th class="text-left">UID</th>
        <th class="text-left">Email</th>
        <th class="text-left">Provider</th>
        <th class="text-left">Role</th>
        <th>&nbsp;</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="user in users" :key="user.id">
        <td>{{ user.name }}</td>
        <td>{{ user.id }}</td>
        <td>{{ user.email }}</td>
        <td>{{ user.provider }}</td>
        <td>
          <v-chip
            variant="flat"
            size="small"
            :color="user.role === 'admin' ? 'primary' : 'secondary'"
            >{{ user.role }}</v-chip
          >
        </td>
        <td>
          <v-btn icon="mdi-pencil" size="x-small" class="me-2" :loading="isLoading" />
          <v-btn
            icon="mdi-delete"
            color="error"
            size="x-small"
            :loading="isLoading"
            @click="deleteUser"
          />
        </td>
      </tr>
    </tbody>
  </v-table>
</template>
