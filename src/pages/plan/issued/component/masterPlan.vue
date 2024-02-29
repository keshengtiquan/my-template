<script lang="ts" setup>
import { getWorkArea } from '@/api/dept';
import { getDivisionTree } from '@/api/division';
import { getMasterPlanApi } from '@/api/issued';
import ProTable from '@/components/pro-table/index.vue'
import { useTable } from '@/composables/useTable';
import { theme } from 'ant-design-vue';
import { onMounted, ref } from 'vue';
const { token } = theme.useToken()
const columns = ref<any[]>([
  { title: '序号', dataIndex: 'serialNumber', width: 80, align: 'center', sorter: true },
  { title: '项目编码', dataIndex: 'listCode', width: 150, search: false, valueType: 'input', align: 'center' },
  { title: '项目名称', dataIndex: 'listName', width: 200, search: true, valueType: 'input', align: 'center' },
  { title: '项目特征', dataIndex: 'listCharacteristic', width: 120, search: true, valueType: 'input', ellipsis: true },
  { title: '单位', dataIndex: 'unit', width: 80, align: 'center' },
  { title: '清单工程量', dataIndex: 'quantities', width: 110, align: 'center' },
  {
    title: '分部分项', dataIndex: 'sectionalEntry', hidden: true,
    width: 200, search: true, valueType: 'treeSelect',
    request: getDivisionTree, fieldNames: {children: 'children', label: 'divisionName', value: 'id'}
  },
  {
    title: '计划工程量', dataIndex: 'totalQuantities', width: 110, align: 'center',
    customCell: () => {
      return {
        style: {
          'font-weight': 'bold',
          color: token.value.colorPrimaryText
        }
      }
    }
  },
])
const { tableData, getTableData, loading, pagination } = useTable(getMasterPlanApi)
onMounted(async () => {
  const workAreaResults = await getWorkArea()
  workAreaResults.data.forEach((item: any) => {
    columns.value.push({
      title: item.deptName,
      dataIndex: item.id,
      align: 'center'
    })
  })
})
</script>

<template>
  <ProTable v-if="columns.length > 8" :data-source="tableData" @refresh="() => getTableData()" :loading="loading"
    :pagination="pagination" @search="(params) => getTableData(params)" :columns="columns"></ProTable>
</template>

<style scoped></style>
