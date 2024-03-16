import {getMenuByIdApi, updateMenuApi} from "@/api/setting/menu";
import {ref} from "vue";

export const useUpdateMenu = () => {
  const loading = ref(false)
  const getMenuById = async (id: number) => {
    loading.value = true
    const {data} = await getMenuByIdApi({id})
    loading.value = false
    return data
  }
  
  const updateMenu = async (data: object) => {
    return await updateMenuApi(data)
  }
  
  return {
    updateMenu,
    loading,
    getMenuById
  }
}