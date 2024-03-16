<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import ProTable from '@/components/pro-table/index.vue'
import { batchDeleteCompanyDeptApi, deleteCompanyDeptApi, getCompanyDeptListApi, getCompanyTreeNodeApi } from '@/api/setting/company-dept'
import { createVNode, h, ref } from 'vue'
import { PlusOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue'
import CreateModal from './component/create-modal.vue'
import { useTable } from '@/composables/useTable'
import { useTreeSelect } from '@/composables/useTreeSelect'
import { Modal, message } from 'ant-design-vue'
import UpdateModal from './component/update-modal.vue'
import { useTheme } from '@/composables/theme'

const selectedKeys = ref()
const checkedKeys = ref()
const selectedRowKeys = ref([])
const createCompanyModalRef = ref()
const updateCompanyModalRef = ref()
const tableRef = ref()
const { token } = useTheme()

const columns = [
  { title: '组织名称', dataIndex: 'deptName', width: 400, search: true, valueType: 'input' },
  { title: '分类', dataIndex: 'deptType', width: 150, },
  { title: '排序', dataIndex: 'sortNumber', width: 100, },
  { title: '操作', dataIndex: 'actions', align: 'center', width: 50, },
]
const { loading, getTableData, tableData, pagination } = useTable(getCompanyTreeNodeApi)
getTableData()
const { treeData, getTreeData } = useTreeSelect(getCompanyDeptListApi)
const onSelectNode = async () => {
  await getTableData({ parentId: selectedKeys.value[0] })
}
const batchdelete = () => {
  Modal.confirm({
    title: `是否删除所选的${selectedRowKeys.value.length}项`,
    icon: createVNode(ExclamationCircleOutlined),
    content: '删除后不可恢复！',
    onOk() {
      batchDeleteCompanyDeptApi({ ids: selectedRowKeys.value }).then(res => {
        if (res.code === 200) {
          getTableData(tableRef.value.onReload())
          getTreeData()
          message.success(res.message)
          selectedRowKeys.value = []
        }
      })
    },
    onCancel() {
      message.info('取消删除')
    },
  });
}
const deleteConfirm = async (id: number) => {
  const res = await deleteCompanyDeptApi({ id })
  if (res.code === 200) {
    getTableData(tableRef.value.onReload())
    getTreeData()
    message.success(res.message)
  }
}
const onSubmit = () => {
  getTableData(tableRef.value.onReload())
  getTreeData()
}
</script>
<template>
  <PageContainer>
    <a-row :gutter="10">
      <a-col :span="5">
        <a-card>
          <a-tree :tree-data="treeData" v-if="treeData && treeData.length > 0" v-model:selectedKeys="selectedKeys"
            v-model:checkedKey="checkedKeys" @select="onSelectNode" defaultExpandAll
            :fieldNames="{ children: 'children', title: 'deptName', key: 'id' }" />
        </a-card>
      </a-col>
      <a-col :span="19">
        <ProTable :columns="columns" bordered ref="tableRef" :loading="loading" :pagination="pagination"
          v-model:selectedRowKeys="selectedRowKeys" @refresh="() => getTableData()" rowKey="id"
          :rowSelection="{ preserveSelectedRowKeys: true, columnWidth: 10 }" @search="(params) => getTableData(params)"
          :dataSource="tableData">
          <template #toolLeft>
            <a-space>
              <a-button type="primary" :icon="h(PlusOutlined)"
                @click="createCompanyModalRef.showModal(selectedKeys && selectedKeys.length > 0 ? selectedKeys[0] : null)">新增</a-button>
              <a-button danger :disabled="selectedRowKeys.length <= 0" :icon="h(DeleteOutlined)"
                @click="batchdelete">批量删除</a-button>
            </a-space>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'actions'">
              <a-space :size="5">
                <span class="cursor-pointer" @click="updateCompanyModalRef.showModal(record.id)" :style="{color: token.colorPrimary}">编辑</span>
                <a-divider type="vertical" />
                <a-popconfirm :title="`你确定删除此组织吗？`" ok-text="确定" cancel-text="取消" @confirm="deleteConfirm(record.id)">
                  <span class="cursor-pointer" :style="{color: token.colorErrorText}">删除</span>
                </a-popconfirm>
              </a-space>
            </template>
            <template v-else-if="column.dataIndex === 'deptType'">
              {{ record.deptType === 'company' ? '公司' : '部门' }}
            </template>
          </template>
        </ProTable>
      </a-col>
    </a-row>
    <CreateModal ref="createCompanyModalRef" @submit="onSubmit" />
    <UpdateModal ref="updateCompanyModalRef" @submit="onSubmit" />
  </PageContainer>
</template>
<style scoped></style>