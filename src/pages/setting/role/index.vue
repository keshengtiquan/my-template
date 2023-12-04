<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import ProTable from '@/components/pro-table/index.vue'
import RoleDrawer from './component/RoleDrawer.vue'
import {createVNode, ref} from "vue";
import {ModalType} from "@/enums";
import {useTable} from "@/composables/useTable.ts";
import {deleteRoleApi, forbiddenRoleApi, getRoleListApi} from "@/api/role";
import TooltioIcon from "@/components/tooltip-icon/index.vue";
import {message, Modal} from "ant-design-vue";
import {ExclamationCircleOutlined} from "@ant-design/icons-vue";

const columns = [
  {title: '角色名称', dataIndex: 'roleName',},
  {title: '角色字符', dataIndex: 'roleKey',},
  {title: '显示顺序', dataIndex: 'roleSort'},
  {title: '是否禁用', dataIndex: 'status'},
  {title: '创建人', dataIndex: 'createBy'},
  {title: '创建时间', dataIndex: 'createTime', width: 180, sorter: true,},
  {title: '更新人', dataIndex: 'updateBy'},
  {title: '更新时间', dataIndex: 'updateTime', width: 180, sorter: true,},
  {title: '操作', dataIndex: 'actions', width: 180},
]
const roleDrawerRef = ref()
const roleTableRef = ref()
const {loading, getTableData, tableData, pagination} = useTable(getRoleListApi)

/**
 * 删除套餐
 * @param data record
 */
const deleteMenu = (data: any) => {
  Modal.confirm({
    title: `是否删除【${data.roleName}】`,
    icon: createVNode(ExclamationCircleOutlined),
    content: '删除后不可恢复！',
    onOk() {
      deleteRoleApi(data.id).then(res => {
        if(res.code === 200){
          getTableData(roleTableRef.value.onReload())
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
/**
 * 启用禁用租户
 * @param checked 是否禁用 true| false
 * @param id 菜单id
 */
const onStatusChange = async (checked: boolean, id: number) => {
  try {
    const res = await forbiddenRoleApi({id, status: checked ? '1' : '0'})
    if (res.code === 200) {
      message.success(res.message)
    }
  } finally {
    await getTableData(roleTableRef.value.onReload())
  }
}
</script>
<template>
  <PageContainer>
    <ProTable ref="roleTableRef" :columns="columns" :data-source="tableData" :pagination="pagination" :loading="loading"
              @refresh="() => getTableData()" title="角色列表" @search="(params) => getTableData(params)">
      <template #toolRight>
        <a-button type="primary" @click="() => roleDrawerRef.openDrawer(ModalType.ADD)">新建角色</a-button>
      </template>
      <template #bodyCell="{ column,record }">
        <template v-if="column.dataIndex === 'actions'">
          <a-space :size="10">
            <TooltioIcon title="编辑">
              <EditOutlined class="text-blue" @click="roleDrawerRef.openDrawer(ModalType.Edit, record.id)"/>
            </TooltioIcon>
            <TooltioIcon title="删除">
              <DeleteOutlined class="text-red" @click="deleteMenu(record)"/>
            </TooltioIcon>
          </a-space>
        </template>
        <template v-else-if="column.dataIndex === 'status'">
          <a-switch checked-children="是" un-checked-children="否" checkedValue="1" :checked="record.status"
                    @change="(checked: boolean) =>onStatusChange(checked,record.id)"/>
        </template>
      </template>
    </ProTable>
    <RoleDrawer ref="roleDrawerRef" @submit="getTableData(roleTableRef.onReload())"></RoleDrawer>
  </PageContainer>
</template>


<style scoped>

</style>