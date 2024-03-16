<script lang="ts" setup>
import {computed} from 'vue';
import {useTreeSelect} from "@/composables/useTreeSelect.ts";
const props = withDefaults(defineProps<{
  request: Function
  expandedKey?: string[],
  selectedKey?: string[],
  checkedKey?: string[]
}>(),{
  expandedKey: () => [],
  selectedKey: () => [],
  checkedKey: () => []
})
const emits = defineEmits(['update:expandedKey','update:selectedKey', 'update:checkedKey'])
const expandedKeys = computed({
  get(){
    return props.expandedKey
  },
  set(value){
    emits('update:expandedKey', value)
  }
})
const selectedKeys = computed({
  get(){
    return props.selectedKey
  },
  set(value){
    emits('update:selectedKey', value)
  }
})
const checkedKeys = computed({
  get(){
    return props.checkedKey
  },
  set(value){
    console.log(value)
    emits('update:expandedKey', value)
  }
})
const {treeData} = useTreeSelect(props.request)

</script>
<template>
  <a-tree
      v-model:expandedKeys="expandedKeys"
      v-model:checkedKeys="checkedKeys"
      v-model:selectedKeys="selectedKeys"
      v-bind="$attrs"
      :tree-data="treeData"
  >
  </a-tree>
</template>


