<template>
  <div class="slider-container">
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

<script setup>
import { ref, watch, onUnmounted } from 'vue';
import { useYearStore } from '@/stores/yearStore';
import { storeToRefs } from 'pinia';

const emit = defineEmits(['year-change']);
const yearStore = useYearStore();
const { currentYear } = storeToRefs(yearStore);

const isPlaying = ref(false);
let playInterval = null;

const handleYearChange = (year) => {
  emit('year-change', year);
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