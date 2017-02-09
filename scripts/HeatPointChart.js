function HeatPointChart(selection) {

  // default values
  var width = 960
  var height = 540
  var imgWidth = 1920
  var imgHeight = 1080
  var eyeData = []
  var mouseData = []

  // init chart here
  var svg, gEye, gMouse
  var xScale, yScale
  selection.each(function (d) {
    //Select the svg element, if it exists
    svg = d3.select(this).selectAll('svg').data([d])
    //Otherwise, create the skeletal chart
    var gEnter = svg.enter().append('svg')

    gEye = gEnter.append('g')
      .attr('class', 'eye')

    gMouse = gEnter.append('g')
      .attr('class', 'mouse')
  })

  this.update = function () {
    xScale = d3.scaleLinear()
      .domain([0, imgWidth])
      .range([0, width])

    yScale = d3.scaleLinear()
      .domain([0, imgHeight])
      .range([0, height])

    gMouse.selectAll('*').remove()
    gMouse.selectAll('circle')
      .data(mouseData).enter().append('circle')
        .attr('r', 5)
        .attr('cx', function (d) { return xScale(d.x) })
        .attr('cy', function (d) { return yScale(d.y) })

    gEye.selectAll('*').remove()
    gEye.selectAll('circle')
      .data(eyeData).enter().append('circle')
        .attr('r', 5)
        .attr('cx', function (d) {
          return d.x === '-nan(ind)' ? -100 : xScale(d.x)
        })
        .attr('cy', function (d) {
          return d.y === '-nan(ind)' ? -100 : yScale(d.y)
        })
    return this
  }

  this.width = function (_) {
    if (!arguments.length) return width
    width = _
    return this
  }

  this.height = function (_) {
    if (!arguments.length) return height
    height = _
    return this
  }

  this.imgWidth = function (_) {
    if (!arguments.length) return imgWidth
    imgWidth = _
    return this
  }

  this.imgHeight = function (_) {
    if (!arguments.length) return imgHeight
    imgHeight = _
    return this
  }

  this.eyeData = function (_) {
    if (!arguments.length) return eyeData
    eyeData = _
    return this
  }

  this.mouseData = function (_) {
    if (!arguments.length) return mouseData
    mouseData = _
    return this
  }

  return this
}
