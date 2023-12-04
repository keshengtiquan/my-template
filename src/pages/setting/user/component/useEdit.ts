import {ref} from "vue";
import {getUserByIdAPi, updateUserApi} from "@/api/user";

export const useEdit = () => {
  const loading = ref(false)
  const getUserById = async (id: number) => {
    loading.value = true
    const {data} = await getUserByIdAPi(id)
    loading.value = false
    return data
  }
  
  const updateUser = async (data: object) => {
    return await updateUserApi(data)
  }
  
  return {
    loading,
    getUserById,
    updateUser
  }
}