<template>
  <div class="color-band-selector">
    <el-select
      v-model="selectedScheme"
      :disabled="isDisabled"
      placeholder="选择色带"
      style="width: 100%"
      @change="handleSchemeChange"
    >
      <template #prefix>
        <div
          class="selected-preview"
          :style="{ background: getSelectedPreviewBackground() }"
        ></div>
      </template>
      <el-option-group
        v-for="group in colorSchemeGroups"
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
                background: getPreviewBackground(scheme),
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
        v-model="isReverse"
        @change="updateColorBand"
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
import { ref, computed, onMounted } from 'vue';
import {
  createColorBand,
  colorSchemes,
  getPredefinedInterpolator,
  getPredefinedOrdinalScheme,
} from '@/composables/useColorBand.js';

const colorSchemeGroups = ref(colorSchemes);

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
});

const emit = defineEmits(['update:modelValue', 'change']);

const isDisabled = computed(() => props.disabled);

const selectedScheme = ref(props.initialScheme);
const isReverse = ref(false);
const currentColorBand = ref(props.modelValue);

const currentSchemeConfig = computed(() => {
  for (const group of colorSchemeGroups.value) {
    const found = group.options.find((s) => s.value === selectedScheme.value);
    if (found) return found;
  }
  return colorSchemeGroups.value[0].options[0];
});

/**
 * 生成色带预览背景
 */
const getPreviewBackground = (scheme) => {
  const type = scheme?.type || currentSchemeConfig.value.type;
  const isOrdinal = type === 'ordinal';

  if (isOrdinal) {
    const colors =
      typeof scheme.value === 'string'
        ? getPredefinedOrdinalScheme(scheme.value) || ['#cccccc']
        : scheme.value || ['#cccccc'];
    const finalColors = isReverse.value ? [...colors].reverse() : colors;
    return `linear-gradient(to right, ${finalColors.join(', ')})`;
  } else {
    const interpolator =
      getPredefinedInterpolator(scheme.value) || ((t) => '#cccccc');
    const steps = 10;
    const colorStops = Array.from({ length: steps }, (_, i) => {
      const t = isReverse.value ? 1 - i / (steps - 1) : i / (steps - 1);
      return interpolator(t);
    });
    return `linear-gradient(to right, ${colorStops.join(', ')})`;
  }
};

/**
 * 生成选择框中显示的预览背景
 */
const getSelectedPreviewBackground = () => {
  return getPreviewBackground(currentSchemeConfig.value);
};

/**
 * 更新色带函数
 */
const updateColorBand = () => {
  const config = currentSchemeConfig.value;

  currentColorBand.value = createColorBand({
    type: config.type,
    scheme: selectedScheme.value,
    domain: props.domain,
    isReverse: isReverse.value,
  });

  if (props.immediate) {
    emitColorBand();
  }
};

/**
 * 发射色带函数
 */
const emitColorBand = () => {
  emit('update:modelValue', currentColorBand.value);
  emit('change', {
    colorBand: currentColorBand.value,
    scheme: selectedScheme.value,
    isReverse: isReverse.value,
    type: currentSchemeConfig.value.type,
  });
};

/**
 * 处理色带变更
 */
const handleSchemeChange = () => {
  updateColorBand();
};

// 初始化
onMounted(() => {
  updateColorBand();
  if (props.immediate) {
    emitColorBand();
  }
});
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