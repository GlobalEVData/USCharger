<template>
  <div class="year-display">
    <div class="year-title">Current Year</div>
    <div class="year-value">{{ currentYear }}</div>
  </div>

  <div class="color-band-display-container">
    <div class="color-band-labels">
      <span class="label">low</span>
      <span class="label">high</span>
    </div>
    
    <div 
      v-if="store.currentColorBand"
      class="color-band-preview"
      :style="bandStyle"
    ></div>
    
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useColorBandStore } from '@/stores/colorBandStore'
import { useYearStore } from '@/stores/yearStore'
import { useTransition } from '@vueuse/core'
import { storeToRefs } from 'pinia'

const store = useColorBandStore()
const yearStore = useYearStore()

const { currentYear } = storeToRefs(yearStore)


const bandStyle = computed(() => ({
  background: store.getSelectedPreviewBackground(),
  height: '30px',
  width: '100%',
  borderRadius: '4px',
  margin: '5px 0',
  boxShadow: '0 0 0 1px rgba(0,0,0,0.1) inset',
}))
</script>

<style scoped>
.color-band-display-container {
  padding: 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
  max-width: 300px;
}

.color-band-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.label {
  font-size: 0.8em;
  font-weight: bold;
  color: var(--vp-c-text-1);
}

.color-band-preview {
  transition: background 0.3s ease;
}

.year-display {
  text-align: center;
  font-size: 1.2em;
  font-weight: bold;
  background-color: var(--vp-c-bg-soft);
}

.year-title {
  font-size: 0.6em;
  color: var(--vp-c-text-2);
}

.year-value {
  font-size: 1.5em;
  color: var(--vp-c-green-1);
}
</style>