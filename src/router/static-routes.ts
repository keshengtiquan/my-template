import type { RouteRecordRaw } from 'vue-router'
const Layout = () => import('@/layout/index.vue')

export const ROOT_ROUTE_REDIRECT_PATH = '/dc/index'


export const rootRoute: RouteRecordRaw = {
  path: '/',
  name: 'rootPath',
  redirect: ROOT_ROUTE_REDIRECT_PATH,
  component: Layout,
  meta: {
    title: '首页'
  },
  children: [],
}
export default [
  // {
  //   path: '/luckysheet',
  //   component: () => import('@/pages/luckysheet/index.vue')
  // },
  {
    path: '/onlyoffice',
    component: () => import('@/pages/onlyoffice/index.vue')
  },
  {
    path: "/redirect",
    component: Layout,
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/pages/common/redirect.vue")
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/pages/common/login.vue'),
    meta: {
      title: '登录',
    },
  },
  {
    path: '/401',
    name: 'Error401',
    component: () => import('@/pages/exception/401.vue'),
    meta: {
      title: '授权已过期',
    },
  },
  {
    path: '/:pathMatch(.*)',
    meta: {
      title: '找不到页面',
    },
    component: () => import('@/pages/exception/error.vue'),
  },
] as RouteRecordRaw[]
