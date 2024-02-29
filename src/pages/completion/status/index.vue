<script lang="ts" setup>
import { getCompletionStatusApi } from '@/api/completion';
import { getDivisionTree } from '@/api/division';
import PageContainer from '@/components/page-container/index.vue';
import ProTable from '@/components/pro-table/index.vue'
import { useTable } from '@/composables/useTable';

const columns = [
  { title: '序号', dataIndex: 'serialNumber', width: 50, align: 'center', search: true, valueType: 'input', fixed: 'left' },
  { title: '项目名称', dataIndex: 'listName', width: 150, search: true, valueType: 'input', align: 'center', fixed: 'left' },
  { title: '项目特征', dataIndex: 'listCharacteristic', width: 120, resizable: true, ellipsis: true },
  { title: '单位', dataIndex: 'unit', width: 50, align: 'center' },
  { title: '清单工程量', dataIndex: 'quantities', width: 80, align: 'center' },
  { title: '清单合价', dataIndex: 'combinedPrice', width: 80, align: 'center' },
  {
    title: '分部分项', dataIndex: 'sectionalEntry', hidden: true,
    width: 200, search: true, valueType: 'treeSelect',
    request: getDivisionTree, fieldNames: { children: 'children', label: 'divisionName', value: 'id' }
  },
  {
    title: '状态', dataIndex: 'completeStatus', width: 80, align: 'center',
    filters: [
      { text: '未开始', value: '未开始' },
      { text: '进行中', value: '进行中' },
      { text: '已完成', value: '已完成' },
    ],
  },
  {
    title: '进度状态', dataIndex: 'status', width: 80, align: 'center',
    filters: [
      { text: '正常', value: '正常' },
      { text: '落后', value: '落后' },
      { text: '超前', value: '超前' },
    ]
  },
  { title: '偏差率', dataIndex: 'deviationdRate', width: 80, align: 'center' },
  { title: '总计划工程量', dataIndex: 'planQuantities', width: 80, align: 'center' },
  { title: '实际完成量', dataIndex: 'completeQuantity', width: 80, align: 'center' },
  { title: '截止当日计划完成率', dataIndex: 'planPercentage', width: 100, align: 'center' },
  { title: '实际完成率', dataIndex: 'completePercentage', width: 100, align: 'center' },
  { title: '截止当日计划完成产值', dataIndex: 'planOutPutValue', width: 100, align: 'center' },
  { title: '实际完产值', dataIndex: 'completeOutPutValue', width: 100, align: 'center' },
  { title: '计划开始时间', dataIndex: 'startDate', width: 100, align: 'center' },
  { title: '计划结束时间', dataIndex: 'endDate', width: 100, align: 'center' },
  { title: '计划工期', dataIndex: 'duration', width: 80, align: 'center' },
  { title: '实际开始时间', dataIndex: 'actualStartDate', width: 100, align: 'center' },
  { title: '实际结束时间', dataIndex: 'actualEndDate', width: 100, align: 'center' },
]
const { tableData, pagination, getTableData, loading } = useTable(getCompletionStatusApi)
</script>

<template>
  <PageContainer>
    <ProTable :columns="columns" :data-source="tableData" table-size="small" :loading="loading" :pagination="pagination"
      :scroll="{ x: 2800 }" @refresh="() => getTableData()" @search="(params) => getTableData(params)">
      <template #bodyCell="{ column, text }">
        <template v-if="(['completePercentage'].includes(column.dataIndex))">
          {{ text ? text + '%' : '' }}
        </template>
        <template v-else-if="(['completeStatus', 'status'].includes(column.dataIndex))">
          <a-tag v-if="text === '未开始' || text === '落后'" color="#f50">{{ text }}</a-tag>
          <a-tag v-else-if="text === '进行中' || text === '正常'" color="#2db7f5">{{ text }}</a-tag>
          <a-tag v-else-if="text === '已完成' || text === '超前'" color="#87d068">{{ text }}</a-tag>
        </template>
        <template v-else-if="column.dataIndex === 'deviationdRate'">
          <CaretUpOutlined v-if="text > 0" text-green />
          <CaretDownOutlined v-else-if="text < 0" text-red />
          {{ text ? text + '%' : '' }}
        </template>
        <template v-else-if="column.dataIndex === 'completeQuantity'">
          {{ text ? text : '' }}
        </template>
        <template v-else-if="column.dataIndex === 'planPercentage'">
          {{ text === '0.00' || text === null ? '' : text + '%' }}
        </template>
        <template v-else-if="column.dataIndex === 'planOutPutValue'">
          {{ text === '0.00' || text === null ? '' : text }}
        </template>
        <template v-else-if="column.dataIndex === 'completeOutPutValue'">
          {{ text ? text : '' }}
        </template>
      </template>
    </ProTable>
  </PageContainer>
</template>

<style scoped></style>
