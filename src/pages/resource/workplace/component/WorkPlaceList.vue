<script setup lang="ts">

import {deleteWorkPlaceApi, getWorkPlaceListApi, uploadWorkPlaceApi} from "@/api/workplace";
import ProTable from "@/components/pro-table/index.vue";
import TooltipIcon from "@/components/tooltip-icon/index.vue";
import Upload from "@/components/upload/index.vue";
import {createVNode, ref} from "vue";
import {useTable} from "@/composables/useTable.ts";
import {message, Modal} from "ant-design-vue";
import {ExclamationCircleOutlined} from "@ant-design/icons-vue";
import {useRouter} from "vue-router";

const router = useRouter()
const columns = ref([
  {title: '排序', dataIndex: 'sortNumber'},
  {title: '工点编码', dataIndex: 'workPlaceCode'},
  {title: '工点名称', dataIndex: 'workPlaceName'},
  {title: '产值(元)', dataIndex: 'outputValue'},
  {title: '工点类型', dataIndex: 'workPlaceType'},
  {title: '创建人', dataIndex: 'createBy', width: 100},
  {title: '创建时间', dataIndex: 'createTime', width: 180},
  {title: '更新人', dataIndex: 'updateBy', width: 100},
  {title: '更新时间', dataIndex: 'updateTime', width: 180},
  {title: '操作', dataIndex: 'actions', width: 100, align: 'center', fixed: 'right'},
])

const createWorkPlace = () => {
  router.push('/resource/workplace/create')
}
const updateWorkPlace = (id: string) => {
  router.push({path: '/resource/workplace/update', query: {id}})
}
const workPlaceDetail = (record: any) => {
  router.push({path: '/resource/workplace/detail', query: {id: record.id, workPlaceName: record.workPlaceName, workPlaceType: record.workPlaceType}})
}
const open = ref(false)
const {getTableData, tableData, loading, pagination} = useTable(getWorkPlaceListApi)
const workPlaceTableRef = ref()
const deleteList = (data: any) => {
  Modal.confirm({
    title: `是否删除【${data.workPlaceName}】`,
    icon: createVNode(ExclamationCircleOutlined),
    content: '删除后不可恢复！',
    onOk() {
      deleteWorkPlaceApi(data.id).then(res => {
        if (res.code === 200) {
          getTableData(workPlaceTableRef.value.onReload())
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
  <div>
    <pro-table :columns="columns" ref="workPlaceTableRef" :data-source="tableData" :loading="loading"
               :pagination="pagination"
               @refresh="() => getTableData()" @search="(params) => getTableData(params)" title="工点列表">
      <template #toolRight>
        <a-space>
          <a-button @click="() => open = true">导入工点</a-button>
          <a-button type="primary" @click="createWorkPlace">添加工点</a-button>
        </a-space>
      </template>
      <template #bodyCell="{ column,record }">
        <template v-if="column.dataIndex === 'actions'">
          <a-space :size="20">
            <TooltipIcon title="编辑">
              <EditOutlined class="text-blue" @click="updateWorkPlace(record.id)"/>
            </TooltipIcon>
            <TooltipIcon title="删除">
              <DeleteOutlined class="text-red" @click="deleteList(record)"/>
            </TooltipIcon>
          </a-space>
        </template>
        <template v-else-if="column.dataIndex === 'workPlaceName'">
          <a-typography-link @click="workPlaceDetail(record)">{{ record.workPlaceName }}</a-typography-link>
        </template>
      </template>
    </pro-table>
    <Upload v-model:open="open" width="70%" :request="uploadWorkPlaceApi" :upload-type="['xlsx']"></Upload>
  </div>

</template>



<style scoped>

</style>