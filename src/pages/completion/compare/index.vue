<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import ProTable from '@/components/pro-table/index.vue'
import {getDivisionTree} from "@/api/division";
const columns = [
  {title: '序号', dataIndex: 'serialNumber', width: 50, align: 'center'},
  {title: '项目编码', dataIndex: 'listCode', width: 100},
  {title: '项目名称', dataIndex: 'listName', width: 120, search: true, valueType: 'input', align: 'center'},
  {title: '项目特征', dataIndex: 'listCharacteristic', width: 120,resizable: true, search: true, valueType: 'input', ellipsis: true},
  {
    title: '分部分项', dataIndex: 'sectionalEntry', hide: true,
    width: 200, search: true, valueType: 'treeSelect',
    request: getDivisionTree, fieldNames: {children: 'children', label: 'divisionName', value: 'id'}
  },
  {title: '单位', dataIndex: 'unit', width: 50, align: 'center'},
  {title: '清单量', dataIndex: 'quantities', width: 80, align: 'center'},
  {title: '图纸量', dataIndex: 'designQuantities', width: 80, align: 'center'},
  {title: '完成量', dataIndex: 'finishQuantities', width: 80, align: 'center'},
  {title: '操作', dataIndex: 'actions', width: 100, align: 'center', fixed: 'right'},
]
</script>
<template>
  <PageContainer>
    <pro-table :columns="columns"></pro-table>
  </PageContainer>
</template>
<style scoped>

</style>