<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import ProTable from '@/components/pro-table/index.vue'
import UserDrawer from "@/pages/setting/user/component/UserDrawer.vue";
import {createVNode, ref} from "vue";
import {ModalType} from "@/enums";
import {useTable} from "@/composables/useTable.ts";
import {deleteUserApi, forbiddenUserApi, getUserListApi} from "@/api/user";
import TooltioIcon from "@/components/tooltip-icon/index.vue";
import {message, Modal} from "ant-design-vue";
import {ExclamationCircleOutlined} from "@ant-design/icons-vue";
const columns = [
  {title: '用户账号', dataIndex: 'userName',},
  {title: '用户昵称', dataIndex: 'nickName',},
  {title: '联系电话', dataIndex: 'phoneNumber',},
  {title: '用户头像', dataIndex: 'avatar',},
  {title: '是否禁用', dataIndex: 'status'},
  {title: '创建人', dataIndex: 'createBy'},
  {title: '创建时间', dataIndex: 'createTime', width: 180, sorter: true,},
  {title: '更新人', dataIndex: 'updateBy'},
  {title: '更新时间', dataIndex: 'updateTime', width: 180, sorter: true,},
  {title: '操作', dataIndex: 'actions', width: 180, align: 'center'},
]
const userDrawerRef = ref()
const userTableRef = ref()
const {pagination,loading,tableData,getTableData} = useTable(getUserListApi)
/**
 * 删除用户
 * @param data record
 */
const deleteMenu = (data: any) => {
  Modal.confirm({
    title: `是否删除【${data.userName}】`,
    icon: createVNode(ExclamationCircleOutlined),
    content: '删除后不可恢复！',
    onOk() {
      deleteUserApi(data.id).then(res => {
        if(res.code === 200){
          getTableData(userTableRef.value.onReload())
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
    const res = await forbiddenUserApi({id, status: checked ? '1' : '0'})
    if (res.code === 200) {
      message.success(res.message)
    }
  } finally {
    await getTableData(userTableRef.value.onReload())
  }
}
</script>
<template>
  <PageContainer>
    <ProTable :columns="columns" ref="userTableRef" :loading="loading" @search="(params) => getTableData(params)" @refresh="() => getTableData()" :pagination="pagination" :data-source="tableData" title="用户列表">
      <template #toolRight>
        <a-button type="primary" @click="() => userDrawerRef.openDrawer(ModalType.ADD)">新建用户</a-button>
      </template>
      <template #bodyCell="{ column,record }">
        <template v-if="column.dataIndex === 'actions'">
          <a-space :size="10">
            <TooltioIcon title="编辑">
              <EditOutlined class="text-blue" @click="userDrawerRef.openDrawer(ModalType.Edit, record.id)"/>
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
    <UserDrawer ref="userDrawerRef" @submit="(() => getTableData(userTableRef.onReload())) "/>
  </PageContainer>
</template>



<style scoped>

</style>