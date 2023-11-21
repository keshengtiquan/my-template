import {onMounted, ref} from "vue";

export const useTreeSelect = (request: Function) => {
  const treeData = ref<any[]>()
  const init = async () => {
    const {data} = await request()
    treeData.value = data
  }
  onMounted(async () => {
    await init()
  })
  
  return {
    treeData
  }
}