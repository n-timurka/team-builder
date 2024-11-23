import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { useCurrentUser, useFirebaseAuth } from 'vuefire'

export const googleAuthProvider = new GoogleAuthProvider()

export function useAuth() {
  const auth = useFirebaseAuth()
  const user = useCurrentUser()

  const signIn = async (email: string, password: string) => {
    if (!auth) return

    return signInWithEmailAndPassword(auth, email, password)
  }

  const signInWithGoogle = async () => {
    if (!auth) return

    return signInWithPopup(auth, googleAuthProvider)
  }

  return {
    user,
    signIn,
    signInWithGoogle,
  }
}
