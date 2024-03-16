<script setup lang="ts">
import {computed} from "vue";
import {LayoutType} from "@/layout/types.ts";
import {SelectValue} from "ant-design-vue/es/select";

const props = defineProps<{
  layout?: LayoutType
  header?: boolean
  footer?: boolean
  menu?: boolean
  showLogo?: boolean
  multiTab?: boolean
  multiTabFixed?: boolean
  animationNameList?: any[]
  animationName?: string
}>()

const emit = defineEmits(['changeSetting'])
const list = computed(() => ([
  // {
  //   title: '顶栏',
  //   key: 'header',
  //   disabled: false,
  //   disabledReason: '',
  // },
  {
    title: '动画',
    key: 'animationName',
    disabled: false,
    disabledReason: '',
  },
  {
    title: '页脚',
    key: 'footer',
    disabled: false,
    disabledReason: '',
  },
  {
    title: '菜单',
    key: 'menu',
    disabled: props.layout === 'top',
    disabledReason: '',
  },
  {
    title: '菜单头',
    key: 'showLogo',
    disabled: false,
    disabledReason: '',
  },
  {
    title: '多页签',
    key: 'multiTab',
    disabled: false,
    disabledReason: '',
  },
  {
    title: '固定多页签',
    key: 'multiTabFixed',
    disabled: false,
    disabledReason: '多页签开启后功能正常使用',
  },
]))
const handleChangeSetting = (key: string, value: any) => {
  emit('changeSetting', key, value)
}
</script>

<template>
  <a-list :data-source="list" :split="false">
    <template #renderItem="{ item }">
      <a-tooltip :title="item.disabled ? item.disabledReason : ''" placement="left">
        <a-list-item>
          <template #actions>
            <a-switch
                v-if="item.key !== 'animationName'"
                size="small"
                :checked="(props as any)[item.key]"
                :disabled="item.disabled"
                @update:checked="(e:boolean) => handleChangeSetting(item.key, e)"
            />
            <a-select
                v-else style="width: 120px;"
                :value="animationName"
                :options="animationNameList" size="small"
                @update:value="(e:SelectValue) => handleChangeSetting(item.key, e)"
            />
          </template>
          <span :style="{ opacity: item.disabled ? '0.5' : '1' }">
            {{ item.title }}
          </span>
        </a-list-item>
      </a-tooltip>
    </template>
  </a-list>
</template>
