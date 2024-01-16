<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import DivisionForm from "@/pages/resource/division/component/divisionForm.vue";
import {onMounted, reactive} from "vue";
import {message} from "ant-design-vue";
import {useRouter, useRoute} from "vue-router";
import {getDivisionById, updateDivision} from "@/api/division";

const formState = reactive({
  parentId: '0',
  divisionName: '',
  divisionType: ''
})
const router = useRouter()
const route = useRoute()
const onSubmit =  () => {
  updateDivision(formState).then(res => {
    message.success(res.message)
    router.go(-1)
  })
}
onMounted(async () => {
  const id = route.query.id as string
  const res = await getDivisionById(id)
  Object.assign(formState, res.data)
})
</script>
<template>
  <PageContainer>
    <DivisionForm v-model:form-state="formState" @submit="onSubmit"></DivisionForm>
  </PageContainer>
</template>



<style scoped>

</style>