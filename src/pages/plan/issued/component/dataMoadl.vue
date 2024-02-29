<script setup lang="ts">
import {ref} from 'vue';

const props = defineProps<{
  planType: string
}>()
const emits = defineEmits(['submit'])
const open = ref<boolean>(false);
const week = ref();
const month = ref();
const quarter = ref();
const year = ref();

const showModal = () => {
  open.value = true;
};

const handleOk = () => {
  switch (props.planType) {
    case 'week':
      emits('submit', week.value);
      break;
    case 'month':
      emits('submit', month.value);
      break;
    case 'quarter':
      emits('submit', quarter.value);
      break;
    case 'year':
      emits('submit', year.value);
      break;
    default:
      break;
  }
  open.value = false;
};
defineExpose({showModal})
</script>
<template>
  <a-modal v-model:open="open" title="生成计划" destroyOnClose width="20%" style="top: 30%" @ok="handleOk">
    <a-date-picker v-if="planType === 'week'" class="w-full" v-model:value="week" value-format="YYYY-MM-DD" picker="week"/>
    <a-date-picker v-else-if="planType === 'month'" class="w-full" v-model:value="month" value-format="YYYY-MM-DD" picker="month"/>
    <a-date-picker v-else-if="planType === 'quarter'" class="w-full" v-model:value="quarter" value-format="YYYY-MM-DD"
                   picker="quarter"/>
    <a-date-picker v-else-if="planType === 'year'" class="w-full" v-model:value="year" value-format="YYYY-MM-DD" picker="year"/>
  </a-modal>
</template>
<style scoped>

</style>