<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import { nextTick, onMounted, ref } from "vue"
import ProTable from '@/components/pro-table/index.vue'
import { useTable } from '@/composables/useTable';
import { getCompletionApi } from '@/api/completion/index'
import { getWorkPlaceListNoPageApi } from '@/api/workplace';
const filterData = new Set()
const columns = ref<any[]>([
  {
    title: '系统', dataIndex: 'parent_name', width: 150, align: 'center', fixed: 'left',
    filters: [],
    onFilter: (value: string, record: any) => record.parent_name.indexOf(value) === 0,
    customRender: ({ text, record }: { text: string, record: any }) => {
      return {
        children: `${text}`,
        props: {
          rowSpan: record.parent_namerowSpan
        }
      }
    },
  },
  {
    title: '分项工程', dataIndex: 'division_name', width: 250, align: 'left', fixed: 'left',
    ellipsis: true,
    customRender: ({ text, record }: { text: string, record: any }) => {
      return {
        children: `${text}`,
        props: {
          rowSpan: record.division_namerowSpan
        }
      }
    },
  },
  { title: '类型', dataIndex: 'data_type', width: 100, align: 'center', fixed: 'left' },
])
const { tableData, getTableData, loading } = useTable(getCompletionApi, {}, false)

onMounted(async () => {
  await getTableData()
  tableData.value.forEach(item => {
    filterData.add(item.parent_name)
  })

  await nextTick(() => {
    filterData.forEach(item => {
      columns.value[0].filters.push({
        text: item, value: item
      })
    })
  })
  const res = await getWorkPlaceListNoPageApi();
  res.data.forEach(item => {
    columns.value.push({
      title: item.workPlaceType === 'station' ? item.workPlaceName : item.workPlaceName.split('-')[0].charAt(0) + '-' + item.workPlaceName.split('-')[1].charAt(0) + '区间',
      dataIndex: item.workPlaceName,
      width: 150,
      align: 'center',
    })
  })

})
</script>
<template>
  <PageContainer>
    <a-card v-if="columns.length === 3">
      <a-skeleton :paragraph="{ rows: 20 }" :loading="columns.length === 3" />
    </a-card>
    <pro-table v-if="columns.length > 3" bordered :scroll="{ x: 5500 }" :columns="columns" :loading="loading"
      @refresh="() => getTableData()" :dataSource="tableData" :pagination="false" tableSize="small">
      <template #bodyCell="{ column, text }">
        <template v-if="!(['parent_name', 'division_name', 'data_type'].includes(column.dataIndex))">
          <!-- <a-progress v-if="text"  :percent="(text * 100).toFixed(1)" size="small"/> -->
          <span v-if="text">完成率{{ (text * 100).toFixed(1) }}%</span>
          <div class="h-2px bg-blue-500 absolute bottom-0 left-0 " :style="{ width: `${(text * 100).toFixed(1)}%` }">
          </div>
        </template>
      </template>
    </pro-table>
  </PageContainer>
</template>
<style scoped></style>