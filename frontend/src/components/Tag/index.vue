<script setup lang="ts">
interface Props {
  color?: 'cyan' | 'green' | 'red' | 'default' | 'primary'
  size?: 'small' | 'default'
}

withDefaults(defineProps<Props>(), {
  color: 'default',
})
</script>

<template>
  <div
    :class="[color, size]"
    class="gui-tag px-8 mx-4 rounded-6 inline-block text-12 white-space-nowrap"
  >
    <slot></slot>
  </div>
</template>

<style lang="less" scoped>
.cyan {
  color: #22a3a7;
  background-color: #e6fffb;
  border: 1px solid #22a3a7;
}
.green {
  color: #389e0d;
  background-color: #f6ffed;
  border: 1px solid #389e0d;
}
.red {
  color: #d52e3b;
  background-color: #fff1f0;
  border: 1px solid #d52e3b;
}
.default {
  color: #3d3d3d;
  background-color: #ffffff;
  border: 1px solid #898989;
}
.primary {
  color: var(--btn-primary-color);
  background-color: var(--primary-color);
  border: 1px solid var(--secondary-color);
}

.small {
  padding: 0 4px;
  margin: 0 2px;
  font-size: 10px;
}
</style>
