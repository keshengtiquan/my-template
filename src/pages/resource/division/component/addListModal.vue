<script setup lang="ts">
import {ref} from 'vue';
import ProTable from "@/components/pro-table/index.vue";
import {useTable} from "@/composables/useTable.ts";
import {getlistDivisionExcludeApi} from "@/api/list";
import {useRoute} from "vue-router";
import {divisionAddListApi} from "@/api/division";
import {message} from "ant-design-vue";

const route = useRoute()
const emits = defineEmits(['submit'])
const columns = [
  {title: '序号', dataIndex: 'serialNumber', width: 50, align: 'center'},
  {title: '项目编码', dataIndex: 'listCode', width: 100, search: true, valueType: 'input', align: 'center'},
  {title: '项目名称', dataIndex: 'listName', width: 120, search: true, valueType: 'input', align: 'center'},
  {title: '项目特征', dataIndex: 'listCharacteristic', width: 120, resizable: true, search: true, valueType: 'input', ellipsis: true},
  {title: '单位', dataIndex: 'unit', width: 50, align: 'center'},
  {title: '工程量', dataIndex: 'quantities', width: 80, align: 'center'},
]
const open = ref<boolean>(false);
const {tableData, loading, getTableData, pagination} = useTable(getlistDivisionExcludeApi)
const selectedRowKeys = ref<any[]>([])
const onSelectChange = (selectedRowKey: any[]) => {
  selectedRowKeys.value = selectedRowKey
}
const showModal = async () => {
  await getTableData()
  open.value = true;
};
const handleOk = async () => {
  const parentNames = JSON.parse(route.query.parentNames as string)
  const divisionId = route.query.divisionId as string
  const res = await divisionAddListApi({divisionId: divisionId, listIds: selectedRowKeys.value, parentNames: parentNames})
  if (res.code === 200) {
    selectedRowKeys.value = []
    message.success(res.message)
    emits('submit')
    open.value = false;
  }
};

defineExpose({open, showModal})
</script>
<template>
  <a-modal v-model:open="open" destroyOnClose width="70%" title="添加清单" @ok="handleOk">
    <pro-table :data-source="tableData" ref="listTableRef" :scroll="{y: 400}" :loading="loading"
               :pagination="pagination" hide-tool table-size="small"
               :row-selection="{ selectedRowKeys: selectedRowKeys, preserveSelectedRowKeys: true, onChange: onSelectChange  }"
               @refresh="() => getTableData()" rowKey="id"
               :custom-row="(record: any) => ({onClick:() => {
                 if(selectedRowKeys.includes(record.id)){
                  const index = selectedRowKeys.indexOf(record.id)
                   selectedRowKeys.splice(index,1)
                  }else {
                    selectedRowKeys.push(record.id)
                  }
               }})"
               @search="(params) => getTableData(params)" :columns="columns" title="清单列表">
    </pro-table>
  </a-modal>
</template>
<style scoped>

</style>