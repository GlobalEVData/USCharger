import { Layer, LayerGroup } from '@/composables/useLayerGroup.ts'
import { GeoJsonLayer } from '@deck.gl/layers'
import { data } from '@/loaders/usa2014_2024.data.js'

import { useColorBandStore } from '@/stores/colorBandStore'

import { createNormalizer } from '@/utils/normalizer';
import { hexToRgbaArray } from '@/utils/color';

import { useMapStore } from '@/stores/mapStore';

const mapStore = useMapStore();
const { selectedRegion } = mapStore;

const store = useColorBandStore()

const column = "Year2014";

const normalizeYearData = createNormalizer(data.features, column, { mode: 'log', boundaryEpsilon: 1e-4 });

function getDataValue(d) {
  // 根据数据属性动态设置填充颜色
  const value = d.properties[column]; // 假设数据中有一个属性叫 value
  const normalizedValue = normalizeYearData(value);
  return normalizedValue;
}

function getFillColor(d) {
  // 根据数据属性动态设置填充颜色
  const normalizedValue = getDataValue(d);
  const hexColor = store.currentColorBand(normalizedValue);
  const res = hexToRgbaArray(hexColor);

  return res;
}

const usaLayer = new Layer('USA-Layer', GeoJsonLayer, {
  opacity: 0.5,
  visible: true,
  props: {
    lineWidthMinPixels: 1,
    getLineColor: [128, 128, 128],
    getFillColor: getFillColor,
    // autoHighlight: true,
    // onClick: (info, event) => console.log('Clicked:', info.object.properties),
    onClick: (info, event) => {
      if (!info.object) return; // 确保点击的是有效的对象
      const regionData = info.object.properties;
      mapStore.updateSelectedRegion(regionData); // 更新 Pinia store 中的选中区域
    }
  },
  data
})

// 最终图层组合
const layerGroup = new LayerGroup([
  usaLayer,
])

export { layerGroup }