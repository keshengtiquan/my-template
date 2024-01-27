<script setup lang="ts">
import ProTable from '@/components/pro-table/index.vue'
import {useTable} from "@/composables/useTable.ts";
import {getFocusListApi} from "@/api/analyse";

const columns = [
  {title: '序号', dataIndex: 'serialNumber', align: 'center', sorter: true},
  {title: '项目名称', dataIndex: 'listName',},
  {title: '清单工程量', dataIndex: 'quantities', align: 'center'},
  {title: '完成量', dataIndex: 'complete', align: 'center'},
]
const {tableData, getTableData, pagination, loading} = useTable(getFocusListApi)


</script>
<template>
  <a-card :bordered="false"
          title="重点关注清单"
          :style="{ height: '100%' }"
  >
    <pro-table hide-tool  :pagination="pagination" :data-source="tableData"
               :loading="loading" @search="(params) => getTableData(params)" :columns="columns"></pro-table>
  </a-card>
</template>
<style scoped>
.ant-card :deep(.ant-card-body) {
  padding: 24px 0;
}
</style>