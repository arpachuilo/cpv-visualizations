function drawCircularAOI (matrix, keys) {
  var svg = d3.select('#aoi')
  var width = +svg.attr('width')
  var height = +svg.attr('height')
  var outerRadius = Math.min(width, height) * 0.5 - 40
  var innerRadius = outerRadius - 30
  svg.selectAll('*').remove() // Doing this as temp patch job

  var chord = d3.chord()
      .padAngle(0.05)
      .sortSubgroups(d3.descending)

  var arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)

  var ribbon = d3.ribbon()
      .radius(innerRadius)

  var className = d3.scaleOrdinal()
      .domain(d3.range(keys.length))
      .range(keys)

  var g = svg.append('g')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
      .datum(chord(matrix))

  var group = g.append('g')
      .attr('class', 'groups')
    .selectAll('g')
    .data(function(chords) { return chords.groups; })
    .enter().append('g')

  group.append('path')
    .attr('class', function (d) { return className(d.index)})
    .attr('d', arc)

  g.append('g')
      .attr('class', 'ribbons')
    .selectAll('path')
    .data(function(chords) { return chords; })
    .enter().append('path')
      .attr('class', function (d) { return className(d.target.index)})
      .attr('d', ribbon)
}
