function drawBbox (data) {
  var width = 1280
  var height = 720

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

  bboxes.enter().append('rect')
    .attr('class', function (d) { return d.key })
    .attr('x', function (d) { return x(d.bbox[0]) })
    .attr('y', function (d) { return y(d.bbox[1]) })
    .attr('width', function (d) { return x(d.bbox[2]) })
    .attr('height', function (d) { return x(d.bbox[3]) })
}
