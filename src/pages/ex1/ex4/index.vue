<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import ProTable from '@/components/pro-table/index.vue'
import {useTable} from '@/composables/useTable.ts'

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
const {loading,getTableData, tableData, pagination} = useTable(getData)

const onChange = (pagination, _, sorter, { currentDataSource }) => {
  console.log(pagination, sorter,)
}


</script>
<script lang='ts'>
export default {
  name: "Ex4"
}
</script>
<template>
  <PageContainer title="测试">
    <ProTable :columns="columns" :loading="loading" :pagination="pagination" :data-source="tableData" @refresh="getTableData()"
              @search="(values) => getTableData(values)"
              @change="onChange">
<!--              @change="(pagination: any) => getTableData({current: pagination.current, pageSize: pagination.pageSize})">-->
      <template #toolLeft>
        <h3>测试表格</h3>
      </template>
      <template #toolRight>
        <a-button type="primary">新增</a-button>
      </template>
      <template #bodyCell="{ column, record }">
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