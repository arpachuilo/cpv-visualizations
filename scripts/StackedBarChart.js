function StackedBarChart(selection, brushable = true) {
  var selection = selection
  var data = []
  var keys = []
  var width = selection.node().offsetWidth
  var height = 140
  var margin = {
    top: 12,
    left: 45,
    bottom: 20,
    right: 0
  }

  var title = ''

  var onBrushStart = function (d) {}
  var onBrushDrag = function (d) {}
  var onBrushEnd = function (d) {}
  var onBrushClick = function (d) {}

  // init chart here
  var svg, gChart, gXaxis, gYaxis, gTitle, gBrush, brush
  var chartWidth, chartHeight
  var x, y
  selection.each(function (d) {
    //Select the svg element, if it exists
    svg = d3.select(this).selectAll('svg').data([d])

    //Otherwise, create the skeletal chart
    var gEnter = svg.enter().append('svg')

    x = d3.scaleLinear()
    y = d3.scaleLinear()

    gEnter
      .attr('width', width)
      .attr('height', height)

    gChart = gEnter.append('g')
      .attr('class', 'chart')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    gTitle = gEnter.append('g')
      .attr('class', 'title')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    gXaxis = gEnter.append('g')
      .attr('class', 'x axis')

    gYaxis = gEnter.append('g')
      .attr('class', 'y axis')

    if (brushable) {
      var brushTipFunction = function (d) {
        var text = moment.duration(Math.round(d[0]), 'ms').format('m:ss') + ' to ' + moment.duration(Math.round(d[1]), 'ms').format('m:ss')
        return text
      }

      var brushTip = new Tooltip()
        .attr('className', 'tooltip')
        .offset([-8, 0])
        .html(brushTipFunction)

      gBrush = gEnter.append('g')
        .attr('class', 'brush')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

      brush = d3.brushX()
        .on('start', function () {
          if (d3.event.selection !== null) {
            onBrushStart(d3.event, d3.event.selection.map(x.invert))
          }
        })
        .on('brush', function () {
          if (d3.event.selection !== null) {
            onBrushDrag(d3.event, d3.event.selection.map(x.invert))
            brushTip.show(event, d3.event.selection.map(x.invert))
          }
        })
        .on('end', function () {
          if (d3.event.selection !== null) {
            onBrushEnd(d3.event, d3.event.selection.map(x.invert))
            brushTip.hide()
          }
        })
    }
  })

  this.update = function () {
    gChart.selectAll('*').remove()
    gXaxis.selectAll('*').remove()
    gYaxis.selectAll('*').remove()

    chartWidth = width - margin.left - margin.right
    chartHeight = height - margin.bottom - margin.top

    x = x
      .domain([
        d3.min(data, function (d) { return d.startTime }),
        d3.max(data, function (d) { return d.endTime })
      ])
      .range([0, chartWidth])

    y = y
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

    gTitle.append('text')
      .text(title)

    gXaxis
      .attr('transform', 'translate(' + margin.left + ',' + (height - margin.bottom) + ')')
      .call(d3.axisBottom(x).tickFormat(function (t) {
        return moment.duration(t, 'ms').format('m:ss')
      }))

    gYaxis
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .call(d3.axisLeft(y))

    if (brushable) {
      gBrush
        .call(brush.extent([[0, 0], [chartWidth, chartHeight]]))
        .call(brush.move, null)
        .on('click', function () {
          onBrushClick()
        })
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

  this.onBrushClick = function (_) {
    if (!arguments.length) return onBrushClick
    onBrushClick = _
    return this
  }

  this.setBrush = function (_) {
    // gBrush.call(brush.move, _)
    var x1 = 0
    var x2 = 0
    if (_) {
      x1 = x(_[0])
      x2 = x(_[1])
    }

    // gBrush.call(brush.move, _.map(x))
    selection.select('.selection')
      .attr('x', x1)
      .attr('width', x2 - x1)

    selection.select('.handle--w')
      .attr('x', x1)

    selection.select('.handle--e')
      .attr('x', x2)
  }

  this.title = function (_) {
    if (!arguments.length) return title
    title = _
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

  this.resizeFunc = function (_) {
    var svg = gChart.node().ownerSVGElement
    width = svg.parentNode.offsetWidth

    d3.select(svg)
      .attr('width', width)
      .attr('height', height)
    return this
  }

  return this
}
