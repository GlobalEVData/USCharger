<template>
  <Suspense>
    <template #default>
      <el-container>
        <SidebarToggleButton v-if="isSidebarCollapsed" :toggle-sidebar="toggleSidebar" />
        <AppSidebar :is-collapsed="isSidebarCollapsed" width="450px">
          <SidebarControls
            :is-drawer-visible="visible"
            :is-collapsed="isSidebarCollapsed"
            @toggle-fullscreen="toggleFullScreen"
            @toggle-drawer="toggleDrawer"
            @toggle-collapse="toggleSidebar"
          />
          <SearchComponent @select="handleLocationSelect" />
          <Details />
          <layers :layerGroup="layerGroup" :onUpdated="updateDeckLayers" />
        </AppSidebar>
        <el-main style="position: relative; padding: 2px; overflow: visible;">
          <MapComponent
            :center="[initialViewState.longitude, initialViewState.latitude]"
            :zoom="initialViewState.zoom"
            :pitch="initialViewState.pitch"
            width="100%"
            height="88vh"
            @map-loaded="handleMapLoaded"
            ref="map"
          >
            <template #legend>
              <Legend />
            </template>
          </MapComponent>
          <AppDrawer v-model="visible">
            <Overall />
          </AppDrawer>
        </el-main>
      </el-container>
    </template>
    <template #fallback>
      <div class="loading-overlay">
        <div class="loading-spinner">
          <el-icon class="is-loading" size="50">
            <Loading />
          </el-icon>
          <p>Loading map data...</p>
        </div>
      </div>
    </template>
  </Suspense>
</template>

<script setup>
import { ref, watch, computed, defineAsyncComponent } from 'vue';
import { Loading } from '@element-plus/icons-vue';
import { useMapStore } from '@/stores/mapStore';
import { calculateGeoJsonCentroid } from '@/layouts/utils';
import { layerGroup } from '@/layouts/layer.js';
import { useDeckOverlay } from '@/composables/useDeckOverlay.js';

// 异步加载子组件
const MapComponent = defineAsyncComponent({
  loader: () => import('@/components/map.vue'),
  delay: 200, // 延迟200ms触发loading
  timeout: 30000, // 30秒超时
});
const AppSidebar = defineAsyncComponent(() => import('@/components/AppSidebar.vue'));
const SidebarControls = defineAsyncComponent(() => import('@/components/SidebarControls.vue'));
const SidebarToggleButton = defineAsyncComponent(() => import('@/components/SidebarToggleButton.vue'));
const AppDrawer = defineAsyncComponent(() => import('@/components/AppDrawer.vue'));
const Details = defineAsyncComponent(() => import('./details.vue'));
const Legend = defineAsyncComponent(() => import('./legend.vue'));
const Overall = defineAsyncComponent(() => import('./overall.vue'));
const SearchComponent = defineAsyncComponent(() => import('./search/SearchComponent.vue'));
const Layers = defineAsyncComponent(() => import('@/components/layer/Layers.vue'));

const mapStore = useMapStore();
const initialViewState = ref({
  longitude: -95.712891,
  latitude: 37.09024,
  pitch: 0,
  zoom: 4,
});
const visible = ref(true);
const isSidebarCollapsed = ref(false);
const map = ref(null);
let deckMap = null;

const handleLocationSelect = (location) => {
  mapStore.updateSelectedRegion(location);
};

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

const toggleFullScreen = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

const toggleDrawer = () => {
  visible.value = !visible.value;
};

const handleMapLoaded = (mapInstance) => {
  deckMap = useDeckOverlay(mapInstance);
  updateDeckLayers();
};

const updateDeckLayers = () => {
  if (deckMap) {
    deckMap.setProps({
      layers: layerGroup.getLayers(),
    });
  }
};

const selectedRegion = computed(() => mapStore.selectedRegion);

watch(selectedRegion, (newRegion) => {
  const highlightLayer = layerGroup.layers.find((l) => l.id === 'Highlight-Layer');
  highlightLayer.data = newRegion ? [newRegion] : [];
  updateDeckLayers();
  if (newRegion) {
    const centroid = calculateGeoJsonCentroid(newRegion.geometry);
    centroid[1] -= 0.5; // 向北偏移
    map.value.flyTo({
      center: centroid,
      zoom: 6,
      duration: 1000,
    });
  }
});
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-spinner {
  text-align: center;
}

.loading-spinner p {
  margin-top: 10px;
  font-size: 16px;
  color: #333;
}

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