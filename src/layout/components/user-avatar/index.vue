<script setup lang="ts">
import {LogoutOutlined} from '@ant-design/icons-vue'
import {useRouter} from "vue-router";
import {message} from 'ant-design-vue';
import {useUserStore} from "@/store";
import {storeToRefs} from "pinia";

const router = useRouter()
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

async function handleClick({key}: any) {
  if (key === 'logout') {
    const hide = message.loading('退出登录...', 0)
    try {
      userStore.logout()
    } finally {
      hide()
      message.success('退出登录成功', 3)
      router.push({
        path: '/login',
      }).then(() => {
      })
    }
  }
}
</script>

<template>

  <a-dropdown>
<span hover="bg-[var(--hover-color)]" flex items-center h-48px px-12px cursor-pointer class="transition-all-300">
      <a-avatar src="/logo.svg" mr-8px size="small"/>
      <span class="anticon">{{ userInfo!.nickName }} </span>
    </span>
    <template #overlay>
      <a-menu @click="handleClick">
<!--        <a-menu-item key="0">-->
<!--          <template #icon>-->
<!--            <UserOutlined/>-->
<!--          </template>-->
<!--          <RouterLink to="/account/center">-->
<!--            个人中心-->
<!--          </RouterLink>-->
<!--        </a-menu-item>-->
<!--        <a-menu-item key="1">-->
<!--          <template #icon>-->
<!--            <ProfileOutlined/>-->
<!--          </template>-->
<!--          <RouterLink to="/account/settings">-->
<!--            个人设置-->
<!--          </RouterLink>-->
<!--        </a-menu-item>-->
<!--        <a-menu-divider/>-->
        <a-menu-item key="logout">
          <template #icon>
            <LogoutOutlined/>
          </template>
          退出登录
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>