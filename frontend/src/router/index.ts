import { useAuthStore } from '@/stores/auth.store'
import { createRouter, createWebHistory, type NavigationGuard } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { RouteName } from './route-names'

const redirectIfAuthenticated: NavigationGuard = () => {
  const auth = useAuthStore()
  return auth.isAuthenticated ? { name: 'home' } : true
}

const requireAuth: NavigationGuard = () => {
  const auth = useAuthStore()
  return !auth.isAuthenticated ? { name: 'login' } : true
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: RouteName.Home,
      component: HomeView,
      beforeEnter: requireAuth,
    },
    {
      path: '/login',
      name: RouteName.Login,
      component: () => import('../views/LoginView.vue'),
      beforeEnter: redirectIfAuthenticated,
    },
    {
      path: '/register',
      name: RouteName.Register,
      component: () => import('../views/RegisterView.vue'),
      beforeEnter: redirectIfAuthenticated,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: RouteName.Home },
    },
  ],
})

export default router
