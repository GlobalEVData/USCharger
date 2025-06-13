import { Layer, LayerGroup } from '@/composables/useLayerGroup.ts'
import { GeoJsonLayer } from '@deck.gl/layers'
import { data } from '@/loaders/usa2014_2024.data.js'

// import { data as usStates } from '@/loaders/usa_states.data.js'

const usaLayer = new Layer('USA-Layer', GeoJsonLayer, {
  opacity: 0.5,
  visible: true,
  props: {
    lineWidthMinPixels: 1,
    getLineColor: [128, 128, 128],
    getFillColor: (d) => {
      // 根据数据属性动态设置填充颜色
      const value = d.properties.Year2014; // 假设数据中有一个属性叫 value
      if (value < 10) {
        return [255, 0, 0]; // 红色
      } else if (value < 20) {
        return [255, 165, 0]; // 橙色
      } else if (value < 30) {
        return [255, 255, 0]; // 黄色
      } else {
        return [0, 128, 0]; // 绿色
      }
    },
  },
  data
})

// const usaStatesLayer = new Layer('USA-States-Layer', GeoJsonLayer, {
//   opacity: 0.8,
//   visible: true,
//   props: {
//     getFillColor: [128, 128, 128]
//   },
//   data: usStates
// })

// 最终图层组合
const layerGroup = new LayerGroup([
  usaLayer,
  // usaStatesLayer
])

export { layerGroup }