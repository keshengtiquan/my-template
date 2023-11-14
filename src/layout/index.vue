<template>
  <a-layout>
    <Header v-if="layoutSetting.layout === 'mix'"/>
    <SiderMenu v-if="layoutSetting.layout === 'side' && layoutSetting.menu "/>
    <a-layout :style="layoutStyle">
      <Header v-if="layoutSetting.layout === 'top' || layoutSetting.layout === 'side' "/>
      <MultiTab v-if="layoutSetting.multiTab"/>
      <SiderMenu v-if="layoutSetting.layout === 'mix' && layoutSetting.menu "/>
      <a-layout-content :style="contentStyle">
        <RouterView>
          <template #default="{ Component, route }">
            <Transition appear :name="layoutSetting.animationName" mode="out-in">
                <component :is="Component"  :key="route.fullPath" />
            </Transition>
          </template>
        </RouterView>
      </a-layout-content>
      <Footer v-if="layoutSetting.footer"/>
    </a-layout>
  </a-layout>
</template>
<script lang="ts" setup>
import SiderMenu from './components/sider-menu/index.vue'
import Header from './components/header/index.vue'
import {useAppStore} from '@/store'
import {storeToRefs} from "pinia";
import {computed, CSSProperties} from "vue";
import MultiTab from './components/multi-tab/index.vue'
import Footer from './components/footer/index.vue'

const appStore = useAppStore()
const {layoutSetting} = storeToRefs(appStore)

const layoutStyle = computed<CSSProperties>(() => {
  const defaultStyle: CSSProperties = {
    transition: 'all 0.2s'
  }
  if (layoutSetting.value.layout === 'side') {
    defaultStyle.marginLeft = `${layoutSetting.value.collapsed ? 48 : 230}px`
    if(!layoutSetting.value.menu){
      defaultStyle.marginLeft = 0
    }
  }
  if (layoutSetting.value.layout === 'mix') {
    defaultStyle.display='flex'
    defaultStyle.flexFlow='column'
  }
  if (layoutSetting.value.layout === 'top') {

  }
  return defaultStyle
})
const contentStyle = computed<CSSProperties>(() => {

  const defaultStyle: CSSProperties = {
    background: 'var(--bg-color-container)',
    // padding: '16px',
  }
  if(layoutSetting.value.footer && layoutSetting.value.multiTab){
    defaultStyle.minHeight = `calc(100vh - ${layoutSetting.value.headerHeight}px - 62px - 62px)`
  }else if((layoutSetting.value.footer && !layoutSetting.value.multiTab) || (!layoutSetting.value.footer && layoutSetting.value.multiTab)){
    defaultStyle.minHeight = `calc(100vh - ${layoutSetting.value.headerHeight}px  - 62px)`
  }else if(!layoutSetting.value.footer && !layoutSetting.value.multiTab){
    defaultStyle.minHeight = `calc(100vh - ${layoutSetting.value.headerHeight}px)`
  }
  if(layoutSetting.value.layout === 'side'){
    if(layoutSetting.value.fixedHeader && (!layoutSetting.value.multiTab || layoutSetting.value.multiTabFixed)){
      defaultStyle.marginTop= `${layoutSetting.value.headerHeight}px`
    }
  }
  if(layoutSetting.value.layout === 'top'){
    if(layoutSetting.value.fixedHeader && !layoutSetting.value.multiTab){
      defaultStyle.marginTop= `${layoutSetting.value.headerHeight}px`
    }
    if(layoutSetting.value.fixedHeader && layoutSetting.value.multiTabFixed){
      defaultStyle.marginTop= `${layoutSetting.value.headerHeight}px`
    }
  }
  if (layoutSetting.value.layout === 'mix') {
    defaultStyle.marginLeft = `${layoutSetting.value.collapsed ? 48 : 230}px`
    defaultStyle.transition = 'all 0.2s'
    defaultStyle.width = `calc(100% - ${layoutSetting.value.collapsed ? 48 : 230}px)`
    if(!layoutSetting.value.menu){
      defaultStyle.marginLeft = 0
    }
    if(layoutSetting.value.multiTab){
      defaultStyle.marginTop= 0
    }
    if(layoutSetting.value.multiTabFixed || !layoutSetting.value.multiTab){
      defaultStyle.marginTop= `${layoutSetting.value.headerHeight}px`
    }
  }
  return defaultStyle
})
</script>
<style>
.trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger:hover {
  color: #1890ff;
}

.site-layout .site-layout-background {
  background: #fff;
}
</style>

