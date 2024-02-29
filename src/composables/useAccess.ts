import { useUserStore } from "@/store"
export const useAccess = () => {
  const userStore = useUserStore()
  const permissions = userStore.permissions
  const hasAccess = (permission: string[]  ) => {
    if(permissions.length === 0) return false
    if(permissions.length === 1 && permissions[0] === '*') return true
    return permission.some(p => permissions.includes(p))
  }
  return {
    hasAccess
  }
}