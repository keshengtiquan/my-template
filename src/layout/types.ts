
export type LayoutType = 'mix' | 'side' | 'top'

export type ThemeType = 'light' | 'dark' | 'inverted'

export type ContentWidth = 'Fluid' | 'Fixed'

export interface LayoutSetting {
  title?: string
  logo?: string
  theme: ThemeType
  collapsed: boolean
  drawerVisible: boolean
  colorPrimary?: string
  layout?: LayoutType
  contentWidth?: ContentWidth
  fixedHeader?: boolean
  fixedSider?: boolean
  showLogo?: boolean
  splitMenus?: boolean
  header?: boolean
  footer?: boolean
  menu?: boolean
  menuHeader?: boolean
  colorWeak?: boolean
  multiTab?: boolean
  multiTabFixed?: boolean
  headerHeight?: number
  copyright?: string
  keepAlive?: boolean
  leftCollapsed? :boolean
  accordionMode?: boolean
  animationName?: AnimationNameValueType
}
export const animationNameList = [
  {
    label: 'None',
    value: 'none',
  },
  {
    label: 'Fadein Up',
    value: 'slide-fadein-up',
  },
  {
    label: 'Fadein Right',
    value: 'slide-fadein-right',
  },
  {
    label: 'Zoom Fadein',
    value: 'zoom-fadein',
  },
  {
    label: 'Fadein',
    value: 'fadein',
  },
]
export type AnimationNameValueType = 'none' | 'slide-fadein-up' | 'slide-fadein-right' | 'zoom-fadein' | 'fadein'