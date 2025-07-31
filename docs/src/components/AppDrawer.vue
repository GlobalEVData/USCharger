<template>
  <div class="attached-panel" :style="panelStyle" v-if="modelValue">
    <div class="panel-header">
      <slot name="header">
        <span class="panel-title">{{ title }}</span>
      </slot>
      <button 
        class="panel-close" 
        @click="close"
        aria-label="Close panel"
      >
        <svg viewBox="0 0 24 24" width="16" height="16">
          <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </button>
    </div>
    <div class="panel-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: 'Panel'
  },
  width: {
    type: String,
    default: '42%',
    validator: (value) => /^\d+(px|%|em|rem|vw)$/.test(value)
  },
  position: {
    type: String,
    default: 'bottom',
    validator: (value) => ['left', 'right', 'top', 'bottom'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue'])

const close = () => {
  emit('update:modelValue', false)
}

const panelStyle = computed(() => {
  const positionStyles = {
    right: { right: 0, top: 0, bottom: 0, width: props.width },
    left: { left: 0, top: 0, bottom: 0, width: props.width },
    top: { top: 0, left: 0, right: 0, height: props.width },
    bottom: { bottom: 0, left: 0, right: 0, height: props.width }
  }
  return positionStyles[props.position]
})
</script>

<style scoped>
.attached-panel {
  position: absolute;
  background: var(--vp-c-bg, #ffffff);
  border: 1px solid var(--vp-c-divider, #e5e7eb);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  z-index: 10;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--vp-c-divider, #e5e7eb);
}

.panel-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1, #333);
}

.panel-close {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: var(--vp-c-text-2, #666);
  transition: color 0.2s;
}

.panel-close:hover {
  color: var(--vp-c-brand, #409eff);
}

.panel-content {
  flex: 1;
  overflow: auto;
}
</style>