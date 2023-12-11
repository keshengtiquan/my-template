<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import ListForm from './component/ListForm.vue'
import {reactive} from "vue";
import {createListApi} from "@/api/list";
import {message} from "ant-design-vue";
import {useRouter} from "vue-router";

const formState = reactive({
  serialNumber: undefined,
  listCode: '',
  listName: '',
  listCharacteristic: '',
  unit: '',
  quantities: undefined,
  unitPrice: undefined,
  combinedPrice: undefined,
})
const router = useRouter()
const onSubmit = async (values: object) => {
  const res = await createListApi(values)
  if(res.code === 200){
    message.success(res.message)
    router.go(-1)
  }
}
</script>
<template>
  <PageContainer>
    <ListForm :form-state="formState" @submit="onSubmit"></ListForm>
  </PageContainer>
</template>



<style scoped>

</style>