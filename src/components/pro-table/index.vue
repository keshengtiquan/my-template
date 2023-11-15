<script setup lang="ts">
import type {TableColumnType} from "ant-design-vue";
import Setting from './component/setting.vue'
import {ref} from "vue";

const props = defineProps<{
  columns: TableColumnType[],
  dataSource: any[],
}>()
const tableColumns = ref<any[]>([])
const settingChangeHandle = (setting: any[]) => {
  let tem: TableColumnType[] = []
  setting.forEach(item => {
    const column = props.columns.find(column => column.dataIndex === item.dataIndex)
    if(column)
      tem.push(column)
  })
  tableColumns.value = tem
}
</script>

<template>
  <div class="bg-[var(--bg-page-container)] rd-8px px-24px">
    <div class="flex justify-between bg-[var(--bg-page-container)] py-16px rd-t-8px">
      <div class="h-32px flex items-center">
        <slot name="toolLeft"></slot>
      </div>
      <div class="h-32px flex items-center">
        <slot name="toolRight"></slot>
        <a-tooltip placement="top" class="w-32px text-center font-size-4 inline-block">
          <template #title>
            <span>刷新</span>
          </template>
          <ReloadOutlined />
        </a-tooltip>
        <a-tooltip placement="top" class="w-32px text-center font-size-4 inline-block">
          <template #title>
            <span>密度</span>
          </template>
          <ColumnHeightOutlined />

        </a-tooltip>
        <a-tooltip placement="top" class="w-32px text-center font-size-4 inline-block relative hover:cursor-pointer">
          <template #title>
            <span>列设置</span>
          </template>
          <Setting :init-columns="columns" @change="settingChangeHandle"></Setting>
        </a-tooltip>
      </div>
    </div>
    <a-table v-bind="$attrs" :columns="tableColumns" :dataSource="dataSource">
      <template v-for="(item, key, index) in $slots" :key="index" v-slot:[key]="item">
        <slot :name="key" v-bind="item"></slot>
      </template>
    </a-table>

  </div>
</template>
<style scoped>

</style>