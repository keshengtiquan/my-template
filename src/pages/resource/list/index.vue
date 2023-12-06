<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import ProTable from '@/components/pro-table/index.vue'
const columns = [
  {title: '序号', dataIndex: 'serialNumber',width: 120},
  {title: '项目编码', dataIndex: 'listCode',width: 120, search: true, valueType: 'input'},
  {title: '项目名称', dataIndex: 'listName', width: 120,search: true, valueType: 'input'},
  {title: '项目特征', dataIndex: 'listCharacteristic', width: 120,search: true, valueType: 'input'},
  {title: '单位', dataIndex: 'unit', width: 120},
  {title: '工程量', dataIndex: 'quantities', width: 120},
  {title: '单价', dataIndex: 'unitPrice', width: 120},
  {title: '合价', dataIndex: 'combinedPrice', width: 120},
  {title: '创建时间', dataIndex: 'createTime', width: 180},
  {title: '更新人', dataIndex: 'updateBy', width: 120},
  {title: '更新时间', dataIndex: 'updateTime', width: 180},
  {title: '操作', dataIndex: 'actions', width: 180, align: 'center'},
]
</script>
<template>
  <PageContainer>
    <pro-table :columns="columns" title="清单列表">
      <template #toolRight>
        <a-space :size="5">
          <a-button type="primary">上传</a-button>
          <a-button type="primary">新建清单</a-button>
        </a-space>
      </template>
    </pro-table>
  </PageContainer>
</template>



<style scoped>

</style>