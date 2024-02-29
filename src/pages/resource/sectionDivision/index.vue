<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import ProTable from '@/components/pro-table/index.vue'
import {useTable} from "@/composables/useTable.ts";
import {getSectionDivisionAPi} from "@/api/sectionDivision";
import TooltipIcon from "@/components/tooltip-icon/index.vue";
import {useRouter} from "vue-router";
import UpdateSectionDivision from "@/pages/resource/sectionDivision/component/updateSectionDivision.vue";
import {ref} from "vue";
import { useAccess } from '@/composables/useAccess';

const columns = [
  {title: '工区/作业队', dataIndex: 'deptName',},
  {title: '负责区段', dataIndex: 'sector'},
  {title: '负责人', dataIndex: 'principal'},
  {title: '产值', dataIndex: 'outputValue'},
  {title: '创建人', dataIndex: 'createBy',},
  {title: '创建时间', dataIndex: 'createTime',},
  {title: '更新人', dataIndex: 'updateBy',},
  {title: '更新时间', dataIndex: 'updateTime',},
  {title: '操作', dataIndex: 'actions', align: 'center', fixed: 'right'},
]
const router = useRouter()
const tableRef = ref()
const {tableData, getTableData, loading, pagination} = useTable(getSectionDivisionAPi)
const create = (record: any) => {
  router.push({path: '/resource/sectionDivision/create', query: {id: record.id}})
}
const updateSectionDivisionModalRef = ref()
const {hasAccess} = useAccess()

</script>
<template>
  <PageContainer>
    <pro-table :data-source="tableData" @refresh="() => getTableData()" :loading="loading" :pagination="pagination"
               :columns="columns" ref="tableRef">
      <template #bodyCell="{ column,record }">
        <template v-if="column.dataIndex === 'actions'">
          <a-space :size="20">
            <TooltipIcon v-if="hasAccess(['sys:sectionDivision:edit'])" title="编辑">
              <EditOutlined class="text-blue" @click="updateSectionDivisionModalRef.showModal(record)"/>
            </TooltipIcon>
          </a-space>
        </template>
        <template v-else-if="column.dataIndex === 'deptName'">
          <a-typography-link @click="create(record)">{{ record.deptName }}</a-typography-link>
        </template>
      </template>
    </pro-table>
    <UpdateSectionDivision ref="updateSectionDivisionModalRef" @submit="() =>getTableData(tableRef.onReload()) "></UpdateSectionDivision>
  </PageContainer>
</template>
<style scoped>

</style>