<script lang="ts" setup>
import {computed, onMounted, ref} from 'vue';

interface filedType {
  label: string
  children: any,
  value: string | number
}

const props = defineProps<{
  modelValue: any,
  request: Function
  fieldNames: filedType
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
const treeData = ref<any[]>()
const init = async () => {
  const {data} = await props.request()
  const rootValue: any = {}
  const oldData = []
  rootValue[props.fieldNames.label] = '根节点'
  rootValue[props.fieldNames.value] = '0'
  rootValue[props.fieldNames.children] = []
  oldData.unshift(rootValue)
  oldData[0].children = data
  treeData.value = oldData
}
onMounted(async () => {
  await init()
})

// const rootValue: any = {}
// rootValue[props.fieldNames.label] = '跟节点'
// rootValue[props.fieldNames.value] = '0'
// treeData.value?.unshift(rootValue)
// console.log(treeData.value)
</script>
<template>
  <a-tree-select
      v-model:value="modelValue"
      :fieldNames="fieldNames"
      v-bind="$attrs"
      :tree-data="treeData"
  >
  </a-tree-select>
</template>


