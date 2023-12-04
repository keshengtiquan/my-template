<script lang="ts" setup>
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons-vue';
import {useAppStore} from '@/store'
import {computed, CSSProperties} from "vue";
import UserAvatar from '../user-avatar/index.vue'
import Menu from '../menu/index.vue'
import Setting from '../setting-drawer/index.vue'
import {storeToRefs} from "pinia";
import {animationNameList} from "@/layout/types.ts";

const appStore = useAppStore()
const {layoutSetting} = storeToRefs(appStore)

const {
  headerHeight
} = layoutSetting.value

const headerStyle = computed<CSSProperties>(() => {

  const defaultStyle: CSSProperties = {
    height: `${layoutSetting.value.headerHeight}px`,
    background: 'var(--bg-color)',
    lineHeight: `${layoutSetting.value.headerHeight}px`,
    display: "flex",
    boxShadow: "0 1px 4px rgba(0,21,41,.08)",
    zIndex: 1,
  }

  if (layoutSetting.value.layout === 'side') {
    defaultStyle.padding= 0
    if (layoutSetting.value.fixedHeader) {
      defaultStyle.position = 'fixed'
      defaultStyle.width = `calc(100% - ${layoutSetting.value.collapsed ? 48 : 230}px)`
      defaultStyle.transition = 'all 0.2s'
    }
    if(!layoutSetting.value.menu){
      defaultStyle.width = '100%'
    }
  }
  if (layoutSetting.value.layout === 'mix') {
    defaultStyle.background = '#001529'
    defaultStyle.color = 'rgba(229, 224, 216, 0.85)'
    defaultStyle.paddingInline= '24px'
    if (layoutSetting.value.fixedHeader) {
      defaultStyle.position = 'fixed'
      defaultStyle.width = '100%'
      defaultStyle.zIndex = 5
    }
  }
  if (layoutSetting.value.layout === 'top') {
    defaultStyle.paddingInline= '24px'
    if (layoutSetting.value.fixedHeader) {
      defaultStyle.position = 'fixed'
      defaultStyle.width = '100%'
    }
    if (layoutSetting.value.theme === "inverted") {
      defaultStyle.background = '#001529'
      defaultStyle.color = 'rgba(229, 224, 216, 0.85)'
    }
  }
  return defaultStyle
})


</script>

<template>
  <a-layout-header :style="headerStyle">
    <span v-if="layoutSetting.layout === 'side' && layoutSetting.leftCollapsed">
      <menu-unfold-outlined v-if="layoutSetting.collapsed" class="trigger"
                            @click="() => (layoutSetting.collapsed = !layoutSetting.collapsed)"/>
      <menu-fold-outlined v-else class="trigger" @click="() => (layoutSetting.collapsed = !layoutSetting.collapsed)"/>
    </span>
    <div class="ant-pro-top-nav-header-logo" v-if="layoutSetting.showLogo && layoutSetting.layout !== 'side'">
      <img :src="layoutSetting.logo">
      <h1>{{ layoutSetting.title }}</h1>
    </div>
    <div class="flex-1">
      <Menu v-if="layoutSetting.layout === 'top'"/>
    </div>
    <UserAvatar/>
    <Setting v-model:open="layoutSetting.drawerVisible"
             :theme="layoutSetting.theme"
             :colorPrimary="layoutSetting.colorPrimary"
             :layout="layoutSetting.layout"
             :contentWidth="layoutSetting.contentWidth"
             :fixedHeader="layoutSetting.fixedHeader"
             :splitMenus="layoutSetting.splitMenus"
             :header="layoutSetting.header"
             :footer="layoutSetting.footer"
             :menu="layoutSetting.menu"
             :colorWeak="layoutSetting.colorWeak"
             :multiTab="layoutSetting.multiTab"
             :multiTabFixed="layoutSetting.multiTabFixed"
             :keepAlive="layoutSetting.keepAlive"
             :leftCollapsed="layoutSetting.leftCollapsed"
             :showLogo="layoutSetting.showLogo"
             :animation-name-list="animationNameList"
             :animation-name="layoutSetting.animationName"
             :accordionMode="layoutSetting.accordionMode"
             @setting-change="appStore.changeSettingLayout"></Setting>
  </a-layout-header>
</template>

<style lang="scss" scoped>

.trigger {
  font-size: 18px;
  padding: 0 15px;
  cursor: pointer;
  transition: color 0.3s;
  line-height: v-bind(headerHeight) px;
}

.trigger:hover {
  color: #1890ff;
}


.ant-pro-top-nav-header-logo {
  position: relative;
  min-width: 165px;
  height: 100%;
  overflow: hidden;
  margin-right: 25px;

  img {
    display: inline-block;
    height: 32px;
    vertical-align: middle;
  }

  h1 {
    display: inline-block;
    margin: 0 0 0 12px;
    font-size: 16px;
    vertical-align: top;
    //color: rgba(0,0,0,.85);
  }
}

.ant-menu-horizontal {
  border-bottom: none;
}

</style>
