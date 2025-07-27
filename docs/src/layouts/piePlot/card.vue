<template>
    <div class="chart-content">
        <slot></slot>
        <div v-if="showData" class="data-section">
            <el-statistic class="total-statistic" :value="totalValue" :precision="0" title="Total Value">
                <template #prefix>
                    <el-icon><data-line /></el-icon>
                </template>
            </el-statistic>
            <el-divider />
            <div class="detail-stats">
                <el-statistic class="detail-stat" :value="dcValue" :precision="0" title="DC">
                    <template #prefix>
                        <div class="stat-color dc"></div>
                    </template>
                </el-statistic>
                <el-statistic class="detail-stat" :value="l1Value" :precision="0" title="L1">
                    <template #prefix>
                        <div class="stat-color l1"></div>
                    </template>
                </el-statistic>
                <el-statistic class="detail-stat" :value="l2Value" :precision="0" title="L2">
                    <template #prefix>
                        <div class="stat-color l2"></div>
                    </template>
                </el-statistic>
            </div>
        </div>
        <div v-else class="empty-state">
            <el-empty description="No data available" :image-size="20" />
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useYearStore } from '@/stores/yearStore';
import { storeToRefs } from 'pinia';
import { useMapStore } from '@/stores/mapStore';

const yearStore = useYearStore();
const { currentYear } = storeToRefs(yearStore);

const mapStore = useMapStore();
const selectedRegion = computed(() => mapStore.selectedRegion);

const totalValue = computed(() => {
    if (!selectedRegion.value) return 0;
    const year = currentYear.value;
    const totalKey = `Year${year}`;
    return Number(selectedRegion.value[totalKey]) || 0;
});

const dcValue = computed(() => {
    if (!selectedRegion.value) return 0;
    const year = currentYear.value;
    const dcKey = `Year${year}_dc`;
    return Number(selectedRegion.value[dcKey]) || 0;
});

const l1Value = computed(() => {
    if (!selectedRegion.value) return 0;
    const year = currentYear.value;
    const l1Key = `Year${year}_l1`;
    return Number(selectedRegion.value[l1Key]) || 0;
});

const l2Value = computed(() => {
    if (!selectedRegion.value) return 0;
    const year = currentYear.value;
    const l2Key = `Year${year}_l2`;
    return Number(selectedRegion.value[l2Key]) || 0;
});

const showData = computed(() => {
    return selectedRegion.value && totalValue.value > 0;
});
</script>

<style scoped>
.chart-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
}

.data-section {
    width: 100%;
    padding: 0 8px;
}

.total-statistic {
    text-align: center;
    margin-bottom: 12px;
}

.detail-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
}

.detail-stat {
    text-align: center;
}

.stat-color {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 2px;
    margin-right: 6px;
    vertical-align: middle;
}

.stat-color.dc {
    background-color: #006d5b;
    border: 1px solid #0cc2b6;
}

.stat-color.l1 {
    background-color: #682487;
    border: 1px solid #1e40af;
}

.stat-color.l2 {
    background-color: #84BA42;
    border: 1px solid #047857;
}

.empty-state {
    width: 100%;
    padding: 20px 0;
}
</style>
