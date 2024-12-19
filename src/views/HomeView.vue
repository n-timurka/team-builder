<script setup lang="ts">
import { TeamStatus, type Team } from '@/types/team'
import { collection, where, query } from 'firebase/firestore'
import { useCollection, useFirestore } from 'vuefire'

const db = useFirestore()

const q = query(collection(db, 'teams'), where('status', '==', TeamStatus.APPROVED))
const { data: teams, pending } = useCollection<Team>(q)
</script>

<template>
  <section>
    <div v-if="pending">Loading...</div>
    <div v-else-if="teams.length">
      <v-row>
        <v-col cols="3" v-for="team in teams" :key="team.id">
          <v-card>
            <v-card-title>{{ team.name }}</v-card-title>
            <v-card-actions>
              <v-btn :to="{ name: 'team', params: { id: team.id } }">View</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <v-empty-state
      v-else
      icon="mdi-magnify"
      text="Try adjusting your search terms or filters. Sometimes less specific terms or broader queries can help you find what you're looking for."
      title="We couldn't find a match."
    />
  </section>
</template>
