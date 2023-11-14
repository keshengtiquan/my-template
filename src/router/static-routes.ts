import type { RouteRecordRaw } from 'vue-router'
const Layout = () => import('@/layout/index.vue')

export default [
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
    path: '/',
    component: Layout,
    redirect: '/ex1/ex4',
    meta: {
      title: '首页'
    },
    children: [
      {
        path: '/ex1',
        meta: {
          title: 'ex1'
        },
        children: [
          {
            path: '/ex1/ex4',
            component: () => import('@/pages/ex1/ex4/index.vue'),
            name: 'Ex4',
            meta: {
              keepAlive: true,
              title: 'ex4',
              affix: true,
              hideInBreadcrumb: false
            }
          },
          {
            path: '/ex1/ex5',
            component: () => import('@/pages/ex1/ex5/index.vue'),
            name: 'Ex5',
            meta: {
              keepAlive: true,
              title: 'ex5',
              affix: false,
              hideInBreadcrumb: false
            }
          },
        ]
      },
      {
        path: '/ex2',
        name: 'Ex2',
        meta: {
          keepAlive: true,
          title: 'ex2',
          affix: false,
          hideInBreadcrumb: false
        },
        children: [
          {
            path: '/ex2/ex6',
            component: () => import('@/pages/ex2/ex6/index.vue'),
            name: 'Ex6',
            meta: {
              keepAlive: true,
              title: 'ex6',
              affix: true,
              hideInBreadcrumb: false
            }
          },
          {
            path: '/ex2/ex7',
            component: () => import('@/pages/ex2/ex7/index.vue'),
            name: 'Ex7',
            meta: {
              keepAlive: true,
              title: 'ex7',
              affix: false,
              hideInBreadcrumb: false
            }
          },
        ]
      },
      {
        path: '/ex3',
        name: 'Ex3',
        meta: {
          keepAlive: true,
          title: 'ex3',
          affix: false,
          hideInBreadcrumb: false
        },
        children: [
          {
            path: '/ex3/ex8',
            component: () => import('@/pages/ex3/ex8/index.vue'),
            name: 'Ex8',
            meta: {
              keepAlive: true,
              title: 'ex8',
              affix: true,
              hideInBreadcrumb: false
            }
          },
          {
            path: '/ex3/ex9',
            component: () => import('@/pages/ex3/ex9/index.vue'),
            name: 'Ex9',
            meta: {
              keepAlive: true,
              title: 'ex9',
              affix: false,
              hideInBreadcrumb: false
            }
          },
        ]
      },
    ]
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
