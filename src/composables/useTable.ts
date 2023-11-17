import {computed, onMounted, ref} from "vue";
import * as _ from 'lodash'

export const useTable = (request: Function, initParams?: Record<string, any>) => {
  const tableData = ref<any[]>()
  const total = ref()
  const current = ref()
  const pageSize = ref()
  const loading = ref(false)
  
  const getTableData = async (params?: Record<string, any>) => {
    loading.value = true
    if(!_.isEmpty(initParams)){
      if(!_.isEmpty(params)){
        Object.assign(params, initParams)
      }else {
        params = initParams
      }
    }
    console.log('params',  params)
    const res = await request(params)
    tableData.value = res.data.results
    total.value = res.data.total
    current.value = res.data.current
    pageSize.value = res.data.pageSize
    loading.value = false
  }
  const pagination = computed(() => ({
    total: total.value,
    current: current.value,
    pageSize: pageSize.value,
    showQuickJumper: true,
    showTotal: ((total: number) => {
      return `共 ${total} 条`;
    })
  }));
  onMounted(async () => {
    await getTableData(initParams)
  })
  
  return {
    tableData,
    pagination,
    getTableData,
    loading
  }
}