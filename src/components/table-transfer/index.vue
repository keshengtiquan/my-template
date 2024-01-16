<template>
  <div>
    <a-transfer v-model:target-keys="targetKeys" :data-source="tableData" :show-select-all="false"
                :rowKey="(record: any) => record.id" @change="onChange">
      <template #children="{direction,filteredItems,selectedKeys,onItemSelectAll,onItemSelect}">
        <a-table :scroll="{y: 400}" :row-selection="getRowSelection({selectedKeys,onItemSelectAll,onItemSelect,})"
                 :pagination="pagination" row-key="id" :columns="direction === 'left' ? leftColumns : rightColumns"
                 :data-source="filteredItems" size="small" @change="paginationChange"
                 :custom-row="(record: any) => ({onClick: () => {onItemSelect(record.id, !selectedKeys.includes(record.id))},
            })
          "/>
      </template>
    </a-transfer>
  </div>
</template>
<script lang="ts" setup>
import {ref} from 'vue';
import {getExcludeListApi} from "@/api/list";
import {Pagination, useTable} from "@/composables/useTable.ts";

const emits = defineEmits(['onTransferChange'])
const props = defineProps<{
  workPlaceId: string
}>()

const {tableData, pagination, getTableData} = useTable(getExcludeListApi, {workPlaceId: props.workPlaceId})
const leftTableColumns = [
  {title: '序号', dataIndex: 'serialNumber', width: 15, align: 'center'},
  {title: '项目名称', dataIndex: 'listName', width: 80,},
  {title: '项目特征', dataIndex: 'listCharacteristic', width: 120, ellipsis: true}
];
const rightTableColumns = [
  {title: '序号', dataIndex: 'serialNumber', width: 50, align: 'center'},
  {title: '项目名称', dataIndex: 'listName', width: 120,},
  {title: '项目特征', dataIndex: 'listCharacteristic', width: 120, ellipsis: true}
];

const targetKeys = ref<string[]>([]);
const leftColumns = ref<any[]>(leftTableColumns);
const rightColumns = ref<any[]>(rightTableColumns);

const onChange = (nextTargetKeys: string[]) => {
  emits('onTransferChange', nextTargetKeys)
};
const paginationChange = (pagination: Pagination) => {
  getTableData({current: pagination.current, pageSize: pagination.pageSize})
}

const getRowSelection = ({selectedKeys, onItemSelectAll, onItemSelect,}: Record<string, any>) => {
  return {
    onSelectAll(selected: boolean, selectedRows: Record<string, string | boolean>[]) {
      const treeSelectedKeys = selectedRows.filter(item => !item.disabled).map(({key}) => key);
      onItemSelectAll(treeSelectedKeys, selected);
    },
    onSelect({key}: Record<string, string>, selected: boolean) {
      onItemSelect(key, selected);
    },
    selectedRowKeys: selectedKeys,
    columnWidth: 10,
  };
};
</script>

