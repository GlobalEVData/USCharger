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

  </el-container>

  <!-- <Dragger :onClose="handleClose" v-show="isShowDragger" :width="400" :initialPosition="'bottom-right'"
    :autoHideHeader="true" title="Legned">
    <Legend />
  </Dragger> -->

  <AppDrawer v-model="visible">
    <Legend />
  </AppDrawer>


</template>

<script setup>
import { ref } from 'vue'
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

// import Dragger from '@/components/Dragger.vue'

const isShowDragger = ref(true)

const handleClose = () => {
  isShowDragger.value = false
}

// 常量定义
const INITIAL_VIEW_STATE = {
  // 美国
  longitude: -95.712891,
  latitude: 37.09024,
  pitch: 0,
  zoom: 4
}

// 响应式状态
const initialViewState = ref(INITIAL_VIEW_STATE)
const visible = ref(false)
const isSidebarCollapsed = ref(false)
let deckMap = null

// 方法
const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
  // 若侧边栏打开则打开 dragger
  if (!isSidebarCollapsed.value) {
    isShowDragger.value = true
  } else {
    isShowDragger.value = false
  }
}

const toggleFullScreen = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
  // 这里可以添加全屏逻辑
  // handleClose()
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
    // console.log('更新图层:', layerGroup.getLayers())
    deckMap.setProps({
      ...tooltipConfig,
      layers: layerGroup.getLayers(),
    })
  }
}
</script>
