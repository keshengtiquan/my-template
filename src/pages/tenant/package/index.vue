<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import ProTable from '@/components/pro-table/index.vue'
import PackageDrawer from "@/pages/tenant/package/component/PackageDrawer.vue";
import {createVNode, ref} from "vue";
import {ModalType} from "@/enums";
import {useTable} from "@/composables/useTable.ts";
import {deletePackageApi, getPackageListApi} from "@/api/package";
import TooltioIcon from "@/components/tooltip-icon/index.vue";
import {message, Modal} from "ant-design-vue";
import {ExclamationCircleOutlined} from "@ant-design/icons-vue";

const columns = [
  {title: '套餐名称', dataIndex: 'packageName',},
  {title: '备注', dataIndex: 'remark',},
  {title: '创建人', dataIndex: 'createBy'},
  {title: '创建时间', dataIndex: 'createTime', width: 180, sorter: true,},
  {title: '更新人', dataIndex: 'updateBy'},
  {title: '更新时间', dataIndex: 'updateTime', width: 180, sorter: true,},
  {title: '操作', dataIndex: 'actions', width: 180, align: 'center'},
]
const packageDrawerRef = ref()
const packageTableRef = ref()
const {loading, getTableData, tableData, pagination} = useTable(getPackageListApi, {current: 1, pageSize: 10})
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
        if(res.code === 200){
          getTableData(packageTableRef.value.onReload())
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
    <pro-table :columns="columns" ref="packageTableRef" @refresh="getTableData()" :loading="loading"
               :data-source="tableData" :pagination="pagination" title="套餐表格"
               @search="(params)=>getTableData(params)"
    >
      <template #toolRight>
        <a-button type="primary" @click="() => packageDrawerRef.openDrawer(ModalType.ADD)">新建套餐</a-button>
      </template>
      <template #bodyCell="{ column,record }">
        <template v-if="column.dataIndex === 'actions'">
          <a-space :size="10">
            <TooltioIcon title="编辑">
              <EditOutlined class="text-blue" @click="packageDrawerRef.openDrawer(ModalType.Edit, record.id)"/>
            </TooltioIcon>
            <TooltioIcon title="删除">
              <DeleteOutlined  class="text-red" @click="deleteMenu(record)"/>
            </TooltioIcon>
          </a-space>
        </template>
      </template>
    </pro-table>
    <PackageDrawer ref="packageDrawerRef" @submit="() => getTableData(packageTableRef.onReload())"></PackageDrawer>
  </PageContainer>
</template>

<style scoped>

</style>