<script lang="ts" setup>
import {useAppStore} from '@/store'
import {storeToRefs} from 'pinia';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons-vue';
import Menu from '../menu/index.vue'
import {computed, CSSProperties} from "vue";

const appStore = useAppStore()

const {layoutSetting} = storeToRefs(appStore)

const siderStyle = computed<CSSProperties>(() => {
  const defaultStyle: CSSProperties = {
    boxShadow: 'var(--box-shadow)',
    height: '100vh',
    position: 'fixed',
    zIndex: 2
  }
  if (layoutSetting.value.layout === 'side') {

  }
  if (layoutSetting.value.layout === 'mix') {
    defaultStyle.marginTop = `${layoutSetting.value.headerHeight}px`
    defaultStyle.height = `calc(100vh - ${layoutSetting.value.headerHeight}px)`
  }
  if (layoutSetting.value.layout === 'top') {

  }
  return defaultStyle
})

</script>

<template>
  <a-layout-sider v-model:collapsed="layoutSetting.collapsed"
                  :style="siderStyle"
                  collapsedWidth="48" width="230" :theme="layoutSetting.theme === 'inverted' ? 'dark' : 'light'"
                  :trigger="null" collapsible>
    <div v-if="layoutSetting.showLogo && layoutSetting.layout !== 'mix'" class="ant-pro-sider-logo"
         :style="{padding: `16px ${layoutSetting.collapsed ? 8 : 24}px`}">
      <a>
        <img src="/logo.svg">
        <h1 v-if="!layoutSetting.collapsed">{{ layoutSetting.title }}</h1>
      </a>
    </div>
    <div class="menu">
      <Menu/>
    </div>

    <a-menu v-if="!layoutSetting.leftCollapsed" class="ant-pro-sider-menu"
            :theme="layoutSetting.theme === 'inverted' ? 'dark' : 'light'" mode="inline"
            @click="appStore.toggleCollapse" :selectable="false">
      <a-menu-item>
        <template #icon>
          <menu-unfold-outlined v-if="layoutSetting.collapsed"/>
          <menu-fold-outlined v-else/>
        </template>
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>

<style lang="scss" scoped>
.ant-menu-light.ant-menu-root.ant-menu-inline {
  border-inline-end: none;
}

.ant-layout-sider :deep(.ant-layout-sider-children) {
  display: flex;
  flex-flow: column;
  height: 100%;
}

.menu {
  flex: 1 1 0%;
  overflow-x: hidden;
  overflow-y: auto;
}

.ant-pro-sider-logo {
  position: relative;
  display: flex;
  align-items: center;
  //padding: 16px 24px;
  cursor: pointer;
  transition: padding .3s cubic-bezier(0.645, 0.045, 0.355, 1);

  > a {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 32px;
  }

  img {
    display: inline-block;
    height: 32px;
    vertical-align: middle;
  }

  h1 {
    display: inline-block;
    height: 32px;
    margin: 0 0 0 12px;
    font-weight: 600;
    font-size: 18px;
    line-height: 32px;
    vertical-align: middle;
    animation: pro-layout-title-hide .3s;
  }
}

@keyframes pro-layout-title-hide {
  0% {
    display: none;
    opacity: 0
  }

  80% {
    display: none;
    opacity: 0
  }

  to {
    display: unset;
    opacity: 1
  }
}

</style>
