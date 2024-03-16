<script setup lang="ts">
import { deleteTenantApi, forbiddenTenantApi, getTenantListApi } from '@/api/setting/tenant';
import PageContainer from '@/components/page-container/index.vue'
import ProTable from '@/components/pro-table/index.vue'
import { useTable } from '@/composables/useTable';
import createTenantModal from './component/create-tenant-modal.vue';
import TooltipIcon from '@/components/tooltip-icon/index.vue'
import { createVNode, ref } from 'vue';
import { Modal, message } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
const router = useRouter()
const columns = [
  { title: 'ID', dataIndex: 'id', align: 'center', width: 50, fixed: 'left' },
  { title: '项目名称', dataIndex: 'companyName', align: 'center', search: true, valueType: 'input' },
  { title: '联系人', dataIndex: 'contactUserName', align: 'center', search: true, valueType: 'input' },
  { title: '项目套餐', dataIndex: ['tenantPackage', 'packageName'], align: 'center', search: true, valueType: 'input' },
  { title: '联系电话', dataIndex: 'contactPhone', align: 'center', search: true, valueType: 'input' },
  {
    title: '状态', dataIndex: 'status', align: 'center', search: true, valueType: 'select', valueEnum: [
      { value: '1', label: '禁用', },
      { value: '0', label: '启用', },
    ]
  },
  { title: '创建人', dataIndex: 'createBy', align: 'center', width: 110, },
  { title: '创建时间', dataIndex: 'createTime', align: 'center', width: 220, },
  { title: '更新人', dataIndex: 'updateBy', align: 'center', width: 110, },
  { title: '更新时间', dataIndex: 'updateTime', align: 'center', width: 220, },
  { title: '操作', dataIndex: 'actions', width: 100, align: 'center', fixed: 'right' },
]
const tableRef = ref()
const createTenantModalRef = ref()
const { pagination, getTableData, loading, tableData } = useTable(getTenantListApi)
getTableData()

/**
 * 删除套餐
 * @param data record
 */
const deleteMenu = (data: any) => {
  Modal.confirm({
    title: `是否删除【${data.companyName}】`,
    icon: createVNode(ExclamationCircleOutlined),
    content: '删除后不可恢复！',
    onOk() {
      deleteTenantApi(data.id).then(res => {
        if (res.code === 200) {
          getTableData(tableRef.value.onReload())
          message.success(res.message)
        }
      })
    },
    onCancel() {
      message.info('已取消删除')
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
    const res = await forbiddenTenantApi({ id, status: checked ? '0' : '1' })
    if (res.code === 200) {
      message.success(res.message)
    }
  } catch (e) {

  } finally {
    await getTableData(tableRef.value.onReload())
  }
}
const toDetail = (id: number) => {
  router.push({ path: '/tenant/detail', query: { tenantId: id } })
}
</script>
<template>
  <PageContainer>
    <ProTable :columns="columns" :scroll="{ x: 1500 }" ref="tableRef" :data-source="tableData" :pagination="pagination"
      :loading="loading" @refresh="() => getTableData()" @search="(params) => getTableData(params)" title="项目列表">
      <template #toolRight>
        <a-space>
          <a-button type="primary" @click="createTenantModalRef.showModal()">创建项目</a-button>
        </a-space>
      </template>
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'actions'">
          <a-space :size="10">
            <TooltipIcon title="编辑">
              <EditOutlined class="text-blue" @click="" />
            </TooltipIcon>
            <TooltipIcon title="删除">
              <DeleteOutlined class="text-red" @click="deleteMenu(record)" />
            </TooltipIcon>
          </a-space>
        </template>
        <template v-else-if="column.dataIndex === 'status'">
          <a-switch checked-children="启用" un-checked-children="禁用" checkedValue="0" :checked="record.status"
            @change="(checked: boolean) => onStatusChange(checked, record.id)" />
        </template>
        <template v-else-if="column.dataIndex === 'companyName'">
          <a @click="toDetail(record.id)">{{ text }}</a>
        </template>
      </template>
    </ProTable>
    <createTenantModal ref="createTenantModalRef" />
  </PageContainer>
</template>
<style scoped></style>deleteTenantApi, forbiddenTenantApi, createVNode, import { ExclamationCircleOutlined } from
'@ant-design/icons-vue';
import { Modal, message } from 'ant-design-vue';
