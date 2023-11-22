<script setup lang="ts">
import {onMounted, ref,computed} from "vue";
import iconData from './icon-data.ts'
import { theme } from 'ant-design-vue';
import * as _ from 'lodash'
type iconKey = 'directionIcons' | 'suggestionIcons' | 'eidtIcons' | 'dataIcons' | 'brandIcons' | 'websIcons'
const { useToken } = theme;
const { token } = useToken();
const props = defineProps<{
  modelValue: string
}>()
const emits = defineEmits(['update:modelValue']);
const activeKey = ref<iconKey>('websIcons');
// const inputValue = toRef(props, "modelValue");
const inputValue = computed({
  set(value: string) {
    emits("update:modelValue", value)
  },
  get(): string {
    return props.modelValue
  },
})
const onChangeSelect = (item: string) => {
  emits("update:modelValue", item);

}
onMounted(() => {
  const key = _.findKey(iconData, (icons) => icons.includes(inputValue.value))
  if(key){
    activeKey.value = key as iconKey
  }
})

</script>
<template>
    <a-popover placement="bottomLeft" trigger="click" >
      <template #content>
        <a-tabs v-model:activeKey="activeKey" size="small" class="w-400px">
          <a-tab-pane key="websIcons" tab="通用图标"></a-tab-pane>
          <a-tab-pane key="directionIcons" tab="方向性图标"></a-tab-pane>
          <a-tab-pane key="suggestionIcons" tab="建议性图标"></a-tab-pane>
          <a-tab-pane key="eidtIcons" tab="编辑类图标"></a-tab-pane>
          <a-tab-pane key="dataIcons" tab="数据类图标"></a-tab-pane>
          <a-tab-pane key="brandIcons" tab="品牌和标识"></a-tab-pane>
        </a-tabs>
        <ul class="flex flex-wrap px-2 ml-2 w-400px h-356px overflow-auto flex-content-start">
          <li
              v-for="(item, key) in iconData[activeKey]"
              :key="key"
              :title="item"
              :style="{borderColor: item === inputValue ? token.colorPrimary : '', color: item === inputValue ? token.colorPrimary : ''}"
              class="hover-scale flex items-center justify-center h-32px w-32px mt-1 mr-2 border border-solid cursor-pointer"
              @click="onChangeSelect(item)"
          >
            <Component :is="item" class="child-component"/>
          </li>
        </ul>
      </template>
      <a-input v-model:value="inputValue" readOnly allowClear>
        <template #addonBefore>
          <Component :is="inputValue" />
        </template>
      </a-input>
    </a-popover>
</template>
<style lang="scss" scoped>
ul {
  padding: 0;
  list-style: none;
}
.hover-scale:hover {
  border-color: #1890ff;
}
.hover-scale:hover > .child-component {
  color: #1890ff;
  transform: scale(1.3);
  transition: transform 0.3s ease; /* 可以添加过渡效果 */
}
</style>