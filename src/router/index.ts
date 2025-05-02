import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { useAuth } from '@/composables/useAuth'
import { Permissions } from '@/types/user'

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
      meta: { permission: Permissions.USER_VIEW },
    },
    {
      path: '/players',
      name: 'players',
      component: () => import('@/views/PlayersView.vue'),
      meta: { permission: Permissions.PLAYER_VIEW },
    },
    {
      path: '/teams',
      name: 'teams',
      component: () => import('@/views/TeamsView.vue'),
      meta: { permission: Permissions.TEAM_VIEW },
    },
    {
      path: '/teams/:id',
      name: 'team-edit',
      component: () => import('@/views/TeamValidateView.vue'),
    },
    {
      path: '/validate/:id',
      name: 'team-validate',
      component: () => import('@/views/TeamValidateView.vue'),
      meta: { permission: Permissions.TEAM_VALIDATE },
    },
    {
      path: '/:id',
      name: 'team',
      component: () => import('@/views/TeamView.vue'),
    },
  ],
})

router.beforeEach(async (to) => {
  const { can, FetchUserData } = useAuth()
  await FetchUserData()

  if (!to.meta.permission) return

  if (!can(to.meta.permission as Permissions)) return { name: 'home' }
})

export default router
