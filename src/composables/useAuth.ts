import type { Team } from '@/types/team'
import { Permissions, RolePermissions, type User } from '@/types/user'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, doc, getDoc, getDocs, getFirestore, query, where } from 'firebase/firestore'
import { computed, ref } from 'vue'
import { useCurrentUser, useFirebaseAuth } from 'vuefire'

export const useAuth = () => {
  const db = getFirestore()
  const user = useCurrentUser()

  const userData = ref<User | null>(null)
  const teams = ref<Team[]>([])

  const userPermissions = computed(() => {
    if (!userData.value) return []

    return RolePermissions[userData.value.role]
  })
  const can = (permission: Permissions) => userPermissions.value.includes(permission)

  const FetchUserData = async () => {
    if (!user.value) {
      userData.value = null
      return
    }

    const userRef = doc(db, 'users', user.value.uid)
    const userDoc = await getDoc(userRef)

    if (userDoc.exists()) {
      userData.value = { id: user.value.uid, ...userDoc.data() } as User
    }
  }

  const FetchTeams = async () => {
    if (!user.value) return

    const teamsCollection = collection(db, 'teams')
    const q = query(teamsCollection, where('createdBy', '==', doc(db, 'users', user.value.uid)))
    const teamDocs = await getDocs(q)

    teams.value = teamDocs.docs.map(
      (t) =>
        ({
          ...t.data(),
          id: t.id,
        }) as Team,
    )
  }

  // Initialize auth state listener
  const initAuthListener = () => {
    const auth = useFirebaseAuth()

    if (!auth) {
      console.error('Firebase Auth is not initialized.')
      return
    }

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        await Promise.all([FetchUserData(), FetchTeams()])
      } else {
        userData.value = null
        teams.value = []
      }
    })
  }

  // Call the initializer on composable creation
  initAuthListener()

  return {
    user: userData,
    permissions: userPermissions,
    teams,
    can,
    FetchUserData,
  }
}
