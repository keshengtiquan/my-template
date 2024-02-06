<script setup lang="ts">
import { ref } from 'vue';
import {getWorkPlaceByListIdApi} from "@/api/workplace";
const open = ref<boolean>(false);
const title = ref('')

const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
  },
};
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

const dynamicValidateForm = ref<any[]>([])


const showModal = async (record: any) => {
  open.value = true;
  title.value = record.listName
  const {data} = await getWorkPlaceByListIdApi({listId: record.listId})
  console.log(data)
};

const handleOk = (e: MouseEvent) => {
  console.log(e);
  open.value = false;
};

defineExpose({showModal})
</script>
<template>
  <a-modal v-model:open="open" :title="title" @ok="handleOk">
    <a-form
        ref="formRef"
        name="dynamic_form_item"
        :model="dynamicValidateForm"
        v-bind="formItemLayoutWithOutLabel"
    >
      <a-form-item
          v-for="(domain, index) in dynamicValidateForm"
          :key="domain.key"
          v-bind="index === 0 ? formItemLayout : {}"
          :label="index === 0 ? 'Domains' : ''"
          :name="['domains', index, 'value']"
          :rules="{
        required: true,
        message: 'domain can not be null',
        trigger: 'change',
      }"
      >
        <a-input
            v-model:value="domain.value"
            placeholder="please input domain"
            style="width: 60%; margin-right: 8px"
        />
        <MinusCircleOutlined
            class="dynamic-delete-button"
            @click=""
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayoutWithOutLabel">
        <a-button type="dashed" style="width: 60%" @click="">
          <PlusOutlined />
          Add field
        </a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<style scoped>

</style>