function drawDataCoverage (matrix) {
  var svg = d3.select('#datacoverage')
  var width = +svg.attr('width')
  var height = +svg.attr('height')
  var outerRadius = Math.min(width, height) * 0.5 - 40
  var innerRadius = outerRadius - 30

  var arcTooltipFunction = function (d) {
    var filter = matrix.filters[d.index]
    var text = ''
    _.forOwn(filter, function(value, key) {
      text += '<label>' + key + ': ' + '</label>'

      if (key === 'AccessTime') {
        text += value[0] + ' to ' + value[1]
      } else {
        value.forEach(function(v, i) {
          text += v
          if (i !== value.length - 1) {
            text += '</br>'
          }
        })
      }
      text += '</br>'
    })

    return text === '' ? 'No Filters' : text
  }

  var chordTooltipFunction = function (d) {
    var text = d.source.value + ' to ' + d.target.value
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
      .sortSubgroups(d3.descending);

  var arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

  var ribbon = d3.ribbon()
      .radius(innerRadius);

  var max = 0
  for (var i = 0; i < matrix.values.length; i++) {
    for (var j = 0; j < matrix.values.length; j++) {
      if (matrix.values[i][j] > max) max = matrix.values[i][j]
    }
  }

  var color = d3.scaleLinear()
      .domain([0, max])
      .range(['brown', '#4682B4'])

  var g = svg.append('g')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
      .datum(chord(matrix.values))

  var group = g.append('g')
      .attr('class', 'groups')
    .selectAll('g')
      .data(function(chords) { return chords.groups; })
      .enter().append('g')

  var arcs = group
    .append('path')
      .attr('fill', function(d) { return color(d.value); })
      .attr('stroke', function(d) { return d3.rgb(color(d.value)).darker(); })
      .attr('d', arc)
      .on('mouseenter', function (d) {
        arcTip.show(d3.event, d)

        var attachedArcIds = []
        ribbons.filter(function (f) {
          var t = (f.source.index !== d.index) && (f.target.index !== d.index)
          if (!t) {
            attachedArcIds.push(f.source.index)
            attachedArcIds.push(f.target.index)
          }
          return t
        }).attr('fill-opacity', 0.1)
        arcs.filter(function(f) {
          return !(attachedArcIds.includes(f.index))
        }).attr('fill-opacity', 0.1)
      })
      .on('mousemove', function (d) {
        arcTip.show(d3.event, d)
      })
      .on('mouseout', function (d) {
        arcTip.hide(d3.event, d)
        arcs.attr('fill-opacity', 1)

        ribbons.attr('fill-opacity', 0.67)
      })

  var gRibbons = g.append('g')
      .attr('class', 'ribbons')

  var ribbons = gRibbons.selectAll('path')
    .data(function(chords) { return chords; })
    .enter().append('path')
      .attr('d', ribbon)
      .attr('fill', function(d) { return color(d.target.value); })
      .attr('stroke', function(d) { return d3.rgb(color(d.target.value)).darker(); })
      .on('mouseenter', function (d) {
        chordTip.show(d3.event, d)
        ribbons.attr('fill-opacity', 0.1)
        d3.select(this).attr('fill-opacity', 1)

        arcs.filter(function (f) {
          return (d.source.index !== f.index) && (d.target.index !== f.index)
        }).attr('fill-opacity', 0.1)
      })
      .on('mousemove', function (d) {
        chordTip.show(d3.event, d)
      })
      .on('mouseout', function (d) {
        chordTip.hide(d3.event, d)
        ribbons.attr('fill-opacity', 0.67)

        arcs.attr('fill-opacity', 1)
      })
}
