<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import ProTable from '@/components/pro-table/index.vue'
import TransferDrawer from "@/pages/resource/workplace/component/TransferDrawer.vue";
import {useRoute} from "vue-router";
import {ref} from "vue";

const route = useRoute()
const title = route.query.workPlaceName as string
const columns = [
  {title: '序号', dataIndex: 'serialNumber', width: 50, align: 'center', sorter: true},
  {title: '项目编码', dataIndex: 'listCode', width: 100, search: true, valueType: 'input', align: 'center'},
  {title: '项目名称', dataIndex: 'listName', width: 120, search: true, valueType: 'input', align: 'center'},
  {title: '项目特征', dataIndex: 'listCharacteristic', width: 120, search: true, valueType: 'input', ellipsis: true},
  {title: '单位', dataIndex: 'unit', width: 50, align: 'center'},
  {title: '工程量', dataIndex: 'quantities', width: 80, align: 'center'},
  {title: '单价', dataIndex: 'unitPrice', width: 100, align: 'center'},
  {title: '合价', dataIndex: 'combinedPrice', width: 100},
  {title: '操作', dataIndex: 'actions', width: 100, align: 'center', fixed: 'right'},
]
const transferDrawerRef = ref()
</script>
<template>
  <PageContainer>
    <pro-table :columns="columns" :title="`${title}清单`">
      <template #toolRight>
        <a-button type="primary" @click="transferDrawerRef.openDrawer()">添加清单</a-button>
      </template>
    </pro-table>
    <TransferDrawer ref="transferDrawerRef"></TransferDrawer>
  </PageContainer>
</template>



<style scoped>

</style>