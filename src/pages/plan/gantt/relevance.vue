<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import ProTable from '@/components/pro-table/index.vue'
import {useTable} from "@/composables/useTable.ts";
import {deleteRelevanceListApi, ganttRelevanceListApi, getGanttRelevanceListApi} from "@/api/gantt";
import {useRoute} from "vue-router";
import TooltipIcon from "@/components/tooltip-icon/index.vue";
import ListSelect from '@/components/list-select/index.vue'
import {createVNode, ref} from "vue";
import {getGanttExcludeApi} from "@/api/list";
import {message, Modal} from "ant-design-vue";
import {ExclamationCircleOutlined} from "@ant-design/icons-vue";
const route = useRoute()
const columns = [
  {title: '序号', dataIndex: 'serialNumber', width: 80, align: 'center'},
  {title: '项目编码', dataIndex: 'listCode', width: 150,},
  {title: '项目名称', dataIndex: 'listName', width: 220,},
  {title: '项目特征', dataIndex: 'listCharacteristic', ellipsis: true},
  {title: '单位', dataIndex: 'unit', width: 80, align: 'center'},
  {title: '操作', dataIndex: 'actions', width: 100, align: 'center', fixed: 'right'},
]
const {tableData, getTableData, loading, pagination} = useTable(getGanttRelevanceListApi, {ganttId: route.query.ganttId as string})
const listSelectRef = ref()
const tableRef = ref()
const listSelectSubmit = async (listIds: any[]) => {
  const res = await ganttRelevanceListApi({ganttId: route.query.ganttId as string, listIds: listIds})
  if(res.code === 200){
    message.success(res.message)
    await getTableData(tableRef.value.onReload())
  }
}
const deleteList = (record: any) => {
  Modal.confirm({
    title: `是否删除【${record.listName}】`,
    icon: createVNode(ExclamationCircleOutlined),
    content: '删除后不可恢复！',
    onOk() {
      deleteRelevanceListApi(record.id).then(res => {
        if (res.code === 200) {
          getTableData(tableRef.value.onReload())
          message.success(res.message)
        }
      })
    },
    onCancel() {
      console.log('取消删除');
    },
  });
}
</script>
<template>
  <PageContainer :title="route.query.text as string">
    <pro-table ref="tableRef" :columns="columns" @search="(params) => getTableData(params)" @refresh="() => getTableData()"
               :data-source="tableData" :loading="loading" :pagination="pagination">
      <template #toolLeft>
        <a-button type="primary" @click="listSelectRef.showModal()">关联清单</a-button>
      </template>
      <template #bodyCell="{ column,record }">
        <template v-if="column.dataIndex === 'actions'">
          <a-space :size="20">
            <TooltipIcon title="删除">
              <DeleteOutlined class="text-red" @click="deleteList(record)"/>
            </TooltipIcon>
          </a-space>
        </template>
      </template>
    </pro-table>
    <ListSelect ref="listSelectRef" :request="getGanttExcludeApi" @submit="listSelectSubmit"></ListSelect>
  </PageContainer>
</template>


<style scoped>

</style>