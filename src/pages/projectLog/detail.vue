<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import { useTable } from "@/composables/useTable.ts";
import { addListApi, deleteById, deleteLogApi, getLogListApi, getProjectLogDetailApi } from "@/api/projectLog";
import { useRoute } from "vue-router";
import ProTable from '@/components/pro-table/index.vue'
import { createVNode, onMounted, ref } from "vue";
import { message, Modal } from "ant-design-vue";
import ListSelect from '@/components/list-select/index.vue'
import { getLogExcludeApi } from "@/api/list";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import FillLog from './component/fillLog.vue'
import { deleteUniqueFromArray } from '@/utils';

const route = useRoute()
const tableRef = ref()
const listSelectRef = ref()
const fillLogRef = ref()
const listData = ref()
const cell = ref()
const hovered = ref(false)
const columns = ref<any[]>([
  { title: '序号', dataIndex: 'serialNumber', width: 80, align: 'center', sorter: true },
  { title: '项目编码', dataIndex: 'listCode', width: 150, },
  { title: '项目名称', dataIndex: 'listName', width: 200, },
  { title: '项目特征', dataIndex: 'listCharacteristic', width: 250, ellipsis: true },
  { title: '单位', dataIndex: 'unit', width: 80, align: 'center' },
  { title: '完成量', dataIndex: 'completionQuantity', width: 100, align: 'center' },
  { title: '创建时间', dataIndex: 'createTime', width: 250 },
  { title: '更新时间', dataIndex: 'updateTime', width: 250 },
  { title: '操作', dataIndex: 'actions', width: 100, align: 'center', fixed: 'right' },
])
const { tableData, getTableData, loading, pagination } = useTable(getProjectLogDetailApi, {
  logId: route.query.logId,
  workAreaId: route.query.workAreaId,
  fillDate: route.query.fillDate
})
/**
 * 编辑
 * @param id
 */
const edit = async (record: any) => {
  fillLogRef.value.showModal(record)
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
      deleteLogApi({ logId: record.logId, listId: record.listId }).then(res => {
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
const popoverChange = async (visible: boolean, listId: string) => {
  if (visible) {
    const { data } = await getLogListApi({ listId, logId: route.query.logId as string })
    // console.table(data);
    listData.value = data
    hovered.value = true
  }
}
const deleteFillList = async(id: string) => {
  const data = await deleteById({id})
  if(data.code === 200){
    message.success(data.message)
    getTableData(tableRef.value.onReload())
    deleteUniqueFromArray(listData.value, 'id', id)
  }
  
}

onMounted(() => {
  cell.value = document.querySelector('.ant-table-tbody')
})


</script>
<template>
  <PageContainer>
    <pro-table ref="tableRef" :columns="columns" :scroll="{ x: 1200 }" :data-source="tableData" :loading="loading"
      :pagination="pagination" @refresh="() => getTableData()" @search="(params) => getTableData(params)">
      <template #toolLeft>
        <a-button type="primary" @click="listSelectRef.showModal()">添加清单</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'actions'">
          <a-space>
            <a @click="edit(record)">添加</a>
            <a class="text-red" @click="deleteLogDetail(record)">删除</a>
          </a-space>
        </template>
        <template v-else-if="column.dataIndex === 'completionQuantity'">
          <a-popover v-if="record.completionQuantity > 0" :title="record.listName" :getPopupContainer="() => cell"  trigger="click" placement="bottom"
            @openChange="(visible: boolean) => popoverChange(visible,record.listId)">
            <template #content>
              <a-list  size="small" bordered :data-source="listData" style="overflow-y: auto;max-height: 312px;">
                <template #renderItem="{ item }">
                  <a-list-item font-size-12px>
                    {{ `${item.workplaceName}完成 ${item.completionQuantity} ${record.unit}。${item.rightQuantities || item.leftQuantities ? '其中' : ''} ${item.leftQuantities ?
                      '左线' + item.leftQuantities + record.unit : ''}${item.rightQuantities ? '，右线' + item.rightQuantities +
                        record.unit : ''}` }}
                    <template #actions>
                      <span font-size-12px>{{ item.deptName}}</span>
                      <a font-size-12px @click="deleteFillList(item.id)">删除</a>
                    </template>
                  </a-list-item>
                </template>
              </a-list>
            </template>
            <span class="text-blue-500 cursor-pointer">{{ record.completionQuantity }}</span>
          </a-popover>
          <span v-else >{{ record.completionQuantity }}</span>
        </template>
      </template>
    </pro-table>
    <list-select ref="listSelectRef" :request="getLogExcludeApi" :init-params="{ logId: route.query.logId as string }"
      @submit="listSelectSubmit"></list-select>
    <FillLog ref="fillLogRef" @submit="() => getTableData(tableRef.onReload())"></FillLog>
  </PageContainer>
</template>
<style scoped></style>