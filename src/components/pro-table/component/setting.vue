<script setup lang="ts">
import {VueDraggableNext as draggable} from 'vue-draggable-next'
import {onMounted, ref, watch} from "vue";
import {FixedType} from "ant-design-vue/es/vc-table/interface";

const props = defineProps<{
  initColumns: any[],
  tableColumns?: any[]
}>()
const emits = defineEmits(['change'])
const checkAllRef = ref()
const open = ref(false)
const settingColumns = ref<any[]>([])
const checkAll = ref(false)
const isIndeterminate = ref(false)

const fixedLeftColumns = ref<any[]>([])
const notFixedColumns = ref<any[]>([])
const fixedRightColumns = ref<any[]>([])

//拖拽完成后
const onDragChange = () => {
  emits('change', mergeColumns())
}
//全选按钮
const onCheckAllChange = (e: any) => {
  settingColumns.value.forEach(item => {
    item.hide = !e.target.checked
  })
  emits('change', mergeColumns())
}
//字段显示隐藏
const onCheckChange = (check: boolean, element: any) => {
  settingColumns.value.forEach(item => {
    if (item.title === element.title) {
      item.hide = !check
    }
  })
  emits('change', mergeColumns())
}
//重置
const onReset = () => {
  init()
  updateColumns()
  emits('change', mergeColumns())
}
//固定按钮
const fixedColumn = (pos: string | undefined | null, element: any) => {
  settingColumns.value.forEach(item => {
    if(item.dataIndex === element.dataIndex){
      item.fixed = pos as FixedType
    }
  })
  updateColumns()
  emits('change', mergeColumns())
}
//全选半选逻辑
watch(settingColumns, (newVal: any[]) => {
  const count = newVal.reduce((accumulator, column) => {
    // 当 hide 为 false 时，进行累加
    if (!column.hide) {
      return accumulator + 1;
    }
    return accumulator;
  }, 0);
  if (count === props.initColumns?.length) {
    isIndeterminate.value = false
    checkAll.value = true
  } else if (count === 0) {
    isIndeterminate.value = false
    checkAll.value = false
  } else {
    checkAll.value = false
    isIndeterminate.value = true
  }
}, {deep: true, immediate: true})

const updateColumns = () => {
  fixedLeftColumns.value = []
  fixedRightColumns.value = []
  notFixedColumns.value = []

  settingColumns.value.forEach(item => {
    if(item.fixed === 'left'){
      fixedLeftColumns.value.push(item)
    }else if(item.fixed === 'right'){
      fixedRightColumns.value.push(item)
    }else {
      notFixedColumns.value.push(item)
    }
  })
}

const init = () => {
  settingColumns.value = []
  // props.initColumns?.forEach((item, index) => {
  //   const obj = {title: item.title, fixed: item.fixed, dataIndex: item.dataIndex, key: index, hide: false}
  //   console.log(item)
  //   settingColumns.value.push(obj)
  // })
  settingColumns.value = processColumns(props.initColumns)
}

const processColumns = (columns: any[]) => {
  const result: any[] = [];
  columns.forEach((item, index) => {
    const obj: any = { title: item.title, key: index, hide: item.hide || false };
    if(item.dataIndex){
      obj.dataIndex = item.dataIndex
    }

    if (item.children && Array.isArray(item.children)) {
      // 如果有子列，递归处理子列
      obj.children = processColumns(item.children);
    }
    result.push(obj);
  });

  return result;
}

onMounted(async () => {
  init()
  updateColumns()
  emits('change', mergeColumns())
})

