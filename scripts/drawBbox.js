function drawBbox (data) {
  var width = d3.select('#app-img').node().offsetWidth
  var height = 400

  var strokeWidth = 4

  var svg = d3.select('#bbox-overlay')
    .attr('width', width)
    .attr('height', height)

  var x = d3.scaleLinear()
    .domain([0, 1920])
    .range([0, width])
  var y = d3.scaleLinear()
    .domain([0, 1080])
    .range([0, height])

  gEnter = svg.append('g')

  var bboxes = gEnter.selectAll('.bbox')
    .data(data, function (d) {
      return d.key
    })

  var aoi = d3.select('#aoi')
  bboxes.enter().append('rect')
    .attr('class', function (d) { return d.key })
    .attr('x', function (d) {
      var offset = strokeWidth / 2
      if (d.isRight) {
        offset = offset * 2
      }
      return x(d.bbox[0]) + offset
    })
    .attr('y', function (d) {
      var offset = strokeWidth / 2
      if (d.isBelow) {
        offset = offset * 2
      }
      return y(d.bbox[1]) + offset
    })
    .attr('width', function (d) {
      var offset = strokeWidth / 2
      if (d.isRight) {
        offset = offset * 3
      }
      return x(d.bbox[2]) - offset
    })
    .attr('height', function (d) {
      var offset = strokeWidth / 2
      if (d.isBottom) {
        offset = offset * 3
      } else if (d.isBelow) {
        offset = offset * 2
      }
      return x(d.bbox[3]) - offset
    })
    .style('stroke-width', strokeWidth)
    .on('mouseover', function (d) {
      // d3.select(this).attr('fill-opacity', 0.8)

      aoi.select('.ribbons').selectAll('path')
        .filter(function (f) {
          return d3.select(this).attr('class') !== d.key
        }).attr('fill-opacity', 0.05)
      aoi.select('.groups').selectAll('path')
        .filter(function (f) {
          return d3.select(this).attr('class') !== d.key
        }).attr('fill-opacity', 0.1)
    })
    .on('mouseout', function (d) {
      // d3.select(this).attr('fill-opacity', 0.5)

      aoi.select('.ribbons').selectAll('path')
        .attr('fill-opacity', 0.67)
      aoi.select('.groups').selectAll('path')
        .attr('fill-opacity', 1)
    })
}
