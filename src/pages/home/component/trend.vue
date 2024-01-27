<script setup lang="ts">
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons-vue'

defineProps({
  flag: {
    type: String,
    default: undefined,
  },
  children: {
    type: String,
    default: undefined,
  },
})
</script>

<template>
  <div
      :title="children"
      class="trendItem"
  >
    <slot />
    <span :class="flag">
      <CaretUpOutlined  v-if="flag === 'up'" />
      <CaretDownOutlined  v-else />
    </span>
  </div>
</template>

<style scoped lang="scss">
.trendItem {
  display: inline-block;
  font-size: 14px;
  line-height: 22px;

  .up,
  .down {
    position: relative;
    top: 1px;
    margin-left: 4px;
    span {
      font-size: 16px;
    }
  }
  .up {
    color: #f5222d;
  }
  .down {
    top: 1px;
    color: var(--text-color-1);
  }

  &.trendItemGrey .up,
  &.trendItemGrey .down {
    color: var(--text-color);
  }

  &.reverseColor .up {
    color: #52c41a;
  }
  &.reverseColor .down {
    color: #f5222d;
  }
}
</style>
