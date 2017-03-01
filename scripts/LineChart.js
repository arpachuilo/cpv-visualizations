function drawLineChart (data, xDomain = [0, 90]) {
  var svg = d3.select('#dataCoverageSparkLine')
  var width = svg.node().parentNode.offsetWidth
  var height = +svg.attr('height')
  var margin = {
    top: 12,
    left: 45,
    bottom: 20,
    right: 0
  }

  var chartWidth = width - margin.left - margin.right
  var chartHeight = height - margin.top - margin.bottom
  svg.attr('width', width)

  svg.selectAll('*').remove()

  var x = d3.scaleLinear()
    .domain([0, d3.max(data, function (d) {
      return d.time
    })])
    .range([0, chartWidth])

  var y = d3.scaleLinear()
  .domain([0, d3.max(data, function (d) {
    return d.numFilters
  })])
  .range([chartHeight, 0])

  var line = d3.line()
    .x(function (d) { return x(d.time) })
    .y(function (d) { return y(d.numFilters) })

  var gTitle = svg.append('g')
    .attr('class', 'title')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  gTitle.append('text')
    .text('Number of Filters')

  var gChart = svg.append('g')
    .attr('class', 'chart')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  gChart.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 1.3)
    .attr('d', line)

  gChart.selectAll('circle')
    .data(data).enter().append('circle')
    .attr('cx', function (d) { return x(d.time) })
    .attr('cy', function (d) { return y(d.numFilters) })
    .attr('fill', 'red')
    .attr('r', 2)

  var gXaxis = svg.append('g')
    .attr('class', 'x axis')

  var gYaxis = svg.append('g')
    .attr('class', 'y axis')

  gXaxis
    .attr('transform', 'translate(' + margin.left + ',' + (height - margin.bottom) + ')')
    .call(d3.axisBottom(x).tickFormat(function (t) {
      return moment.duration(t, 'ms').format('m:ss')
    }))

  gYaxis
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .call(d3.axisLeft(y).ticks(2))
}
