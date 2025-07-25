import * as d3 from 'd3';
import { useYearStore } from '@/stores/yearStore';
const yearStore = useYearStore();

export function drawStackedBar(svgRef, data, currentYear) {
  if (!data || !svgRef) return;

  d3.select(svgRef).selectAll('*').remove();

  const margin = { top: 35, right: 20, bottom: 35, left: 40 };
  const width = 560 - margin.left - margin.right;
  const height = 280 - margin.top - margin.bottom;

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
    .domain(data.map((d) => d.year))
    .range([0, width])
    .padding(0.2);

  const y = d3
    .scaleLinear()
    .domain([0, 1]) // 占比范围固定为 0-1
    .range([height, 0])
    .nice();

  const color = d3
    .scaleOrdinal()
    .domain(['dc', 'l1', 'l2'])
    .range(['#f9741699', '#3b83f6a4', '#10b9818f']);

  // X 轴
  svg
    .append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll('text')
    .style('font-size', '10px');

  svg.append('text')
    .attr('transform', `translate(${width / 2},${height + margin.bottom - 5})`)
    .style('text-anchor', 'middle')
    .style('font-size', '10px')
    .text('Year');

  // Y 轴
  svg
    .append('g')
    .call(d3.axisLeft(y).tickFormat(d3.format('.0%')))
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', -30)
    .attr('x', -height / 2)
    .attr('dy', '0.71em')
    .style('text-anchor', 'middle')
    .style('font-size', '10px')
    .text('Percentage');

  // 标题
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', -15)
    .attr('text-anchor', 'middle')
    .style('font-size', '12px')
    .style('font-weight', 'bold')
    .style('fill', 'currentColor')
    .text('Charging Station Type Distribution by Year');

  // 堆叠柱状图
  const stack = d3.stack().keys(['dc', 'l1', 'l2']);
  const series = stack(data);

  svg
    .selectAll('.bar-group')
    .data(series)
    .enter()
    .append('g')
    .attr('fill', (d) => color(d.key))
    .selectAll('rect')
    .data((d) => d)
    .enter()
    .append('rect')
    .attr('x', (d) => x(d.data.year))
    .attr('y', (d) => y(d[1]))
    .attr('height', (d) => y(d[0]) - y(d[1]))
    .attr('width', x.bandwidth())
    .attr('stroke', (d) => d3.color(color(d.key)).darker())
    .attr('stroke-width', (d) => (parseInt(d.data.year) === currentYear ? 3 : 1))
    .on('mouseover', function (event, d) {
      d3.select(this).attr('opacity', 0.8);
      const type = series.find(s => s.includes(d)).key;
      const percentage = ((d[1] - d[0]) * 100).toFixed(2);
      d3.select(this.parentNode.parentNode)
        .append('text')
        .attr('class', 'tooltip')
        .attr('x', x(d.data.year) + x.bandwidth() / 2)
        .attr('y', y(d[1]) - 5)
        .attr('text-anchor', 'middle')
        .style('font-size', '10px')
        .text(`${type}: ${percentage}%`);
    })
    .on('mouseout', function () {
      d3.select(this).attr('opacity', 1);
      d3.select('.tooltip').remove();
    })
    .on('click', function (event, d) {
      const year = parseInt(d.data.year);
      yearStore.currentYear = year;
    });
}