<script setup lang="ts">
import { collection, where, query } from 'firebase/firestore'
import { useCollection, useFirestore } from 'vuefire'

const db = useFirestore()

const q = query(collection(db, 'teams'), where('status', '==', 'approved'))
const { data: teams, pending } = useCollection(q)
</script>

<template>
  <section>
    <div v-if="pending">Loading...</div>
    <div v-else-if="teams.length">{{ teams }}</div>
    <v-empty-state
      v-else
      icon="mdi-magnify"
      text="Try adjusting your search terms or filters. Sometimes less specific terms or broader queries can help you find what you're looking for."
      title="We couldn't find a match."
    />
  </section>
</template>
