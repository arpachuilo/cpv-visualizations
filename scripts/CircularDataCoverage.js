function drawDataCoverage (matrix) {
  var svg = d3.select('#datacoverage')
  var width = +svg.attr('width')
  var height = +svg.attr('height')
  var outerRadius = Math.min(width, height) * 0.5 - 40
  var innerRadius = outerRadius - 30
  svg.selectAll('*').remove() // Doing this as temp patch job

  var chord = d3.chord()
      .padAngle(0.05)
      .sortSubgroups(d3.descending);

  var arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

  var ribbon = d3.ribbon()
      .radius(innerRadius);

  var max = 0
  for (var i = 0; i < matrix.length; i++) {
    for (var j = 0; j < matrix.length; j++) {
      if (matrix[i][j] > max) max = matrix[i][j]
    }
  }

  var color = d3.scaleLinear()
      .domain([0, max])
      .range(['#FFFFFF', '#4682B4'])

  var g = svg.append('g')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
      .datum(chord(matrix))

  var group = g.append('g')
      .attr('class', 'groups')
    .selectAll('g')
      .data(function(chords) { return chords.groups; })
      .enter().append('g')

  group
    .append('path')
      .attr('fill', function(d) { return color(d.value); })
      .attr('stroke', function(d) { return d3.rgb(color(d.value)).darker(); })
      .attr('d', arc)
    .append('svg:title')
      .text(function (d) {
        return d.value
      })


  g.append('g')
      .attr('class', 'ribbons')
    .selectAll('path')
    .data(function(chords) { return chords; })
    .enter().append('path')
      .attr('d', ribbon)
      .attr('fill', function(d) { return color(d.target.value); })
      .attr('stroke', function(d) { return d3.rgb(color(d.target.value)).darker(); })
    .append('svg:title')
      .text(function (d) {
        return d.source.value + ' to ' + d.target.value
      })
}
