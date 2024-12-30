<script setup lang="ts">
import { computed } from 'vue'
import { useFirebaseStorage, useStorageFileUrl } from 'vuefire'
import { ref as storageRef } from 'firebase/storage'

const props = defineProps<{
  photo?: string
}>()

const storage = useFirebaseStorage()
const playerPhotoRef = computed(() => (props.photo ? storageRef(storage, props.photo) : null))
const { url } = useStorageFileUrl(playerPhotoRef)
</script>

<template>
  <v-avatar :image="url || undefined" icon="mdi-account-circle" color="grey-lighten-2" />
</template>
