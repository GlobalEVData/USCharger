<template>
  <div class="color-band-selector">
    <el-select v-model="selectedScheme" :disabled="isDisabled" placeholder="选择色带" style="width: 100%"
      @change="handleSchemeChange">
      <template #prefix>
        <div class="selected-preview" :style="{ background: getSelectedPreviewBackground() }"></div>
      </template>
      <el-option-group v-for="group in colorSchemeGroups" :key="group.label" :label="group.label">
        <el-option v-for="scheme in group.options" :key="scheme.value" :label="scheme.label" :value="scheme.value">
          <div style="display: flex; align-items: center; width: 100%">
            <span style="flex: 1">{{ scheme.label }}</span>
            <div class="color-band-preview" :style="{
              background: getPreviewBackground(scheme),
              height: '20px',
              width: '120px',
              borderRadius: '4px',
            }"></div>
          </div>
        </el-option>
      </el-option-group>
    </el-select>

    <div class="color-band-controls" v-if="showControls">
      <el-checkbox v-model="isReverse" @change="updateColorBand" :disabled="isDisabled">
        reverse
      </el-checkbox>
      <el-button size="small" type="primary" plain @click="emitColor" style="margin-left: 10px" :disabled="isDisabled">
        Apply
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useColorBand } from '@/composables/useColorBand.js'
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
})

const emit = defineEmits(['update:modelValue', 'change'])

// 初始化 composable
const {
  selectedScheme,
  isReverse,
  currentColorBand,
  domain,
  colorSchemeGroups,
  currentSchemeConfig, // 添加缺失的解构
  getPreviewBackground,
  getSelectedPreviewBackground,
  setDomain,
  setScheme, // 添加缺失的解构
  updateColorBand,
  toggleReverse,
} = useColorBand(props.initialScheme, props.domain)

const isDisabled = computed(() => props.disabled)

// 监听 props.domain 变化
watch(
  () => props.domain,
  (newDomain) => {
    setDomain(newDomain)
  },
  { immediate: true }
)

// 发射色带函数
const emitColor = () => {
  emit('update:modelValue', currentColorBand.value) // 使用 .value
  emit('change', {
    colorBand: currentColorBand.value,
    scheme: selectedScheme.value,
    isReverse: isReverse.value,
    type: currentSchemeConfig.value.type,
  })

  store.currentColorBand = currentColorBand;
  store.getSelectedPreviewBackground = getSelectedPreviewBackground;
}

// 处理色带变更
const handleSchemeChange = () => {
  updateColorBand()
  if (props.immediate) {
    emitColor()
  }
}

// 初始化
onMounted(() => {
  if (props.initialScheme) {
    setScheme(props.initialScheme) // 恢复初始方案设置
  }
  if (props.immediate) {
    emitColor()
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