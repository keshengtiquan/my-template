import {defineStore} from 'pinia'
import {LayoutSetting, LayoutType, ThemeType} from "@/layout/types.ts";
import {theme as antdTheme} from 'ant-design-vue/es'
import type { ThemeConfig } from 'ant-design-vue/es/config-provider/context'
import {reactive} from "vue";
import defaultSetting from '@/config/default-setting.ts'
import {isDark, toggleDark} from "@/composables/theme.ts";

const useAppStore = defineStore('app', () => {
  const layoutSetting = reactive<LayoutSetting>(defaultSetting)
  const themeConfig = reactive<ThemeConfig>({
    algorithm: antdTheme.defaultAlgorithm,
    token: {
      colorBgContainer: '#fff',
      colorPrimary: layoutSetting.colorPrimary,
    },
    components: {},
  })
  
  const toggleTheme = (theme: ThemeType) => {
    if (layoutSetting.theme === theme)
      return
    
    layoutSetting.theme = theme
    if (theme === 'light' || theme === 'inverted') {
      if (themeConfig.token)
        themeConfig.token.colorBgContainer = '#fff'
      if (themeConfig.components?.Menu)
        delete themeConfig.components.Menu
      
      themeConfig.algorithm = antdTheme.defaultAlgorithm
      
      toggleDark(false)
    }
    else if (theme === 'dark') {
      toggleDark(true)
      if (themeConfig.token)
        themeConfig.token.colorBgContainer = 'rgb(36, 37, 37)'
      if (themeConfig.components) {
        themeConfig.components = {
          ...themeConfig.components,
          Menu: {
            colorItemBg: 'rgb(36, 37, 37)',
            colorSubItemBg: 'rgb(36, 37, 37)',
            menuSubMenuBg: 'rgb(36, 37, 37)',
          } as any,
        }
      }
      themeConfig.algorithm = antdTheme.darkAlgorithm
    }
  }
  
  const toggleDrawerVisible = (visible: boolean) => {
    layoutSetting.drawerVisible = visible
  }
  
  const toggleColorPrimary = (color: string) => {
    layoutSetting.colorPrimary = color
    if (themeConfig.token)
      themeConfig.token.colorPrimary = color
  }
  
  // 如果加载进来是暗色模式，就切换到暗色模式
  if (isDark.value)
    toggleTheme('dark')
  
  const toggleCollapsed = (collapsed: boolean) => {
    layoutSetting.collapsed = collapsed
  }
  
  const toggleLayout = (layout: LayoutType) => {
    if (layoutSetting.theme === 'inverted' && layout === 'mix')
      layoutSetting.theme = 'light'
    
    if (layout !== 'mix')
      layoutSetting.splitMenus = false
    
    if (layout === 'top')
      layoutSetting.contentWidth = 'Fixed'
    else
      layoutSetting.contentWidth = 'Fluid'
    
    layoutSetting.layout = layout
  }
  
  const changeSettingLayout = (key: keyof LayoutSetting, value: any) => {
    if (key === 'theme'){
      toggleTheme(value as ThemeType)
    } else if (key === 'colorPrimary'){
      toggleColorPrimary(value)
    } else if (key === 'layout'){
      toggleLayout(value as LayoutType)
    } else if (key in layoutSetting){
      console.log(87);
      (layoutSetting as any)[key] = value
    }
    
  }
  
  const toggleCollapse = () => {
    layoutSetting.collapsed = !layoutSetting.collapsed
  }
  
  return {
    toggleCollapse,
    layoutSetting,
    theme: themeConfig,
    toggleTheme,
    toggleCollapsed,
    toggleDrawerVisible,
    changeSettingLayout,
    toggleColorPrimary,
  }
  
})

export default useAppStore
