<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import ProTable from '@/components/pro-table/index.vue'
import TooltipIcon from "@/components/tooltip-icon/index.vue";
import {useRouter} from "vue-router";
const router = useRouter()
const columns = [
  {title: '模版名称', dataIndex: 'templateName',},
  {title: '导出类型', dataIndex: 'exportType',},
  {title: '导出服务', dataIndex: 'exportService',},
  {title: '操作', dataIndex: 'actions', width: 180, align: 'center'},
]

const createTemplate = () => {
  router.push('/excel/export/create')
}
const editTem = (data: any) => {
  router.push({path: '/excel/export/update', query: {id: data.id}})
}
</script>
<template>
  <PageContainer>
    <pro-table :columns="columns">
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
              <DeleteOutlined class="text-red" @click=""/>
            </TooltipIcon>
          </a-space>
        </template>
      </template>
    </pro-table>
  </PageContainer>
</template>



<style scoped>

</style>