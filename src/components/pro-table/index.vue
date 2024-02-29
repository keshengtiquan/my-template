<script setup lang="ts">
import type { TableColumnType } from "ant-design-vue";
import Setting from './component/setting.vue'
import { onMounted, reactive, ref } from "vue";
import * as _ from 'lodash'
import TreeSelect from '@/components/tree-select/index.vue'

const props = withDefaults(defineProps<{
  columns: any[],
  dataSource?: any[],
  title?: string
  hideTool?: boolean
  tableSize?: 'middle' | 'small' | 'large'
}>(), {
  hideTool: false,
  tableSize: 'large'
})
const emits = defineEmits(['search', 'refresh'])
const tableColumns = ref<any[]>([])
const expand = ref(false);
const formState = reactive<Record<any, any>>({});
const formRef = ref();
const searchArray = ref<any[]>([])
const tableSize = ref(props.tableSize)

searchArray.value = props.columns.filter(item => item.search)


const settingChangeHandle = (setting: any[]) => {
  let tem: TableColumnType[] = []
  setting.forEach(item => {
    const column = _.cloneDeep(props.columns.find(column => column.title === item.title))
    if (column && item.fixed) {
      column['fixed'] = item.fixed
    }
    if (column)
      tem.push(column)
  })
  tableColumns.value = tem.length === 0 ? [{ title: '', dataIndex: '' }] : tem
}
const onFinish = () => {
  delete formState.current
  delete formState.pageSize

  emits('search', _.pickBy(formState, value => {
    return value !== '' && value !== null && value !== undefined;
  }))
};
const onChange = (pagination: any, filters: any, sorter: any) => {
  if (!_.isEmpty(pagination)) {
    formState['current'] = pagination.current
    formState['pageSize'] = pagination.pageSize
  }
  if (!_.isEmpty(filters)) {
    if (!_.isEmpty(filters)) {
      Object.assign(formState, filters)
    }
  }
  if (!_.isEmpty(sorter)) {
    if (sorter.order) {
      formState['sortField'] = sorter.field
      formState['sortOrder'] = sorter.order === 'ascend' ? 'ASC' : 'DESC'
    } else {
      delete formState.sortField
      delete formState.sortOrder
    }
  }
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
  col.width = w;
}

const handleClick = ({ key }: any) => {
  tableSize.value = key
}

defineExpose({ onReload })
onMounted(() => {

})
</script>

<template>
  <div v-if="searchArray.length > 0" class="bg-[var(--bg-page-container)] rd-8px px-24px mb-20px pt-24px">
    <a-form ref="formRef" name="advanced_search" class="ant-advanced-search-form" :model="formState" @finish="onFinish">
      <a-row :gutter="32" :class="{ aa: searchArray.length === 1 }">
        <template v-for="(item, index) in searchArray" :key="item.dataIndex">
          <a-col v-show="expand || index <= 2" :span="6">
            <a-form-item :name="item.dataIndex" :label="item.title">
              <a-input v-if="item.valueType === 'input'" allowClear v-model:value="formState[item.dataIndex]"
                :placeholder="`请输入${item.title}`"></a-input>
              <a-select v-if="item.valueType === 'select'" allowClear :options="item.valueEnum"
                v-model:value="formState[item.dataIndex]" :placeholder="`请输入${item.title}`"></a-select>
              <tree-select v-if="item.valueType === 'treeSelect'" allowClear treeDefaultExpandAll
                :dropdownMatchSelectWidth="false" :field-names="item.fieldNames" :request="item.request"
                v-model="formState[item.dataIndex]" :placeholder="`请选择${item.title}`"></tree-select>
              <a-date-picker v-if="item.valueType === 'date'" class="w-full" valueFormat="YYYY-MM-DD"
                v-model:value="formState[item.dataIndex]" />
              <a-input-number v-if="item.valueType === 'number'" v-model:value="formState[item.dataIndex]" :min="0" />
              <Select v-if="item.valueType === 'querySelect'" :placeholder="`请选择${item.title}`"
                v-model="formState[item.dataIndex]" :limit="50" :fieldNames="item.fieldNames"
                :request="item.request"></Select>
            </a-form-item>
          </a-col>
        </template>
        <a-col :span="!expand ? 6 : (4 - (searchArray.length % 4)) * 6" style="text-align: right">
          <a-button type="primary" html-type="submit">搜索</a-button>
          <a-button style="margin: 0 8px" @click="() => formRef.resetFields()">清除</a-button>
          <a style="font-size: 12px" @click="expand = !expand" v-if="searchArray.length > 3">
            <template v-if="expand">
              <UpOutlined />
            </template>
            <template v-else>
              <DownOutlined />
            </template>
            {{ expand ? '收起' : '展开' }}
          </a>
        </a-col>
      </a-row>
    </a-form>
  </div>
  <div class="bg-[var(--bg-page-container)] rd-8px px-24px">
    <div v-show="!hideTool" class="flex justify-between bg-[var(--bg-page-container)] py-16px rd-t-8px">
      <div class="h-32px flex items-center">
        <span v-if="props.title" class="font-600 font-size-16px">{{ title }}</span>
        <slot v-else name="toolLeft"></slot>
      </div>
      <div class="h-32px flex items-center">
        <slot name="toolRight"></slot>
        <a-tooltip placement="top" class="w-32px text-center font-size-4 inline-block">
          <template #title>
            <span>刷新</span>
          </template>
          <ReloadOutlined @click="onRefresh" />
        </a-tooltip>
        <a-tooltip placement="top" class="w-32px text-center font-size-4 inline-block">
          <template #title>
            <span>密度</span>
          </template>
          <a-dropdown placement="bottomRight" :trigger="['click']">
            <ColumnHeightOutlined />
            <template #overlay>
              <a-menu w-100px @click="handleClick" :selectedKeys="[tableSize]">
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

    <a-table v-bind="$attrs" :size="tableSize" @resizeColumn="handleResizeColumn" @change="onChange"
      :columns="tableColumns" :dataSource="dataSource">
      <template v-for="(_item, key, index) in $slots" :key="index" v-slot:[key]="_item">
        <slot :name="key" v-bind="_item"></slot>
      </template>
    </a-table>
  </div>
</template>
<style lang="scss" scoped>
.aa {
  justify-content: space-between;
}

.ant-popover :deep(.ant-popover-content .ant-popover-inner) {
  padding: 0 !important;
}

.ant-menu-light.ant-menu-root.ant-menu-vertical {
  border-inline-end: 0;
}

.ant-menu-vertical :deep(>.ant-menu-item) {
  height: 32px;
  line-height: 32px;
}
</style>
