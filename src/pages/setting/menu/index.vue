<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import ProTable from '@/components/pro-table/index.vue'
import {useTable} from "@/composables/useTable.ts";
import {deleteMenuApi, getMenuListApi} from "@/api/menu";
import MenuModal from "@/pages/setting/menu/component/MenuModal.vue";
import {createVNode, ref} from "vue";
import {ModalType} from "@/enums";
import TooltioIcon from '@/components/tooltip-icon/index.vue'
import DescriptionDrawer from '@/components/description-drawer/index.vue'
import {message, Modal} from "ant-design-vue";
import {ExclamationCircleOutlined} from "@ant-design/icons-vue";

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
const menuTableRef = ref()
const viewDrawerOpen = ref(false)
const descriptionData = ref()
const {loading, getTableData, tableData} = useTable(getMenuListApi, undefined, false)
const viewHandle = (data: object) => {
  viewDrawerOpen.value = true
  descriptionData.value = data
}
const deleteMenu = (data: any) => {
  Modal.confirm({
    title: `是否删除${data.title}`,
    icon: createVNode(ExclamationCircleOutlined),
    content: '删除后不可恢复！',
    onOk() {
      deleteMenuApi({id: data.id}).then(res => {
        if(res.code === 200){
          getTableData(menuTableRef.value.onReload())
          message.success(res.message)
        }
      })
    },
    onCancel() {
      console.log('Cancel');
    },
    class: 'test',
  });
}
</script>
<template>
  <PageContainer>
    <ProTable :columns="columns" rowKey="id" ref="menuTableRef" :loading="loading" @refresh="() => getTableData()" :pagination="false" :data-source="tableData">
      <template #toolLeft>
        <h3>菜单表格</h3>
      </template>
      <template #toolRight>
        <a-button type="primary" @click="menuModalRef.openModal(ModalType.ADD,undefined,0)">新增</a-button>
      </template>
      <template #bodyCell="{ column,record }">
        <template v-if="column.dataIndex === 'icon'">
          <Component v-if="record.icon" :is="record.icon"/>
        </template>
        <template v-else-if="column.dataIndex === 'actions'">
          <a-space :size="10">
            <TooltioIcon title="编辑">
              <EditOutlined class="text-blue" @click="menuModalRef.openModal(ModalType.Edit, record.id)"/>
            </TooltioIcon>
            <TooltioIcon class="text-green" title="查看">
              <EyeOutlined @click="viewHandle(record)"/>
            </TooltioIcon>
            <TooltioIcon title="添加下级">
              <PlusOutlined class="text-blue" @click="menuModalRef.openModal(ModalType.ADD,undefined,record.id)"/>
            </TooltioIcon>
            <TooltioIcon title="删除">
              <DeleteOutlined  class="text-red" @click="deleteMenu(record)"/>
            </TooltioIcon>
          </a-space>
        </template>
      </template>
    </ProTable>
    <MenuModal ref="menuModalRef" @submit="() => getTableData(menuTableRef.onReload())"></MenuModal>
    <DescriptionDrawer v-model:open="viewDrawerOpen" width="60%"  :description-data="descriptionData"></DescriptionDrawer>
  </PageContainer>
</template>
<style scoped>

</style>