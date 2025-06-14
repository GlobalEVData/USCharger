// stores/colorBandStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useColorBandStore = defineStore('colorBand', () => {
  // 响应式对象
  const currentColorBand = ref(null)
  
  // 方法引用，可以从外部更新
  let getSelectedPreviewBackground = ref(() => {
    return 'linear-gradient(to right, #cccccc, #cccccc)'}
  )

  return {
    currentColorBand,
    getSelectedPreviewBackground,
  }
})