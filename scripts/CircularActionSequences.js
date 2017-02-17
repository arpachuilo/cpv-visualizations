var fKey = true
function drawCircularActionSequence (data, rawData, bounds = false) {
  var svg = d3.select('#as')
  var width = svg.node().parentNode.offsetWidth
  var height = +svg.attr('height')
  svg.attr('width', width)
  var outerRadius = Math.min(width, height) * 0.5 - 40
  var innerRadius = outerRadius - 30

  var matrix = data.outerMatrix
  var keys = data.outerKeys
  if (fKey !== null) {
    // var obj = generateActionSequence(rawData, bounds, 'pageChanged')
    // matrix = obj.matrix
    // keys = obj.keys
  }

  svg.selectAll('*').remove() // Doing this as temp patch job

  var arcTooltipFunction = function (d, i) {
    return keys[d.index] + ': ' + d.value + 's'
  }

  var chordTooltipFunction = function (d, i) {
    var text = keys[d.source.index] + ': ' + d.source.value + 's to ' + keys[d.target.index] + ': ' + d.target.value + 's'
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

  var chord = d3.chord()
      .padAngle(0.05)
      .sortSubgroups(d3.descending)

  var arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)

  var ribbon = d3.ribbon()
      .radius(innerRadius)

  // Arc
  var g = svg.append('g')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
      .datum(chord(matrix))

  var group = g.append('g')
      .attr('class', 'groups')
    .selectAll('g')
    .data(function(chords) { return chords.groups })
      .enter().append('g')

  var arcs = group.append('path')
    .attr('d', arc)
    .attr('id', function (d) { return keys[d.index] })
    .attr('class', function (d) { return keys[d.index] })
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
      }).attr('fill-opacity', 0.05)
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

  // Arc text
  var arcText = group.append('text')
    .attr('x', 6)
    .attr('dy', 15)

  arcText.append('textPath')
    .attr('xlink:href', function (d) { return '#' + keys[d.index] })
    .text(function (d) { return keys[d.index] })

  arcText.filter(function (d) {
    return arcs._groups[0][d.index].getTotalLength() / 2 - 16 < this.getComputedTextLength()
  }).remove()

  // Render ribbons
  var gRibbons = g.append('g')
      .attr('class', 'ribbons')

  var ribbons = gRibbons.selectAll('path')
    .data(function(chords) { return chords; })
    .enter().append('path')
      .attr('d', ribbon)
      .attr('class', function (d) { return keys[d.source.index] })
      .on('mouseenter', function (d) {
        chordTip.show(d3.event, d)
        ribbons.attr('fill-opacity', 0.05)
        d3.select(this).attr('fill-opacity', 0.67)

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
