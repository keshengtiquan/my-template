<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import ProTable from '@/components/pro-table/index.vue'
import SetupModal from "@/pages/resource/sectionDivision/component/setupMoadl.vue";
import {createVNode, onMounted, ref} from "vue";
import {useTable} from "@/composables/useTable.ts";
import {
  deleteSectionDivisionByIdAPi,
  getSectionDivisionByIdAPi,
  getSectionDivisionWorkPlaceName
} from "@/api/sectionDivision";
import {useRoute} from "vue-router";
import TooltipIcon from "@/components/tooltip-icon/index.vue";
import {message, Modal} from "ant-design-vue";
import {ExclamationCircleOutlined} from "@ant-design/icons-vue";

const columns = [
  {title: '序号', dataIndex: 'serialNumber', width: 50, align: 'center'},
  {title: '项目编码', dataIndex: 'listCode', width: 100},
  {title: '项目名称', dataIndex: 'listName', width: 120},
  {title: '项目特征', dataIndex: 'listCharacteristic', width: 120, ellipsis: true},
  {title: '单位', dataIndex: 'unit', width: 50, align: 'center'},
  {title: '工程量', dataIndex: 'totalQuantities', width: 80, align: 'center'},
  {title: '单价', dataIndex: 'unitPrice', width: 100, align: 'center'},
  {title: '合价', dataIndex: 'totalPrice', width: 100},
  {title: '操作', dataIndex: 'actions', width: 100, align: 'center', fixed: 'right'},
]
const setupModalRef = ref()
const sectionDivisionTableRef = ref()
const route = useRoute()
const workPlaceName = ref<any[]>([])
const {tableData, getTableData, loading, pagination} = useTable(getSectionDivisionByIdAPi, {id: route.query.id as string})
const deleteList = (record: any) => {
  Modal.confirm({
    title: `是否删除【${record.listName}】`,
    icon: createVNode(ExclamationCircleOutlined),
    content: '删除后不可恢复！',
    onOk() {
      deleteSectionDivisionByIdAPi({id: route.query.id, listId: record.id}).then(res => {
        if (res.code === 200) {
          getTableData(sectionDivisionTableRef.value.onReload())
          message.success(res.message)
        }
      })
    },
    onCancel() {
      console.log('Cancel');
    },
  });
}
const showSetupModal = () => {
  setupModalRef.value.showModal()
}
const getWorkPlaceNames = async () => {
  const {data} = await getSectionDivisionWorkPlaceName({id: route.query.id as string})
  workPlaceName.value = data
}
const onSubmit = async () => {
  await getTableData(sectionDivisionTableRef.value.onReload())
  await getWorkPlaceNames()
}
onMounted(async () => {
  await getWorkPlaceNames()
})
</script>
<template>
  <PageContainer>
    <a-card class="mb-4">
      <span>已分配的工点：</span>
            <a-tag
                v-for="item in workPlaceName as any[]"
                :key="item"
                color="processing"
            >
              {{ item.workplace_name }}
            </a-tag>
    </a-card>
    <pro-table :columns="columns" ref="sectionDivisionTableRef" @refresh="() => getTableData()" :loading="loading"
               :pagination="pagination"
               @search="(params) => getTableData(params)" :data-source="tableData">
      <template #toolLeft>
        <a-button type="primary" @click="showSetupModal">新增</a-button>
      </template>
      <template #bodyCell="{ column,record }">
        <template v-if="column.dataIndex === 'actions'">
          <a-space :size="20">
            <TooltipIcon title="删除">
              <DeleteOutlined class="text-red" @click="deleteList(record)"/>
            </TooltipIcon>
          </a-space>
        </template>
      </template>
    </pro-table>
    <SetupModal ref="setupModalRef" @submit="onSubmit"></SetupModal>
  </PageContainer>
</template>
<style scoped>

</style>