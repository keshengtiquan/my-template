<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import DivisionForm from "@/pages/resource/division/component/divisionForm.vue";
import {onMounted, reactive} from "vue";
import {message} from "ant-design-vue";
import {useRouter, useRoute} from "vue-router";
import {createDivision} from "@/api/division";

const formState = reactive({
  parentId: '0',
  divisionName: '',
  divisionType: undefined
})
const router = useRouter()
const route = useRoute()
const onSubmit = async () => {
  console.log(formState)
  await createDivision(formState).then(res => {
    message.success(res.message)
    router.go(-1)
  })
}
onMounted(() => {
  const parentId = route.query.parentId as string
  formState.parentId = parentId || '0'
})
</script>
<template>
  <PageContainer>
    <DivisionForm v-model:form-state="formState" @submit="onSubmit"></DivisionForm>
  </PageContainer>
</template>



<style scoped>

</style>