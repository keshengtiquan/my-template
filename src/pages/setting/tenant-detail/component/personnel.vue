<script lang="ts" setup>
import { deleteTenantUserApi, getTenantUserApi } from '@/api/setting/tenant';
import { useTable } from '@/composables/useTable';
import ProTable from '@/components/pro-table/index.vue'
import { useRoute } from 'vue-router';
import AddTenantUser from './add-tenant-user.vue';
import TooltipIcon from '@/components/tooltip-icon/index.vue'
import { createVNode, ref } from 'vue';
import { UserTypeEnum } from '@/enums/index'
import { Modal, message } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
const route = useRoute();
const columns = [
  { title: 'ID', dataIndex: 'id', width: 80, align: 'center' },
  { title: '账号', dataIndex: 'userName', align: 'center' },
  { title: '用户名', dataIndex: 'nickName', align: 'center' },
  { title: '性别', dataIndex: 'gender', align: 'center' },
  { title: '电话号', dataIndex: 'phoneNumber', align: 'center' },
  { title: '邮箱', dataIndex: 'email', align: 'center' },
  { title: '状态', dataIndex: 'status', align: 'center' },
  { title: '备注', dataIndex: 'remark', align: 'center' },
  { title: '操作', dataIndex: 'actions', align: 'center' },
]
const { tableData, getTableData, pagination, loading } = useTable(getTenantUserApi, { tenantId: Number(route.query.tenantId as string) })
getTableData()
const addTenantUserRef = ref()
const tableRef = ref()
const deleteUserApi = async (record: any) => {
  Modal.confirm({
    title: `是否删除【${record.userName}】`,
    icon: createVNode(ExclamationCircleOutlined),
    content: '删除后不可恢复！',
    onOk() {
      deleteTenantUserApi({ tenantId: Number(route.query.tenantId as string), userId: record.id }).then(res => {
        if (res.code === 200) {
          getTableData(tableRef.value.onReload())
          message.success(res.message)
        }
      })
    },
    onCancel() {
      message.info('取消删除')
    },
  });
}
</script>
<template>
  <ProTable :columns="columns" ref="tableRef" :data-source="tableData" :pagination="pagination" title="项目用户"
    :is-padding="false" @refresh="() => getTableData()" @search="(params) => getTableData(params)" :loading="loading">
    <template #toolRight>
      <a-button type="primary" @click="addTenantUserRef.showModal()">添加用户</a-button>
    </template>
    <template #bodyCell="{ column,text, record }">
      <template v-if="column.dataIndex === 'actions'">
        <a-space :size="10">
          <TooltipIcon v-if="record.userType !== UserTypeEnum.PROJECTADMIN" title="删除">
            <DeleteOutlined @click="deleteUserApi(record)" class="text-red" />
          </TooltipIcon>
        </a-space>
      </template>
      <template v-else-if="column.dataIndex === 'gender'">
        <a-tag>{{ text === '0' ? '未知' : text === '1' ? '男' : '女' }}</a-tag>
      </template>
      <template v-else-if="column.dataIndex === 'status'">
        <a-tag :color="record.status === '1' ? 'red' : 'green'">{{ record.status === '1' ? '禁用' : '启用' }}</a-tag>
      </template>
    </template>
  </ProTable>
  <AddTenantUser ref="addTenantUserRef" @submit="() => getTableData(tableRef.onReload())"></AddTenantUser>
</template>
<style scoped></style>