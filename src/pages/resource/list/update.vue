<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import ListForm from './component/ListForm.vue'
import {useRoute, useRouter} from "vue-router";
import {onMounted, reactive} from "vue";
import {getOneById, updateListApi} from "@/api/list";
import {message} from "ant-design-vue";
import {FormState} from "@/pages/resource/list/component/ListForm.vue";
const route = useRoute()
const router = useRouter()
const formState = reactive<FormState>({
  serialNumber: undefined,
  listCode: '',
  listName: '',
  listCharacteristic: '',
  unit: '',
  quantities: undefined,
  unitPrice: undefined,
  combinedPrice: undefined,
})

const onSubmit = async (values: object) => {
  console.log(11,values)
  const res = await updateListApi(values)
  if(res.code === 200) {
    message.success(res.message)
    router.go(-1)
  }
}

onMounted(async () => {
  if(route.query.id){
    const res = await getOneById((route.query.id) as string)
    Object.assign(formState, res.data)
  }
})
</script>
<template>
  <PageContainer>
    <ListForm :form-state="formState" @submit="onSubmit"/>
  </PageContainer>
</template>
<style scoped>

</style>