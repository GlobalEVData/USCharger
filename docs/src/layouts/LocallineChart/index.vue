<template>
  <div class="line-chart">
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
      <div class="legend-item">
        <div class="legend-color total"></div>
        <span>Total</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue';
import { useYearStore } from '@/stores/yearStore';
import { storeToRefs } from 'pinia';
import { useMapStore } from '@/stores/mapStore';
import { drawLineChart } from './svg';

const yearStore = useYearStore();
const { currentYear } = storeToRefs(yearStore);
const chartSvg = ref(null);

const mapStore = useMapStore();
const selectedRegion = computed(() => mapStore.selectedRegion);

// Process selected region data into a format suitable for the line chart
const stackedData = computed(() => {
  if (!selectedRegion.value || !selectedRegion.value) {
    return [];
  }

  const properties = selectedRegion.value;
  const years = Array.from({ length: 11 }, (_, i) => 2014 + i); // 2014 to 2024
  const data = years.map((year) => {
    const total = properties[`Year${year}`] || 0;
    const dc = properties[`Year${year}_dc`] || 0;
    const l1 = properties[`Year${year}_l1`] || 0;
    const l2 = properties[`Year${year}_l2`] || 0;

    // Calculate percentages, handle division by zero
    const totalNonZero = total > 0 ? total : 1; // Avoid division by zero
    return {
      year: year.toString(),
      dc: total > 0 ? dc / totalNonZero : 0,
      l1: total > 0 ? l1 / totalNonZero : 0,
      l2: total > 0 ? l2 / totalNonZero : 0,
      total: total > 0 ? 1 : 0, // Total is 100% if there are chargers, else 0
    };
  });

  return data;
});

const regionName = computed(() => {
  return selectedRegion.value?.NAME_2_x || 'Unknown Region';
});

watchEffect(() => {
  if (stackedData.value && chartSvg.value) {
    drawLineChart(chartSvg.value, stackedData.value, currentYear.value, regionName.value);
  }
});
</script>

<style scoped>
.line-chart {
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
.legend-color.total {
  background-color: #8B4513;
  border-color: #5c2f0d;
}
svg {
  width: 100%;
  height: auto;
  border: 1px solid var(--vp-c-divider);
}
</style>