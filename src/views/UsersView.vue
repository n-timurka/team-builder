<script setup lang="ts">
import { useCollection, useFirestore } from 'vuefire'
import { collection } from 'firebase/firestore'

const db = useFirestore()
const users = useCollection(collection(db, 'users'))
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
          <v-btn icon="mdi-pencil" size="x-small" class="me-2" />
          <v-btn icon="mdi-delete" color="error" size="x-small" />
        </td>
      </tr>
    </tbody>
  </v-table>
</template>
