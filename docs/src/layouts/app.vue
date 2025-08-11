<template>
  <el-container>
    <!-- 侧边栏折叠按钮 -->
    <SidebarToggleButton v-if="isSidebarCollapsed" :toggle-sidebar="toggleSidebar" />

    <!-- 侧边栏 -->
    <AppSidebar :is-collapsed="isSidebarCollapsed" width="450px">
      
      <SidebarControls :is-drawer-visible="visible" :is-collapsed="isSidebarCollapsed"
        @toggle-fullscreen="toggleFullScreen" @toggle-drawer="toggleDrawer" @toggle-collapse="toggleSidebar" />
        <SearchComponent @select="handleLocationSelect" />
        <Details />
      <layers :layerGroup="layerGroup" :onUpdated="updateDeckLayers" />
    </AppSidebar>

    <el-main style="position: relative; padding: 2px; overflow: visible;">
      <MapComponent :center="[initialViewState.longitude, initialViewState.latitude]" :zoom="initialViewState.zoom"
        :pitch="initialViewState.pitch" width="100%" height="88vh" @map-loaded="handleMapLoaded" ref="map">
        <template #legend>
          <Legend></Legend>
        </template>
      </MapComponent>
      <AppDrawer v-model="visible">
        <Overall />
      </AppDrawer>
    </el-main>

  </el-container>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import MapComponent from '@/components/map.vue'
import { useDeckOverlay } from '@/composables/useDeckOverlay.js'
import layers from '@/components/layer/Layers.vue'
import SidebarControls from '@/components/SidebarControls.vue'
import SidebarToggleButton from '@/components/SidebarToggleButton.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import AppDrawer from '@/components/AppDrawer.vue'
import Details from './details.vue'

import Legend from './legend.vue'

import Overall from './overall.vue'

import { layerGroup } from "@/layouts/layer.js"
import { tooltipConfig } from "@/layouts/tooltip.js"


import SearchComponent from './search/SearchComponent.vue'
import { calculateGeoJsonCentroid } from '@/layouts/utils'

import { useMapStore } from '@/stores/mapStore';

const mapStore = useMapStore();

const handleLocationSelect = (location) => {
  mapStore.updateSelectedRegion(location);
}

// 常量定义
const INITIAL_VIEW_STATE = {
  longitude: -95.712891,
  latitude: 37.09024,
  pitch: 0,
  zoom: 4
}

// 响应式状态
const initialViewState = ref(INITIAL_VIEW_STATE)
const visible = ref(true)
const isSidebarCollapsed = ref(false)
let deckMap = null

const map = ref(null)

// 方法
const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const toggleFullScreen = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const toggleDrawer = () => {
  visible.value = !visible.value
}


const handleMapLoaded = (map) => {
  deckMap = useDeckOverlay(map);
  updateDeckLayers()
}

const updateDeckLayers = () => {
  if (deckMap) {
    deckMap.setProps({
      // ...tooltipConfig,
      layers: layerGroup.getLayers(),
    })
  }
}


// 定义选中区域的计算属性
const selectedRegion = computed(() => {
  return mapStore.selectedRegion;
});


// 在 watch 中设置标志
watch(selectedRegion, (newRegion) => {
  const highlightLayer = layerGroup.layers.find(l => l.id === 'Highlight-Layer');
  highlightLayer.data = newRegion ? [newRegion] : [];
  updateDeckLayers();
if (newRegion) {
  const centroid = calculateGeoJsonCentroid(newRegion.geometry);
  // 由于下方有一个抽屉遮挡，所以尝试将纵向偏移一个小量
  centroid[1] -= 0.5; // 向北偏移0.01度

  map.value.flyTo({
    center: centroid,
    zoom: 6,
    duration: 1000
  });
}
});


</script>

<style scoped>
.drawer-toggle-icon {
  position: fixed;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--vp-c-text-2);
  transition: all 0.3s ease;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.drawer-toggle-icon:hover {
  background: var(--vp-c-brand);
  color: var(--vp-c-white);
  transform: translateY(-50%) scale(1.1);
}
</style>