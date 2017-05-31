function timeBar (selection, tMin, tMax, t0, t1, inflections) {
  // NOTE: keep consistent with Heatmap.js
  var height = 240
  var width = 80

  var margin = {
    top: 1,
    left: 40,
    bottom: 0,
    right: 5
  }

  var chartWidth = width - margin.left - margin.right
  var chartHeight = height - margin.top - margin.bottom

  var fontYOffset = 14

  var svg = d3.select(selection).append('svg')
    .attr('class', 'timebar')
    .attr('width', width)
    .attr('height', height)

  var scale = d3.scaleLinear(tMin, tMax)
    .domain([tMin, tMax])
    .range([0, chartHeight])

  svg.append('rect')
    .attr('x', margin.left)
    .attr('y', margin.top)
    .attr('width', chartWidth)
    .attr('height', chartHeight)
    .attr('fill-opacity', 0)
    .attr('stroke', 'black')
    .attr('stroke-width', 1)

  svg.append('rect')
    .attr('x', margin.left)
    .attr('y', scale(t0))
    .attr('width', chartWidth)
    .attr('height', scale(t1 - t0))
    .attr('fill', '#0077BE')

  for (var i = 0; i < inflections.length; i++) {
    svg.append('rect')
      .attr('x', margin.left)
      .attr('y', scale(inflections[i].time))
      .attr('width', chartWidth)
      .attr('height', 1)
      .attr('fill', '#FF7F00')
  }

  var t0offset = (scale(t0) >  margin.top + fontYOffset) ? scale(t0) :  margin.top + fontYOffset
  var t1offset = (scale(t1) - t0offset > 15) ? scale(t1) : t0offset + 15

  if (scale(t0) + 15 > chartHeight) {
    t0offset = chartHeight - 15
    t1offset = chartHeight
  }

  svg.append('text')
    .attr('x', margin.left)
    .attr('dx', -2)
    .attr('y', t0offset)
    .attr('text-anchor', 'end')
    .text(moment.duration(t0, 'ms').format('m:ss'))

  svg.append('text')
    .attr('x', margin.left)
    .attr('dx', -2)
    .attr('y', t1offset)
    .attr('text-anchor', 'end')
    .text(moment.duration(t1, 'ms').format('m:ss'))
}
