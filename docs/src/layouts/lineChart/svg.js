import * as d3 from 'd3';

export function drawLineChart(svgRef, data, currentYear) {
  if (!data || !svgRef) return;

  d3.select(svgRef).selectAll('*').remove();

  const margin = { top: 35, right: 20, bottom: 35, left: 40 };
  const width = 560 - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;

  const svg = d3
    .select(svgRef)
    .attr('width', '100%')
    .attr('height', height + margin.top + margin.bottom)
    .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const x = d3
    .scalePoint()
    .domain(data.map((d) => d.year))
    .range([0, width])
    .padding(0.2);

  const y = d3
    .scaleLinear()
    .domain([0, 1])
    .range([height, 0])
    .nice();

  const color = d3
    .scaleOrdinal()
    .domain(['dc', 'l1', 'l2', 'total'])
    .range(['#006d5b', '#682487', '#84BA42', '#8B4513']);

  // X 轴
  svg
    .append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll('text')
    .style('font-size', '10px')
    .style('fill', (d) => (parseInt(d) === currentYear ? '#000000' : '#6b7280'))
    .style('font-weight', (d) => (parseInt(d) === currentYear ? 'bold' : 'normal'));

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
    .style('font-size', '20px')
    .style('font-weight', 'bold')
    .style('fill', 'currentColor')
    .text('Local EV Charger Type Distribution by Year');

  // 绘制折线
  const line = d3
    .line()
    .x((d) => x(d.year))
    .y((d) => y(d.value));

  const types = ['dc', 'l1', 'l2'];
  types.forEach((type) => {
    const lineData = data.map((d) => ({
      year: d.year,
      value: d[type],
    }));

    svg
      .append('path')
      .datum(lineData)
      .attr('fill', 'none')
      .attr('stroke', color(type))
      .attr('stroke-width', 2)
      .attr('d', line)
      .on('mouseover', function () {
        d3.select(this).attr('stroke-width', 3);
      })
      .on('mouseout', function () {
        d3.select(this).attr('stroke-width', 2);
      });
  });

  // 绘制总计线
  const totalLineData = data.map((d) => ({
    year: d.year,
    value: d.dc + d.l1 + d.l2,
  }));

  svg
    .append('path')
    .datum(totalLineData)
    .attr('fill', 'none')
    .attr('stroke', color('total'))
    .attr('stroke-width', 2)
    .attr('stroke-dasharray', '5,5')
    .attr('d', line);

  // 当前年份高亮点
  types.forEach((type) => {
    const currentYearData = data.find((d) => parseInt(d.year) === currentYear);
    if (currentYearData) {
      svg
        .append('circle')
        .attr('cx', x(currentYearData.year))
        .attr('cy', y(currentYearData[type]))
        .attr('r', 5)
        .attr('fill', color(type))
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 2)
        .on('mouseover', function (event) {
          const percentage = (currentYearData[type] * 100).toFixed(2);
          svg
            .append('text')
            .attr('class', 'tooltip')
            .attr('x', x(currentYearData.year))
            .attr('y', y(currentYearData[type]) - 10)
            .attr('text-anchor', 'middle')
            .style('font-size', '10px')
            .text(`${type}: ${percentage}%`);
        })
        .on('mouseout', function () {
          svg.select('.tooltip').remove();
        })
        .on('click', function () {
          yearStore.currentYear = currentYear;
        });
    }
  });
}