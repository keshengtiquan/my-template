<script setup lang="ts">
import {SettingOutlined} from "@ant-design/icons-vue";
import {ContentWidth, LayoutType, ThemeType} from "@/layout/types.ts";
import Body from './body.vue'
import BlockCheckbox from './block-checkbox.vue'
import ThemeColor from './theme-color.vue'
import LayoutSetting from './layout-setting.vue'
import RegionalSetting from './regional-setting.vue'
import {shallowRef} from "vue";


const props = withDefaults(defineProps<{
  open?: boolean
  theme?: ThemeType
  colorPrimary?: string
  colorList?: ({ key: string; color: string })[]
  layout?: LayoutType
  contentWidth?: ContentWidth
  fixedHeader?: boolean
  fixedSider?: boolean
  splitMenus?: boolean
  header?: boolean
  footer?: boolean
  menu?: boolean
  showLogo?: boolean
  colorWeak?: boolean
  multiTab?: boolean
  multiTabFixed?: boolean
  keepAlive?: boolean
  leftCollapsed?: boolean
  animationName?: string
  animationNameList?: any[]
  accordionMode?: boolean
}>(), {
  theme: 'light',
  colorList: () => [
    {key: 'techBlue', color: '#1677FF'},
    {key: 'daybreak', color: '#1890ff'},
    {key: 'dust', color: '#F5222D'},
    {key: 'volcano', color: '#FA541C'},
    {key: 'sunset', color: '#FAAD14'},
    {key: 'cyan', color: '#13C2C2'},
    {key: 'green', color: '#52C41A'},
    {key: 'geekblue', color: '#2F54EB'},
    {key: 'purple', color: '#722ED1'},
  ],
})
const prefixCls = shallowRef('ant-pro-drawer-setting')
const emit = defineEmits(['update:open', 'settingChange'])
const handleVisible = (open: boolean) => {
  emit('update:open', open)
}
//改主题
const changeTheme = (theme: ThemeType) => {
  emit('settingChange', 'theme', theme)
}
//改主题颜色
const changeColor = (color: string) => {
  emit('settingChange', 'colorPrimary', color)
}
//改布局
const changeLayout = (layout: string) => {
  emit('settingChange', 'layout', layout)
}
const changeSettingLayout = (key: string, value: any) => {
  console.log(key, value)
  emit('settingChange', key, value)
}
</script>
<template>
  <div hover="bg-[var(--hover-color)]" h-48px px-12px cursor-pointer @click="handleVisible(!open)">
    <SettingOutlined/>
  </div>
  <a-drawer
      :open="open"
      :width="300"
      placement="right"
      :closable="false"
      @update:open="handleVisible"
  >
    <div :class="`${prefixCls}-content`">
      <Body title="整体风格设计">
      <div class="ant-pro-drawer-setting-block-checkbox">
        <BlockCheckbox :checked="props.theme === 'light'" theme="light" :is-dark="props.theme === 'dark'"
                       @click="changeTheme('light')"/>
        <BlockCheckbox v-if="layout !== 'mix'" :checked="props.theme === 'inverted'" theme="inverted"
                       :is-dark="props.theme === 'dark'" @click="changeTheme('inverted')"/>
        <BlockCheckbox :checked="props.theme === 'dark'" theme="dark" :is-dark="props.theme === 'dark'"
                       @click="changeTheme('dark')"/>
      </div>
      </Body>
      <Body title="主题色">
      <ThemeColor :color-list="colorList" :color="colorPrimary" @change="changeColor"/>
      </Body>
      <a-divider/>
      <Body title="导航模式">
      <div :class="`${prefixCls}-block-checkbox`">
        <BlockCheckbox theme="side" :checked="layout === 'side'" :is-dark="props.theme === 'dark'"
                       @click="changeLayout('side')"/>
        <BlockCheckbox theme="top" :checked="layout === 'top'" :is-dark="props.theme === 'dark'"
                       @click="changeLayout('top')"/>
        <BlockCheckbox theme="mix" :checked="layout === 'mix'" :is-dark="props.theme === 'dark'"
                       @click="changeLayout('mix')"/>
      </div>
      </Body>
      <LayoutSetting
          :layout="layout"
          :fixed-header="fixedHeader"
          :menu="menu"
          :content-width="contentWidth"
          :split-menus="splitMenus"
          :keepAlive="keepAlive"
          :leftCollapsed="leftCollapsed"
          :accordionMode="accordionMode"
          @change-setting="changeSettingLayout"
      />
      <a-divider />
      <Body title="内容区域">
      <RegionalSetting
          :layout="layout"
          :header="header"
          :showLogo="showLogo"
          :footer="footer"
          :multi-tab="multiTab"
          :multi-tab-fixed="multiTabFixed"
          :animation-name="animationName"
          :animation-name-list="animationNameList"
          :menu="menu"
          @change-setting="changeSettingLayout"
      />
      </Body>
    </div>
  </a-drawer>
