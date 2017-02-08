function functor (f) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key]
  }

  return typeof f === 'function' ? f.apply(undefined, args) : f
}

// Cross browser helpers
function getWidth () {
  if (self.innerWidth) {
    return self.innerWidth
  }

  if (document.documentElement && document.documentElement.clientWidth) {
    return document.documentElement.clientWidth
  }

  if (document.body) {
    return document.body.clientWidth
  }
}

function getHeight () {
  if (self.innerHeight) {
    return self.innerHeight
  }

  if (document.documentElement && document.documentElement.clientHeight) {
    return document.documentElement.clientHeight
  }

  if (document.body) {
    return document.body.clientHeight
  }
}

function scrollTop () {
  if (document.documentElement && document.documentElement.scrollTop) {
    return document.documentElement.scrollTop
  }

  if (document.body) {
    return document.body.scrollTop
  }
}

function scrollLeft () {
  if (document.documentElement && document.documentElement.scrollLeft) {
    return document.documentElement.scrollLeft
  }

  if (document.body) {
    return document.body.scrollLeft
  }
}

function flattenData (data) {
  var flat = []

  Object.keys(data[0]).forEach(function (key) {
    if (key !== 'id') {
      data[0][key].forEach(function (d) {
        if (d.eventType !== 'click' && d.eventType !== 'brushStart' && d.eventType !== 'brushEnd' && d.eventType !== 'mouseup' && d.eventType !== 'keyup') {
          d.id = key
          d.time = moment(d.date)
          flat.push(d)
        }
      })
    }
  })

  flat.sort(function (a, b) {
    return a.time - b.time
  })

  return flat;
}

function timeBinData (data, numBins = 20) {
  var subKeys = {
    'officesCleared': 'offices',
    'officeMouseEnter': 'offices',
    'officeClicked': 'offices',
    'sliderMoved': 'offices',
    'accessTimeClicked': 'table',
    'histogramBrushStart': 'overviewHist',
    'histogramBrushEnd': 'overviewHist',
    'headerClicked': 'table',
    'rowClicked': 'table',
    'rowMouseOver': 'table',
    'tableToggleSelected': 'table',
    'pageChange': 'table',
    'histogramBarClick': 'detailHist',
    'histogramBarMouseEnter': 'detailHist',
    'graphNodeMouseEnter': 'graph'
  }

  var timeExtent = d3.extent(data, function (d) {
    return d.time
  })

  var elapsedTime = timeExtent[1] - timeExtent[0]
  var interval = elapsedTime / numBins

  var initBins = []
  for (var i = 1; i <= numBins; i++) {
    initBins.push(
      data.filter(function (d) {
        return timeExtent[0] + interval * (i - 1) <= d.time &&
          d.time < timeExtent[0] + interval * i &&
          d.id !== 'mouseEnter'
      })
    )
  }

  var bins = []
  for (var i = 0; i < initBins.length; i++) {
    bins.push({
      'startTime': timeExtent[0] + interval * i,
      'endTime': timeExtent[0] + interval * (i + 1),
      'overviewHist': 0,
      'detailHist': 0,
      'graph': 0,
      'table': 0,
      'offices': 0,
      'total': 0
    })

    for (var j = 0; j < initBins[i].length; j++) {
      var key = subKeys[initBins[i][j].id]
      bins[i][key] += 1
      bins[i].total += 1
    }
  }
  return bins
}

function convertDataForCoverage (data, bounds = false) {
  // Filter data
  var data = data.filter(function (d) {
    return (bounds ? (
      bounds[0] <= d.time && d.time <= bounds[1]
    ) : true) && d.id !== 'mouseEnter'
  })

  // First pass get possible filter settings
  var filters = []
  for (var i = 0; i < data.length; i++) {

    var exist = false
    for (var j = 0; j < filters.length; j++) {
      if (_.isEqual(filters[j], data[i].filters)) {
        var exist = true
        break
      }
    }

    if (!exist) {
      filters.push(data[i].filters)
    }
  }

  function getFilterIndex (f) {
    var index = -1
    for (var x = 0; x < filters.length; x++) {
      if (_.isEqual(filters[x], f)) {
        index = x
        break
      }
    }
    return index
  }

  var matrix = []
  for (var i = 0; i < filters.length; i++) {
    matrix.push([])
    for (var j = 0; j < filters.length; j++) {
      matrix[i].push(0)
    }
  }

  var previousFilter = null
  var previousTime = null
  for (var i = 0; i < data.length; i++) {
    if (previousFilter === null || previousTime === null) {
      previousFilter = data[i].filters
      previousTime = data[i].time
    }
    if (!(_.isEqual(previousFilter, data[i].filters)) || i === data.length - 1) {
      var fromIndex = getFilterIndex(previousFilter)
      var toIndex = getFilterIndex(data[i].filters)

      timeLapsed = data[i].time - previousTime

      matrix[fromIndex][toIndex] += timeLapsed / 1000
      previousFilter = data[i].filters
      previousTime = data[i].time
    }
  }

  return {
    values: matrix,
    filters: filters
  }
}

function convertDataForAOI (data, bounds = false) {
  // Filter data
  var data = data.filter(function (d) {
    return (bounds ? (
      bounds[0] <= d.time && d.time <= bounds[1]
    ) : true) && d.id !== 'mouseEnter'
  })

  var keys = {
    'overviewHist': 0,
    'detailHist': 1,
    'graph': 2,
    'table': 3,
    'offices': 4
  }

  var subKeys = {
    'officesCleared': 'offices',
    'officeMouseEnter': 'offices',
    'officeClicked': 'offices',
    'sliderMoved': 'offices',
    'accessTimeClicked': 'table',
    'histogramBrushStart': 'overviewHist',
    'histogramBrushEnd': 'overviewHist',
    'headerClicked': 'table',
    'rowClicked': 'table',
    'rowMouseOver': 'table',
    'tableToggleSelected': 'table',
    'pageChange': 'table',
    'histogramBarClick': 'detailHist',
    'histogramBarMouseEnter': 'detailHist',
    'graphNodeMouseEnter': 'graph'
  }

  var matrix = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
  ]

  var previousId = null
  var previousTime = null
  for (let i = 0; i < data.length; i++) {
    if (previousId === null || previousTime === null) {
      previousId = data[i].id
      previousTime = data[i].time
    }
    if (previousId !== data[i].id || i === data.length - 1) {
      timeLapsed = data[i].time - previousTime

      var fromIndex = +keys[subKeys[previousId]]
      var toIndex = +keys[subKeys[data[i].id]]
      matrix[fromIndex][toIndex] += timeLapsed / 1000
      previousId = data[i].id
      previousTime = data[i].time
    }
  }

  return matrix
}
