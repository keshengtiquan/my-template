<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import ProTable from '@/components/pro-table/index.vue'
import {useRouter} from "vue-router";
const router = useRouter()
const columns = [
  {title: '模版名称', dataIndex: 'fileName',},
  {title: '导入类型', dataIndex: 'fileType',},
  {title: '解析页签', dataIndex: 'sheetName',},
  {title: '开始行号', dataIndex: 'skipRows',},
  {title: '操作', dataIndex: 'actions', width: 180, align: 'center'},
]
/**
 * 跳转导入模版页面
 */
const createTemplate = () => {
  router.push('/excel/import/create')
}
</script>
<template>
  <PageContainer>
    <pro-table :columns="columns" title="导入模版">
      <template #toolRight>
        <a-button type="primary" @click="createTemplate">新建模版</a-button>
      </template>
    </pro-table>
  </PageContainer>
</template>
<style scoped>

</style>
