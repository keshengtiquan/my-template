import {computed, onMounted, ref} from "vue";
import * as _ from 'lodash'

export interface Pagination {
  total: number,
  current: number,
  pageSize: number,
  size: string,
  showQuickJumper: boolean,
  showTotal: Function
}
/**
 * 查询表格数据
 * @param request 查询的API
 * @param initParams 初始参数
 * @param hasPagination 有没有分页
 */
export const useTable = (request: Function, initParams?: Record<string, any>, hasPagination= true) => {
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
    const res = await request(params)
    if(hasPagination){
      tableData.value = res.data.results
      total.value = res.data.total
      current.value = res.data.current
      pageSize.value = res.data.pageSize
    }else {
      tableData.value = res.data
    }
    
    loading.value = false
  }
  const pagination = computed(() => ({
    total: total.value,
    current: current.value,
    pageSize: pageSize.value,
    size: 'small',
    showQuickJumper: true,
    showTotal: ((total: number) => {
      return `第 ${current.value}-${current.value * pageSize.value} 条/共 ${total} 条`;
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