import type { Team } from '@/types/team'
import type { User } from '@/types/user'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
  getFirestore,
  getDoc,
  doc,
  query,
  collection,
  where,
  getDocs,
  limit,
} from 'firebase/firestore'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('userStore', () => {
  const user = ref<User | null>(null)
  const team = ref<Team | null>(null)

  const db = getFirestore()

  const fetchUser = async () => {
    const auth = getAuth()
    onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const userDoc = await getDoc(doc(db, 'users', authUser.uid))

        if (userDoc.exists()) {
          user.value = { id: authUser.uid, ...userDoc.data() } as User
        }
      } else {
        user.value = null
      }
    })
  }

  const fetchTeam = async () => {
    if (!user.value) return

    const teamsCollection = collection(db, 'teams')
    const q = query(teamsCollection, where('createdBy', '==', user.value.id), limit(1))
    const teamDoc = await getDocs(q)

    team.value = !teamDoc.empty ? (teamDoc.docs[0].data() as Team) : null
  }

  return {
    user,
    team,
    fetchUser,
    fetchTeam,
  }
})
