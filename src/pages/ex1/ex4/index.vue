<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import {ref} from "vue";
import ProTable from '@/components/pro-table/index.vue'

const activeKey = ref('1');
const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '地址',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '标签',
    key: 'tags',
    dataIndex: 'tags',
  },
  {
    title: '操作',
    key: 'action',
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];
</script>
<template>
  <PageContainer title="测试">
    <template #content>
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="Tab 1"></a-tab-pane>
        <a-tab-pane key="2" tab="Tab 2" force-render></a-tab-pane>
        <a-tab-pane key="3" tab="Tab 3"></a-tab-pane>
      </a-tabs>
    </template>
    <ProTable :columns="columns" :data-source="data">
      <template #toolLeft>
        <h3>测试表格</h3>
      </template>
      <template #toolRight>
        <a-button type="primary">新增</a-button>
      </template>
    </ProTable>
  </PageContainer>

</template>


<style scoped>
.ant-tabs-top > :deep(.ant-tabs-nav) {
  margin: 0;
}

.ant-tabs-top > :deep(.ant-tabs-nav::before) {
  border-bottom: none;
}
</style>