<template>
  <div class="slider-container">
    <div class="slider-wrapper">
      <el-slider
        v-model="currentYear"
        :min="2014"
        :max="2024"
        :step="1"
        :show-stops="false"
        :show-tooltip="true"
        @change="handleYearChange"
        class="custom-slider"
      />
    </div>
    <el-button
      :icon="isPlaying ? 'VideoPause' : 'VideoPlay'"
      class="play-btn"
      @click="togglePlay"
      circle
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
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: 8px;
  margin: 16px 0;
}

.slider-wrapper {
  flex: 1;
}

.play-btn {
  width: 24px;
  height: 24px;
  border: none;
}


:deep(.el-slider__stop) {
  display: none;
}

:deep(.el-slider__marks-text) {
  display: none;
}
</style>