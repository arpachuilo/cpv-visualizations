function StackedBarChart(selection, brushable = true) {
  var data = []
  var keys = []
  var width = selection.node().offsetWidth
  var height = 480
  var margin = {
    top: 0,
    left: 45,
    bottom: 45,
    right: 0
  }

  var onBrushStart = function (d) {}
  var onBrushDrag = function (d) {}
  var onBrushEnd = function (d) {}

  // init chart here
  var svg, gChart, gXaxis, gYaxis, gBrush
  var chartWidth, chartHeight
  selection.each(function (d) {
    //Select the svg element, if it exists
    svg = d3.select(this).selectAll('svg').data([d])

    //Otherwise, create the skeletal chart
    var gEnter = svg.enter().append('svg')

    gEnter
      .attr('width', width)
      .attr('height', height)

    gChart = gEnter.append('g')
      .attr('class', 'chart')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    gXaxis = gEnter.append('g')
      .attr('class', 'x axis')

    gYaxis = gEnter.append('g')
      .attr('class', 'y axis')

    if (brushable) {
      gBrush = gEnter.append('g')
        .attr('class', 'brush')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    }
  })

  this.update = function () {
    gChart.selectAll('*').remove()
    chartWidth = width - margin.left - margin.right
    chartHeight = height - margin.bottom - margin.top

    var x = d3.scaleTime()
      .domain([
        d3.min(data, function (d) { return d.startTime }),
        d3.max(data, function (d) { return d.endTime })
      ])
      .range([0, chartWidth])

    var y = d3.scaleLinear()
      .domain([0, d3.max(data, function (d) { return d.total })])
      .range([chartHeight, 0])

    gChart.selectAll('g')
      .data(d3.stack().keys(keys)(data))
      .enter().append('g')
        .attr('class', function (d, i) { return keys[i] })
      .selectAll('rect')
      .data(function(d) { return d })
      .enter().append('rect')
        .attr('x', function (d) { return  x(d.data.startTime )})
        .attr('y', function (d) { return y(d[1]) })
        .attr('height', function (d) { return y(d[0]) - y(d[1]) })
        .attr('width', function (d, i) { return width / data.length })

    gXaxis
      .attr('transform', 'translate(' + margin.left + ',' + chartHeight + ')')
      .call(d3.axisBottom(x))

    gYaxis
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .call(d3.axisLeft(y))

    if (brushable) {
      gBrush
        .call(d3.brushX()
          .extent([[0, 0], [chartWidth, chartHeight]])
          .on('start', function () {
            onBrushStart(d3.event, d3.event.selection.map(x.invert))
          })
          .on('brush', function () {
            onBrushDrag(d3.event, d3.event.selection.map(x.invert))
          })
          .on('end', function () {
            onBrushEnd(d3.event, d3.event.selection.map(x.invert))
          }))
    }
  }

  this.onBrushStart = function (_) {
    if (!arguments.length) return onBrushStart
    onBrushStart = _
    return this
  }

  this.onBrushDrag = function (_) {
    if (!arguments.length) return onBrushDrag
    onBrushDrag = _
    return this
  }

  this.onBrushEnd = function (_) {
    if (!arguments.length) return onBrushEnd
    onBrushEnd = _
    return this
  }

  this.data = function (_) {
    if (!arguments.length) return data
    data = _
    return this
  }

  this.keys = function (_) {
    if (!arguments.length) return keys
    keys = _
    return this
  }

  return this
}
