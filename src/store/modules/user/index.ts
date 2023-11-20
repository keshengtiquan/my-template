import {defineStore} from "pinia";
import {computed, ref, shallowRef} from "vue";
import {MenuDataItem} from "@/types/gloable";
import {getUserInfoApi, UserInfo} from "@/api/user";
import {getMenuDataApi} from "@/api/menu";
import {rootRoute} from "@/router/static-routes.ts";
import {generateRoutes} from "@/utils";


export const useUserStore = defineStore('user', () => {
  const menuData = ref<MenuDataItem[]>([])
  const routerData = ref<any[]>([])
  const userInfo = shallowRef<UserInfo>()
  const avatar = computed(() => userInfo.value?.avatar)
  const nickname = computed(() => userInfo.value?.nickName ?? userInfo.value?.userName)
  // const roles = computed(() => userInfo.value?)
  
  
  const getMenuData = async () => {
    const {data} = await getMenuDataApi()
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
    const {data} = await getUserInfoApi()
    userInfo.value = data
  }
  return {
    routerData,
    menuData,
    userInfo,
    avatar,
    nickname,
    // roles,
    getMenuData,
    getUserInfo,
    generateDynamicRoutes
  }
})