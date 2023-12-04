<script setup lang="ts">
import {computed} from "vue";

const props = withDefaults(defineProps<{
  open: boolean,
  descriptionData?: object
  width?: string | number
  title?: string
}>(),{
  width: '40%',
  title: '查看'
})
const emits = defineEmits(['update:open'])
const drawerOpen = computed({
  get(){
    return props.open
  },
  set(value: boolean){
    emits('update:open', value)
  }
})

</script>
<template>
  <a-drawer
      v-model:open="drawerOpen"
      :width="width"
      :title="title"
      :closable="false"
  >
    <a-descriptions v-bind="$attrs" bordered>
      <a-descriptions-item v-for="(val, key) in props.descriptionData" :key="key" :label="key">{{val}}</a-descriptions-item>
    </a-descriptions>
  </a-drawer>
</template>



<style scoped>

</style>