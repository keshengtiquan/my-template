import { useUserStore, useMultiTab } from '@/store'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
export const useChangeRouter = () => {
  const userStore = useUserStore()
  const router = useRouter()
  const multiTab = useMultiTab()

  const changeToCompany = () => {
    if (userStore.moduleType === 'project' || !userStore.moduleType) {
      userStore.setModuleType('company')
      userStore.clearManuData()
      multiTab.clear()
      router.replace('/index')
    }
  }

  const changeToProject = (id?: number) => {
    if(!id && !userStore.currentTenantId){
      return message.error('请选择要操作的项目！')
    }
    //TODO 如果本地没有id,取用户下的第一个项目
    if (userStore.moduleType === 'company' || !userStore.moduleType) {
      userStore.setModuleType('project')
      userStore.setTenantId(id || userStore.currentTenantId!)
      userStore.clearManuData()
      multiTab.clear()
      router.replace('/project/info')
    }
  }

  return {
    changeToCompany,
    changeToProject,
  }
}
