<script setup lang="ts">
import ProTable from '@/components/pro-table/index.vue'
import TooltipIcon from "@/components/tooltip-icon/index.vue";
import CreateData from "@/pages/plan/gantt/component/createData.vue";
import UpdateData from './component/updateData.vue'
import { createVNode, onMounted, ref } from "vue";
import { useTable } from "@/composables/useTable.ts";
import { deleteGanttApi, getGanttTree } from "@/api/gantt";
import { message, Modal } from "ant-design-vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { useRouter } from "vue-router";
import { useAccess } from '@/composables/useAccess';

const columns = [
  { title: '任务名称', dataIndex: 'text', width: 210, ellipsis: true },
  { title: '开始时间', dataIndex: 'startDate', width: 110 },
  { title: '工期(天)', dataIndex: 'duration', width: 80 },
  { title: '结束时间', dataIndex: 'endDate', width: 110 },
  { title: '创建人', dataIndex: 'createBy', width: 100 },
  { title: '创建时间', dataIndex: 'createTime', width: 150 },
  { title: '更新人', dataIndex: 'updateBy', width: 100 },
  { title: '更新时间', dataIndex: 'updateTime', width: 150 },
  { title: '操作', dataIndex: 'actions', width: 100, align: 'center', fixed: 'right' },
]
const { hasAccess } = useAccess()
const router = useRouter()
const createDataRef = ref()
const updateDataRef = ref()
const tableRef = ref()
const { tableData, getTableData, loading } = useTable(getGanttTree, {}, false)
let expandedRowKeys = ref<string[]>([])
// 默认展开行
const getExpandedRowKeys = (list: any[]) => {
  list.forEach((item) => {
    if (item.children && item.children.length > 0) {
      expandedRowKeys.value.push(item.id)
      getExpandedRowKeys(item.children)
    }
  })
}
// 删除
const deleteDate = (record: any) => {
  Modal.confirm({
    title: `是否删除【${record.text}】`,
    icon: createVNode(ExclamationCircleOutlined),
    content: '删除后不可恢复！',
    onOk() {
      deleteGanttApi(record.id).then(res => {
        if (res.code === 200) {
          getTableData(tableRef.value.onReload())
          message.success(res.message)
        }
      })
    },
    onCancel() {
      message.info('取消删除');
    },
  });
}

const relevanceList = (record: any) => {
  router.push({ path: '/plan/gantt/relevance', query: { ganttId: record.id, text: record.text } })
}

onMounted(async () => {
  await getTableData()
  getExpandedRowKeys(tableData.value)
})
</script>
<template>
  <pro-table :defaultExpandedRowKeys="expandedRowKeys" :columns="columns" rowKey="id" ref="tableRef"
    @refresh="() => getTableData()" :loading="loading" :data-source="tableData" :pagination="false">
    <template #toolLeft>
      <a-button v-if="hasAccess(['sys:gantt:add'])" type="primary" @click="createDataRef.showModal()">新建</a-button>
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'actions'">
        <a-space>
          <TooltipIcon title="编辑"
            v-if="!(record.children && record.children.length != 0) && hasAccess(['sys:gantt:edit'])">
            <EditOutlined class="text-blue" @click="updateDataRef.showModal(record.id)" />
          </TooltipIcon>
          <TooltipIcon title="关联清单" v-if="!(record.children && record.children.length != 0)">
            <RetweetOutlined class="text-blue" @click="relevanceList(record)" />
          </TooltipIcon>
          <TooltipIcon v-if="hasAccess(['sys:gantt:addSub'])" title="添加下级">
            <PlusOutlined class="text-blue" @click="createDataRef.showModal(record.id)" />
          </TooltipIcon>
          <TooltipIcon title="删除"
            v-if="!(record.children && record.children.length != 0) && hasAccess(['sys:gantt:delete'])">
            <DeleteOutlined class="text-red" @click="deleteDate(record)" />
          </TooltipIcon>
        </a-space>
      </template>
    </template>
  </pro-table>
  <CreateData ref="createDataRef" @submit="() => getTableData(tableRef.onReload())"></CreateData>
  <UpdateData ref="updateDataRef" @submit="() => getTableData(tableRef.onReload())"></UpdateData>
</template>
<style scoped></style>