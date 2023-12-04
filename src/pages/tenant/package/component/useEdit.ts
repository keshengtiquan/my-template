
import {ref} from "vue";
import {getPackageByIdApi, updatePackageApi} from "@/api/package";
import {updatePackage} from "@/api/package/types.ts";

export const useEdit = () => {
  const loading = ref(false)
  const getPackageById = async (id: string) => {
    loading.value = true
    const {data} = await getPackageByIdApi(id)
    loading.value = false
    return data
  }
  
  const updatePackage = async (data: updatePackage) => {
    const res = await updatePackageApi(data)
    return res
  }
  
  return {
    loading,
    getPackageById,
    updatePackage
  }
}