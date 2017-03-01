function AOIQuilt(selection) {
  var selection = selection
  var data = []

  var width = selection.node().offsetWidth
  var height = 340
  var margin = {
    top: 12,
    left: 45,
    bottom: 20,
    right: 5
  }

  var title = ''

  var xAxisEnabled = true
  var yAxisEnabled = true
  var clickHandler = function () {}

  var keys = [
    'detailHist',
    'graph',
    'offices',
    'overviewHist',
    'table'
  ]

  // init chart here
  var svg, gChart, gXaxis, gYaxis, gTitle, gOverlay
  var chartWidth, chartHeight
  var x, y

  var xDomain = [0, 90]

  selection.each(function (d) {
    //Select the svg element, if it exists
    svg = d3.select(this).selectAll('svg').data([d])

    //Otherwise, create the skeletal chart
    var gEnter = svg.enter().append('svg')

    x = d3.scaleLinear()
    y = d3.scaleBand()

    gEnter
      .attr('width', width)
      .attr('height', height)

    gChart = gEnter.append('g')
      .attr('class', 'chart')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    gOverlay = gEnter.append('g')
      .attr('class', 'overlay')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    gTitle = gEnter.append('g')
      .attr('class', 'title')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    gXaxis = gEnter.append('g')
      .attr('class', 'x axis')

    gYaxis = gEnter.append('g')
      .attr('class', 'y axis')
  })

  this.update = function () {
    gChart.selectAll('*').remove()
    gXaxis.selectAll('*').remove()
    gYaxis.selectAll('*').remove()

    chartWidth = width - margin.left - margin.right
    chartHeight = height - margin.bottom - margin.top

    x = x
      .domain([0, d3.max(data, function (d) {
        return d.xMax
      })])
      .range([0, chartWidth])

    y = y
      .domain(data.map(function (d) {
        return d.id
      }))
      .range([chartHeight, 0])

    gChart = gChart.selectAll('g')
        .data(data, function (d) {
          return d.id
        })
      .enter().append('g') //setup onclick
        .attr('class', 'thread')
        .attr('transform', function (d) { return 'translate(' + 0 + ',' + y(d.id) + ')' })

    gChart.selectAll('rect')
        .data(function (d) {
          var _zip = []
          for (var i = 0; i < d.mouseTimeBin.length; i++) {
            var m_max = 0
            var m_key = ''
            for (var j = 0; j < keys.length; j++) {
              if (d.mouseTimeBin[i][keys[j]] >= m_max) {
                m_key = keys[j]
                m_max = d.mouseTimeBin[i][keys[j]]
              }
            }

            var e_max = 0
            var e_key = ''
            for (var j = 0; j < keys.length; j++) {
              if (d.eyeTimeBin[i][keys[j]] >= e_max) {
                e_key = keys[j]
                e_max = d.eyeTimeBin[i][keys[j]]
              }
            }

            _zip.push({
              eyeKey: e_key,
              mouseKey: m_key,
              startTime: d.mouseTimeBin[i].startTime
            })
          }
          return _zip
        })
      .enter().append('rect')
        .attr('class', function (d) { return d.eyeKey })
        .attr('fill-opacity', function (d) { return (d.eyeKey === d.mouseKey) ? 1 : 0.5; })
        .attr('height', y.bandwidth())
        .attr('width', function (d, i, j) { return chartWidth / j.length })
        .attr('x', function (d) { return x(d.startTime) })

    gOverlay.selectAll('rect')
          .data(data)
      .enter().append('rect') //setup onclick
        .attr('x', 0)
        .attr('y', function (d) { return y(d.id) })
        .attr('height', y.bandwidth())
        .attr('width', chartWidth)
        .attr('fill', '#FFF')
        .attr('fill-opacity', 0)
        .style('cursor', 'pointer')
        .on('click', function (d) {
          clickHandler(d.index)
        })
        .on('mouseover', function (d) {
          d3.select(this)
            .attr('fill-opacity', 0.3)
        })
        .on('mouseout', function (d) {
          d3.select(this)
            .attr('fill-opacity', 0)
        })

    gTitle.append('text')
      .text(title)

    gXaxis
      .attr('transform', 'translate(' + margin.left + ',' + (height - margin.bottom) + ')')
      .call(d3.axisBottom(x).tickFormat(function (t) {
        return moment.duration(t, 'ms').format('m:ss')
      }))

    gYaxis
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .call(d3.axisLeft(y))
  }

  this.margin = function (_) {
    if (!arguments.length) return margin
    margin = _
    return this
  }

  this.title = function (_) {
    if (!arguments.length) return title
    title = _
    this.resizeFunc()
    return this
  }

  this.data = function (_) {
    if (!arguments.length) return data
    data = _
    return this
  }

  this.clickHandler = function (_) {
    if (!arguments.length) return clickHandler
    clickHandler = _
    return this
  }

  this.resizeFunc = function (_) {

    return this
  }

  return this
}
