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
export const useTable = <T = any>(request: Function, initParams?: Record<string, any>, hasPagination= true) => {
  const tableData = ref<T[]>([])
  const total = ref()
  const current = ref()
  const pageSize = ref()
  const loading = ref(false)
  
  const getTableData = async (params?: Record<string, any>) => {
    loading.value = true
    if(!_.isEmpty(initParams)){
      if(!_.isEmpty(params)){
        for (let key in initParams) {
          // 检查是否是 initParams 自身的属性而不是原型链上的属性
          if (initParams.hasOwnProperty(key) && params[key] === undefined) {
            // 将 initParams 中的属性添加到 params 中
            params[key] = initParams[key];
          }
        }
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
    showSizeChanger: true,
    size: 'small',
    showQuickJumper: true,
    showTotal: ((total: number) => {
      return `第 ${(current.value - 1) * pageSize.value + 1 }-${current.value * pageSize.value > total ? total : current.value * pageSize.value} 条/共 ${total} 条`;
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