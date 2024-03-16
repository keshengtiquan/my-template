<script setup lang="ts">
import { deletePackageApi, getPackageListApi } from '@/api/setting/package';
import PageContainer from '@/components/page-container/index.vue'
import ProTable from '@/components/pro-table/index.vue'
import { useTable } from '@/composables/useTable';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Modal, message } from 'ant-design-vue';
import { createVNode, ref } from 'vue';
import CreatePackageModal from './component/create-package-modal.vue';
import UpdatePackageModal from './component/update-package-modal.vue';
import TooltipIcon from '@/components/tooltip-icon/index.vue'

const columns = [
  { title: 'ID', dataIndex: 'id',width: 50, align: 'center' },
  { title: '套餐名称', dataIndex: 'packageName',width: 110, align: 'center' },
  { title: '备注', dataIndex: 'remark', align: 'center' },
  { title: '创建人', dataIndex: 'createBy',width: 100, align: 'center' },
  { title: '创建时间', dataIndex: 'createTime', width: 230, align: 'center' },
  { title: '更新人', dataIndex: 'updateBy',width: 100, align: 'center' },
  { title: '更新时间', dataIndex: 'updateTime', width: 230, align: 'center' },
  { title: '操作', dataIndex: 'actions', width: 100, align: 'center' },
]
const packageTableRef = ref()
const createPackageModal = ref()
const updatePackageModal = ref()
const { tableData, loading, pagination, getTableData } = useTable(getPackageListApi)
getTableData()
/**
 * 删除套餐
 * @param data record
 */
const deleteMenu = (data: any) => {
  Modal.confirm({
    title: `是否删除【${data.packageName}】`,
    icon: createVNode(ExclamationCircleOutlined),
    content: '删除后不可恢复！',
    onOk() {
      deletePackageApi(data.id).then(res => {
        if (res.code === 200) {
          getTableData(packageTableRef.value.onReload())
          message.success(res.message)
        }
      })
    },
    onCancel() {
      message.info('已取消删除')
    },
  });
}
</script>
<template>
  <PageContainer>
    <ProTable :columns="columns" :dataSource="tableData" :loading="loading" :pagination="pagination"
      @refresh="() => getTableData()" @search="(params) => getTableData(params)" ref="packageTableRef" bordered
      title="套餐列表">
      <template #toolRight>
        <a-space>
          <a-button type="primary" @click="createPackageModal.showModal()">新增套餐</a-button>
        </a-space>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'actions'">
          <a-space :size="10">
            <TooltipIcon title="编辑">
              <EditOutlined class="text-blue" @click="updatePackageModal.showModal(record.id)" />
            </TooltipIcon>
            <TooltipIcon title="删除">
              <DeleteOutlined class="text-red" @click="deleteMenu(record)" />
            </TooltipIcon>
          </a-space>
        </template>
      </template>
    </ProTable>
    <CreatePackageModal ref="createPackageModal" @submit="getTableData(packageTableRef.onReload())"/>
    <UpdatePackageModal ref="updatePackageModal" @submit="getTableData(packageTableRef.onReload())"/>
  </PageContainer>
</template>
<style scoped></style>