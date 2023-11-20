import router from '@/router'
import {useUserStore} from "@/store";
import {AxiosError} from "axios";
const allowList = ['/login', '/error', '/401', '/404', '/403']
const loginPath = '/login'

router.beforeEach(async (to,_,next) => {
  const userStore = useUserStore()
  const token = localStorage.getItem('token')
  console.log(!allowList.includes(to.path) )
  if(token){
    if(!userStore.userInfo && !allowList.includes(to.path) && !to.path.startsWith('/redirect')){
      try {
        await userStore.getUserInfo()
        // 获取路由菜单的信息
        const currentRoute = await userStore.generateDynamicRoutes()
        router.addRoute(currentRoute)
        console.log(router.getRoutes())
        next({
          ...to,
          replace: true,
        })
        return
      }catch (e){
        if (e instanceof AxiosError && e?.response?.status === 401) {
          // 跳转到error页面
          next({
            path: '/401',
          })
        }
      }
    }else {
      next()
    }
  }else {
    // if (!allowList.includes(to.path) && !to.path.startsWith('/redirect')) {
    //   next({
    //     path: loginPath,
    //     query: {
    //       redirect: encodeURIComponent(to.fullPath),
    //     },
    //   })
    //   return
    // }
    if (allowList.indexOf(to.path) !== -1) {
      // 如果在免登录的白名单中，则直接进入
      next()
    } else {
      // 其他没有访问权限的页面将被重定向到登录页面
      next(loginPath)
    }
  }
})