<script setup lang="ts">
import { useUserStore } from '@/store';
import dayjs from 'dayjs';
import { onBeforeUnmount, ref } from 'vue';
const userStore = useUserStore();
const currentTime = ref(dayjs().format('YYYY年MM月DD日 HH时mm分ss秒'))
// 运行定时器，一秒获取一次
const interval = window.setInterval(() => {
  currentTime.value = dayjs().format('YYYY年MM月DD日 HH时mm分ss秒')
}, 1000)
// 这个界面不在我们视线中的时候，关闭定时器
onBeforeUnmount(() => {
  window.clearInterval(interval)
})
</script>
<template>
  <div p-24px mb-8px flex items-center relative class="bg-[var(--bg-page-container)]">
    <a-avatar style="background-color: #87d068" :size="{ xs: 24, sm: 32, md: 40, lg: 60, xl: 60, xxl: 60 }">
      <span style="font-size: 30px;">{{ userStore.userInfo?.nickName?.substring(0, 1) }}</span>
    </a-avatar>
    <div ml-8px h-60px flex flex-col justify-around>
      <span font-600 m-2px font-size-18px>{{ userStore.userInfo?.nickName }}</span>
      <span m-2px text-gray>{{ userStore.userInfo?.CompanyDept?.deptName }}</span>
    </div>
    <span absolute top-20px right-20px>{{ currentTime }}</span>
  </div>
</template>



<style scoped></style>