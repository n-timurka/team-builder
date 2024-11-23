<script setup lang="ts">
import { useCurrentUser } from 'vuefire'

const user = useCurrentUser()
</script>

<template>
  <section>
    {{ user }}
    <v-empty-state
      icon="mdi-magnify"
      text="Try adjusting your search terms or filters. Sometimes less specific terms or broader queries can help you find what you're looking for."
      title="We couldn't find a match."
    />
  </section>
</template>
