// stores/colorBandStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  createColorBand,
  getPredefinedInterpolator,
  getPredefinedOrdinalScheme
} from '@/composables/useColorBand.js'
import { colorSchemes } from '@/composables/useColorBand.js'

export const useColorBandStore = defineStore('colorBand', () => {
  // 状态
  const selectedScheme = ref('ylorrd')
  const isReverse = ref(false)
  const currentColorBand = ref(null)
  const domain = ref([0, 1])
  
  // 计算属性
  const colorSchemeGroups = ref(colorSchemes)
  
  const currentSchemeConfig = computed(() => {
    for (const group of colorSchemeGroups.value) {
      const found = group.options.find((s) => s.value === selectedScheme.value)
      if (found) return found
    }
    return colorSchemeGroups.value[0].options[0]
  })

  // 方法
  function getPreviewBackground(scheme) {
    const type = scheme?.type || currentSchemeConfig.value.type
    const isOrdinal = type === 'ordinal'

    if (isOrdinal) {
      const colors =
        typeof scheme.value === 'string'
          ? getPredefinedOrdinalScheme(scheme.value) || ['#cccccc']
          : scheme.value || ['#cccccc']
      const finalColors = isReverse.value ? [...colors].reverse() : colors
      return `linear-gradient(to right, ${finalColors.join(', ')})`
    } else {
      const interpolator =
        getPredefinedInterpolator(scheme.value) || ((t) => '#cccccc')
      const steps = 10
      const colorStops = Array.from({ length: steps }, (_, i) => {
        const t = isReverse.value ? 1 - i / (steps - 1) : i / (steps - 1)
        return interpolator(t)
      })
      return `linear-gradient(to right, ${colorStops.join(', ')})`
    }
  }

  function getSelectedPreviewBackground() {
    return getPreviewBackground(currentSchemeConfig.value)
  }

  function updateColorBand() {
    const config = currentSchemeConfig.value

    currentColorBand.value = createColorBand({
      type: config.type,
      scheme: selectedScheme.value,
      domain: domain.value,
      isReverse: isReverse.value
    })
  }

  function setDomain(newDomain) {
    domain.value = newDomain
    updateColorBand()
  }

  function setScheme(scheme, updateImmediately = false) {
    selectedScheme.value = scheme
    updateColorBand()
  }

  function toggleReverse() {
    isReverse.value = !isReverse.value
    updateColorBand()
  }

  // 初始化
  updateColorBand()

  return {
    // 状态
    selectedScheme,
    isReverse,
    currentColorBand,
    domain,
    
    // 计算属性
    colorSchemeGroups,
    currentSchemeConfig,
    
    // 方法
    getPreviewBackground,
    getSelectedPreviewBackground,
    updateColorBand,
    setDomain,
    setScheme,
    toggleReverse
  }
})