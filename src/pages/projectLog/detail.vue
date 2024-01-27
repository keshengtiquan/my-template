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
import Tooltip from '@/components/tooltip-icon/index.vue'
import ListSelect from '@/components/list-select/index.vue'
import {getLogExcludeApi} from "@/api/list";
import {ExclamationCircleOutlined} from "@ant-design/icons-vue";

const route = useRoute()
const tableRef = ref()
const listSelectRef = ref()
const columns = ref<any[]>([
  {title: '序号', dataIndex: 'serialNumber', width: 80, align: 'center', sorter: true},
  {title: '项目编码', dataIndex: 'listCode', width: 150,},
  {title: '项目名称', dataIndex: 'listName', width: 150,},
  {title: '项目特征', dataIndex: 'listCharacteristic', width: 300, ellipsis: true},
  {title: '单位', dataIndex: 'unit', width: 80, align: 'center'},
  {title: '工点', dataIndex: 'workPlaceName', align: 'center'},
  {title: '完成量', dataIndex: 'quantity', width: 200, align: 'center'},
  {title: '工区', dataIndex: 'workAreaName', width: 150, align: 'center'},
  {title: '创建人', dataIndex: 'createBy', width: 100},
  {title: '创建时间', dataIndex: 'createTime', width: 150},
  {title: '更新人', dataIndex: 'updateBy', width: 100},
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
  editableData[record.id] = cloneDeep(tableData.value.filter(item => record.id === item.id)[0])
  if (editableData[record.id].leftQuantities > 0 && editableData[record.id].rightQuantities > 0) {
    editableData[record.id].quantity = editableData[record.id].leftQuantities
  }
  const {data} = await getWorkPlaceByListIdApi({listId: record.listId})
  editableOption[record.id] = data
};
/**
 * 取消编辑
 * @param id
 */
const cancel = (id: string) => {
  delete editableData[id];
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

const cascaderChange = (value: string[], id: string) => {
  editableData[id].quantity = editableData[id][value[1]]
}

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
      deleteLogApi({id: record.id}).then(res => {
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
    <pro-table ref="tableRef" :columns="columns" :scroll="{ x: 2100 }" :data-source="tableData" :loading="loading"
               :pagination="pagination"
               @refresh="() => getTableData()"
               @search="(params)=> getTableData(params)">
      <template #toolLeft>
        <a-button type="primary" @click="listSelectRef.showModal()">添加清单</a-button>
      </template>
      <template #bodyCell=" { column,text,record }">
        <template v-if="column.dataIndex === 'quantity'">
          <div class="h-30px">
            <div v-if="editableData[record.id]" class="flex h-30px ">
              <a-input-number class="animate__animated animate__fadeInUp animate__faster w-full"
                              style="line-height: 30px" :min="0" placeholder="请填写完成量"
                              v-model:value="editableData[record.id].quantity"
                              @pressEnter="save(record)"/>
            </div>
            <div class="h-30px leading-30px" v-else>
              <Tooltip color="blue"
                       v-if="record.workPlaceType ==='section' && record.rightQuantities > 0 && record.leftQuantities > 0"
                       :title="`左线:${record.leftQuantities}, 右线:${record.rightQuantities}`">
                <a-typography-link>{{ text }}</a-typography-link>
              </Tooltip>
              <span v-else>
                {{ text }}
              </span>
            </div>
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'workPlaceName'">
          <div class="h-30px">
            <div v-if="editableData[record.id]" class="flex h-30px ">
              <a-cascader class="animate__animated animate__fadeInUp animate__faster w-full"
                          @change="(value: string[]) => cascaderChange(value,record.id)"
                          v-model:value="editableData[record.id].workPlace" :options="editableOption[record.id]"
                          placeholder="请选择工点"/>
            </div>
            <div class="h-30px leading-30px" v-else>
              {{ text }}
            </div>
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'actions'">
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
  </PageContainer>
</template>
<style scoped>

</style>