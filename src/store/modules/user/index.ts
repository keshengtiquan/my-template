import { defineStore } from 'pinia'
import { computed, ref, shallowRef } from 'vue'
import { MenuDataItem } from '@/types/gloable'
import { getUserInfoApi, getUserPermissions, UserInfo } from '@/api/user'
import { getMenuDataApi } from '@/api/menu'
import { rootRoute } from '@/router/static-routes.ts'
import { generateRoutes } from '@/utils'

export const useUserStore = defineStore(
  'user',
  () => {
    const menuData = ref<MenuDataItem[]>([])
    const routerData = ref<any[]>([])
    const userInfo = shallowRef<UserInfo>()
    const permissions = ref<string[]>([])
    const avatar = computed(() => userInfo.value?.avatar)
    const nickname = computed(
      () => userInfo.value?.nickName ?? userInfo.value?.userName
    )
    // const roles = computed(() => userInfo.value?)

    const getMenuData = async () => {
      const { data } = await getMenuDataApi({ module: 'schedule' })
      menuData.value = data
      const currentRoute = {
        ...rootRoute,
        children: [...generateRoutes(data)],
      }
      return currentRoute
    }

    const generateDynamicRoutes = async () => {
      const routerDatas = await getMenuData()
      return routerDatas
    }

    // 获取用户信息
    const getUserInfo = async () => {
      // 获取用户信息
      const { data: info } = await getUserInfoApi()
      // const { data: permission } = await getUserPermissions()
      userInfo.value = info
      // permissions.value = permission
    }
    const setUserInfo = (info: UserInfo) => {
      userInfo.value = info
    }

    const logout = () => {
      menuData.value = []
      localStorage.removeItem('token')
    }

    return {
      routerData,
      menuData,
      userInfo,
      avatar,
      nickname,
      // roles,
      permissions,
      setUserInfo,
      logout,
      getMenuData,
      getUserInfo,
      generateDynamicRoutes,
    }
  },
  {
    // storage: 定义缓存方式
    // enabled: 是否开启缓存
    // key: 自定义缓存名称
    // paths: 自定义要缓存的字段
    persist: {
      paths: ['userInfo'],
    },
  }
)
