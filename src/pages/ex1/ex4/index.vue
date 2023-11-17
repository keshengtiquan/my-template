<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import ProTable from '@/components/pro-table/index.vue'
import {useTable} from '@/composables/useTable.ts'
import { ref } from 'vue';
const activeKey = ref('1');
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    search: true,
    sorter: true,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    search: true,
    sorter: true,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    search: true,
  },
  {
    title: 'Address1',
    dataIndex: 'address1',
    search: true,
  },
  {
    title: 'Address2',
    dataIndex: 'address2',
    search: true,
  },
  {
    title: 'Address3',
    dataIndex: 'address3',
    search: true
  },
];

const getData = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      const arr = []
      for (let i = 0; i < 20; i++) {
        arr.push({
          key: i,
          name: `Edward King ${i}`,
          age: 32,
          address: `London, Park Lane no. ${i}`,
        });
      }
      resolve({code: 200, data: {results: arr, total: 100, current: 1, pageSize: 20}, message: 'success'})
    },1000)

  })
}
const {loading,getTableData, tableData, pagination} = useTable(getData, {office: activeKey.value})

</script>
<script lang='ts'>
export default {
  name: "Ex4"
}
</script>
<template>
  <PageContainer title="测试">
    <template #content>
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="Tab 1">

        </a-tab-pane>
        <a-tab-pane key="2" tab="Tab 2" force-render></a-tab-pane>
        <a-tab-pane key="3" tab="Tab 3"></a-tab-pane>
      </a-tabs>
    </template>
    <ProTable :columns="columns" :loading="loading" :pagination="pagination" :data-source="tableData" @refresh="getTableData()"
              @search="(values) => getTableData(values)">
      <template #toolLeft>
        <h3>测试表格</h3>
      </template>
      <template #toolRight>
        <a-button type="primary">新增</a-button>
      </template>

      <template #bodyCell="{ column }">
        <template v-if="column.dataIndex === 'address1'">
        <span>
          <a-divider type="vertical"/>
          <a>Delete</a>
          <a-divider type="vertical"/>
          <a class="ant-dropdown-link">
            More actions
            <down-outlined/>
          </a>
        </span>
        </template>
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