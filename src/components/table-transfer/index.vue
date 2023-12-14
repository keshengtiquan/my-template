<script setup lang="ts">
import {computed, CSSProperties, ref} from "vue";
import {getListApi} from "@/api/list";
import {Pagination, useTable} from "@/composables/useTable.ts";
import { theme } from 'ant-design-vue';
const { useToken } = theme;
const { token } = useToken();
//左侧表格列
const leftColumns = ref<any[]>([
  {title: '序号', dataIndex: 'serialNumber', width: 30, align: 'center'},
  {title: '项目名称', dataIndex: 'listName', width: 80,},
  {title: '项目特征', dataIndex: 'listCharacteristic', width: 120, ellipsis: true}
]);
//右侧表格列
const rightColumns = ref<any[]>([
  {title: '序号', dataIndex: 'serialNumber', width: 50, align: 'center'},
  {title: '项目名称', dataIndex: 'listName', width: 120,},
  {title: '项目特征', dataIndex: 'listCharacteristic', width: 120, ellipsis: true}
]);
const {tableData,pagination,getTableData} = useTable(getListApi)
const hasSelected = computed(() => selectedRowKeys.value.length > 0);
const selectedRowKeys = ref<string[]>([])
const selectedRows = ref<any[]>([])

/**
 * 全选方法
 * @param selected
 */
const onSelectAll = (selected:boolean,allSelectedRows: any[], changeRows: any[]) => {
  if(selected){
    const allSelectedKeys = changeRows.map(i => i.id)
    selectedRowKeys.value = [...selectedRowKeys.value, ...allSelectedKeys]
  }else {
    console.log(35)
    const removeIds = changeRows.map(i => i.id)
    selectedRowKeys.value = selectedRowKeys.value.filter(i => !removeIds.includes(i))
  }
  console.log(selectedRowKeys.value)
}
/**
 * 行选择
 * @param record
 * @param selected
 */
const onSelect = (record: any,selected: boolean) => {
  if(selected){
    selectedRowKeys.value.push(record.id)
    selectedRows.value.push(record)
  }else {
    selectedRowKeys.value = selectedRowKeys.value.filter(i => i !== record.id)
    selectedRows.value = selectedRows.value.filter(i => i.id !== record.id)
  }
}

/**
 * 页码更改方法
 */
const paginationChange = (pagination: Pagination) => {
  getTableData({current: pagination.current, pageSize: pagination.pageSize})
}

</script>
<template>
  <div class="flex ">
    <div class="border border-solid b-rd-2 border-gray-3">
      <div>{{ `${selectedRowKeys.length}/${pagination.total}` }}</div>
      <a-table @change="paginationChange" :row-selection="{selectedRowKeys,onSelect: onSelect, onSelectAll: onSelectAll  }" row-key="id" :data-source="tableData" size="small" :pagination="pagination" :columns="leftColumns"></a-table>
    </div>
    <div class="flex flex-col justify-center px-10px">
      <div  class="m-b-10px w-30px flex h-30px b-rd-2 justify-center border-gray-3 border border-solid">
        <RightOutlined />
      </div>
      <div class="w-30px flex h-30px b-rd-2 justify-center border-gray-3 border border-solid">
        <LeftOutlined />
      </div>
    </div>
    <div class="border border-solid b-rd-2 border-gray-3">
      <a-table size="small" :columns="rightColumns"></a-table>
    </div>
  </div>
</template>


<style scoped>

</style>
