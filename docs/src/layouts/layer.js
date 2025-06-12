import { Layer, LayerGroup } from '@/composables/useLayerGroup.js'
import { GeoJsonLayer } from '@deck.gl/layers'
import { data } from '@/loaders/usa2014_2024.data.js'

const usaLayer = new Layer('USA-Layer', GeoJsonLayer, {
  opacity: 0.4,
  visible: true,
  props: {
    getLineColor: [255, 244, 255],
    lineWidthMinPixels: 1,
    getFillColor: [255, 244, 255],
    // getLineColor: [255, 24, 25],
    // getFillColor: (d) => {
    //   // 根据数据属性动态设置填充颜色
    //   const value = d.properties.Year2014; // 假设数据中有一个属性叫 value
    //   if (value < 10) {
    //     return [255, 0, 0]; // 红色
    //   } else if (value < 20) {
    //     return [255, 165, 0]; // 橙色
    //   } else if (value < 30) {
    //     return [255, 255, 0]; // 黄色
    //   } else {
    //     return [0, 128, 0]; // 绿色
    //   }
    // }
  },
  data
})

// 最终图层组合
const layerGroup = new LayerGroup([
  usaLayer
])

export { layerGroup }