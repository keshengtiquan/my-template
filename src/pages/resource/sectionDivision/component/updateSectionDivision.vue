<script lang="ts" setup>
import { ref,reactive } from 'vue';
import Setup3 from "@/pages/resource/sectionDivision/component/setup3.vue";
import {updateSectorAndPrincipalApi} from "@/api/sectionDivision";
const open = ref<boolean>(false);

const emits = defineEmits(['submit'])
const id = ref<string>('')
const formState = reactive({
  principal: undefined,
  sector: ''
})
const showModal = (record: any) => {
  id.value = record.id
  open.value = true;
};

const handleOk = async () => {
  const data = {
    id: id.value,
    principal: formState.principal,
    sector: formState.sector
  }
  await updateSectorAndPrincipalApi(data)
  emits('submit')
  open.value = false;
};
defineExpose({showModal})
</script>
<template>
  <div>
    <a-modal v-model:open="open" title="修改" @ok="handleOk">
      <Setup3 v-model:form-state="formState"></Setup3>
    </a-modal>
  </div>
</template>
