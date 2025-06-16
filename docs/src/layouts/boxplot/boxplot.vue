<template>
  <div class="boxplot-chart">
    <svg ref="chartSvg"></svg>
    <div class="legend">
      <div class="legend-item">
        <div class="legend-color current-year"></div>
        <span>Current Year</span>
      </div>
      <div class="legend-item">
        <div class="legend-color other-year"></div>
        <span>Other Years</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue';
import { adaptGeojsonForBoxplot, computeMultiBoxplotStats } from '@/utils/boxplotStats';
import { useYearStore } from '@/stores/yearStore';
import { storeToRefs } from 'pinia';
import { data } from '@/loaders/usa2014_2024.data.js';

import { drawBoxplot } from './svg';

const yearStore = useYearStore();
const { currentYear } = storeToRefs(yearStore);
const chartSvg = ref(null);

const statsArray = computed(() => {
  const columnData = adaptGeojsonForBoxplot(data.features, {
    columns: { startYear: 2014, endYear: 2024 },
  });
  if (!columnData) return null;
  return computeMultiBoxplotStats(columnData, {
    whiskerMultiplier: 1.5,
    epsilon: 1e-10,
    showOutliers: false
  });
});

watchEffect(() => {
  if (statsArray.value && chartSvg.value) {
    drawBoxplot(chartSvg.value, statsArray.value, currentYear.value);
  }
});
</script>

<style scoped>
.boxplot-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem;
  background-color: var(--vp-c-bg);
  width: 100%;
  max-width: 600px; /* 添加最大宽度以控制整体大小 */
}
.legend {
  display: flex;
  gap: 1rem;
  margin-top: 0.4rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8em;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  border: 1px solid #6b7280;
}

.legend-color.current-year {
  background-color: #f97316;
  border-color: #c2410c;
}

.legend-color.other-year {
  background-color: #d1d5db;
  border-color: #6b7280;
}

svg {
  width: 100%;
  height: auto;
  border: 1px solid var(--vp-c-divider);
}
</style>