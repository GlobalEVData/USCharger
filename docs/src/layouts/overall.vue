<template>
    <div class="container">
        <BoxPlot />
        <StackedBar />
        <LineChart />
    </div>
</template>

<script setup>
import BoxPlot from './boxplot/boxplot.vue'
import StackedBar from './StackedBar/index.vue'
import LineChart from './lineChart/index.vue'
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
}
</style>