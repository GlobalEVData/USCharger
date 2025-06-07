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
  layer.getFillColor = [255, 0, 0, 255];
  layer.getLineColor = [0, 255, 0, 255];

  console.log('图层:', layer);
};  

defineEmits(['toggle-expand', 'toggle-visibility']);
</script>