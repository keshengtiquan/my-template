import { defineStore } from 'pinia'
import { computed, ref, shallowRef } from 'vue'
import { MenuDataItem } from '@/types/gloable'
import { getUserInfoApi, UserInfo } from '@/api/setting/user'
import { getMenuDataApi } from '@/api/setting/menu'
import { rootRoute } from '@/router/static-routes.ts'
import { generateRoutes } from '@/utils'
import { UserTypeEnum } from '@/enums'

export const useUserStore = defineStore(
  'user',
  () => {
    const menuData = ref<MenuDataItem[]>([])
    const routerData = ref<any[]>([])
    const userInfo = shallowRef<UserInfo>()
    const permissions = ref<string[]>([])
    const avatar = computed(() => userInfo.value?.avatar)
    const currentTenantId = ref<number>()
    const moduleType = ref<string>()
    const nickname = computed(
      () => userInfo.value?.nickName ?? userInfo.value?.userName
    )
    // const roles = computed(() => userInfo.value?)

    const getMenuModuleType = () => {
      console.log(26)

      const userType = userInfo.value?.userType

      // 当前有项目ID
      if (currentTenantId.value) {
        // 非系统用户 需要 判断当前的项目id是否属于自己
        if(userType !== UserTypeEnum.SYSTEM_USER && !userInfo.value?.tenants.map(item => item.tenantId).includes(currentTenantId.value)){
          currentTenantId.value = userInfo.value?.tenants[0].tenantId
          return 'project'
        }
        // 系统用户不用判断
        if (moduleType.value) {
          return moduleType.value
        }
      } else {
        // 当前没有项目ID， 系统用户 进入企业工作台
        if (userType === UserTypeEnum.SYSTEM_USER) {
          return 'company'
        }
        // 非系统用户 获取当前用户的第一个项目的ID（ps: 用户没有项目不会登录成功的）
        if (
          userType === UserTypeEnum.GENERAL_USER ||
          userType === UserTypeEnum.PROJECTADMIN
        ) {
          currentTenantId.value = userInfo.value?.tenants[0].tenantId
          return 'project'
        }
      }
    }
    const getMenuData = async () => {
      const type = getMenuModuleType()
      moduleType.value = type
      const { data } = await getMenuDataApi({
        module: type,
      })
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

    const logout = () => {
      menuData.value = []
      localStorage.removeItem('token')
    }

    const setTenantId = (id: number) => {
      currentTenantId.value = id
    }

    const clearTenantId = () => {
      currentTenantId.value = undefined
    }
    const clearManuData = () => {
      menuData.value = []
    }
    const setModuleType = (type: 'company' | 'project') => {
      moduleType.value = type
    }

    return {
      routerData,
      menuData,
      userInfo,
      avatar,
      nickname,
      // roles,
      permissions,
      logout,
      getMenuData,
      getUserInfo,
      generateDynamicRoutes,
      currentTenantId,
      setTenantId,
      clearTenantId,
      clearManuData,
      moduleType,
      setModuleType,
      getMenuModuleType,
    }
  },
  {
    // storage: 定义缓存方式
    // enabled: 是否开启缓存
    // key: 自定义缓存名称
    // paths: 自定义要缓存的字段
    persist: {
      paths: ['currentTenantId', 'moduleType'],
    },
  }
)
