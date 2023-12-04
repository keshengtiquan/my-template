import {ref} from "vue";
import {getRoleByIdAPi, updateRoleApi} from "@/api/role";

export const useEdit = () => {
  const loading = ref(false)
  const getRoleById = async (id: number) => {
    loading.value = true
    const {data} = await getRoleByIdAPi(id)
    loading.value = false
    return data
  }
  
  const updateRole = async (data: object) => {
    const res = await updateRoleApi(data)
    return res
  }
  
  return {
    loading,
    getRoleById,
    updateRole
  }
}