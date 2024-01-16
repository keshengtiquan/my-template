<script setup lang="ts">
import {onMounted, ref} from 'vue';
import TableTransfer from '@/components/table-transfer/index.vue'
import {relevanceListIdApi} from "@/api/workplace";
import {message} from "ant-design-vue";
import {useRoute} from "vue-router";

const route = useRoute()
const id = route.query.id as string
const open = ref<boolean>(false);
//选择的清单的ID
const selectedKeys = ref<string[]>([])
//当前工点的ID
const selectedId = ref('')
const emits = defineEmits(['submit'])

const openDrawer = (id: string) => {
  selectedId.value = id
  open.value = true
}
const onClose = () => {
  open.value = false;
};
// 穿梭框的change事件
const onTransferChange = (values: string[]) => {
  selectedKeys.value = values
}
const onSubmit = async () => {
  if (selectedKeys.value.length === 0) {
    message.warn('请选择清单')
    return
  }
  const res = await relevanceListIdApi({id: selectedId.value, listIds: selectedKeys.value})
  if (res.code === 200) {
    emits('submit')
    message.success(res.message)
    onClose()
  }
}


defineExpose({openDrawer, onClose})
</script>
<template>
  <a-drawer destroyOnClose :height="650" title="选择清单" @close="onClose" placement="bottom" :open="open">
    <template #extra>
      <a-button style="margin-right: 8px" @click="() => onClose()">取消</a-button>
      <a-button type="primary" @click="onSubmit">确定</a-button>
    </template>
    <TableTransfer :work-place-id="id" @onTransferChange="onTransferChange"></TableTransfer>
  </a-drawer>
</template>


<style scoped>

</style>