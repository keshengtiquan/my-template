<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import ProTable from '@/components/pro-table/index.vue'
import {useRouter} from "vue-router";
import {useTable} from "@/composables/useTable.ts";
import {deleteTemplateApi, getTemplateListApi} from "@/api/excel";
import TooltipIcon from "@/components/tooltip-icon/index.vue";
import {message, Modal} from "ant-design-vue";
import {createVNode, ref} from "vue";
import {ExclamationCircleOutlined} from "@ant-design/icons-vue";

const router = useRouter()
const columns = [
  {title: '模版名称', dataIndex: 'fileName',},
  {title: '导入类型', dataIndex: 'fileType',},
  {title: '解析页签', dataIndex: 'sheetName',},
  {title: '开始行号', dataIndex: 'skipRows',},
  {title: '操作', dataIndex: 'actions', width: 180, align: 'center'},
]
const importTableRef = ref()
/**
 * 跳转导入模版页面
 */
const createTemplate = () => {
  router.push('/excel/import/create')
}
const {tableData, loading, getTableData, pagination} = useTable(getTemplateListApi)
const editTem = (record: any) => {
  router.push(`/excel/import/create?id=${record.id}`)
}
const deleteList = (data: any) => {
  Modal.confirm({
    title: `是否删除【${data.fileName}】`,
    icon: createVNode(ExclamationCircleOutlined),
    content: '删除后不可恢复！',
    onOk() {
      deleteTemplateApi(data.id).then(res => {
        if (res.code === 200) {
          getTableData(importTableRef.value.onReload())
          message.success(res.message)
        }
      })
    },
  });
}
</script>
<template>
  <PageContainer>
    <pro-table :data-source="tableData" ref="importTableRef" :pagination="pagination" :loading="loading" @refresh="() => getTableData()" :columns="columns" title="导入模版">
      <template #toolRight>
        <a-button type="primary" @click="createTemplate">新建模版</a-button>
      </template>
      <template #bodyCell="{ column, record, }">
        <template v-if="column.dataIndex === 'actions'">
          <a-space>
            <TooltipIcon title="编辑">
              <EditOutlined class="text-blue" @click="editTem(record)"/>
            </TooltipIcon>
            <TooltipIcon title="删除">
              <DeleteOutlined class="text-red" @click="deleteList(record)"/>
            </TooltipIcon>
          </a-space>
        </template>
      </template>
    </pro-table>
  </PageContainer>
</template>
<style scoped>

</style>
