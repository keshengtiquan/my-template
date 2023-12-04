
import {ref} from "vue";
import {getTenantByIdApi, updateTenantApi} from "@/api/tenant";

export const useEdit = () => {
  const loading = ref(false)
  const getTenantById = async (id: number) => {
    loading.value = true
    const {data} = await getTenantByIdApi(id)
    loading.value = false
    return data
  }
  
  const updateTenant = async (data: object) => {
    const res = await updateTenantApi(data)
    return res
  }
  
  return {
    loading,
    getTenantById,
    updateTenant
  }
}