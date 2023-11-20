<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import ProTable from '@/components/pro-table/index.vue'
import {useTable} from "@/composables/useTable.ts";
import {getMenuListApi} from "@/api/menu";
import MenuModal from "@/pages/setting/menu/component/MenuModal.vue";
import {ref} from "vue";
import {ModalType} from "@/enums";

const columns = [
  {title: 'id', dataIndex: 'id'},
  {title: '菜单名称', dataIndex: 'title',},
  {title: '路由地址', dataIndex: 'path',},
  {title: '图标', dataIndex: 'icon'},
  {title: '菜单类型', dataIndex: 'menuType'},
  {title: '权限标识', dataIndex: 'permission'},
  {title: '创建人', dataIndex: 'createBy'},
  {title: '创建时间', dataIndex: 'createTime',width: 180},
  {title: '更新人', dataIndex: 'updateBy'},
  {title: '更新时间', dataIndex: 'updateTime',width: 180},
  {title: '操作', dataIndex: 'actions',width: 180},
]
const menuModalRef = ref()
const {loading, getTableData, tableData} = useTable(getMenuListApi, undefined, false)

</script>
<template>
  <PageContainer>
    <ProTable :columns="columns" :loading="loading" @refresh="() => getTableData()" :pagination="false" :data-source="tableData">
      <template #toolLeft>
        <h3>菜单表格</h3>
      </template>
      <template #toolRight>
        <a-button type="primary" @click="menuModalRef.openModal(ModalType.ADD)">新增</a-button>
      </template>
      <template #bodyCell="{ column,record }">
        <template v-if="column.dataIndex === 'icon'">
          <Component :is="record.icon"/>
        </template>
        <template v-else-if="column.dataIndex === 'actions'">
          <a @click="menuModalRef.openModal(ModalType.Edit, record.id)">编辑</a>
        </template>
      </template>
    </ProTable>
    <MenuModal ref="menuModalRef" ></MenuModal>
  </PageContainer>
</template>
<style scoped>

</style>