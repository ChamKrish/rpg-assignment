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
      path: '/about',
      name: RouteName.About,
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
      beforeEnter: requireAuth,
    },
  ],
})

export default router
