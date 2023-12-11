<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import ProTable from '@/components/pro-table/index.vue'
import Upload from '@/components/upload/index.vue'
import {createVNode, ref} from "vue";
import {deleteListApi, getListApi, uploadListApi} from "@/api/list";
import {useTable} from "@/composables/useTable.ts";
import TooltioIcon from "@/components/tooltip-icon/index.vue";
import {useRouter} from "vue-router";
import {message, Modal} from "ant-design-vue";
import {ExclamationCircleOutlined} from "@ant-design/icons-vue";

const columns = [
  {title: '序号', dataIndex: 'serialNumber', width: 50, align: 'center', sorter: true},
  {title: '项目编码', dataIndex: 'listCode', width: 100, search: true, valueType: 'input', align: 'center'},
  {title: '项目名称', dataIndex: 'listName', width: 120, search: true, valueType: 'input', align: 'center'},
  {title: '项目特征', dataIndex: 'listCharacteristic', width: 120, search: true, valueType: 'input', ellipsis: true},
  {title: '单位', dataIndex: 'unit', width: 50, align: 'center'},
  {title: '工程量', dataIndex: 'quantities', width: 80, align: 'center'},
  {title: '单价', dataIndex: 'unitPrice', width: 100, align: 'center'},
  {title: '合价', dataIndex: 'combinedPrice', width: 100},
  {title: '创建人', dataIndex: 'createBy', width: 100},
  {title: '创建时间', dataIndex: 'createTime', width: 150},
  {title: '更新人', dataIndex: 'updateBy', width: 100},
  {title: '更新时间', dataIndex: 'updateTime', width: 150},
  {title: '操作', dataIndex: 'actions', width: 100, align: 'center', fixed: 'right'},
]
const router = useRouter()
const open = ref(false)
const {tableData, loading, getTableData, pagination} = useTable(getListApi)
const listTableRef = ref()
/**
 * 创建
 */
const createList = () => {
  router.push('/resource/list/create')
}
/**
 * 编辑
 * @param id
 */
const editList = (id: string) => {
  router.push({path: '/resource/list/update', query: {id}})
}

const deleteList = (data: any) => {
  Modal.confirm({
    title: `是否删除【${data.listName}】`,
    icon: createVNode(ExclamationCircleOutlined),
    content: '删除后不可恢复！',
    onOk() {
      deleteListApi(data.id).then(res => {
        if (res.code === 200) {
          getTableData(listTableRef.value.onReload())
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
<script lang='ts'>
export default {
  name: "ListIndex"
}
</script>
<template>
  <PageContainer>
    <pro-table :data-source="tableData" ref="listTableRef" :loading="loading" :scroll="{ x: 2000 }" :pagination="pagination"
               @refresh="() => getTableData()"
               @search="(params) => getTableData(params)" :columns="columns" title="清单列表">
      <template #toolRight>
        <a-space :size="5">
          <a-button @click="() => open = true">导入清单</a-button>
          <a-button type="primary" @click="createList">新建清单</a-button>
        </a-space>
      </template>
      <template #bodyCell="{ column,record }">
        <template v-if="column.dataIndex === 'actions'">
          <a-space :size="20">
            <TooltioIcon title="编辑">
              <EditOutlined class="text-blue" @click="editList(record.id)"/>
            </TooltioIcon>
            <TooltioIcon title="删除">
              <DeleteOutlined class="text-red" @click="deleteList(record)"/>
            </TooltioIcon>
          </a-space>
        </template>
      </template>
    </pro-table>
    <Upload v-model:open="open" width="70%" :is-multiple="false" :request="uploadListApi"
            :upload-type="['xlsx']"></Upload>
  </PageContainer>
</template>


<style scoped>

</style>