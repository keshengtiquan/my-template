<script setup lang="ts">
import {getUserListApi} from "@/api/user";
import Select from "@/components/select/index.vue";
import {computed} from "vue";

export interface FormState {
  principal: undefined | string,
  sector: string
}
const props = defineProps<{
  formState: FormState
}>()
const emits = defineEmits(['update:formState'])
const formStateComputed = computed({
  set(value: FormState) {
    emits("update:formState", value)
  },
  get(): FormState {
    return props.formState
  },
})
</script>
<template>
  <a-form
      ref="formRef"
      :model="formStateComputed"
      :label-col="{lg: { span: 4 }, sm: { span: 3 }}"
      :wrapper-col="{lg: { span: 20 }, sm: { span: 21 }}"
  >
    <a-form-item label="负责人" name="principal" :rules="[{ required: true, message: '请选择负责人' }]">
      <Select placeholder="请选择负责人" v-model="formStateComputed.principal" :limit="50"
              :fieldNames="{label: 'nickName', value: 'nickName'}" :request="getUserListApi"></Select>
    </a-form-item>
    <a-form-item label="区段名称" name="sector" :rules="[{ required: true, message: '请输入区段名称' }]">
      <a-input v-model:value="formStateComputed.sector" placeholder="区段名称"></a-input>
    </a-form-item>
  </a-form>
</template>
<style scoped>

</style>