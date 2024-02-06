<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import ProTable from '@/components/pro-table/index.vue'
import {useRouter} from "vue-router";
import {useTable} from "@/composables/useTable.ts";
import {deleteDivisionApi, getDivisionTree, uploadDivisionApi} from "@/api/division";
import TooltipIcon from "@/components/tooltip-icon/index.vue";
import {ref, createVNode, onMounted} from "vue";
import {message, Modal} from "ant-design-vue";
import {ExclamationCircleOutlined} from "@ant-design/icons-vue";
import Upload from '@/components/upload/index.vue'

const router = useRouter()
const open = ref<boolean>(false)
const columns = ref<any[]>([
  {title: '分部分项名称', dataIndex: 'divisionName',},
  {title: '产值(元)', dataIndex: 'outputValue',},
  {title: '分部分项类型', dataIndex: 'divisionType', align: 'center'},
  {title: '创建人', dataIndex: 'createBy',},
  {title: '创建时间', dataIndex: 'createTime',},
  {title: '更新人', dataIndex: 'updateBy',},
  {title: '更新时间', dataIndex: 'updateTime',},
  {title: '操作', dataIndex: 'actions', align: 'center', fixed: 'right'},
])
const divisionTableRef = ref()
const {tableData, getTableData, loading} = useTable(getDivisionTree, {}, false)
const createDivision = () => {
  router.push('/resource/division/create')
}
const editDivision = (id: string) => {
  router.push({path: '/resource/division/update', query: {id}})
}
const addSub = (record: any) => {
  router.push({path: '/resource/division/create', query: {parentId: record.id}})
}
const addProjectlist = (record: any) => {
  router.push({path: '/resource/division/detail', query: {parentNames: record.parentNames, divisionId: record.id, divisionName: record.divisionName}})
}
const viewProjectList = (record: any) => {
  const query: any = {
    divisionId: record.id,
    divisionName: record.divisionName
  }
  if(!record.isTreeLeaf) {
    query.parentNames = record.parentNames
  }
  router.push({path: '/resource/division/detail', query: query})
}

const deleteDivision = (record: any) => {
  Modal.confirm({
    title: `是否删除【${record.divisionName}】`,
    icon: createVNode(ExclamationCircleOutlined),
    content: '删除后不可恢复！',
    onOk() {
      deleteDivisionApi(record.id, record.isTreeLeaf).then(res => {
        if (res.code === 200) {
          getTableData(divisionTableRef.value.onReload())
          message.success(res.message)
        }
      })
    },
    onCancel() {
      message.info('取消删除');
    },
  });
}
let expandedRowKeys= ref<string[]>([])
const getExpandedRowKeys = (list: any[]) => {
  list.forEach((item) => {
    if(item.children && item.children.length > 0 && JSON.parse(item.parentNames).length < 3 ){
      expandedRowKeys.value.push(item.id)
      getExpandedRowKeys(item.children)
    }
  })
}

onMounted(async () => {
  await getTableData()
  getExpandedRowKeys(tableData.value)
})

</script>
<template>
  <PageContainer>
    <ProTable :columns="columns" :defaultExpandedRowKeys="expandedRowKeys" ref="divisionTableRef" rowKey="id" :data-source="tableData"
               :loading="loading" @refresh="() => getTableData()" :pagination="false">
      <template #toolLeft>
        <a-space>
          <a-button type="primary" @click="createDivision">新增</a-button>
          <a-button @click="() => open = true">导入数据</a-button>
        </a-space>
      </template>
      <template #bodyCell=" { column,record }">
        <template v-if="column.dataIndex === 'actions'">
          <a-space :size="20">
            <TooltipIcon title="编辑">
              <EditOutlined class="text-blue" @click="editDivision(record.id)"/>
            </TooltipIcon>
            <TooltipIcon v-if="!record.isTreeLeaf" title="添加清单">
              <ControlOutlined class="text-green" @click="addProjectlist(record)"/>
            </TooltipIcon>
            <TooltipIcon title="添加下级">
              <PlusOutlined class="text-blue" @click="addSub(record)"/>
            </TooltipIcon>
            <TooltipIcon title="删除">
              <DeleteOutlined class="text-red" @click="deleteDivision(record)"/>
            </TooltipIcon>
          </a-space>
        </template>
        <template v-else-if="column.dataIndex === 'divisionName'">
          <a-typography-paragraph @click="viewProjectList(record)" :copyable="{ onCopy: onCopy, tooltip: false, }">
           <a>{{ record.divisionName }}</a>
          </a-typography-paragraph>
        </template>
      </template>
    </ProTable>
    <Upload v-model:open="open" width="70%" :is-multiple="false" :request="uploadDivisionApi"
            :upload-type="['xlsx']" service-name="DivisionImport"></Upload>

  </PageContainer>
</template>
<style scoped>
.ant-typography {
  margin-bottom: 0px;
}
</style>