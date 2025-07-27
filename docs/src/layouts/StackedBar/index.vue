<template>
  <div class="stacked-bar-chart">
    <svg ref="chartSvg"></svg>
    <div class="legend">
      <div class="legend-item">
        <div class="legend-color dc"></div>
        <span>DC</span>
      </div>
      <div class="legend-item">
        <div class="legend-color l1"></div>
        <span>L1</span>
      </div>
      <div class="legend-item">
        <div class="legend-color l2"></div>
        <span>L2</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue';
import { computeStackedBarData } from '@/utils/boxplotStats.ts';
import { useYearStore } from '@/stores/yearStore';
import { storeToRefs } from 'pinia';
import { data } from '@/loaders/usa2014_2024.data.js';
import { drawStackedBar } from './svg';

const yearStore = useYearStore();
const { currentYear } = storeToRefs(yearStore);
const chartSvg = ref(null);

const stackedData = computed(() => {
  return computeStackedBarData(data.features, {
    columns: { startYear: 2014, endYear: 2024 },
  });
});

watchEffect(() => {
  if (stackedData.value && chartSvg.value) {
    drawStackedBar(chartSvg.value, stackedData.value, currentYear.value);
  }
});
</script>

<style scoped>
.stacked-bar-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem;
  background-color: var(--vp-c-bg);
  width: 100%;
  max-width: 600px;
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
/* .range(['teal', '#682487', '#84BA42', '#d1d5db']);#006d5b */
.legend-color.dc {
  background-color: #006d5b;
  border-color: #0cc26d;
}
.legend-color.l1 {
  background-color: #682487;
  border-color: #1e40af;
}
.legend-color.l2 {
  background-color: #84BA42;
  border-color: #047857;
}
svg {
  width: 100%;
  height: auto;
  border: 1px solid var(--vp-c-divider);
}
</style>