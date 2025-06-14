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
      <div class="slider-container mt-2">
        <div class="slider-wrapper">
          <el-slider
            v-model="currentYear"
            :min="2014"
            :max="2024"
            :step="1"
            :show-stops="false"
            :show-tooltip="false"
            @change="handleYearChange"
          />
          
        </div>

        <div class="year-display">{{ currentYear }}</div>

        <el-button
          type="primary"
          :icon="isPlaying ? 'CircleClose' : 'CaretRight'"
          size="small"
          class="play-btn"
          @click="togglePlay"
          plain
        />
        
      </div>

      

    </template>
  </BaseLayerCard>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch, onUnmounted } from 'vue';
import BaseLayerCard from './LayerCard.vue';
import ColorBandSelector from '@/components/ColorBand.vue';
import { createNormalizer } from '@/utils/normalizer';
import { hexToRgbaArray } from '@/utils/color';

const props = defineProps({
  layer: {
    type: Object,
    required: true,
  },
});

const { layer } = props;
const emit = defineEmits(['toggle-expand', 'toggle-visibility']);

const currentYear = ref(2014);
const isPlaying = ref(false);
let playInterval = null;

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

const togglePlay = () => {
  isPlaying.value = !isPlaying.value;
  if (isPlaying.value) {
    playInterval = setInterval(() => {
      currentYear.value = currentYear.value >= 2024 ? 2014 : currentYear.value + 1;
    }, 1000);
  } else {
    clearInterval(playInterval);
  }
};

watch(currentYear, (newYear) => {
  handleYearChange(newYear);
});

onUnmounted(() => {
  if (playInterval) {
    clearInterval(playInterval);
  }
});
</script>

<style scoped>
.slider-container {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 8px;
}

.slider-wrapper {
  flex: 1;
  position: relative;
  padding-top: 8px;
}

.year-display {
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.play-btn {
  flex-shrink: 0;
  width: 32px;
}

:deep(.el-slider__stop) {
  display: none;
}

:deep(.el-slider__marks-text) {
  display: none;
}
</style>