<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import ProTable from '@/components/pro-table/index.vue'
import { createVNode, ref } from "vue";
import TooltipIcon from "@/components/tooltip-icon/index.vue";
import AddListModal from "@/pages/resource/division/component/addListModal.vue";
import { useRoute } from "vue-router";
import { useTable } from "@/composables/useTable.ts";
import { deleteDivisionListApi, getDivisionListApi } from "@/api/division";
import { message, Modal } from "ant-design-vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { useAccess } from "@/composables/useAccess";
const route = useRoute()
const { hasAccess } = useAccess()
const columns = ref([
  { title: '序号', dataIndex: 'serialNumber', width: 50, align: 'center' },
  { title: '项目编码', dataIndex: 'listCode', width: 110, },
  { title: '项目名称', dataIndex: 'listName', width: 120, },
  { title: '项目特征', dataIndex: 'listCharacteristic', width: 220, ellipsis: true },
  { title: '单位', dataIndex: 'unit', width: 50, align: 'center' },
  { title: '操作', dataIndex: 'actions', width: 100, align: 'center', fixed: 'right' },
])
const addListModalRef = ref()
const divisionTableRef = ref()
const { tableData, getTableData, loading, pagination } = useTable(getDivisionListApi, { divisionId: route.query.divisionId as string })
const selectedRowKeys = ref<any[]>([])
const onSelectChange = (selectedRowKey: any[]) => {
  selectedRowKeys.value = selectedRowKey
}
const batchDelete = () => {
  Modal.confirm({
    title: `是否删除所选的${selectedRowKeys.value.length}项`,
    icon: createVNode(ExclamationCircleOutlined),
    content: '删除后不可恢复！',
    onOk() {
      deleteDivisionListApi({ ids: selectedRowKeys.value, divisionId: route.query.divisionId as string }).then(res => {
        if (res.code === 200) {
          getTableData(divisionTableRef.value.onReload())
          message.success(res.message)
          selectedRowKeys.value = []
        }
      })
    },
    onCancel() {
      console.log('Cancel');
    },
  });
}
const deleteDivision = (record: any) => {
  Modal.confirm({
    title: `是否删除【${record.listName}】`,
    icon: createVNode(ExclamationCircleOutlined),
    content: '删除后不可恢复！',
    onOk() {
      deleteDivisionListApi({ ids: [record.id], divisionId: route.query.divisionId as string }).then(res => {
        if (res.code === 200) {
          getTableData(divisionTableRef.value.onReload())
          message.success(res.message)
        }
      })
    },
    onCancel() {
      console.log('Cancel');
    },
  });
}

</script>
<template>
  <PageContainer :title="route.query.divisionName as string">
    <pro-table :data-source="tableData" @refresh="() => getTableData()" :loading="loading" :pagination="pagination"
      :row-selection="{ selectedRowKeys: selectedRowKeys, preserveSelectedRowKeys: true, onChange: onSelectChange }"
      rowKey="id" ref="divisionTableRef" @search="(params) => getTableData(params)" :columns="columns">
      <template #toolLeft>
        <a-space>
          <a-button v-if="route.query.parentNames && hasAccess(['sys:divisionList:add'])" type="primary" @click="addListModalRef.showModal()">添加清单</a-button>
          <a-button v-if="hasAccess(['sys:divisionList:batchDelete'])" type="primary" danger :disabled="!(selectedRowKeys.length > 0)" @click="batchDelete">批量删除</a-button>
        </a-space>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'actions'">
          <a-space :size="20">
            <TooltipIcon v-if="hasAccess(['sys:divisionList:delete'])" title="删除">
              <DeleteOutlined class="text-red" @click="deleteDivision(record)" />
            </TooltipIcon>
          </a-space>
        </template>
      </template>
    </pro-table>
    <AddListModal ref="addListModalRef" @submit="() => getTableData(divisionTableRef.onReload())"></AddListModal>
  </PageContainer>
</template>
<style scoped></style>