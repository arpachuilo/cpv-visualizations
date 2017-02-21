function drawBbox (data) {
  var width = d3.select('#app-img').node().offsetWidth
  var height = 340

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
    .attr('x', function (d) { return x(d.bbox[0]) })
    .attr('y', function (d) { return y(d.bbox[1]) })
    .attr('width', function (d) { return x(d.bbox[2]) })
    .attr('height', function (d) { return x(d.bbox[3]) })
    .on('mouseover', function (d) {
      d3.select(this).attr('fill-opacity', 0.8)

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
      d3.select(this).attr('fill-opacity', 0.5)

      aoi.select('.ribbons').selectAll('path')
        .attr('fill-opacity', 0.67)
      aoi.select('.groups').selectAll('path')
        .attr('fill-opacity', 1)
    })
}
