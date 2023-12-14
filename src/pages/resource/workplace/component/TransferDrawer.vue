<script setup lang="ts">
import {ref} from 'vue';
import TableTransfer from '@/components/table-transfer/index.vue'
const open = ref<boolean>(false);

const openDrawer = () => {
  open.value = true
}
const onClose = () => {
  open.value = false;
};

defineExpose({openDrawer,onClose})
</script>
<template>
  <a-drawer destroyOnClose :height="650" title="Basic Drawer" @close="onClose" placement="bottom" :open="open">
    <template #extra>
      <a-button style="margin-right: 8px">Cancel</a-button>
      <a-button type="primary">Submit</a-button>
    </template>
    <TableTransfer></TableTransfer>
  </a-drawer>
</template>


<style scoped>

</style>