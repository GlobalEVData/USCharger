import * as d3 from 'd3';

export function drawLineChart(svgRef, data, currentYear, regionName) {
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

  // Check if all data is zero
  const isEmptyData = data.every((d) => d.dc === 0 && d.l1 === 0 && d.l2 === 0 && d.total === 0);

  if (isEmptyData) {
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('fill', '#829585ff')
      .text('No charging station data available for this region');
    return;
  }

  const x = d3
    .scalePoint()
    .domain(data.map((d) => d.year))
    .range([0, width])
    .padding(0.2);

  // Calculate max value for Y-axis (excluding total, as it's always 1 or 0)
  const maxY = d3.max(data, (d) => Math.max(d.dc, d.l1, d.l2)) || 1;
  const y = d3
    .scaleLinear()
    .domain([0, maxY * 1.1]) // Add 10% padding
    .range([height, 0])
    .nice();

  const color = d3
    .scaleOrdinal()
    .domain(['dc', 'l1', 'l2', 'total'])
    .range(['#006d5b', '#682487', '#84BA42', '#8B4513']);

  // X axis
  svg
    .append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll('text')
    .style('font-size', '12px')
    .style('fill', (d) => (parseInt(d) === currentYear ? '#117839ff' : '#829585ff'))
    .style('font-weight', (d) => (parseInt(d) === currentYear ? 'bold' : 'normal'));

  svg
    .append('text')
    .attr('transform', `translate(${width / 2},${height + margin.bottom - 5})`)
    .style('text-anchor', 'middle')
    .style('font-size', '10px')
    .text('Year');

  // Y axis
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

  // Title
  svg
    .append('text')
    .attr('x', width / 2)
    .attr('y', -15)
    .attr('text-anchor', 'middle')
    .style('font-size', '20px')
    .style('font-weight', 'bold')
    .style('fill', 'currentColor')
    .text('The number of public EV chargers in ' + regionName);

  // Draw lines
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

  // Draw total line
  const totalLineData = data.map((d) => ({
    year: d.year,
    value: d.total,
  }));

  svg
    .append('path')
    .datum(totalLineData)
    .attr('fill', 'none')
    .attr('stroke', color('total'))
    .attr('stroke-width', 2)
    .attr('stroke-dasharray', '5,5')
    .attr('d', line);

  // Highlight current year
  types.forEach((type) => {
    const currentYearData = data.find((d) => parseInt(d.year) === currentYear);
    if (currentYearData && currentYearData[type] > 0) {
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
            .text(`${type.toUpperCase()}: ${percentage}%`);
        })
        .on('mouseout', function () {
          svg.select('.tooltip').remove();
        });
    }
  });
}