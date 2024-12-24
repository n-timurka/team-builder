import type { Team } from '@/types/team'
import { Permissions, RolePermissions, type User } from '@/types/user'
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from 'firebase/auth'
import { collection, doc, getDoc, getDocs, getFirestore, query, where } from 'firebase/firestore'
import { computed, ref, watch } from 'vue'
import { useCurrentUser, useFirebaseAuth } from 'vuefire'

export const googleAuthProvider = new GoogleAuthProvider()

export const useAuth = () => {
  const db = getFirestore()
  const auth = useFirebaseAuth()
  const user = useCurrentUser()

  const userData = ref<User | null>(null)
  const teams = ref<Team[]>([])

  const userPermissions = computed(() => {
    if (!userData.value) return []

    return RolePermissions[userData.value.role]
  })
  const can = (permission: Permissions) => userPermissions.value.includes(permission)

  const signIn = async (email: string, password: string) => {
    if (!auth) return

    return signInWithEmailAndPassword(auth, email, password)
  }

  const signInWithGoogle = async () => {
    if (!auth) return

    return signInWithPopup(auth, googleAuthProvider)
  }

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

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      await Promise.all([FetchUserData(), FetchTeams()])
    } else {
      userData.value = null
      teams.value = []
    }
  })

  return {
    user: userData,
    permissions: userPermissions,
    teams,
    can,
    FetchUserData,
    signIn,
    signInWithGoogle,
  }
}
