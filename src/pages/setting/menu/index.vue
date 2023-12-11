<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import ProTable from '@/components/pro-table/index.vue'
import {useTable} from "@/composables/useTable.ts";
import {deleteMenuApi, forbiddenMenuApi, getMenuListApi} from "@/api/menu";
import MenuModal from "@/pages/setting/menu/component/MenuModal.vue";
import {createVNode, ref} from "vue";
import {ModalType} from "@/enums";
import TooltioIcon from '@/components/tooltip-icon/index.vue'
import DescriptionDrawer from '@/components/description-drawer/index.vue'
import {message, Modal} from "ant-design-vue";
import {ExclamationCircleOutlined} from "@ant-design/icons-vue";

const columns = [
  {title: 'id', dataIndex: 'id', width: 200,align: 'center', resizable: true},
  {title: '菜单名称', dataIndex: 'title',width: 100, resizable: true},
  {title: '路由地址', dataIndex: 'path',width: 220, resizable: true},
  {title: '图标', dataIndex: 'icon',width: 100, resizable: true},
  {title: '状态', dataIndex: 'status',width: 100, resizable: true},
  {title: '权限标识', dataIndex: 'permission',width: 100, resizable: true},
  {title: '排序', dataIndex: 'menuSort',width: 100, resizable: true},
  {title: '创建人', dataIndex: 'createBy',width: 100, resizable: true},
  {title: '创建时间', dataIndex: 'createTime',width: 180, resizable: true},
  {title: '更新人', dataIndex: 'updateBy',width: 100, resizable: true},
  {title: '更新时间', dataIndex: 'updateTime',width: 180, resizable: true},
  {title: '操作', dataIndex: 'actions',width: 150,align: 'center', fixed: 'right'},
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
/**
 * 禁用菜单
 * @param checked 是否禁用 true| false
 * @param id 菜单id
 */
const onStatusChange = async (checked: boolean,id:number) => {
  const res = await forbiddenMenuApi({id,status:checked?'0':'1'})
  if(res.code === 200) {
    message.success(res.message)
  }
}
/**
 * 删除菜单
 * @param data record
 */
const deleteMenu = (data: any) => {
  Modal.confirm({
    title: `是否删除【${data.title}】`,
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
    <ProTable :columns="columns" :scroll="{ x: 1500 }" rowKey="id" ref="menuTableRef" :loading="loading" @refresh="() => getTableData()" :pagination="false" :data-source="tableData">
      <template #toolLeft>
        <span class="font-600 font-size-16px">菜单表格</span>
      </template>
      <template #toolRight>
        <a-button type="primary" @click="menuModalRef.openModal(ModalType.ADD,undefined,0)">新增</a-button>
      </template>
      <template #bodyCell="{ column,record }">
        <template v-if="column.dataIndex === 'icon'">
          <Component v-if="record.icon" :is="record.icon"/>
        </template>
        <template v-else-if="column.dataIndex === 'status'">
          <a-switch checked-children="启用" un-checked-children="禁用" checkedValue="0" v-model:checked="record.status" @change="(checked: boolean) =>onStatusChange(checked,record.id)" />
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