const mergeColumns = () => {
  const tableColumns = [...fixedLeftColumns.value,  ...notFixedColumns.value, ...fixedRightColumns.value]
  return tableColumns.filter(item => !item.hide)
}
</script>
<template>
  <a-popover v-model:open="open"  placement="bottomRight"  trigger="click">
    <template #content>
      <div class="flex justify-between">
        <a-checkbox ref="checkAllRef" :indeterminate="isIndeterminate" v-model:checked="checkAll"
                    @change="onCheckAllChange">
          <span class="pl-8px">列展示</span>
        </a-checkbox>
        <a-button type="link" size="small" @click="onReset">重置</a-button>
      </div>
      <div class="popover">
        <!--   固定在左侧   -->
        <div v-if="fixedLeftColumns.length > 0" class="w-full pl-24px mx-6px font-size-12px text-[var(--text-color-1)]">固定在左侧</div>
        <draggable
            v-model="fixedLeftColumns"
            @change="onDragChange"
            class="w-200px"
        >
          <div class="flex pt-5px" v-for="element in fixedLeftColumns" :key="element.key">
            <HolderOutlined class="pr-8px hover:cursor-grabbing "/>
            <span class="w-24px" v-if="fixedLeftColumns.length > 1"></span>
            <a-checkbox class="flex-1 w-full" :checked="!element.hide"
                        @change="(e: any) => onCheckChange(e.target.checked, element)">
              <div class="flex justify-between w-full hover:bg-[var(--hover-color)] px-8px rd-6px show-span">
                {{ element.title }}
                <span class="text-blue font-600">
                <a-tooltip placement="top" class="">
                  <template #title>
                    <span>取消固定</span>
                  </template>
                  <VerticalAlignMiddleOutlined  @click.prevent="fixedColumn(undefined, element)"/>
                </a-tooltip>
                <a-tooltip placement="top" class="">
                  <template #title>
                    <span>固定在列尾</span>
                  </template>
                  <VerticalAlignBottomOutlined @click.prevent="fixedColumn('right', element)"/>
                </a-tooltip>
              </span>
              </div>
            </a-checkbox>
          </div>
        </draggable>
        <!--   不固定   -->
        <div v-if="fixedLeftColumns.length > 0 || fixedRightColumns.length > 0" class="w-full pl-24px mx-6px font-size-12px text-[var(--text-color-1)]">不固定</div>
        <draggable
            v-model="notFixedColumns"
            @change="onDragChange"
            class="w-200px"
        >
          <div class="flex pt-5px" v-for="element in notFixedColumns" :key="element.key">
            <HolderOutlined class="pr-8px hover:cursor-grabbing "/>
            <span class="w-24px"></span>
            <a-checkbox class="flex-1 w-full" :checked="!element.hide"
                        @change="(e: any) => onCheckChange(e.target.checked, element)">
              <div class="flex justify-between w-full hover:bg-[var(--hover-color)] px-8px rd-6px show-span">
                {{ element.title }}
                <span class="text-blue font-600">
                <a-tooltip placement="top" class="">
                  <template #title>
                    <span>固定在列首</span>
                  </template>
                  <VerticalAlignTopOutlined @click.prevent="fixedColumn('left', element)"/>
                </a-tooltip>
                <a-tooltip placement="top" class="">
                  <template #title>
                    <span>固定在列尾</span>
                  </template>
                  <VerticalAlignBottomOutlined @click.prevent="fixedColumn('right', element)"/>
                </a-tooltip>
              </span>
              </div>
            </a-checkbox>
          </div>
        </draggable>
        <!--   固定在右侧   -->
        <div v-if="fixedRightColumns.length > 0" class="w-full pl-24px mx-6px font-size-12px text-[var(--text-color-1)]">固定在右侧</div>
        <draggable
            v-model="fixedRightColumns"
            @change="onDragChange"
            class="w-200px"
        >
          <div class="flex pt-5px" v-for="element in fixedRightColumns" :key="element.key">
            <HolderOutlined class="pr-8px hover:cursor-grabbing "/>
            <span v-if="fixedRightColumns.length > 1" class="w-24px"></span>
            <a-checkbox class="flex-1 w-full" :checked="!element.hide"
                        @change="(e: any) => onCheckChange(e.target.checked, element)">
              <div class="flex justify-between w-full hover:bg-[var(--hover-color)] px-8px rd-6px show-span">
                {{ element.title }}
                <span class="text-blue font-600">
                <a-tooltip placement="top" class="">
                  <template #title>
                    <span>固定在列首</span>
                  </template>
                  <VerticalAlignTopOutlined @click.prevent="fixedColumn('left', element)"/>
                </a-tooltip>
                <a-tooltip placement="top" class="">
                  <template #title>
                    <span>取消固定</span>
                  </template>
                  <VerticalAlignMiddleOutlined @click.prevent="fixedColumn(undefined, element)"/>
                </a-tooltip>
              </span>
              </div>
            </a-checkbox>
          </div>
        </draggable>
      </div>

    </template>
    <SettingOutlined/>
  </a-popover>


</template>
<style scoped>
.ant-popconfirm :deep(.ant-popconfirm-message-title) {
  margin-inline-start: 0 !important;
}

.ant-checkbox-wrapper > :deep(span:last-child) {
  width: 100%;
}

:deep(.ant-checkbox+span) {
  padding-inline-start: 0;
  padding-inline-end: 0;
}

.show-span > span {
  display: none;

}

/* hover div 时显示 span */
.show-span:hover > span {
  display: inline-block;
}

.popover {
  max-height: 488px;
  overflow: scroll;
}
</style>