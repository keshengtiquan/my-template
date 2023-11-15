<script setup lang="ts">
import type {TableColumnType} from "ant-design-vue";
import {VueDraggableNext as draggable} from 'vue-draggable-next'
import {onMounted, ref, watch} from "vue";

const props = defineProps<{
  initColumns?: TableColumnType[],
  tableColumns?: any[]
}>()
const emits = defineEmits(['change'])
const checkAllRef = ref()
const open = ref(false)
const settingColumns = ref<any[]>([])
const checkAll = ref(false)
const isIndeterminate = ref(false)
const onDragChange = () => {
  emits('change', settingColumns.value.filter(item => !item.hide))
}
const onCheckAllChange = (e: any) => {
  settingColumns.value.forEach(item => {
    item.hide = !e.target.checked
  })
  emits('change', settingColumns.value.filter(item => !item.hide))
}
const onCheckChange = (check: boolean, element: any) => {
  settingColumns.value.forEach(item => {
    if (item.dataIndex === element.dataIndex) {
      item.hide = !check
    }
  })
  emits('change', settingColumns.value.filter(item => !item.hide))
}
const onReset = () => {
  init()
  emits('change', settingColumns.value.filter(item => !item.hide))
}

const aaa = () => {
  console.log(39)
}

watch(settingColumns, (newVal: any[]) => {
  const count = newVal.reduce((accumulator, column) => {
    // 当 hide 为 false 时，进行累加
    if (!column.hide) {
      return accumulator + 1;
    }
    return accumulator;
  }, 0);
  console.log(count, props.initColumns?.length)
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

const init = () => {
  settingColumns.value = []
  props.initColumns?.forEach((item, index) => {
    const obj = {title: item.title, fixed: item.fixed, dataIndex: item.dataIndex, key: index, hide: false}
    settingColumns.value.push(obj)
  })
}
onMounted(async () => {
  init()
  emits('change', settingColumns.value.filter(item => !item.hide))
})
</script>
<template>
  <a-popover v-model:open="open" placement="bottomRight" trigger="click">
    <template #content>
      <div class="flex justify-between">
        <a-checkbox ref="checkAllRef" :indeterminate="isIndeterminate" v-model:checked="checkAll"
                    @change="onCheckAllChange">
          <span class="pl-8px">列展示</span>
        </a-checkbox>
        <a-button type="link" size="small" @click="onReset">重置</a-button>
      </div>
      <!--   不固定   -->
      <draggable
          v-model="settingColumns"
          @change="onDragChange"
          class="w-200px"
      >
        <div class="w-full pl-24px mx-6px font-size-12px text-[var(--text-color-1)]">不固定</div>
        <div class="flex pt-5px" v-for="element in settingColumns" :key="element.key">
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
                  <VerticalAlignTopOutlined @click.stop="aaa"/>
                </a-tooltip>
                <a-tooltip placement="top" class="">
                  <template #title>
                    <span>固定在列尾</span>
                  </template>
                  <VerticalAlignBottomOutlined/>
                </a-tooltip>
              </span>

            </div>
          </a-checkbox>
        </div>
      </draggable>
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
</style>