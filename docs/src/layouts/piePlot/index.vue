<template>
  <div class="pie-chart-card">
    <h3 class="region-title">{{ regionName }}</h3>
    <svg ref="chartSvg"></svg>
    <!-- <div class="legend">
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
    </div> -->
  </div>
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue';
import { useYearStore } from '@/stores/yearStore';
import { storeToRefs } from 'pinia';
import { useMapStore } from '@/stores/mapStore';
import { drawPieChart } from './svg';

const yearStore = useYearStore();
const { currentYear } = storeToRefs(yearStore);

const mapStore = useMapStore();
const selectedRegion = computed(() => mapStore.selectedRegion);

const regionName = computed(() => {
  return  selectedRegion.value?.NAME_2_x || 'no region selected';
});

const pieData = computed(() => {
  if (!selectedRegion.value) {
    return [{ type: 'empty', value: 1 }]; // 空状态数据
  }
  const props = selectedRegion.value;
  const year = currentYear.value;
  const totalKey = `Year${year}`;
  const dcKey = `Year${year}_dc`;
  const l1Key = `Year${year}_l1`;
  const l2Key = `Year${year}_l2`;

  const total = Number(props[totalKey]) || 0;
  const dc = Number(props[dcKey]) || 0;
  const l1 = Number(props[l1Key]) || 0;
  const l2 = Number(props[l2Key]) || 0;

  // 检查数据是否有效（总量为 0 或所有类别为 0）
  if (total === 0 || (dc === 0 && l1 === 0 && l2 === 0)) {
    return [{ type: 'empty', value: 1 }]; // 空状态数据
  }

  const totalNonZero = total > 0 ? total : 1; // 防止除以零
  const data = [
    { type: 'dc', value: dc / totalNonZero },
    { type: 'l1', value: l1 / totalNonZero },
    { type: 'l2', value: l2 / totalNonZero },
  ].filter(d => d.value > 0); // 过滤掉占比为零的数据

  return data.length > 0 ? data : [{ type: 'empty', value: 1 }]; // 如果没有有效数据，返回空状态
});

const chartSvg = ref(null);

watchEffect(() => {
  if (chartSvg.value) {
    drawPieChart(chartSvg.value, pieData.value);
  }
});
</script>

<style scoped>
.pie-chart-card {
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem;
  background-color: var(--vp-c-bg);
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.region-title {
  font-size: 1.2em;
  font-weight: bold;
  color: var(--vp-c-text-1);
  text-align: center;
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
  background-color: #f97316;
  border-color: #c2410c;
}
.legend-color.l1 {
  background-color: #3b82f6;
  border-color: #1e40af;
}
.legend-color.l2 {
  background-color: #10b981;
  border-color: #047857;
}
.legend-color.empty {
  background-color: #d1d5db;
  border-color: #6b7280;
}
svg {
  width: 100%;
  height: 200px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
}
</style>