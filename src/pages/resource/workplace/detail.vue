<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import ProTable from '@/components/pro-table/index.vue'
import TransferDrawer from "@/pages/resource/workplace/component/TransferDrawer.vue";
import {useRoute} from "vue-router";
import {createVNode, reactive, ref, UnwrapRef} from "vue";
import {useTable} from "@/composables/useTable.ts";
import {
  deleteWorkPlaceRelevanceListApi,
  getWorkPlaceRelevanceListApi,
  updateWorkPlaceListQuantitiesApi, uploadRelevanceApi
} from "@/api/workplace";
import TooltipIcon from "@/components/tooltip-icon/index.vue";
import {message, Modal} from "ant-design-vue";
import {cloneDeep} from 'lodash-es';
import {ExclamationCircleOutlined} from "@ant-design/icons-vue";
import Upload from "@/components/upload/index.vue";
import { useAccess } from '@/composables/useAccess';

interface DataItem {
  id: string
  allQuantities: number
  leftQuantities: number
  rightQuantities: number
  unitPrice: number
  combinedPrice: number
  serialNumber: number
  listCode: string
  listName: string
  listCharacteristic: string
  unit: string
}

const route = useRoute()
const title = route.query.workPlaceName as string
const id = route.query.id as string
const workPlaceType = route.query.workPlaceType as string
const selectedRowKeys = ref<any[]>([])
const onSelectChange = (selectedRowKey: any[]) => {
  selectedRowKeys.value = selectedRowKey
}
const open = ref(false)
const removeField = ref<string[]>(['leftQuantities', 'rightQuantities'])
const columns = ref([
  {title: '序号', dataIndex: 'serialNumber', width: 50, align: 'center', sorter: true},
  {title: '项目编码', dataIndex: 'listCode', width: 110, search: true, valueType: 'input', align: 'center'},
  {title: '项目名称', dataIndex: 'listName', width: 120, search: true, valueType: 'input', align: 'center'},
  {title: '项目特征', dataIndex: 'listCharacteristic', width: 220, search: true, valueType: 'input', ellipsis: true},
  {title: '单位', dataIndex: 'unit', width: 50, align: 'center'},
  {title: '工程量', dataIndex: 'quantities', width: 120, align: 'center'},
  {title: '单价', dataIndex: 'unitPrice', width: 100, align: 'center'},
  {title: '合价', dataIndex: 'combinedPrice', width: 100, align: 'center'},
  {title: '操作', dataIndex: 'actions', width: 100, align: 'center', fixed: 'right'},
])
const {hasAccess} = useAccess()
const tableRef = ref()
const transferDrawerRef = ref()
const {tableData, getTableData, pagination, loading} = useTable<DataItem>(getWorkPlaceRelevanceListApi, {id: id})
const editableData: UnwrapRef<Record<string, DataItem>> = reactive({});

/**
 * 编辑
 * @param id
 */
const edit = (id: string) => {
  editableData[id] = cloneDeep(tableData.value.filter(item => id === item.id)[0])
};
/**
 * 保存
 * @param id
 */
const save = async (id: string) => {
  Object.assign(tableData.value.filter(item => id === item.id)[0], editableData[id]);
  const params = {
    id,
    allQuantities: editableData[id].allQuantities,
    leftQuantities: editableData[id].leftQuantities,
    rightQuantities: editableData[id].rightQuantities,
  }
  const res = await updateWorkPlaceListQuantitiesApi(params)
  if (res.code === 200) {
    message.success(res.message)
    await getTableData(tableRef.value.onReload())
    delete editableData[id];
  }
};
/**
 * 取消
 * @param id
 */
const cancel = (id: string) => {
  delete editableData[id];
  message.info('取消编辑')
};
/**
 * 数量改变
 * @param e
 * @param id
 * @param direction
 */
const quantityChange = (e: number, id: string, direction: string) => {
  if(direction=== 'left'){
    editableData[id].allQuantities = e + editableData[id].rightQuantities
  }else {
    editableData[id].allQuantities = e + editableData[id].leftQuantities
  }
}
/**
 * 单个删除
 * @param record
 */
const deleteList = (record: any) => {
  Modal.confirm({
    title: `是否删除【${record.listName}】`,
    icon: createVNode(ExclamationCircleOutlined),
    content: '删除后不可恢复！',
    onOk() {
      deleteWorkPlaceRelevanceListApi({ids: [record.id]}).then(res => {
        if (res.code === 200) {
          getTableData(tableRef.value.onReload())
          message.success(res.message)
        }
      })
    },
    onCancel() {
      console.log('Cancel');
    },
  });
}
/**
 * 批量删除
 */
