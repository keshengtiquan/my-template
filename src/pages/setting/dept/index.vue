<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import ProTable from '@/components/pro-table/index.vue'
import DeptDrawer from "@/pages/setting/dept/component/DeptDrawer.vue";
import {createVNode, ref} from "vue";
import {ModalType} from "@/enums";
import {useTable} from "@/composables/useTable.ts";
import {deleteDeptApi, forbiddenDeptApi, getDeptListApi} from "@/api/dept";
import TooltioIcon from "@/components/tooltip-icon/index.vue";
import {message, Modal} from "ant-design-vue";
import {ExclamationCircleOutlined} from "@ant-design/icons-vue";

const columns = [
  {title: '部门名称', dataIndex: 'deptName',},
  {title: '状态', dataIndex: 'status'},
  {title: '创建人', dataIndex: 'createBy', width: 150},
  {title: '创建时间', dataIndex: 'createTime', width: 180},
  {title: '更新人', dataIndex: 'updateBy', width: 150},
  {title: '更新时间', dataIndex: 'updateTime', width: 180},
  {title: '操作', dataIndex: 'actions', width: 180, align: 'center'},
]
const deptDrawerRef = ref()
const deptTableRef = ref()
const { tableData, getTableData, loading } = useTable(getDeptListApi,undefined, false)
/**
 * 删除部门
 * @param data record
 */
const deleteDept = (data: any) => {
  Modal.confirm({
    title: `是否删除【${data.deptName}】`,
    icon: createVNode(ExclamationCircleOutlined),
    content: '删除后不可恢复！',
    onOk() {
      deleteDeptApi(data.id).then(res => {
        if(res.code === 200){
          getTableData(deptTableRef.value.onReload())
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
    const res = await forbiddenDeptApi({id, status: checked ? '0' : '1'})
    if (res.code === 200) {
      message.success(res.message)
    }
  } finally {
    await getTableData(deptTableRef.value.onReload())
  }
}
</script>
<template>
  <PageContainer>
    <ProTable :columns="columns" row-key="id" ref="deptTableRef" @refresh="() => getTableData()" :pagination="false" :data-source="tableData" :loading="loading" title="部门列表">
      <template #toolRight>
        <a-button type="primary" @click="() => deptDrawerRef.openDrawer(ModalType.ADD)">添加部门</a-button>
      </template>
      <template #bodyCell="{ column,record }">
        <template v-if="column.dataIndex === 'actions'">
          <a-space :size="10">
            <TooltioIcon title="编辑">
              <EditOutlined class="text-blue" @click="deptDrawerRef.openDrawer(ModalType.Edit, record.id)"/>
            </TooltioIcon>
            <TooltioIcon title="删除">
              <DeleteOutlined class="text-red" @click="deleteDept(record)"/>
            </TooltioIcon>
          </a-space>
        </template>
        <template v-else-if="column.dataIndex === 'status'">
          <a-switch checked-children="启用" un-checked-children="禁用" checkedValue="0" :checked="record.status"
                    @change="(checked: boolean) =>onStatusChange(checked,record.id)"/>
        </template>
      </template>
    </ProTable>
    <DeptDrawer ref="deptDrawerRef" @submit="() => getTableData(deptTableRef.onReload())"></DeptDrawer>
  </PageContainer>
</template>
<style scoped>

</style>@/api/setting/dept