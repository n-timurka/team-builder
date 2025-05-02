<script setup lang="ts">
import { useCollection, useFirestore } from 'vuefire'
import { collection, deleteDoc, doc, updateDoc, type DocumentData } from 'firebase/firestore'
import { ref, shallowRef } from 'vue'
import { useDate } from 'vuetify'
import { useAuth } from '@/composables/useAuth'
import { UserRole, Permissions } from '@/types/user'

const date = useDate()
const db = useFirestore()
const { data: users, pending } = useCollection(collection(db, 'users'))
const { can, user } = useAuth()

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Email', key: 'email', width: '150px' },
  { title: 'Role', key: 'role', width: '150px' },
  { title: 'Created At', key: 'createdAt', width: '250px' },
  { key: 'id', sortable: false, width: '150px' },
]

const dialog = ref(false)
const model = shallowRef<UserRole>()
const activeUser = ref<DocumentData>()
const editUser = (item: DocumentData) => {
  dialog.value = true
  activeUser.value = item
  model.value = item.role
}

const isLoading = ref(false)
const saveUser = async () => {
  if (!activeUser.value || !can(Permissions.USER_UPDATE)) return

  isLoading.value = true
  try {
    const userDoc = doc(collection(db, 'users'), String(activeUser.value.id))
    await updateDoc(userDoc, {
      role: model.value,
    })
    dialog.value = false
  } finally {
    isLoading.value = false
  }
}

const deleteUser = async (id: string) => {
  if (!can(Permissions.USER_UPDATE)) return
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
  <v-sheet border rounded>
    <v-data-table :items="users" :headers="headers" :loading="pending">
      <template #top>
        <v-toolbar title="Users" color="transparent" />
      </template>
      <template v-slot:loading>
        <v-skeleton-loader type="table-row@5" />
      </template>

      <template #[`item.name`]="{ item }">
        <div class="d-flex align-center ga-4">
          <v-avatar :src="item.photo" size="large">
            <v-icon icon="mdi-account-circle" />
          </v-avatar>
          <div>
            <p class="text-body-1">{{ item.name }}</p>
            <p class="text-caption font-weight-thin text-grey-darken-1">#{{ item.id }}</p>
          </div>
        </div>
      </template>
      <template #[`item.role`]="{ value }">
        <v-chip
          variant="flat"
          size="small"
          :color="value === 'admin' ? 'primary' : 'surface-light'"
          :text="value"
        />
      </template>
      <template #[`item.createdAt`]="{ value }">
        {{ date.format(value.toDate(), 'fullDateTime') }}
      </template>
      <template #[`item.id`]="{ item }">
        <v-btn
          v-if="can(Permissions.USER_UPDATE)"
          icon="mdi-pencil"
          size="x-small"
          class="me-2"
          :loading="isLoading"
          :disabled="item.id === user?.id"
          @click="editUser(item)"
        />
        <v-btn
          v-if="can(Permissions.USER_DELETE)"
          icon="mdi-delete"
          color="error"
          size="x-small"
          :loading="isLoading"
          :disabled="item.id === user?.id"
          @click="deleteUser"
        />
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" width="400">
      <v-confirm-edit v-if="activeUser" v-model="model" @save="saveUser">
        <template v-slot:default="{ model: proxyModel, actions }">
          <v-card class="mx-auto" width="400" title="Update User">
            <template v-slot:text>
              <v-text-field v-model="activeUser.name" disabled label="Name" />
              <v-select
                v-model="proxyModel.value"
                messages="Modify the role"
                label="Role"
                :items="Object.values(UserRole)"
              />
            </template>

            <template v-slot:actions>
              <v-btn text="Close" @click.prevent="dialog = false" />
              <v-spacer />
              <component :is="actions" />
            </template>
          </v-card>
        </template>
      </v-confirm-edit>
    </v-dialog>
  </v-sheet>
</template>
