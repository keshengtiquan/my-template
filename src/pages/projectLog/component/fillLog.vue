<script setup lang="ts">
import { reactive, ref } from 'vue';
import { getWorkPlaceByListIdApi } from "@/api/workplace";
import { useRoute } from 'vue-router';
import { saveLogApi } from '@/api/projectLog';
import { getWorkArea } from '@/api/dept/index'
import { Rule } from 'ant-design-vue/es/form';

const route = useRoute()
const open = ref<boolean>(false);
const title = ref('')
const formRef = ref()
const cascaderOption = ref<any[]>([])
const listId = ref('')
const workAreaData = ref<any[]>([])
const loading = ref(true)

interface Domain {
  workPlace: string[];
  quantity: number | undefined;
  workAreaId: string | undefined;
}
const dynamicValidateForm = reactive<{ domains: Domain[] }>({
  domains: [],
});
const emits = defineEmits(['submit'])

const addDomain = () => {
  dynamicValidateForm.domains.push({
    workPlace: [],
    quantity: undefined,
    workAreaId: route.query.workAreaId as string || undefined,
  });
};

const removeDomain = (item: Domain) => {
  const index = dynamicValidateForm.domains.indexOf(item);
  if (index !== -1) {
    dynamicValidateForm.domains.splice(index, 1);
  }
};

const showModal = async (record: any) => {
  open.value = true;
  title.value = record.listName
  listId.value = record.listId
  const { data } = await getWorkPlaceByListIdApi({ listId: record.listId })
  // const resulst = await getLogListApi({logId: route.query.logId as string, listId: record.listId, mode: 'form'})
  // dynamicValidateForm.domains = resulst.data
  const selectData = await getWorkArea()
  workAreaData.value = selectData.data
  cascaderOption.value = data
  loading.value = false
};

const validatorWorkPlace = async (_rule: Rule, value: any[]) => {
  if (value == undefined || value.length === 0) {
    return Promise.reject('请选择工点');
  } else if (value.length === 1) {
    const newData = dynamicValidateForm.domains.filter(item => item.workPlace[0] === value[0])
    const workAreaIds = new Set<string>([])
    newData.forEach(item => {
      workAreaIds.add(item.workAreaId ? item.workAreaId : '')
    })
    console.log(workAreaIds)
    return newData.length > 1 ? Promise.reject('选择的工点重复') : Promise.resolve()
  } else if (value.length > 1) {
    const newData = dynamicValidateForm.domains.filter(item => item.workPlace[0] === value[0] && item.workPlace[1] === value[1])
    return newData.length > 1 ? Promise.reject('选择的工点重复') : Promise.resolve()
  }

}

const handleOk = () => {
  formRef.value
    .validate()
    .then(async () => {
      console.log('values', dynamicValidateForm.domains);
      const params = {
        logId: route.query.logId,
        listId: listId.value,
        workPlaceData: dynamicValidateForm.domains
      }
      const res = await saveLogApi(params)
      if (res.code === 200) {
        open.value = false;
        emits('submit')
        resetForm()
      }
    })
    .catch((error: any) => {
      console.log('error', error);
    });
};
const resetForm = () => {
  formRef.value.resetFields();
};



defineExpose({ showModal })
</script>
<template>
  <a-modal v-model:open="open" :width="route.query.workAreaId ? '40%' : '70%'" :title="title" @ok="handleOk"
    :afterClose="resetForm">
    <a-skeleton v-if="loading" :loading="loading"/>
    <a-form v-else ref="formRef" name="dynamic_form_item" :model="dynamicValidateForm">
      <a-row :gutter="16" v-for="(domain, index) in dynamicValidateForm.domains" :key="index">
        <a-col :span="route.query.workAreaId ? 12 : 8">
          <a-form-item label="工点" :name="['domains', index, 'workPlace']" :rules="{
            required: true,
            validator: validatorWorkPlace,
            trigger: 'change',
          }">
            <a-cascader v-model:value="domain.workPlace" :options="cascaderOption" placeholder="请选择工点" />
          </a-form-item>
        </a-col>
        <a-col :span="route.query.workAreaId ? 12 : 8">
          <a-form-item label="数量" :name="['domains', index, 'quantity']" :rules="{
            required: true,
            message: '数量不能为空',
            trigger: 'change',
          }">
            <div class="flex">
              <a-input-number placeholder="请填写完成量" style="width: 90%;margin-right: 5px;" v-model:value="domain.quantity"
                :min="1" />
              <MinusCircleOutlined v-if="dynamicValidateForm.domains.length > 1 && route.query.workAreaId"
                class="font-size-5 text-red-500" @click="removeDomain(domain)" />
            </div>
          </a-form-item>
        </a-col>
        <a-col v-if="!route.query.workAreaId" :span="route.query.workAreaId ? 12 : 8">
          <a-form-item label="工区" :name="['domains', index, 'workAreaId']">
            <div class="flex">
              <a-select v-model:value="domain.workAreaId" style="width: 90%;margin-right: 5px;">
                <a-select-option v-for="workArea in workAreaData" :value="workArea.id">{{ workArea.deptName
                }}</a-select-option>
              </a-select>
              <MinusCircleOutlined v-if="dynamicValidateForm.domains.length > 1" class="font-size-5 text-red-500"
                @click="removeDomain(domain)" />
            </div>
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item>
        <a-button type="dashed" style="width: 100%" @click="addDomain">
          <PlusOutlined />
          添加项目
        </a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<style scoped></style>