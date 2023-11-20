<script lang="ts" setup>
import { reactive, ref} from "vue";
import {Rule} from "ant-design-vue/es/form";
import {ModalType} from "@/enums";
import IconSelect from '@/components/icon-select/index.vue'
import * as antIcons from '@ant-design/icons-vue'
const open = ref(false)
const formRef = ref();
const title = ref('')
const formState = reactive({
  parentId: '',
  menuType: 'C',
  icon: ''
});
const rules: Record<string, Rule[]> = {
  name: [
    {required: true, message: 'Please input Activity name', trigger: 'change'},
  ],
};
const openModal = (type: ModalType, id?: number) => {
  title.value = type === ModalType.ADD ? '新增菜单' : '编辑菜单';
  open.value = !open.value;
}
const handleOk = () => {
  formRef.value.resetFields();
  open.value = !open.value
}
defineExpose({openModal})
</script>
<template>
  <a-modal v-model:open="open" :title="title" @ok="handleOk">
    <a-form
        ref="formRef"
        :model="formState"
        :rules="rules"
    >
      <a-form-item label="上级菜单" name="parentId">
        <a-input v-model:value="formState.parentId"/>
      </a-form-item>
      <a-form-item label="菜单类型" name="menuType">
        <a-radio-group v-model:value="formState.menuType" button-style="solid">
          <a-radio-button value="C">目录</a-radio-button>
          <a-radio-button value="M">菜单</a-radio-button>
          <a-radio-button value="F">按钮</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="图标" name="icon">
        <IconSelect :iconCom="antIcons"></IconSelect>
      </a-form-item>
    </a-form>
  </a-modal>
</template>