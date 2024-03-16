<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import ProTable from '@/components/pro-table/index.vue'
import { createVNode, ref } from "vue";
import { useTable } from "@/composables/useTable.ts";
import { deleteUserApi, forbiddenUserApi, getUserListApi } from "@/api/setting/user";
import TooltioIcon from "@/components/tooltip-icon/index.vue";
import { message, Modal } from "ant-design-vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import CreateModal from './component/create-modal.vue'
import UpdateModal from './component/update-modal.vue'
import { useTreeSelect } from '@/composables/useTreeSelect';
import { getCompanyDeptListApi } from '@/api/setting/company-dept';
const columns = [
  { title: '头像', dataIndex: 'avatar', align: 'center', width: 80 },
  { title: '账号', dataIndex: 'userName', align: 'center', search: true, valueType: 'input' },
  { title: '姓名', dataIndex: 'nickName', align: 'center', search: true, valueType: 'input' },
  { title: '性别', dataIndex: 'gender', align: 'center', width: 80 },
  { title: '机构', dataIndex: ['CompanyDept', 'deptName'], align: 'center' },
  { title: '联系电话', dataIndex: 'phoneNumber', align: 'center' },
  {
    title: '状态', dataIndex: 'status', align: 'center', width: 80, search: true, valueType: 'select', valueEnum: [
      { value: '0', label: '启用', },
      { value: '1', label: '禁用', },
    ]
  },
  { title: '操作', dataIndex: 'actions', width: 100, align: 'center', fixed: 'right' },
]
const createModalRef = ref()
const updateModalRef = ref()
const userTableRef = ref()
const selectedKeys = ref()
const { pagination, loading, tableData, getTableData } = useTable(getUserListApi)
getTableData()
const { treeData } = useTreeSelect(getCompanyDeptListApi)
const onSelectNode = async () => {
  await getTableData({ companyDeptId: selectedKeys.value[0] })
}
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
        if (res.code === 200) {
          getTableData(userTableRef.value.onReload())
          message.success(res.message)
        }
      })
    },
    onCancel() {
      message.info('取消删除');
    },
  });
}
/**
 * 启用禁用租户
 * @param checked 是否禁用 true| false
 * @param id 菜单id
 */
const onStatusChange = async (checked: boolean, id: number) => {
  try {
    const res = await forbiddenUserApi({ id, status: checked ? '0' : '1' })
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
    <a-row :gutter="10">
      <a-col :span="5">
        <a-card>
          <a-tree :tree-data="treeData" v-if="treeData && treeData.length > 0" v-model:selectedKeys="selectedKeys"
            @select="onSelectNode" defaultExpandAll
            :fieldNames="{ children: 'children', title: 'deptName', key: 'id' }" />
        </a-card>
      </a-col>
      <a-col :span="19">
        <ProTable :columns="columns" bordered ref="userTableRef" :loading="loading" @clear="() => getTableData()"
          @search="(params) => getTableData(params)" @refresh="() => getTableData()" :pagination="pagination"
          :data-source="tableData" title="用户列表">
          <template #toolRight>
            <a-button type="primary" @click="() => createModalRef.showModal()">新建用户</a-button>
          </template>
          <template #bodyCell="{ column, text, record }">
            <template v-if="column.dataIndex === 'actions'">
              <a-space :size="10">
                <TooltioIcon title="编辑">
                  <EditOutlined class="text-blue" @click="updateModalRef.showModal(record.id)" />
                </TooltioIcon>
                <TooltioIcon title="删除">
                  <DeleteOutlined class="text-red" @click="deleteMenu(record)" />
                </TooltioIcon>
              </a-space>
            </template>
            <template v-else-if="column.dataIndex === 'status'">
              <a-switch checked-children="启用" un-checked-children="禁用" checkedValue="0" :checked="record.status"
                @change="(checked: boolean) => onStatusChange(checked, record.id)" />
            </template>
            <template v-else-if="column.dataIndex === 'gender'">
              {{ text === '0' ? '未知' : text === '1' ? '男' : '女' }}
            </template>
          </template>
        </ProTable>
      </a-col>
    </a-row>
    <CreateModal ref="createModalRef" @submit="() => getTableData(userTableRef.onReload())"></CreateModal>
    <UpdateModal ref="updateModalRef" @submit="() => getTableData(userTableRef.onReload())" />
  </PageContainer>
</template>



<style scoped></style>