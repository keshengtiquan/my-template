<script setup lang="ts">
import {useLuckySheetStore} from "@/store";
import {useRouter} from "vue-router";
const router = useRouter()
const luckySheetStore = useLuckySheetStore()
const props = defineProps<{
  request: Function
}>()
const editOnline = () => {
  luckySheetStore.setRequest(props.request)
  router.push({path: '/luckysheet'})
}
</script>
<template>
  <a-button type="primary" @click="editOnline">在线编辑</a-button>
</template>
<style scoped>

</style>