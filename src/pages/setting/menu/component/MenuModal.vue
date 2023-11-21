<script lang="ts" setup>
import {reactive, ref} from "vue";
import {Rule} from "ant-design-vue/es/form";
import {ModalType} from "@/enums";
import IconSelect from '@/components/icon-select/index.vue'
import TreeSelect from '@/components/tree-select/index.vue'
import {getMenuDataApi} from "@/api/menu";

const open = ref(false)
const formRef = ref();
const title = ref('')
const formState = reactive({
  parentId: undefined,
  menuType: 'C',
  icon: 'QuestionOutlined',
  title: "",
  menuSort: 10,
  isIframe: false,
  path: '',
  hideInMenu: false,
  status: '0',
  name: '',
  component: '',
  url: '',
  affix: false,
  hideInBreadcrumb: false,
  hideChildrenInMenu: false,
  keepAlive: false,
  target: '',
  permission: '',
  redirect: ''
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
  <a-modal v-model:open="open" width="40%" :title="title" @ok="handleOk">
    <a-form
        ref="formRef"
        :model="formState"
        :rules="rules"
    >
      <a-form-item label="上级菜单" name="parentId">
        <TreeSelect :field-names="{children: 'children',label: 'title',value: 'id',}" v-model="formState.parentId"
                    :request="getMenuDataApi" allowClear/>
      </a-form-item>
      <a-form-item label="菜单类型" name="menuType">
        <a-radio-group v-model:value="formState.menuType" button-style="solid">
          <a-radio-button value="C">目录</a-radio-button>
          <a-radio-button value="M">菜单</a-radio-button>
          <a-radio-button value="F">按钮</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="图标" name="icon">
        <IconSelect v-model="formState.icon"></IconSelect>
      </a-form-item>
      <a-row :gutter="20">

        <a-col :span="12">
          <a-form-item label="菜单名称" name="title">
            <a-input v-model:value="formState.title"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="菜单排序" name="menuSort">
            <a-input-number v-model:value="formState.menuSort" class="w-full" :min="1" :step="10"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="路由地址" name="path">
            <a-input v-model:value="formState.path"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="路由名称" name="name">
            <a-input v-model:value="formState.name"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="组件地址" name="component">
            <a-input v-model:value="formState.component"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="重定向地址" name="redirect">
            <a-input v-model:value="formState.redirect"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="权限标识" name="permission">
            <a-input v-model:value="formState.permission"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="是否缓存" name="keepAlive">
            <a-radio-group v-model:value="formState.keepAlive" button-style="solid">
              <a-radio-button :value="true">是</a-radio-button>
              <a-radio-button :value="false">否</a-radio-button>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="是否外链" name="isIframe">
            <a-radio-group v-model:value="formState.isIframe" button-style="solid">
              <a-radio-button :value="true">是</a-radio-button>
              <a-radio-button :value="false">否</a-radio-button>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="外链地址" name="url">
            <a-input v-model:value="formState.url"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="外链地址" name="target">
            <a-select v-model:value="formState.target" class="w-full">
              <a-select-option value="_blank">_blank</a-select-option>
              <a-select-option value="_self">_self</a-select-option>
              <a-select-option value="_parent">_parent</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="是否隐藏" name="hideInMenu">
            <a-radio-group v-model:value="formState.hideInMenu" button-style="solid">
              <a-radio-button :value="true">是</a-radio-button>
              <a-radio-button :value="false">否</a-radio-button>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="页签是否固定" name="affix">
            <a-radio-group v-model:value="formState.affix" button-style="solid">
              <a-radio-button :value="true">是</a-radio-button>
              <a-radio-button :value="false">否</a-radio-button>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="是否固定在面包屑隐藏" name="hideInBreadcrumb">
            <a-radio-group v-model:value="formState.hideInBreadcrumb" button-style="solid">
              <a-radio-button :value="true">是</a-radio-button>
              <a-radio-button :value="false">否</a-radio-button>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="是否隐藏子菜单" name="hideChildrenInMenu">
            <a-radio-group v-model:value="formState.hideChildrenInMenu" button-style="solid">
              <a-radio-button :value="true">是</a-radio-button>
              <a-radio-button :value="false">否</a-radio-button>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="菜单状态" name="status">
            <a-radio-group v-model:value="formState.status" button-style="solid">
              <a-radio-button value="0">激活</a-radio-button>
              <a-radio-button value="1">禁用</a-radio-button>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>

    </a-form>
  </a-modal>
</template>