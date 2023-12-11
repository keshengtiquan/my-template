<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'
import WorkPlaceForm, {FormState} from "@/pages/resource/workplace/component/WorkPlaceForm.vue";
import {reactive} from "vue";
import {useRouter} from "vue-router";
import {message} from "ant-design-vue";
import {createWorkPlaceApi} from "@/api/workplace";

const formState = reactive<FormState>({
  sortNumber: undefined,
  workPlaceCode: '',
  workPlaceName: '',
  workPlaceType: undefined
})
const router = useRouter()
const createWorkPlace = async (values: any) => {
  const res = await createWorkPlaceApi(values)
  if(res.code === 200){
    message.success(res.message)
    router.go(-1)
  }
}
</script>
<template>
  <PageContainer>
    <WorkPlaceForm :form-state="formState" @submit="createWorkPlace"></WorkPlaceForm>
  </PageContainer>
</template>



<style scoped>

</style>