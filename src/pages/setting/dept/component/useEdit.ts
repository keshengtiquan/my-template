import {ref} from "vue";
import {getDeptByIdApi, updateDeptApi} from "@/api/setting/dept";

export const useEdit = () => {
  const loading = ref(false)
  const getDeptById = async (id: number) => {
    loading.value = true
    const {data} = await getDeptByIdApi(id)
    loading.value = false
    return data
  }
  
  const updateDept = async (data: object) => {
    const res = await updateDeptApi(data)
    return res
  }
  
  return {
    loading,
    getDeptById,
    updateDept
  }
}