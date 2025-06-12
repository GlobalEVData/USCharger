/**
 * 创建数值归一化映射函数
 * @param {Array} data - GeoJSON的features数组
 * @param {string} column - 要归一化的属性列名(如"Year2014")
 * @returns {Function} - 接收原始值返回0-1之间的归一化值的函数
 */
function createNormalizer(data, column) {
  // 第一阶段：计算最小最大值
  let min = Infinity;
  let max = -Infinity;
  
  for (const feature of data) {
    const value = feature.properties[column];
    // 只处理数值类型
    if (typeof value === 'number') {
      min = Math.min(min, value);
      max = Math.max(max, value);
    }
  }
  
  // 处理所有值相同的情况
  if (min === max) {
    return () => 0.5; // 所有值映射到中值
  }
  
  const range = max - min;
  
  // 第二阶段：返回归一化函数
  return function normalize(value) {
    if (typeof value !== 'number') return NaN;
    return (value - min) / range;
  };
}

// 使用示例
const geoJsonData = { /* 您的GeoJSON数据 */ };
const features = geoJsonData.features;

// 创建Year2014列的归一化器
const normalizeYear2014 = createNormalizer(features, "Year2014");

// 使用归一化函数
const sampleValue = features[0].properties.Year2014; // 4.0
const normalized = normalizeYear2014(sampleValue); // 0.0 (假设4是最小值)
console.log(normalized);