const batchDelete = () => {
  Modal.confirm({
    title: `是否删除所选的${selectedRowKeys.value.length}项`,
    icon: createVNode(ExclamationCircleOutlined),
    content: '删除后不可恢复！',
    onOk() {
      deleteWorkPlaceRelevanceListApi({ids: selectedRowKeys.value}).then(res => {
        if (res.code === 200) {
          getTableData(tableRef.value.onReload())
          message.success(res.message)
        }
      })
    },
    onCancel() {
      console.log('Cancel');
    },
  });
}
if (workPlaceType === '区间') {
  columns.value.splice(6, 0 ,{title: '左线工程量', dataIndex: 'leftQuantities', width: 90, align: 'center'} )
  columns.value.splice(7, 0 ,{title: '右线工程量', dataIndex: 'rightQuantities', width: 90, align: 'center'} )
  removeField.value = []
}
</script>
<template>
  <PageContainer :title="`${title}清单`">
    <pro-table :columns="columns" ref="tableRef" :scroll="{x: 1500}" :data-source="tableData" @refresh="() => getTableData()"
               @search="(params) => getTableData(params)" :loading="loading" :pagination="pagination"
               :row-selection="{ selectedRowKeys: selectedRowKeys, preserveSelectedRowKeys: true, onChange: onSelectChange  }"
               rowKey="id" >
      <template #toolLeft>
        <a-space>
          <a-button v-if="hasAccess(['sys:workplaceList:add'])" type="primary" @click="transferDrawerRef.openDrawer(id)">添加清单</a-button>
          <a-button v-if="hasAccess(['sys:workplaceList:batchDelete'])" type="primary" :disabled="!(selectedRowKeys.length > 0)" danger @click="batchDelete">批量删除</a-button>
          <a-button v-if="hasAccess(['sys:workplaceList:upload'])" @click="() => open = true">导入数据</a-button>
        </a-space>
      </template>
      <template #headerCell="{ column }">
        <template v-if="column.dataIndex === 'quantities'">
        <span>
          工程量(可编辑)
        </span>
        </template>
      </template>
      <template #bodyCell="{ column,record }">
        <template v-if="column.dataIndex === 'actions'">
          <a-space :size="20">
            <TooltioIcon v-if="hasAccess(['sys:workplaceList:delete'])" title="删除">
              <DeleteOutlined class="text-red" @click="deleteList(record)"/>
            </TooltioIcon>
          </a-space>
        </template>
        <template v-else-if="['quantities'].includes(column.dataIndex)">
          <div class="h-30px">
            <div v-if="editableData[record.id]" class="flex h-30px">
              <a-input-number class="animate__animated animate__fadeInUp animate__faster w-full" :min="0"
                              v-model:value="editableData[record.id].allQuantities"
                              @pressEnter="save(record.id)"/>
              <TooltipIcon title="提交">
                <check-outlined class="m-x-4px" @click="save(record.id)"/>
              </TooltipIcon>
              <TooltipIcon title="取消">
                <CloseOutlined class="m-x-2px" @click="cancel(record.id)"/>
              </TooltipIcon>
            </div>
            <div class="h-30px leading-30px" v-else>
              <span>{{ record.allQuantities || '0' }}</span>
              <edit-outlined v-if="hasAccess(['sys:workplaceList:edit'])" class="text-blue mx-10px" @click="edit(record.id)"/>
            </div>
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'leftQuantities'">
          <div class="h-30px">
            <div v-if="editableData[record.id]" class="flex h-30px">
              <a-input-number class="animate__animated animate__fadeInUp animate__faster w-full" :min="0"
                              v-model:value="editableData[record.id].leftQuantities" @change="quantityChange($event,record.id, 'left')"
                              @pressEnter="save(record.id)"/>
            </div>
            <div class="h-30px leading-30px" v-else>
              <span>{{ record.leftQuantities || '0' }}</span>
            </div>
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'rightQuantities'">
          <div class="h-30px">
            <div v-if="editableData[record.id]" class="flex h-30px">
              <a-input-number class="animate__animated animate__fadeInUp animate__faster w-full" :min="0"
                              v-model:value="editableData[record.id].rightQuantities"
                              @pressEnter="save(record.id)" @change="quantityChange($event,record.id, 'right')" />
            </div>
            <div class="h-30px leading-30px" v-else>
              <span>{{ record.rightQuantities || '0' }}</span>
            </div>
          </div>
        </template>
      </template>
    </pro-table>
    <TransferDrawer ref="transferDrawerRef" @submit="() => getTableData(tableRef.onReload())"></TransferDrawer>
    <Upload  v-model:open="open" width="70%" :is-multiple="false" service-name="WorkPlaceListRelevanceService" :request="uploadRelevanceApi"
             :upload-type="['xlsx']" :removeField="removeField"></Upload>
  </PageContainer>
</template>


<style lang="scss" scoped>

</style>