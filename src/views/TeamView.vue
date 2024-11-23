<script setup lang="ts">
import { useDocument, useFirestore } from 'vuefire'
import { collection, doc } from 'firebase/firestore'

const db = useFirestore()
const team = useDocument(doc(collection(db, 'teams'), '1'))
</script>

<template>
  <v-card>
    Team Page
    {{ team }}
  </v-card>
</template>
