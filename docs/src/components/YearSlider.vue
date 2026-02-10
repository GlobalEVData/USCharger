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
      class="play-btn"
      @click="togglePlay"
      size="large"
      circle
    >
      <el-icon :size="32">
      <component :is="isPlaying ? 'VideoPause' : 'VideoPlay'" />
      </el-icon>
    </el-button>
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
/* 容器样式 */
.slider-container {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 30px;
  margin: 12px 0;
}

.slider-wrapper {
  flex: 1;
}

/* 按钮样式 */
.play-btn {
  color: var(--vp-c-brand-2); /* 绿色主题色 */
  opacity: 0.3;
}

/* 覆盖 Element Plus 滑块样式 */
:deep(.custom-slider) {
  height: 40px;
}

/* 滑块轨道 */
:deep(.el-slider__runway) {
  height: 8px;
  border-radius: 4px;
  background-color: rgba(128, 128, 128, 0.171); /* 灰色轨道 */
  transition: background-color 0.3s ease;
}

/* 滑块填充 */
:deep(.el-slider__bar) {
  height: 8px;
  background-color: var(--vp-c-brand-2); /* 绿色主题色 */
  border-radius: 4px;
  transition: width 0.3s ease;
  opacity: 0.3;
}

/* 滑块手柄 */
:deep(.el-slider__button-wrapper) {
  top: -16px;
}

:deep(.el-slider__button) {
  width: 20px;
  height: 20px;
  background-color: var(--vp-c-brand-2); /* 绿色主题色 */
  border: 2px solid var(--vp-c-brand-3); /* 绿色主题色 */
}

</style>