function BrushOverlay (parent) {
  var parent = parent
  var width = parent.node().offsetWidth
  var height = parent.node().offsetHeight
  var margin = {
    top: 12,
    left: 46, // One pixel off err
    bottom: 0, // extra 6 to take into account the tick length from bottom chart
    right: 0
  }

  var onBrushStart = function (d) {}
  var onBrushDrag = function (d) {}
  var onBrushEnd = function (d) {}
  var onBrushClick = function (d) {}

  // init chart here
  var svg, gBrush, brush
  var chartWidth, chartHeight
  var x, y

  var xDomain = [0, 90]

  //Select the svg element, if it exists
  svg = d3.select('#brush-overlay')

  x = d3.scaleLinear()
  y = d3.scaleLinear()

  svg
    .attr('width', width)
    .attr('height', height)

  var brushTipFunction = function (d) {
    var text = moment.duration(Math.round(d[0]), 'ms').format('m:ss') + ' to ' + moment.duration(Math.round(d[1]), 'ms').format('m:ss')
    return text
  }

  var brushTip = new Tooltip()
    .attr('className', 'tooltip')
    .offset([-8, 0])
    .html(brushTipFunction)

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

  this.update = function () {
    svg.selectAll('.brush').remove()
    chartWidth = width - margin.left - margin.right
    chartHeight = height - margin.bottom - margin.top

    gBrush = svg.append('g')
      .attr('class', 'brush')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')


    x = x
      .domain(xDomain)
      .range([0, chartWidth])

    gBrush
      .call(brush.extent([[0, 0], [chartWidth, chartHeight]]))
      .call(brush.move, null)
      .on('click', function () {
        onBrushClick()
      })
  }

  this.setBrushExtent = function (_) {
    gBrush
      .call(brush.move, [x(_[0]), x(_[1])])
    return this
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

  this.xDomain = function (_) {
    if (!arguments.length) return xDomain
    xDomain = _
    return this
  }

  this.resizeFunc = function (_) {
    width = parent.node().offsetWidth
    height = parent.node().offsetHeight

    svg
      .attr('width', width)
      .attr('height', height)

    gBrush = svg.append('g')
      .attr('class', 'brush')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    return this
  }

  return this
}
