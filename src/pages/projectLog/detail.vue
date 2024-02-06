<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import {useTable} from "@/composables/useTable.ts";
import {addListApi, deleteLogApi, getProjectLogDetailApi, saveLogApi} from "@/api/projectLog";
import {useRoute} from "vue-router";
import ProTable from '@/components/pro-table/index.vue'
import {createVNode, reactive, ref, UnwrapRef} from "vue";
import {cloneDeep} from 'lodash-es';
import {getWorkPlaceByListIdApi} from "@/api/workplace";
import {message, Modal} from "ant-design-vue";
import ListSelect from '@/components/list-select/index.vue'
import {getLogExcludeApi} from "@/api/list";
import {ExclamationCircleOutlined} from "@ant-design/icons-vue";
import FillLog from './component/fillLog.vue'

const route = useRoute()
const tableRef = ref()
const listSelectRef = ref()
const fillLogRef = ref()
const columns = ref<any[]>([
  {title: '序号', dataIndex: 'serialNumber', width: 80, align: 'center', sorter: true},
  {title: '项目编码', dataIndex: 'listCode', width: 100,},
  {title: '项目名称', dataIndex: 'listName', width: 100,},
  {title: '项目特征', dataIndex: 'listCharacteristic', width: 150, ellipsis: true},
  {title: '单位', dataIndex: 'unit', width: 80, align: 'center'},
  {title: '完成量', dataIndex: 'quantity', width: 200, align: 'center'},
  {title: '创建时间', dataIndex: 'createTime', width: 150},
  {title: '更新时间', dataIndex: 'updateTime', width: 150},
  {title: '操作', dataIndex: 'actions', width: 100, align: 'center', fixed: 'right'},
])
const {tableData, getTableData, loading, pagination} = useTable(getProjectLogDetailApi, {
  logId: route.query.logId,
  workAreaId: route.query.workAreaId,
  fillDate: route.query.fillDate
})
const editableData: UnwrapRef<Record<string, any>> = reactive({});
const editableOption: UnwrapRef<Record<string, any>> = reactive({});
/**
 * 编辑
 * @param id
 */
const edit = async (record: any) => {
  fillLogRef.value.showModal(record)
};

/**
 * 保存
 * @param record
 */
const save = async (record: any) => {
  const params = {
    logId: editableData[record.id]['logId'],
    logDetailId: editableData[record.id]['logDetailId'],
    workPlace: editableData[record.id]['workPlace'],
    quantity: editableData[record.id]['quantity'],
  }
  const res = await saveLogApi(params)
  if (res.code === 200) {
    await getTableData(tableRef.value.onReload())
    message.success(res.message)
    delete editableData[record.id];
  }
};

/**
 * 添加清单
 * @param listId
 */
const listSelectSubmit = async (listId: string[]) => {
  const res = await addListApi({
    listIds: listId,
    logId: route.query.logId as string,
    workAreaId: route.query.workAreaId as string
  })
  if (res.code === 200) {
    await getTableData(tableRef.value.onReload())
    message.success(res.message)
  }
}

const deleteLogDetail = (record: any) => {
  Modal.confirm({
    title: `是否删除【${record.listName}】`,
    icon: createVNode(ExclamationCircleOutlined),
    content: '删除后不可恢复！',
    onOk() {
      deleteLogApi({logId: record.logId, listId: record.listId}).then(res => {
        if (res.code === 200) {
          getTableData(tableRef.value.onReload())
          message.success(res.message)
        }
      })
    },
    onCancel() {
      message.info('取消删除');
    },
  });
}


</script>
<template>
  <PageContainer>
    <pro-table ref="tableRef" :columns="columns" :scroll="{ x: 800 }" :data-source="tableData" :loading="loading"
               :pagination="pagination"
               @refresh="() => getTableData()"
               @search="(params)=> getTableData(params)">
      <template #toolLeft>
        <a-button type="primary" @click="listSelectRef.showModal()">添加清单</a-button>
      </template>
      <template #bodyCell=" { column,text,record }">
        <template v-if="column.dataIndex === 'actions'">
          <div>
            <a-space v-if="editableData[record.id]">
              <a-typography-link @click="save(record)">保存</a-typography-link>
              <a @click="cancel(record.id)">取消</a>
            </a-space>
            <a-space v-else>
              <a @click="edit(record)">编辑</a>
              <a class="text-red" @click="deleteLogDetail(record)">删除</a>
            </a-space>
          </div>
        </template>
      </template>
    </pro-table>
    <list-select ref="listSelectRef" :request="getLogExcludeApi" :init-params="{logId: route.query.logId as string}"
                 @submit="listSelectSubmit"></list-select>
    <FillLog ref="fillLogRef"></FillLog>
  </PageContainer>
</template>
<style scoped>

</style>