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

const props = defineProps({
  layer: {
    type: Object,
    required: true
  }
});

const { layer } = props;

const handleColorBandChange = (payload) => {
  // console.log('色带变更:', payload.colorBand(0.25));
  // 生成随机颜色
  function getRandomColor() {
    return [
      Math.floor(Math.random() * 256), // R
      Math.floor(Math.random() * 256), // G
      Math.floor(Math.random() * 256), // B
      255 // A
    ];
  }

  layer.getFillColor = (d) => {
      // 根据数据属性动态设置填充颜色
      const value = d.properties.Year2014; // 假设数据中有一个属性叫 value
      if (value < 10) {
        return [255, 0, 0]; // 红色
      } else{
        return getRandomColor(); // 随机颜色
      }
    }

  console.log('图层:', layer);
};  

defineEmits(['toggle-expand', 'toggle-visibility']);


// function fillColor(d) {
//   // 根据数据属性动态设置填充颜色
//   return [255, 0, 0, 255]; // 红色
// }
</script>