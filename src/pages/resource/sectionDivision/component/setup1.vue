<script setup lang="ts">
import {useTable} from "@/composables/useTable.ts";
import ProTable from "@/components/pro-table/index.vue"
import {getListApi} from "@/api/list";
import {computed} from "vue";
import {getDivisionTree} from "@/api/division";

const props = defineProps<{
  selectedRowKeys: string[]
}>()
const emits = defineEmits(['update:selectedRowKeys'])
const selectedRowKeysCom = computed({
  set(value: string[]) {
    emits("update:selectedRowKeys", value)
  },
  get(): string[] {
    return props.selectedRowKeys
  },
})
const columns = [
  {title: '序号', dataIndex: 'serialNumber', width: 50, align: 'center'},
  {title: '项目编码', dataIndex: 'listCode', width: 120, },
  {title: '项目名称', dataIndex: 'listName', width: 200, search: true, valueType: 'input',},
  {title: '项目特征', dataIndex: 'listCharacteristic',search: true, valueType: 'input', ellipsis: true},
  {title: '分部分项', dataIndex: 'sectionalEntry', hide: true,
    width: 200, search: true, valueType: 'treeSelect',
    request: getDivisionTree, fieldNames: {children: 'children',label: 'divisionName',value: 'id'}},
  {title: '单位', dataIndex: 'unit', width: 80, align: 'center'},
]
const {tableData, getTableData, loading, pagination} = useTable(getListApi)
const onSelectChange = (selectedRowKey: any[]) => {
  selectedRowKeysCom.value = selectedRowKey
}
</script>
<template>
  <ProTable :data-source="tableData" hide-tool @search="(params) => getTableData(params)" :loading="loading"
            table-size="small" :pagination="pagination" :columns="columns"
            :row-selection="{ selectedRowKeys: selectedRowKeysCom, preserveSelectedRowKeys: true, onChange: onSelectChange  }"
            :custom-row="(record: any) => ({onClick:() => {
                 if(selectedRowKeysCom.includes(record.id)){
                  const index = selectedRowKeysCom.indexOf(record.id)
                   selectedRowKeysCom.splice(index,1)
                  }else {
                    selectedRowKeysCom.push(record.id)
                  }
               }})"
            :scroll="{ y: 400 }" rowKey="id">
  </ProTable>
</template>


<style scoped>

</style>