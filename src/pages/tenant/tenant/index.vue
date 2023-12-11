<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import ProTable from '@/components/pro-table/index.vue'
import TenantDrawer from "@/pages/tenant/tenant/component/TenantDrawer.vue";
import {createVNode, ref} from "vue";
import {ModalType} from "@/enums";
import {useTable} from "@/composables/useTable.ts";
import {deleteTenantApi, forbiddenTenantApi, getTenantListApi} from "@/api/tenant";
import TooltioIcon from "@/components/tooltip-icon/index.vue";
import {message, Modal} from "ant-design-vue";
import {ExclamationCircleOutlined} from "@ant-design/icons-vue";

const columns = [
  {title: '租户编号', dataIndex: 'id',},
  {title: '联系人', dataIndex: 'contactUserName', search: true, valueType: 'input'},
  {title: '联系电话', dataIndex: 'contactPhone',},
  {title: '企业名称', dataIndex: 'companyName', search: true, valueType: 'input'},
  {title: '地址', dataIndex: 'address',},
  {
    title: '状态', dataIndex: 'status', search: true, valueType: 'select', valueEnum: [
      {value: '1', label: '禁用',},
      {value: '0', label: '启用',},
    ]
  },
  {title: '创建人', dataIndex: 'createBy'},
  {title: '创建时间', dataIndex: 'createTime', width: 180, sorter: true,},
  {title: '更新人', dataIndex: 'updateBy'},
  {title: '更新时间', dataIndex: 'updateTime', width: 180, sorter: true,},
  {title: '操作', dataIndex: 'actions', width: 180, align: 'center'},
]
const tenantDrawerRef = ref()
const tenantTableRef = ref()
const {tableData, loading, getTableData, pagination} = useTable(getTenantListApi)
/**
 * 启用禁用租户
 * @param checked 是否禁用 true| false
 * @param id 菜单id
 */
const onStatusChange = async (checked: boolean, id: number) => {
  try {
    const res = await forbiddenTenantApi({id, status: checked ? '0' : '1'})
    if (res.code === 200) {
      message.success(res.message)
    }
  } catch (e) {

  } finally {
    await getTableData(tenantTableRef.value.onReload())
  }

}
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
        if(res.code === 200){
          getTableData(tenantTableRef.value.onReload())
          message.success(res.message)
        }
      })
    },
    onCancel() {
      console.log('Cancel');
    },
  });
}
</script>
<template>
  <PageContainer>
    <ProTable :columns="columns" ref="tenantTableRef" :data-source="tableData"
              @search="(params) => getTableData(params)" :loading="loading" @refresh="() => getTableData()"
              :pagination="pagination" title="租户列表" >
      <template #toolRight>
        <a-button type="primary" @click="tenantDrawerRef.openDrawer(ModalType.ADD)">新建租户</a-button>
      </template>

      <template #bodyCell="{ column,record }">
        <template v-if="column.dataIndex === 'actions'">
          <a-space :size="10">
            <TooltioIcon title="编辑">
              <EditOutlined class="text-blue" @click="tenantDrawerRef.openDrawer(ModalType.Edit, record.id)"/>
            </TooltioIcon>
            <TooltioIcon title="删除">
              <DeleteOutlined class="text-red" @click="deleteMenu(record)"/>
            </TooltioIcon>
          </a-space>
        </template>
        <template v-else-if="column.dataIndex === 'status'">
          <a-switch checked-children="启用" un-checked-children="禁用" checkedValue="0" :checked="record.status"
                    @change="(checked: boolean) =>onStatusChange(checked,record.id)"/>
        </template>
      </template>
    </ProTable>
    <TenantDrawer ref="tenantDrawerRef" @submit="() => getTableData(tenantTableRef.onReload())"></TenantDrawer>
  </PageContainer>
</template>

<style scoped>

</style>