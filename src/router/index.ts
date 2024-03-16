import { createRouter, createWebHistory,createWebHashHistory } from 'vue-router'
import staticRoutes from './static-routes'

const router = createRouter({
  routes: [
    ...staticRoutes,
  ],
  history: import.meta.env.VITE_ROUTER_HISTORY === "hash"
  ? createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH)
  : createWebHistory(import.meta.env.VITE_PUBLIC_PATH),
})

export default router