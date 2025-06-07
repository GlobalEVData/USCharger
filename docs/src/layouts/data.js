// import { DataGroup, DataEntity } from '@/composables/useDataGroup'
// import { data } from '@/loaders/usa2014_2024.data.js'

// const dataGroup = new DataGroup()

// // 构建基础数据
// const builtData = data.filter(d => d.built)
// const notBuiltData = data.filter(d => !d.built)
// const borderData = [
//   [113.8242, 22.1380], [114.4441, 22.1380], [114.4441, 22.5719], [113.8242, 22.5719], [113.8242, 22.1380]
// ]

// // 创建基本数据实体
// const builtEntity = new DataEntity('built', 'scatter', builtData)
// const notBuiltEntity = new DataEntity('notBuilt', 'scatter', notBuiltData)
// const borderEntity = new DataEntity('border', 'polygon', borderData)

// dataGroup.addEntity(builtEntity)
// dataGroup.addEntity(notBuiltEntity)
// dataGroup.addEntity(borderEntity)




// let del = RVGeo.Delaunator.from([...builtMultiPoints.toXY(), ...MBRPoints.toXY()])
// let trs = RVGeo.fillIndexArray(del.getTriangleIndices(), [...builtMultiPoints.coordinates, ...MBRPoints.coordinates])
// trs = RVGeo.toMultiPolygon(trs.map(x => RVGeo.toPolygon(x)))

// const delaunayEntity = new DataEntity('delaunay', 'polygon', trs.toGeoJSON())
// dataGroup.addEntity(delaunayEntity)
// dataGroup.addRelation('builtPoints', 'delaunay')
// dataGroup.addRelation('border', 'delaunay')

// // Voronoi
// let vor = new RVGeo.Voronoi(del)
// let voi = vor.cutVoronoiByMBR(HK_MBR) 
// voi = Array.from(voi, ([key, value]) => RVGeo.toPolygon(value, { centeridx: key }))

// voi = RVGeo.toMultiPolygon(voi)
// voi.assignAreas()

// // RVGeo.Column();
// const Column = new RVGeo.Column(voi.area)
// // console.log(Column.mapValue(1233333333))

// // console.log(voi.toFeatureCollection())
// const voronoiEntity = new DataEntity('voronoi', 'multipolygon', voi.toFeatureCollection())
// dataGroup.addEntity(voronoiEntity)
// dataGroup.addRelation('delaunay', 'voronoi')

// export { dataGroup, Column }