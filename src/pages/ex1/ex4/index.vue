<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import {ref} from "vue";
import { SmileOutlined, DownOutlined } from '@ant-design/icons-vue';

const activeKey = ref('1');
const columns = [
  {
    name: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
  },
  {
    title: 'Action',
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
    <a-table :columns="columns" :data-source="data">
      <template #headerCell="{ column }">
        <template v-if="column.key === 'name'">
        <span>
          <smile-outlined />
          Name
        </span>
        </template>
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          <a>
            {{ record.name }}
          </a>
        </template>
        <template v-else-if="column.key === 'tags'">
        <span>
          <a-tag
              v-for="tag in record.tags"
              :key="tag"
              :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'"
          >
            {{ tag.toUpperCase() }}
          </a-tag>
        </span>
        </template>
        <template v-else-if="column.key === 'action'">
        <span>
          <a>Invite 一 {{ record.name }}</a>
          <a-divider type="vertical" />
          <a>Delete</a>
          <a-divider type="vertical" />
          <a class="ant-dropdown-link">
            More actions
            <down-outlined />
          </a>
        </span>
        </template>
      </template>
    </a-table>
  </PageContainer>

</template>



<style scoped>
.ant-tabs-top >:deep(.ant-tabs-nav) {
  margin: 0;
}
.ant-tabs-top >:deep(.ant-tabs-nav::before) {
  border-bottom: none;
}
</style>