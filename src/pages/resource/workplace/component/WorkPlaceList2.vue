<script setup lang="ts">
import ProTable from '@/components/pro-table/index.vue'
import {onMounted, ref} from "vue";
import {getWorkPlaceListNoPageApi, getWorkPlaceRelevanceCollectList} from "@/api/workplace";
import {useTable} from "@/composables/useTable.ts";

const columns = ref<any[]>([
  {title: '序号', dataIndex: 'serial_number', width: 80, align: 'center', sorter: true},
  {title: '项目编码', dataIndex: 'list_code', width: 100},
  {title: '项目名称', dataIndex: 'list_name', width: 120},
  {title: '项目特征', dataIndex: 'list_characteristic', width: 120,ellipsis: true},
  {title: '单位', dataIndex: 'unit', width: 80, align: 'center'},
])
const {tableData, pagination,loading,getTableData} = useTable(getWorkPlaceRelevanceCollectList)


onMounted(async () => {
  const res = await getWorkPlaceListNoPageApi();
  setTimeout(() => {
    res.data.forEach(item => {
      if (item.workPlaceType === 'section') {
        const column: any = {
          title: item.workPlaceName.split('-')[0].charAt(0) + '-' + item.workPlaceName.split('-')[1].charAt(0)+ '区间',
          children: [
            {title: '左线', dataIndex: item.workPlaceCode + '_left_quantities', width: 100, align: 'center'},
            {title: '右线', dataIndex: item.workPlaceCode + '_right_quantities', width: 100,align: 'center'}
          ]
        }
        columns.value.push(column)
      } else {
        columns.value.push({title: item.workPlaceName, dataIndex: item.workPlaceCode+ '_all_quantities', width: 120,align: 'center'})
      }
    })
  },0)
})
</script>
<template>
  <div>
    <pro-table v-if="columns.length > 5" border @search="(params) => getTableData(params)" :loading="loading" @refresh="() => getTableData()" :pagination="pagination" :data-source="tableData"  :scroll="{x: 1500}" :columns="columns"></pro-table>
  </div>
</template>


<style scoped>

</style>