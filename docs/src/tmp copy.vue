<template>
  <div class="color-band-selector">
    <el-select
      v-model="store.selectedScheme"
      :disabled="isDisabled"
      placeholder="选择色带"
      style="width: 100%"
      @change="handleSchemeChange"
    >
      <template #prefix>
        <div
          class="selected-preview"
          :style="{ background: store.getSelectedPreviewBackground() }"
        ></div>
      </template>
      <el-option-group
        v-for="group in store.colorSchemeGroups"
        :key="group.label"
        :label="group.label"
      >
        <el-option
          v-for="scheme in group.options"
          :key="scheme.value"
          :label="scheme.label"
          :value="scheme.value"
        >
          <div style="display: flex; align-items: center; width: 100%">
            <span style="flex: 1">{{ scheme.label }}</span>
            <div
              class="color-band-preview"
              :style="{
                background: store.getPreviewBackground(scheme),
                height: '20px',
                width: '120px',
                borderRadius: '4px',
              }"
            ></div>
          </div>
        </el-option>
      </el-option-group>
    </el-select>

    <div class="color-band-controls" v-if="showControls">
    <el-checkbox
      v-model="store.isReverse"
      @change="store.updateColorBand"
      :disabled="isDisabled"
    >
      reverse
    </el-checkbox>
      <el-button
        size="small"
        type="primary"
        plain
        @click="emitColorBand"
        style="margin-left: 10px"
        :disabled="isDisabled"
      >
        Apply
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useColorBandStore } from '@/stores/colorBandStore'

const store = useColorBandStore()

const props = defineProps({
  modelValue: {
    type: Function,
    default: null,
  },
  initialScheme: {
    type: String,
    default: 'viridis',
  },
  showControls: {
    type: Boolean,
    default: true,
  },
  immediate: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  domain: {
    type: Array,
    default: () => [0, 1],
  },
  // 预定义色带，从外界传入，为色带名称
  
  
})

const emit = defineEmits(['update:modelValue', 'change'])

const isDisabled = computed(() => props.disabled)

// 监听props.domain变化
watch(() => props.domain, (newDomain) => {
  store.setDomain(newDomain)
}, { immediate: true })

/**
 * 发射色带函数
 */
const emitColorBand = () => {
  emit('update:modelValue', store.currentColorBand)
  emit('change', {
    colorBand: store.currentColorBand,
    scheme: store.selectedScheme,
    isReverse: store.isReverse,
    type: store.currentSchemeConfig.type,
  })
}

/**
 * 处理色带变更
 */
const handleSchemeChange = () => {
  store.updateColorBand()
  if (props.immediate) {
    emitColorBand()
  }
}

// 初始化
onMounted(() => {
  if (props.initialScheme) {
    store.setScheme(props.initialScheme)
  }
  if (props.immediate) {
    emitColorBand()
  }
})
</script>

<style scoped>
.color-band-selector {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
  padding: 10px;
  border-radius: 8px;
}

.color-band-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
}

.selected-preview {
  width: 120px;
  height: 20px;
  border-radius: 4px;
  margin-right: 10px;
  border: 1px solid var(--vp-c-border);
}

.color-band-preview {
  border: 1px solid var(--vp-c-border);
}

/* 优化下拉选项样式 */
:deep(.el-select-dropdown__item) {
  padding: 0 10px;
  height: 36px;
}

:deep(.el-select-dropdown__item .color-band-preview) {
  margin-left: 10px;
}

:deep(.el-option-group__title) {
  padding: 0 10px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

/* 调整选择框内预览位置 */
:deep(.el-select .el-input__wrapper) {
  display: flex;
  align-items: center;
}

:deep(.el-select .el-input__prefix) {
  display: flex;
  align-items: center;
}
</style>