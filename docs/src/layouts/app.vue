<template>
  <el-container>
    <!-- 侧边栏折叠按钮 -->
    <SidebarToggleButton v-if="isSidebarCollapsed" :toggle-sidebar="toggleSidebar" />

    <!-- 侧边栏 -->
    <AppSidebar :is-collapsed="isSidebarCollapsed">
      <SidebarControls :is-drawer-visible="visible" :is-collapsed="isSidebarCollapsed"
        @toggle-fullscreen="toggleFullScreen" @toggle-drawer="toggleDrawer" @toggle-collapse="toggleSidebar" />

      <layers :layerGroup="layerGroup" :onUpdated="updateDeckLayers" />
    </AppSidebar>

    <el-main style="padding: 2px;">
      <MapComponent :center="[initialViewState.longitude, initialViewState.latitude]" :zoom="initialViewState.zoom"
        :pitch="initialViewState.pitch" width="100%" height="88vh" @map-loaded="handleMapLoaded" />
    </el-main>

    <!-- 右侧抽屉提示图标 -->
    <button class="drawer-toggle-icon" @click="toggleDrawer" v-if="!visible">
      <el-icon><ArrowLeft /></el-icon>
    </button>

    <AppDrawer v-model="visible">      
      <Legend />
    </AppDrawer>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import MapComponent from '@/components/map.vue'
import { useDeckOverlay } from '@/composables/useDeckOverlay.js'
import layers from '@/components/layer/Layers.vue'
import SidebarControls from '@/components/SidebarControls.vue'
import SidebarToggleButton from '@/components/SidebarToggleButton.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import AppDrawer from '@/components/AppDrawer.vue'
import Legend from './legend.vue'
import { layerGroup } from "@/layouts/layer.js"
import { tooltipConfig } from "@/layouts/tooltip.js"

import { useMapStore } from '@/stores/mapStore';

const mapStore = useMapStore();
const selectedRegion = computed(() => mapStore.selectedRegion);

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
  deckMap = useDeckOverlay(map)
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