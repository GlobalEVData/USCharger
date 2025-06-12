<template>
  <BaseLayerCard :layer="layer" @toggle-expand="$emit('toggle-expand', $event)"
    @toggle-visibility="$emit('toggle-visibility', $event)">
    <template #custom-controls>
      <ColorBandSelector :disabled="!layer.visible" @change="handleColorBandChange" />
    </template>
  </BaseLayerCard>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import BaseLayerCard from './LayerCard.vue';
import ColorBandSelector from '@/components/ColorBand.vue';
import * as d3 from 'd3';

const props = defineProps({
  layer: {
    type: Object,
    required: true
  }
});

const { layer } = props;

const handleColorBandChange = (payload) => {
  // console.log('色带变更:', payload.colorBand(0.25));

  const column = "Year2024";

  const features = layer.data.features;
  // 创建Year2014列的归一化器
  const normalizeYear2014 = createNormalizer(features, column, { mode: 'log', boundaryEpsilon: 1e-4 });

  layer.getFillColor = (d) => {
    // 根据数据属性动态设置填充颜色
    const value = d.properties[column]; // 假设数据中有一个属性叫 value
    const normalizedValue = normalizeYear2014(value);
    const hexColor = payload.colorBand(normalizedValue);
    const res = hexToRgbaArray(hexColor);

    // if(d.properties.NAME_2 === "Baldwin") {
    //   console.log('Baldwin归一化值:', normalizedValue, '颜色:', res, '16进制:', hexColor);
    // }

    return res;
  }

};

defineEmits(['toggle-expand', 'toggle-visibility']);


/**
 * 创建数值归一化映射函数，支持多种拉伸模式
 * @param {Array} data - GeoJSON的features数组
 * @param {string} column - 要归一化的属性列名（如"Year2014"）
 * @param {Object} [options] - 配置选项
 * @param {string} [options.mode='linear'] - 拉伸模式：'linear'（线性）、'log'（对数）、'sqrt'（平方根）、'exp'（指数）、'arctan'（反正切）
 * @param {number} [options.epsilon=1e-10] - 对数模式下避免log(0)的微小偏移量
 * @param {number} [options.boundaryEpsilon=1e-5] - 边界扰动，防止归一化值达到0或1
 * @param {number} [options.expBase=2] - 指数模式下的底数
 * @returns {Function} - 接收原始值返回0-1之间的归一化值的函数
 */
function createNormalizer(data, column, options = {}) {
  // 默认配置
  const {
    mode = 'linear', // 默认线性拉伸
    epsilon = 1e-10, // 对数模式下避免log(0)
    boundaryEpsilon = 1e-5, // 边界扰动
    expBase = 2 // 指数模式底数
  } = options;

  // 验证输入
  if (!Array.isArray(data) || !column || typeof column !== 'string') {
    return () => NaN;
  }

  // 验证拉伸模式
  const validModes = ['linear', 'log', 'sqrt', 'exp', 'arctan'];
  let selectedMode = mode;
  if (!validModes.includes(mode)) {
    console.warn(`Invalid mode: ${mode}. Falling back to 'linear'.`);
    selectedMode = 'linear';
  }

  // 验证boundaryEpsilon
  if (typeof boundaryEpsilon !== 'number' || boundaryEpsilon <= 0 || boundaryEpsilon >= 0.5) {
    console.warn(`Invalid boundaryEpsilon: ${boundaryEpsilon}. Using default 1e-5.`);
    boundaryEpsilon = 1e-5;
  }

  // 第一阶段：计算最小最大值
  let min = Infinity;
  let max = -Infinity;
  let hasValidValue = false;

  for (const feature of data) {
    if (!feature?.properties) continue;
    
    const value = feature.properties[column];
    if (typeof value === 'number' && !isNaN(value) && value !== null) {
      min = Math.min(min, value);
      max = Math.max(max, value);
      hasValidValue = true;
    }
  }

  // 处理无有效数值
  if (!hasValidValue) {
    return () => NaN;
  }

  // 处理所有值相同的情况
  if (min === max) {
    return () => 0.5; // 中间值不受boundaryEpsilon影响
  }

  // 对数、平方根、指数模式需要正值域
  if (['log', 'sqrt', 'exp'].includes(selectedMode)) {
    if (min < 0) {
      console.warn(`Negative values detected (min: ${min}). Shifting data to positive range for ${selectedMode} mode.`);
      const shift = -min + epsilon;
      min += shift;
      max += shift;
    } else if (min === 0 && selectedMode === 'log') {
      min = epsilon; // 避免log(0)
    }
  }

  const range = max - min;

  // 第二阶段：返回归一化函数
  return function normalize(value) {
    if (typeof value !== 'number' || isNaN(value) || value === null) {
      return NaN;
    }

    let normalized;
    switch (selectedMode) {
      case 'linear':
        normalized = (value - min) / range;
        break;
      case 'log':
        // 对数拉伸：log(value + ε) / log(max + ε)
        normalized = Math.log(value - min + epsilon) / Math.log(max - min + epsilon);
        break;
      case 'sqrt':
        // 平方根拉伸：sqrt(value - min) / sqrt(max - min)
        normalized = Math.sqrt(value - min) / Math.sqrt(max - min);
        break;
      case 'exp':
        // 指数拉伸：(base^(value - min) - 1) / (base^(max - min) - 1)
        normalized = (Math.pow(expBase, value - min) - 1) / (Math.pow(expBase, max - min) - 1);
        break;
      case 'arctan':
        // 反正切拉伸：arctan(value - min) / arctan(max - min)
        normalized = Math.atan(value - min) / Math.atan(max - min);
        break;
      default:
        normalized = (value - min) / range; // 兜底线性拉伸
    }

    // 应用边界扰动：映射到[boundaryEpsilon, 1 - boundaryEpsilon]
    const clamped = Math.max(0, Math.min(1, normalized));
    return boundaryEpsilon + (1 - 2 * boundaryEpsilon) * clamped;
  };
}

function hexToRgbaArray(hex) {
  const color = d3.color(hex);
  return color ? [color.r, color.g, color.b] : null;
}

</script>