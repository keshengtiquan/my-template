<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import ProTable from '@/components/pro-table/index.vue'
import Upload from '@/components/upload/index.vue'
import {createVNode, watch, ref} from "vue";
import {batchDeleteApi, deleteListApi, exportListApi, getListApi, setFocusApi, uploadListApi} from "@/api/list";
import {useTable} from "@/composables/useTable.ts";
import TooltipIcon from "@/components/tooltip-icon/index.vue";
import {useRouter} from "vue-router";
import {message, Modal} from "ant-design-vue";
import {ExclamationCircleOutlined} from "@ant-design/icons-vue";
import {getSectionalApi} from "@/api/division";
import ExportButton from '@/components/exportButton/index.vue'
import { useAccess } from '@/composables/useAccess'; 

const columns = [
  {title: '序号', dataIndex: 'serialNumber', width: 50, align: 'center'},
  {title: '项目编码', dataIndex: 'listCode', width: 100, search: true, valueType: 'input', align: 'center'},
  {title: '项目名称', dataIndex: 'listName', width: 120, search: true, valueType: 'input', align: 'center'},
  {title: '项目特征', dataIndex: 'listCharacteristic', width: 120,resizable: true, search: true, valueType: 'input', ellipsis: true},
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
const listTableRef = ref()
const segmentData = ref<any[]>([])
const activeKey = ref('');
const {hasAccess} = useAccess()

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
const selectedRowKeys = ref<any[]>([])
const onSelectChange = (selectedRowKey: any[]) => {
  selectedRowKeys.value = selectedRowKey
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

const focusList = async (record: any) => {
  const res = await setFocusApi({id: record.id, isFocusList: !record.isFocusList})
  if (res.code === 200) {
    await getTableData(listTableRef.value.onReload())
    message.success(res.message)
  }
}
const batchDelete = async () => {
  Modal.confirm({
    title: `是否删除所选的${selectedRowKeys.value.length}项`,
    icon: createVNode(ExclamationCircleOutlined),
    content: '删除后不可恢复！',
    onOk() {
      batchDeleteApi({ids: selectedRowKeys.value}).then(res => {
        if (res.code === 200) {
          getTableData(listTableRef.value.onReload())
          message.success(res.message)
          selectedRowKeys.value = []
        }
      })
    },
    onCancel() {
      message.info('取消删除')
    },
  });
}

getSectionalApi({divisionType: '分部工程'}).then(res => {
  if(res.code === 200){
    segmentData.value = res.data
  }
})
const {tableData, loading, getTableData, pagination} = useTable(getListApi, {sectionalEntry: activeKey.value})

watch(activeKey, () => {
  getTableData({sectionalEntry: activeKey.value})
})

</script>
<script lang='ts'>
export default {
  name: "ListIndex"
}
</script>
<template>
  <PageContainer >
    <template #content>
      <a-tabs v-if="segmentData.length > 1" v-model:activeKey="activeKey">
        <a-tab-pane key="" tab="全部"></a-tab-pane>
        <a-tab-pane v-for="item in segmentData" :key="item.id" :tab="item.divisionName"></a-tab-pane>
      </a-tabs>
    </template>
    <pro-table :data-source="tableData" ref="listTableRef" :loading="loading" :scroll="{ x: 2000 }"
               :pagination="pagination" rowKey="id"
               :row-selection="{ selectedRowKeys: selectedRowKeys, preserveSelectedRowKeys: true, onChange: onSelectChange  }"
               @refresh="() => getTableData({sectionalEntry: activeKey})"
               @search="(params) => getTableData({...params, ...{sectionalEntry: activeKey}})" :columns="columns">
      <template #toolLeft>
        <a-space>
          <a-button v-if="hasAccess(['sys:list:add'])" type="primary" @click="createList">新建清单</a-button>
          <a-button v-if="hasAccess(['sys:list:batchDelete'])" type="primary" :disabled="!(selectedRowKeys.length > 0)" danger @click="batchDelete">批量删除</a-button>
          <a-button v-if="hasAccess(['sys:list:upload'])" @click="() => open = true">导入数据</a-button>
          <ExportButton v-if="hasAccess(['sys:list:export'])" :request="exportListApi" :init-params="{'sectionalEntry': activeKey}" file-name="项目清单"></ExportButton>
        </a-space>
      </template>
      <template #bodyCell=" { column,record }">
        <template v-if="column.dataIndex === 'actions'">
          <a-space :size="20">
            <TooltipIcon v-if="hasAccess(['sys:list:edit'])" title="编辑">
              <EditOutlined class="text-blue" @click="editList(record.id)"/>
            </TooltipIcon>
            <TooltipIcon v-if="hasAccess(['sys:list:focus'])" :title="`${record.isFocusList ?  '取消关注' : '关注清单'}`">
              <AimOutlined class="text-blue" @click="focusList(record)"/>
            </TooltipIcon>
            <TooltipIcon v-if="hasAccess(['sys:list:delete'])" title="删除">
              <DeleteOutlined class="text-red" @click="deleteList(record)"/>
            </TooltipIcon>
          </a-space>
        </template>
        <template v-else-if="column.dataIndex === 'listName'">
          <StarFilled v-if="record.isFocusList" style="color: #d7ee19; margin-right: 5px"/>{{record.listName}}
        </template>
      </template>
    </pro-table>
    <Upload v-model:open="open" width="70%" :is-multiple="true" :request="uploadListApi"
            :upload-type="['xlsx']" service-name="projectListImport"></Upload>
  </PageContainer>
</template>


<style scoped>

</style>
