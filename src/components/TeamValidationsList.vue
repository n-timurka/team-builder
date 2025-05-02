<script lang="ts" setup>
import { ValidationStatus, type Validation } from '@/types/validation'

defineProps<{
  validations: Validation[]
}>()

const statusColor = (status: ValidationStatus) => {
  const colors: Record<ValidationStatus, string> = {
    [ValidationStatus.PENDING]: 'primary',
    [ValidationStatus.APPROVED]: 'green',
    [ValidationStatus.REJECTED]: 'red',
  }

  return colors[status]
}
</script>

<template>
  <section>
    <v-list v-if="validations.length > 0">
      <v-list-item v-for="v in validations" :key="v.id" class="py-3 border-t">
        <v-list-item-title>
          {{ v.createdAt.toDate().toLocaleDateString() }}
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ v.createdBy.name }} ({{ v.createdBy.email }})
        </v-list-item-subtitle>
        <div class="my-2 d-flex justify-space-between align-center">
          <v-chip :color="statusColor(v.status)" :text="v.status" />
          <p>{{ `Checked By: ${v.validatedBy.name}` }}</p>
        </div>
        <v-alert :text="v.message" />
      </v-list-item>
    </v-list>
    <v-alert
      v-else
      type="info"
      variant="tonal"
      text="There are no validations yet. Please complete the form and hit the 'Validate' button"
    />
  </section>
</template>
