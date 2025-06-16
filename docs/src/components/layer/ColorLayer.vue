<template>
  <BaseLayerCard
    :layer="layer"
    @toggle-expand="$emit('toggle-expand', $event)"
    @toggle-visibility="$emit('toggle-visibility', $event)"
  >
    <template #custom-controls>
      <ColorBandSelector
        :disabled="!layer.visible"
        @change="handleColorBandChange"
        initialScheme="ylorrd"
        :immediate="true"
      />
      <YearSlider 
        class="mt-2"
        :initial-year="currentYear"
        @year-change="handleYearChange"
      />
    </template>
  </BaseLayerCard>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue';
import BaseLayerCard from './LayerCard.vue';
import ColorBandSelector from '@/components/ColorBand.vue';
import YearSlider from '@/components/YearSlider.vue';
import { createNormalizer } from '@/utils/normalizer';
import { hexToRgbaArray } from '@/utils/color';
import { useYearStore } from '@/stores/yearStore'
import { storeToRefs } from 'pinia'

const yearStore = useYearStore()
const { currentYear } = storeToRefs(yearStore)

const props = defineProps({
  layer: {
    type: Object,
    required: true,
  },
});

const { layer } = props;
const emit = defineEmits(['toggle-expand', 'toggle-visibility']);

const handleYearChange = (year) => {
  updateLayerColor(year);
};

const updateLayerColor = (year) => {
  const column = `Year${year}`;
  const features = layer.data.features;
  const normalize = createNormalizer(features, column, {
    mode: 'log',
    boundaryEpsilon: 1e-4,
  });

  layer.getFillColor = (d) => {
    const value = d.properties[column];
    const normalizedValue = normalize(value);
    const hexColor = layer.colorBand?.(normalizedValue) || '#ffffff';
    return hexToRgbaArray(hexColor);
  };
};

const handleColorBandChange = (payload) => {
  layer.colorBand = payload.colorBand;
  updateLayerColor(currentYear.value);
};

watch(currentYear, (newYear) => {
  handleYearChange(newYear);
});
</script>