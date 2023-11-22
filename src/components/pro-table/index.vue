<script setup lang="ts">
import type {TableColumnType} from "ant-design-vue";
import Setting from './component/setting.vue'
import {reactive, ref} from "vue";
import * as _ from 'lodash'

const props = defineProps<{
  columns: any[],
  dataSource?: any[],
}>()
const emits = defineEmits(['search', 'refresh', 'reload'])
const tableColumns = ref<any[]>([])
const expand = ref(false);
const formState = reactive<Record<any, any>>({});
const formRef = ref();
const searchArray = ref<any[]>([])
const tableSize = ref('large')

searchArray.value = props.columns.filter(item => item.search)

const settingChangeHandle = (setting: any[]) => {
  let tem: TableColumnType[] = []
  setting.forEach(item => {
    const column = _.cloneDeep(props.columns.find(column => column.dataIndex === item.dataIndex))
    if (column && item.fixed) {
      column['fixed'] = item.fixed
    }
    if (column)
      tem.push(column)
  })
  tableColumns.value = tem
}
const onFinish = () => {
  emits('search', _.pickBy(formState, value => {
    return value !== '' && value !== null && value !== undefined;
  }))
};
const onChange = (pagination: any, filters: any, sorter: any) => {
  if (!_.isEmpty(pagination)) {
    formState['current'] = pagination.current
    formState['pageSize'] = pagination.pageSize
  }
  if (!_.isEmpty(sorter)) {

  }
  if (!_.isEmpty(sorter)) {
    if (sorter.order) {
      formState['sortField'] = sorter.field
      formState['sortOrder'] = sorter.order
    } else {
      delete formState.sortField
      delete formState.sortOrder
    }
  }
  console.log(filters)
  //除去formState中的空字段
  emits('search', _.pickBy(formState, value => {
    return value !== '' && value !== null && value !== undefined;
  }))
}

const onReload = () => {
  return _.pickBy(formState, value => {
    return value !== '' && value !== null && value !== undefined;
  })
}

const onRefresh = () => {
  emits('refresh')
}
const handleResizeColumn = (w: number, col: any) => {
  console.log(w, col)
  col.width = w;
}

const handleClick = ({key}: any) => {
  tableSize.value = key
}

defineExpose({onReload})

</script>

<template>
  <div v-if="searchArray.length > 0" class="bg-[var(--bg-page-container)] rd-8px px-24px mb-20px pt-24px">
    <a-form
        ref="formRef"
        name="advanced_search"
        class="ant-advanced-search-form"
        :model="formState"
        @finish="onFinish"
    >
      <a-row :gutter="24">
        <template v-for="(item,index) in searchArray" :key="item.dataIndex">
          <a-col v-show="expand || index <= 2" :span="6">
            <a-form-item
                :name="item.dataIndex"
                :label="item.title"
            >
              <a-input v-model:value="formState[item.dataIndex]" :placeholder="`请输入${item.title}`"></a-input>
            </a-form-item>
          </a-col>
        </template>
        <a-col :span="!expand ? 6 : (4 - (searchArray.length % 4)) * 6 " style="text-align: right">
          <a-button type="primary" html-type="submit">搜索</a-button>
          <a-button style="margin: 0 8px" @click="() => formRef.resetFields()">清除</a-button>
          <a style="font-size: 12px" @click="expand = !expand">
            <template v-if="expand">
              <UpOutlined/>
            </template>
            <template v-else>
              <DownOutlined/>
            </template>
            {{ expand ? '收起' : '展开' }}
          </a>
        </a-col>
      </a-row>
    </a-form>
  </div>
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
          <ReloadOutlined @click="onRefresh"/>
        </a-tooltip>
        <a-tooltip placement="top" class="w-32px text-center font-size-4 inline-block">
          <template #title>
            <span>密度</span>
          </template>
          <a-dropdown placement="bottomRight" :trigger="['click']">
            <ColumnHeightOutlined/>
          <template #overlay>
              <a-menu
                  w-100px
                  @click="handleClick"
                  :selectedKeys="[tableSize]"
              >
                <a-menu-item key="large">
                  默认
                </a-menu-item>
                <a-menu-item key="middle">
                  中等
                </a-menu-item>
                <a-menu-item key="small">
                  紧凑
                </a-menu-item>
              </a-menu>
          </template>
          </a-dropdown>
        </a-tooltip>
        <a-tooltip placement="top" class="w-32px text-center font-size-4 inline-block relative hover:cursor-pointer">
          <template #title>
            <span>列设置</span>
          </template>
          <Setting :init-columns="columns" @change="settingChangeHandle"></Setting>
        </a-tooltip>
      </div>
    </div>
    <a-table v-bind="$attrs" :size="tableSize" @resizeColumn="handleResizeColumn" @change="onChange" :columns="tableColumns"
             :dataSource="dataSource" :scroll="{ x: 1000 }">
      <template v-for="(_item, key, index) in $slots" :key="index" v-slot:[key]="_item">
        <slot :name="key" v-bind="_item"></slot>
      </template>
    </a-table>
  </div>
</template>
<style lang="scss" scoped>
.ant-popover :deep(.ant-popover-content .ant-popover-inner) {
  padding: 0 !important;
}
.ant-menu-light.ant-menu-root.ant-menu-vertical{
  border-inline-end: 0;
}
.ant-menu-vertical :deep(>.ant-menu-item) {
  height: 32px;
  line-height: 32px;
}
</style>