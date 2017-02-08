function drawCircularAOI (matrix, keys) {
  var svg = d3.select('#aoi')
  var width = +svg.attr('width')
  var height = +svg.attr('height')
  var outerRadius = Math.min(width, height) * 0.5 - 40
  var innerRadius = outerRadius - 30

  var arcTooltipFunction = function (d, i) {
    return className(i) + ': ' + d.value + 's'
  }

  var chordTooltipFunction = function (d, i) {
    var text = className(d.source.index) + ': ' + d.source.value + 's to ' + className(d.target.index) + ': ' + d.target.value + 's'
    return text
  }

  var arcTip = new Tooltip()
    .attr('className', 'tooltip')
    .offset([-8, 0])
    .useMouseCoordinates(true)
    .html(arcTooltipFunction)

  var chordTip = new Tooltip()
    .attr('className', 'tooltip')
    .offset([-8, 0])
    .useMouseCoordinates(true)
    .html(chordTooltipFunction)

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
    .on('mouseenter', function (d, i) {
      arcTip.show(d3.event, d, i)
    })
    .on('mousemove', function (d, i) {
      arcTip.show(d3.event, d, i)
    })
    .on('mouseout', function (d, i) {
      arcTip.hide(d3.event, d, i)
    })

  g.append('g')
      .attr('class', 'ribbons')
    .selectAll('path')
    .data(function(chords) { return chords; })
    .enter().append('path')
      .attr('class', function (d) { return className(d.target.index)})
      .attr('d', ribbon)
      .on('mouseenter', function (d, i) {
        chordTip.show(d3.event, d, i)
      })
      .on('mousemove', function (d, i) {
        chordTip.show(d3.event, d, i)
      })
      .on('mouseout', function (d, i) {
        chordTip.hide(d3.event, d, i)
      })
}
