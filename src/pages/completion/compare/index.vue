<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import ProTable from '@/components/pro-table/index.vue'
import { getSectionalApi } from "@/api/division";
import {reactive, ref, UnwrapRef, watch} from 'vue';
import { useTable } from '@/composables/useTable';
import {getListCompareApi, updateListCompareApi} from '@/api/list';
import TooltipIcon from "@/components/tooltip-icon/index.vue";
import {cloneDeep} from "lodash-es";
import {message} from "ant-design-vue";
import {useAccess} from '@/composables/useAccess'
const columns = [
  { title: '序号', dataIndex: 'serialNumber', width: 80,resizable: true, align: 'center' },
  { title: '项目编码', dataIndex: 'listCode', width: 150,resizable: true,search: true, valueType: 'input', },
  { title: '项目名称', dataIndex: 'listName', width: 200,resizable: true, search: true, valueType: 'input', align: 'center' },
  { title: '项目特征', dataIndex: 'listCharacteristic', width: 220, resizable: true, search: true, valueType: 'input', ellipsis: true },
  { title: '单位', dataIndex: 'unit', width: 80,resizable: true, align: 'center' },
  { title: '清单量', dataIndex: 'quantities', align: 'center' },
  { title: '图纸量', dataIndex: 'designQuantities', align: 'center' },
  { title: '完成量', dataIndex: 'completionQuantities',  align: 'center' },
]
interface DataItem {
  id: string
  serialNumber: number
  listCode: string
  listName: string
  listCharacteristic: string
  unit: string
  quantities: number
  designQuantities: number
  completionQuantities: string
}
const segmentData = ref<any[]>([])
const activeKey = ref('');
const tableRef = ref()
const {hasAccess} = useAccess()
getSectionalApi({ divisionType: '分部工程' }).then(res => {
  if (res.code === 200) {
    segmentData.value = res.data
  }
})
const { tableData, loading, pagination, getTableData } = useTable(getListCompareApi, { sectionalEntry: activeKey.value })
const editableData: UnwrapRef<Record<string, DataItem>> = reactive({});
/**
 * 编辑
 * @param id
 */
const edit = (id: string) => {
  const cloneData = cloneDeep(tableData.value.filter(item => id === item.id)[0])
  if(cloneData.designQuantities === 0){
    cloneData.designQuantities = cloneData.quantities
  }
  editableData[id] = cloneData
};
/**
 * 保存
 * @param id
 */
const save = async (id: string) => {
  Object.assign(tableData.value.filter(item => id === item.id)[0], editableData[id]);
  const params = {
    id,
    designQuantities: editableData[id].designQuantities,
  }
  const res = await updateListCompareApi(params)
  if (res.code === 200) {
    message.success(res.message)
    console.log(tableRef.value.onReload())
    await getTableData(Object.assign(tableRef.value.onReload(),{sectionalEntry: activeKey.value}))
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
watch(activeKey, () => {
  getTableData({sectionalEntry: activeKey.value})
})
</script>
<template>
  <PageContainer>
    <template #content>
      <a-tabs v-if="segmentData.length > 1" v-model:activeKey="activeKey">
        <a-tab-pane key="" tab="全部"></a-tab-pane>
        <a-tab-pane v-for="item in segmentData" :key="item.id" :tab="item.divisionName"></a-tab-pane>
      </a-tabs>
    </template>
    <pro-table ref="tableRef" :columns="columns" :loading="loading" :pagination="pagination" :dataSource="tableData"
      @refresh="() => getTableData({ sectionalEntry: activeKey })"
      @search="(params) => getTableData({ ...params, ...{ sectionalEntry: activeKey } })">
      <template #bodyCell="{ column,record }">
        <template v-if="column.dataIndex === 'designQuantities'">
          <div class="h-30px">
            <div v-if="editableData[record.id]" class="flex h-30px">
              <a-input-number class="animate__animated animate__fadeInUp animate__faster w-full" :min="0"
                              v-model:value="editableData[record.id].designQuantities"
                              @pressEnter="save(record.id)"/>
              <TooltipIcon title="提交">
                <check-outlined class="m-x-4px" @click="save(record.id)"/>
              </TooltipIcon>
              <TooltipIcon title="取消">
                <CloseOutlined class="m-x-2px" @click="cancel(record.id)"/>
              </TooltipIcon>
            </div>
            <div class="h-30px leading-30px" v-else>
              <span>{{ record.designQuantities || '0' }}</span>
              <edit-outlined v-if="hasAccess(['sys:compare:edit'])" class="text-blue mx-10px" @click="edit(record.id)"/>
            </div>
          </div>
        </template>
      </template>
    </pro-table>
  </PageContainer>
</template>
<style scoped></style>