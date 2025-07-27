<template>
  <teleport to="body">
    <div class="drawer-container" v-if="modelValue">
      <div class="drawer" :style="drawerStyle">
        <div class="drawer-header">
          <slot name="header">
            <span class="drawer-title">Drawer</span>
          </slot>
          <button class="close-button" @click="closeDrawer">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        <div class="drawer-content" :class="contentLayoutClass">
          <slot></slot>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  size: {
    type: String,
    default: '35%'
  },
  direction: {
    type: String,
    default: 'rtl',
    validator: (value) => ['rtl', 'ltr', 'ttb', 'btt'].includes(value)
  },
  flexDirection: {
    type: String,
    default: 'column',
    validator: (value) => ['row', 'column', 'row-reverse', 'column-reverse'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue'])

const closeDrawer = () => {
  emit('update:modelValue', false)
}

const drawerPosition = computed(() => {
  switch (props.direction) {
    case 'rtl':
      return { right: 0, top: 0, bottom: 0 }
    case 'ltr':
      return { left: 0, top: 0, bottom: 0 }
    case 'ttb':
      return { top: 0, left: 0, right: 0 }
    case 'btt':
      return { bottom: 0, left: 0, right: 0 }
    default:
      return { right: 0, top: 0, bottom: 0 }
  }
})

const drawerStyle = computed(() => {
  const isVertical = props.direction === 'ttb' || props.direction === 'btt'
  return {
    ...drawerPosition.value,
    [isVertical ? 'height' : 'width']: props.size,
    [isVertical ? 'width' : 'height']: 'auto'
  }
})

const contentLayoutClass = computed(() => {
  return {
    'flex-layout': true,
    [`flex-${props.flexDirection}`]: true,
    'is-vertical': props.direction === 'ttb' || props.direction === 'btt'
  }
})
</script>

<style scoped>
.drawer-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  pointer-events: none;
}

.drawer {
  position: fixed;
  background: var(--vp-c-bg);
  opacity: 0.9;
  border: 1px solid var(--vp-c-border);
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
  pointer-events: auto;
  transition: all 0.3s ease;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--vp-c-border);
}

.drawer-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.close-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--vp-c-text-2);
  transition: color 0.2s;
}

.close-button:hover {
  color: var(--vp-c-brand);
}

.drawer-content {
  overflow: auto;
  height: 100%;
}

/* 弹性布局基础样式 */
.flex-layout {
  display: flex;
  gap: 16px;
}

/* 弹性方向样式 */
.flex-row {
  flex-direction: row;
}
.flex-column {
  flex-direction: column;
}
.flex-row-reverse {
  flex-direction: row-reverse;
}
.flex-column-reverse {
  flex-direction: column-reverse;
}

/* 垂直方向抽屉的特殊样式 */
.flex-layout.is-vertical {
  flex-wrap: wrap;
}

/* 动态定位样式 */
.drawer {
  top: v-bind('drawerPosition.top');
  right: v-bind('drawerPosition.right');
  bottom: v-bind('drawerPosition.bottom');
  left: v-bind('drawerPosition.left');
}
</style>