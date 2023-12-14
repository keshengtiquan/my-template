<script setup lang="ts">
import {ref} from "vue";
import {getListApi} from "@/api/list";
import {useTable} from "@/composables/useTable.ts";

const targetKeys = ref<string[]>();
const leftColumns = ref<any[]>([
  {title: '序号', dataIndex: 'serialNumber', width: 30, align: 'center', sorter: true},
  {title: '项目编码', dataIndex: 'listCode', width: 50,},
  {title: '项目名称', dataIndex: 'listName', width: 50,},
  {title: '项目特征', dataIndex: 'listCharacteristic', width: 120, ellipsis: true}
]);
const rightColumns = ref<any[]>([
  {title: '序号', dataIndex: 'serialNumber', width: 50, align: 'center', sorter: true},
  {title: '项目编码', dataIndex: 'listCode', width: 100,},
  {title: '项目名称', dataIndex: 'listName', width: 120,},
  {title: '项目特征', dataIndex: 'listCharacteristic', width: 120, ellipsis: true}
]);
const {tableData,pagination} = useTable(getListApi)


</script>
<template>
  <a-transfer v-model:target-keys="targetKeys"  :data-source="tableData" :show-select-all="false">
    <template #children="{
          direction,
          filteredItems,
          selectedKeys,
          onItemSelectAll,
          onItemSelect,
        }">
      <a-table
          :columns="direction === 'left' ? leftColumns : rightColumns"
          :data-source="filteredItems"
          :pagination="pagination"
          size="small"
      />
    </template>
  </a-transfer>
</template>


<style scoped>

</style>