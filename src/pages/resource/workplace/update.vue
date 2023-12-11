<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import WorkPlaceForm from "@/pages/resource/workplace/component/WorkPlaceForm.vue";
import {reactive} from "vue";
import {onMounted} from "vue";
import {getOneByIdApi, updateWorkPlaceApi} from "@/api/workplace";
import {useRouter,useRoute} from "vue-router";
import {message} from "ant-design-vue";

const formState = reactive({
  sortNumber: undefined,
  workPlaceCode: '',
  workPlaceName: '',
  workPlaceType: undefined
})
const route = useRoute()
const router = useRouter()
const onSubmit = async (values: object) => {
  const res = await updateWorkPlaceApi(values)
  if(res.code === 200){
    message.success('更新成功')
    router.go(-1)
  }
}
onMounted(async () => {
  const res = await getOneByIdApi((route.query.id as string))
  Object.assign(formState,res.data)
})

</script>
<template>
  <PageContainer>
    <WorkPlaceForm :form-state="formState" @submit="onSubmit"></WorkPlaceForm>
  </PageContainer>
</template>



<style scoped>

</style>