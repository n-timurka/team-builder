<script setup lang="ts">
import { useCollection, useFirestore } from 'vuefire'
import { collection } from 'firebase/firestore'
import { type Team } from '@/types/team'

const db = useFirestore()
const teams = useCollection<Team>(collection(db, 'teams'))
</script>

<template>
  <v-table>
    <thead>
      <tr>
        <th class="text-left">Name</th>
        <th class="text-left">Status</th>
        <th class="text-left">Created By</th>
        <th class="text-left">Created At</th>
        <th>&nbsp;</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="team in teams" :key="team.id">
        <td>{{ team.name }}</td>
        <td>{{ team.status }}</td>
        <td>{{ team.createdBy }}</td>
        <td>{{ team.createdAt?.toDate().toLocaleDateString() }}</td>
        <td class="text-right">
          <v-btn icon="mdi-pencil" size="x-small" class="me-2" />
          <v-btn icon="mdi-delete" color="error" size="x-small" />
        </td>
      </tr>
    </tbody>
  </v-table>
</template>
