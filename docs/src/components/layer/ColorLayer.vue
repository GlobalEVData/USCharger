<template>
  <BaseLayerCard :layer="layer" @toggle-expand="$emit('toggle-expand', $event)"
    @toggle-visibility="$emit('toggle-visibility', $event)">
    <template #custom-controls>
      <ColorBandSelector :disabled="!layer.visible" @change="handleColorBandChange" initialScheme="ylorrd"/>
    </template>
  </BaseLayerCard>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import BaseLayerCard from './LayerCard.vue';
import ColorBandSelector from '@/components/ColorBand.vue';

import { createNormalizer } from '@/utils/normalizer';
import { hexToRgbaArray } from '@/utils/color';


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

    return res;
  }

};

defineEmits(['toggle-expand', 'toggle-visibility']);
</script>