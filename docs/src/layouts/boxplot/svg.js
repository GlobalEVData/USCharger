import * as d3 from 'd3';

import { useYearStore } from '@/stores/yearStore';
const yearStore = useYearStore();

export function drawBoxplot(svgRef, stats, currentYear) {
  if (!stats || !svgRef) return;

  d3.select(svgRef).selectAll('*').remove();

  const margin = { top: 35, right: 20, bottom: 35, left: 40 };
  const width = 560 - margin.left - margin.right; // 缩小约30%
  const height = 300 - margin.top - margin.bottom; // 缩小约30%

  const svg = d3
    .select(svgRef)
    .attr('width', '100%')
    .attr('height', height + margin.top + margin.bottom)
    .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const x = d3
    .scaleBand()
    .domain(stats.map((d) => d.column.replace('Year', '')))
    .range([0, width])
    .padding(0.2);

  const yMax = d3.max(stats, (d) => (d.stats ? d.stats.whiskerMax : 0)) * 1.1 || 1;
  const yMin = Math.min(0, d3.min(stats, (d) => (d.stats ? d.stats.whiskerMin : 0)) * 0.9);
  const y = d3.scaleLinear().domain([yMin, yMax]).range([height, 0]).nice();

  // X 轴
  svg
    .append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll('text')
    .style('font-size', '12px');

  svg.append('text')
    .attr('transform', `translate(${width / 2},${height + margin.bottom - 5})`)
    .style('text-anchor', 'middle')
    .style('font-size', '10px')
    .text('Year');

  svg.append('g')
    .call(d3.axisLeft(y))
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', -30)
    .attr('x', -height / 2)
    .attr('dy', '0.71em')
    .style('text-anchor', 'middle')
    .style('font-size', '180px')
    .text('Value');

  svg.append('text')
    .attr('x', width / 2)
    .attr('y', -15)
    .attr('text-anchor', 'middle')
    .style('font-size', '20px')
    .style('font-weight', 'bold')
    .style('fill', '#374151') // 适应暗黑模式
    .style('fill', 'currentColor')
    .text('The number of public EV chargers by year');

  // blic EV chargers by year
  stats.forEach(({ column, stats: stat }) => {
    if (!stat) return;
    const xPos = x(column.replace('Year', '')) + x.bandwidth() / 2;
    const boxWidth = x.bandwidth() * 0.4;
    const isCurrentYear = column === `Year${currentYear}`;
    const fillColor = isCurrentYear ? 'brown' : '#d1d5db';
    const strokeColor = isCurrentYear ? '#cfc58fff' : '#6b7280';

    const boxGroup = svg.append('g')
      .attr('class', 'boxplot-group')
      .attr('data-year', column)
      .style('cursor', 'pointer');

    boxGroup.append('line')
      .attr('x1', xPos)
      .attr('x2', xPos)
      .attr('y1', y(stat.whiskerMin))
      .attr('y2', y(stat.whiskerMax))
      .attr('stroke', strokeColor)
      .attr('stroke-width', 1);

    boxGroup.append('rect')
      .attr('x', xPos - boxWidth / 2)
      .attr('y', y(stat.q3))
      .attr('width', boxWidth)
      .attr('height', Math.max(y(stat.q1) - y(stat.q3), 1))
      .attr('fill', fillColor)
      .attr('stroke', strokeColor)
      .attr('stroke-width', 1)
      .attr('rx', 2)
      .attr('ry', 2);

    boxGroup.append('line')
      .attr('x1', xPos - boxWidth / 2)
      .attr('x2', xPos + boxWidth / 2)
      .attr('y1', y(stat.median))
      .attr('y2', y(stat.median))
      .attr('stroke', strokeColor)
      .attr('stroke-width', 2);

    boxGroup.append('line')
      .attr('x1', xPos - boxWidth / 4)
      .attr('x2', xPos + boxWidth / 4)
      .attr('y1', y(stat.whiskerMin))
      .attr('y2', y(stat.whiskerMin))
      .attr('stroke', strokeColor)
      .attr('stroke-width', 1);

    boxGroup.append('line')
      .attr('x1', xPos - boxWidth / 4)
      .attr('x2', xPos + boxWidth / 4)
      .attr('y1', y(stat.whiskerMax))
      .attr('y2', y(stat.whiskerMax))
      .attr('stroke', strokeColor)
      .attr('stroke-width', 1);

    boxGroup.on('mouseover', function () {
      const year = column.replace('Year', '');
      const statsText = [
        `Year: ${year}`,
        `Min: ${stat.whiskerMin.toFixed(2)}`,
        `Q1: ${stat.q1.toFixed(2)}`,
        `Median: ${stat.median.toFixed(2)}`,
        `Q3: ${stat.q3.toFixed(2)}`,
        `Max: ${stat.whiskerMax.toFixed(2)}`,
        `IQR: ${(stat.q3 - stat.q1).toFixed(2)}`
      ].join('<br/>');


      d3.select(this).select('rect')
        .attr('stroke-width', 2)
        .attr('stroke', '#000');
    })
      .on('mouseout', function () {
        d3.select(this).select('rect')
          .attr('stroke-width', 1)
          .attr('stroke', strokeColor);
      })
      .on('click', function () {
        const year = parseInt(column.replace('Year', ''));
        yearStore.currentYear = year;
      });
  });
}