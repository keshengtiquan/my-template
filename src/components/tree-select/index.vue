<script lang="ts" setup>
import {computed} from 'vue';
import {useTreeSelect} from "@/composables/useTreeSelect.ts";
const props = defineProps<{
  modelValue: any,
  request: Function
}>()
const emits = defineEmits(['update:modelValue'])
const modelValue = computed({
  set(value: undefined | number) {
    emits("update:modelValue", value)
  },
  get(): undefined | number {
    return props.modelValue
  },
})
const {treeData} = useTreeSelect(props.request)

</script>
<template>
  <a-tree-select
      v-model:value="modelValue"
      v-bind="$attrs"
      :tree-data="treeData"
  >
  </a-tree-select>
</template>


