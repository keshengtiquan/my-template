import {onMounted, ref} from "vue";

export const useTreeSelect = (request: Function) => {
  const treeData = ref<any[]>()
  const getTreeData = async () => {
    const {data} = await request()
    treeData.value = data
    return data
  }
  onMounted(async () => {
    await getTreeData()
  })
  
  return {
    getTreeData,
    treeData
  }
}