</template>
<style lang="scss">
.ant-pro-drawer-setting-handle {
  position: fixed;
  inset-block-start: 240px;
  inset-inline-end: 0px;
  z-index: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  font-size: 16px;
  text-align: center;
  -webkit-backdropilter: saturate(180%) blur(20px);
  backdrop-filter: saturate(180%) blur(20px);
  cursor: pointer;
  pointer-events: auto;

  &-icon {
    color: #fff;
  }

  &-icon-dark {
    color: #e5e0d8
  }
}


.ant-pro-drawer-setting-block-checkbox {
  display: flex;
  min-height: 42px;


  &-selectIcon {
    position: absolute !important;
    right: 6px !important;
    bottom: 4px !important;
    font-weight: 700 !important;
    font-size: 14px !important;
    pointer-events: none !important;
  }

  &-item {
    position: relative;
    width: 44px;
    height: 36px;
    margin-right: 16px;
    overflow: hidden;
    background-color: #f0f2f5;
    border-radius: 4px;
    box-shadow: 0 1px 2.5px 0 rgba(0, 0, 0, .18);
    cursor: pointer;

    &::before {
      position: absolute;
      top: 0;
      left: 0;
      width: 33%;
      height: 100%;
      background-color: #fff;
      content: "";
    }

    &::after {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 25%;
      background-color: #fff;
      content: ""
    }

    &-dark {
      background-color: rgba(0, 21, 41, .85);

      &::before {
        background-color: rgba(0, 21, 41, .65);
        content: "";
      }

      &::after {
        background-color: rgba(0, 21, 41, .85);
      }
    }

    &-light {
      &::before {
        background-color: #fff;
        content: "";
      }

      &::after {
        background-color: #fff
      }
    }

    &-inverted::before, &-side::before {
      z-index: 1;
      background-color: #001529;
      content: ""
    }

    &-inverted::after, &-side::after {
      background-color: #fff
    }

    &-top::before {
      background-color: transparent;
      content: ""
    }

    &-top::after {
      background-color: #001529;
    }

    &-mix::before {
      background-color: #fff;
      content: ""
    }

    &-mix::after {
      background-color: #001529;
    }

  }

  &-theme-item {
    background: rgb(42, 44, 44);
    box-shadow: rgba(13, 13, 13, 0.18) 0px 1px 2.5px 0px;

    &-light {
      &::before, &::after {
        background-color: rgb(36, 37, 37);
      }
    }

    &-dark {
      &::before, &::after {
        background-color: rgba(15, 28, 41, 0.65);
      }
    }

    &-side::before, &-inverted::before {
      background-color: rgb(15, 28, 41);
    }

    &-side::after, &-inverted::after {
      background-color: rgb(36, 37, 37);
    }

    &-mix::before {
      background-color: rgb(36, 37, 37);
    }

  }
}


.ant-pro-drawer-setting-theme-color {
  margin-top: 16px;
  overflow: hidden;

  &-block {
    float: left;
    width: 20px;
    height: 20px;
    margin-top: 8px;
    margin-right: 8px;
    font-weight: 700;
    display: flex;
    color: #fff;
    align-items: center;
    justify-content: center;
    border-radius: 2px;
    cursor: pointer
  }

}

.ant-pro-drawer-setting-content {
  .ant-list {
    &-item {
      padding-inline: 0;
      padding-block: 8px;
    }
  }
}

</style>