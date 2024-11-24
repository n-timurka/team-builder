import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { getCurrentUser } from 'vuefire'
import { collection, doc, getDoc, getFirestore } from 'firebase/firestore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('@/views/UsersView.vue'),
      meta: { roles: ['admin'] },
    },
    {
      path: '/teams',
      name: 'teams',
      component: () => import('@/views/TeamsView.vue'),
      meta: { roles: ['admin', 'user'] },
    },
  ],
})

router.beforeEach(async (to) => {
  if (!to.meta.roles) return

  const user = await getCurrentUser()
  if (!user) return { name: 'home' }

  const db = getFirestore()
  const userDoc = await getDoc(doc(collection(db, 'users'), user.uid))
  const data = userDoc.data()

  if (!data || !Array.isArray(to.meta.roles) || !to.meta.roles.includes(data.role))
    return { name: 'home' }
})

export default router
