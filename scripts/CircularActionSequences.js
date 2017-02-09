function drawCircularActionSequence (data) {
  var svg = d3.select('#as')
  var width = +svg.attr('width')
  var height = +svg.attr('height')
  var outerRadius = Math.min(width, height) * 0.5 - 40
  var innerRadius = outerRadius - 30

  svg.selectAll('*').remove() // Doing this as temp patch job

  var arcTooltipFunction = function (d, i) {
    return data.outerKeys[d.index] + ': ' + d.value + 's'
  }

  var chordTooltipFunction = function (d, i) {
    var text = data.outerKeys[d.source.index] + ': ' + d.source.value + 's to ' + data.outerKeys[d.target.index] + ': ' + d.target.value + 's'
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

  var outerArc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)

  var middleArc = d3.arc()
      .innerRadius(innerRadius - 30)
      .outerRadius(innerRadius)

  var innerArc = d3.arc()
      .innerRadius(innerRadius - 60)
      .outerRadius(innerRadius - 30)

  var ribbon = d3.ribbon()
      .radius(innerRadius)

  var outerColors = d3.scaleOrdinal(d3.schemeCategory20 )
      .domain(data.outerKeys)

  var middleColors = d3.scaleOrdinal(d3.schemeCategory20b  )
      .domain(data.middleKeys)

  var innerColors = d3.scaleSequential(d3.interpolateRainbow)
    .domain([0, data.innerKeys.length])

  // Outer Arc
  var outerG = svg.append('g')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
      .datum(chord(data.outerMatrix))

  var outerGroup = outerG.append('g')
      .attr('class', 'groups')
    .selectAll('g')
    .data(function(chords) { return chords.groups })
      .enter().append('g')

  var arc = outerGroup.append('path')
    .attr('d', outerArc)
    .attr('fill', function (d) { return outerColors(data.outerKeys[d.index]) })
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
      arc.filter(function(f) {
        return !(attachedArcIds.includes(f.index))
      }).attr('fill-opacity', 0.1)
    })
    .on('mousemove', function (d) {
      arcTip.show(d3.event, d)
    })
    .on('mouseout', function (d) {
      arcTip.hide(d3.event, d)
      arc.attr('fill-opacity', 1)

      ribbons.attr('fill-opacity', 0.67)
    })

  // Middle Arc
  // var middleG = svg.append('g')
  //     .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
  //     .datum(chord(data.middleMatrix))
  //
  // var middleGroup = middleG.append('g')
  //     .attr('class', 'groups')
  //   .selectAll('g')
  //   .data(function(chords) { return chords.groups })
  //     .enter().append('g')
  //
  // var middleArcs = middleGroup.append('path')
  //   .attr('d', middleArc)
  //   .attr('fill', function (d) { return middleColors(data.middleKeys[d.index]) })
  //   .on('mouseenter', function (d, i) {})
  //   .on('mousemove', function (d, i) {})
  //   .on('mouseout', function (d, i) {})
  //
  // // Inner Arc
  // var innerG = svg.append('g')
  //     .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
  //     .datum(chord(data.innerMatrix))
  //
  // var innerGroup = innerG.append('g')
  //     .attr('class', 'groups')
  //   .selectAll('g')
  //   .data(function(chords) { return chords.groups })
  //     .enter().append('g')
  //
  // var innerArcs = innerGroup.append('path')
  //   .attr('d', innerArc)
  //   .attr('fill', function (d) { return innerColors(d.index) })
  //   .on('mouseenter', function (d, i) {})
  //   .on('mousemove', function (d, i) {})
  //   .on('mouseout', function (d, i) {})

  // Render ribbons
  var gRibbons = outerG.append('g')
      .attr('class', 'ribbons')

  var ribbons = gRibbons.selectAll('path')
    .data(function(chords) { return chords; })
    .enter().append('path')
      .attr('d', ribbon)
      .attr('fill', function (d) { return outerColors(data.outerKeys[d.source.index] )})
      .on('mouseenter', function (d) {
        chordTip.show(d3.event, d)
        ribbons.attr('fill-opacity', 0.05)
        d3.select(this).attr('fill-opacity', 0.67)

        outerArcs.filter(function (f) {
          return (d.source.index !== f.index) && (d.target.index !== f.index)
        }).attr('fill-opacity', 0.1)
      })
      .on('mousemove', function (d) {
        chordTip.show(d3.event, d)
      })
      .on('mouseout', function (d) {
        chordTip.hide(d3.event, d)

        ribbons.attr('fill-opacity', 0.67)
        outerArcs.attr('fill-opacity', 1)
      })
}
