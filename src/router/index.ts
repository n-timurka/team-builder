import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { useUserStore } from '@/stores/userStore'

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
    },
    {
      path: '/teams/:id',
      name: 'team-edit',
      component: () => import('@/views/TeamEditView.vue'),
    },
    {
      path: '/:id',
      name: 'team',
      component: () => import('@/views/TeamView.vue'),
    },
  ],
})

router.beforeEach(async (to) => {
  const userStore = useUserStore()
  await userStore.fetchUser()

  if (!to.meta.roles) return

  if (!userStore.user) return { name: 'home' }

  if (!Array.isArray(to.meta.roles) || !to.meta.roles.includes(userStore.user.role))
    return { name: 'home' }
})

export default router
