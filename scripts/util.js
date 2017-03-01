// NOTE: Each bbox is defined as [x, y, width, height]
var bboxArray = [
  {
    key: 'detailHist',
    bbox: [0, 0, 1085, 331],
    isBelow: false,
    isRight: false,
    isBottom: false
  }, {
    key: 'overviewHist',
    bbox: [0, 331, 1085, 223],
    isBelow: true,
    isRight: false,
    isBottom: false
  }, {
    key: 'graph',
    bbox: [0, 554, 1085, 526],
    isBelow: true,
    isRight: false,
    isBottom: true
  }, {
    key: 'offices',
    bbox: [1085, 0, 835, 303],
    isBelow: false,
    isRight: true,
    isBottom: false
  }, {
    key: 'info',
    bbox: [1085, 303, 835, 192],
    isBelow: true,
    isRight: true,
    isBottom: false
  }, {
    key: 'table',
    bbox: [1085, 495, 835, 585],
    isBelow: true,
    isRight: true,
    isBottom: true
  }
]


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

function timeBinInteractionData (data, numBins = 20) {
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

  var timeExtent = [0, d3.max(data, function (d) {
    return +d.date
  })]

  var elapsedTime = timeExtent[1] - timeExtent[0]
  var interval = elapsedTime / numBins

  var initBins = []
  for (var i = 1; i <= numBins; i++) {
    initBins.push(
      data.filter(function (d) {
        return timeExtent[0] + interval * (i - 1) <= d.date &&
          d.date < timeExtent[0] + interval * i &&
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

function timeBinEyeData (data, numBins = 20) {

  var timeExtent = [0, d3.max(data, function (d) {
    return +d.time
  })]

  var elapsedTime = timeExtent[1] - timeExtent[0]
  var interval = elapsedTime / numBins

  var initBins = []
  for (var i = 1; i <= numBins; i++) {
    initBins.push(
      data.filter(function (d) {
        return timeExtent[0] + interval * (i - 1) <= (+d.time) &&
          (+d.time) < timeExtent[0] + interval * i &&
          d.aoi !== 'none' &&
          d.aoi !== 'officesKey' &&
          d.aoi !== 'info'
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
      var key = initBins[i][j].aoi
      bins[i][key] += 1
      bins[i].total += 1
    }
  }

  return bins
}

function numFiltersOverTime (data) {
  var filter_arr = []

  function getNumberOfFilters (obj) {
    var total = 0
    _.forOwn(obj, function(value, key) {

      if (key === 'AccessTime') {
        total += 1
      } else {
        value.forEach(function(v, i) {
          total += 1
        })
      }
    })
    return total
  }

  for (var i = 0; i < data.length; i++) {

    var exist = false
    if (filter_arr.length > 0) {
      if (_.isEqual(filter_arr[filter_arr.length - 1].filters, data[i].filters)) {
        exist = true
      }
    }

    if (!exist) {
      filter_arr.push({
        filters: data[i].filters,
        numFilters: getNumberOfFilters(data[i].filters),
        time: data[i].date
      })
    }
  }

  return filter_arr
}

function convertDataForCoverage (data, bounds = false) {
  // Filter data
  data = data.filter(function (d) {
    return (bounds ? (
      bounds[0] <= d.date && d.date <= bounds[1]
    ) : true) && d.id !== 'mouseEnter'
  })

  // First pass get possible filter settings
  var filters = []
  for (var i = 0; i < data.length; i++) {

    var exist = false
    for (var j = 0; j < filters.length; j++) {
      if (_.isEqual(filters[j], data[i].filters)) {
        exist = true
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
      previousTime = data[i].date
    }
    if (!(_.isEqual(previousFilter, data[i].filters)) || i === data.length - 1) {
      var fromIndex = getFilterIndex(previousFilter)
      var toIndex = getFilterIndex(data[i].filters)

      timeLapsed = data[i].date - previousTime

      matrix[fromIndex][toIndex] += timeLapsed / 1000
      previousFilter = data[i].filters
      previousTime = data[i].date
    }
  }

  return {
    values: matrix,
    filters: filters
  }
}

function convertDataForAOI (data, bounds = false) {
  // Filter data
  data = data.filter(function (d) {
    return (bounds ? (
      bounds[0] <= d.date && d.date <= bounds[1]
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

  var matrix = []
  for (var i = 0; i < Object.keys(keys).length; i++) {
    matrix.push([])
    for (var j = 0; j < Object.keys(keys).length; j++) {
      matrix[i].push(0)
    }
  }

  var previousKey = null
  var previousTime = null
  for (let i = 0; i < data.length; i++) {
    if (previousKey === null || previousTime === null) {
      previousKey = subKeys[data[i].id]
      previousTime = data[i].date
    }
    if (previousKey !== subKeys[data[i].id] || data.length - 1 === i) {
      timeLapsed = data[i].date - previousTime

      var fromIndex = +keys[previousKey]
      var toIndex = +keys[subKeys[data[i].id]]

      matrix[fromIndex][toIndex] += timeLapsed / 1000

      previousKey = subKeys[data[i].id]
      previousTime = data[i].date
    }
  }

  return matrix
}

function convertDataForActionSequence (data, bounds = false) {
  // Filter data
  data = data.filter(function (d) {
    return (bounds ? (
      bounds[0] <= d.date && d.date <= bounds[1]
    ) : true) && d.id !== 'mouseEnter'
  })

  // Get keyings for each matrix
  var outerKeys = [] // keys themselves
  var middleKeys = [] // event types
  var innerKeys = [] // targets
  for (var i = 0; i < data.length; i++) {
    // Out keyings
    var outerExist = false
    for (var j = 0; j < outerKeys.length; j++) {
      if (_.isEqual(outerKeys[j], data[i].id)) {
        outerExist = true
        break
      }
    }

    if (!outerExist) {
      outerKeys.push(data[i].id)
    }

    // Middle keyings
    var middleExist = false
    for (var j = 0; j < middleKeys.length; j++) {
      if (_.isEqual(middleKeys[j], data[i].eventType)) {
        middleExist = true
        break
      }
    }

    if (!middleExist) {
      middleKeys.push(data[i].eventType)
    }

    // Inner keyings
    var innerExist = false
    for (var j = 0; j < innerKeys.length; j++) {
      if (_.isEqual(innerKeys[j], data[i].target)) {
        innerExist = true
        break
      }
    }

    if (!innerExist) {
      innerKeys.push(data[i].target)
    }
  }

  // Init matrices
  var outerMatrix = []
  var middleMatrix = []
  var innerMatrix = []

  // Init outer
  for (var i = 0; i < outerKeys.length; i++) {
    outerMatrix.push([])
    for (var j = 0; j < outerKeys.length; j++) {
      outerMatrix[i].push(0)
    }
  }

  // Init middle
  for (var i = 0; i < middleKeys.length; i++) {
    middleMatrix.push([])
    for (var j = 0; j < middleKeys.length; j++) {
      middleMatrix[i].push(0)
    }
  }

  // Init inner
  for (var i = 0; i < innerKeys.length; i++) {
    innerMatrix.push([])
    for (var j = 0; j < innerKeys.length; j++) {
      innerMatrix[i].push(0)
    }
  }

  function getKeyIndex (f, k) {
    var index = -1
    for (var x = 0; x < k.length; x++) {
      if (_.isEqual(k[x], f)) {
        index = x
        break
      }
    }
    return index
  }

  // Populate matrices
  var previousOuter = null
  var previousOuterTime = null
  var previousMiddle = null
  var previousMiddleTime = null
  var previousInner = null
  var previousInnerTime = null
  for (var i = 0; i < data.length; i++) {
    if (previousOuter === null || previousOuterTime === null) {
      previousOuter = data[i].id
      previousOuterTime = data[i].date
      previousMiddle = data[i].eventType
      previousMiddleTime = data[i].date
      previousInner = data[i].target
      previousInnerTime = data[i].date
    }

    // Outer
    if (!(_.isEqual(previousOuter, data[i].id)) || i === data.length - 1) {
      var fromIndex = getKeyIndex(previousOuter, outerKeys)
      var toIndex = getKeyIndex(data[i].id, outerKeys)

      var outerTimeElapsed = data[i].date - previousOuterTime

      outerMatrix[fromIndex][toIndex] += outerTimeElapsed / 1000
      previousOuter = data[i].id
      previousOuterTime = data[i].date
    }

    // Middle
    if (!(_.isEqual(previousMiddle, data[i].eventType)) || i === data.length - 1) {
      var fromIndex = getKeyIndex(previousMiddle, middleKeys)
      var toIndex = getKeyIndex(data[i].eventType, middleKeys)

      middleTimeElapsed = data[i].date - previousMiddleTime
      middleMatrix[fromIndex][toIndex] += middleTimeElapsed / 1000
      previousMiddle = data[i].eventType
      previousMiddleTime = data[i].date
    }

    // Inner
    if (!(_.isEqual(previousInner, data[i].target)) || i === data.length - 1) {
      var fromIndex = getKeyIndex(previousInner, innerKeys)
      var toIndex = getKeyIndex(data[i].target, innerKeys)

      var innerTimeElapsed = data[i].date - previousInnerTime

      innerMatrix[fromIndex][toIndex] += innerTimeElapsed / 1000
      previousInner = data[i].target
      previousInnerTime = data[i].date
    }
  }

  return {
    outerMatrix: outerMatrix,
    middleMatrix: middleMatrix,
    innerMatrix: innerMatrix,
    outerKeys: outerKeys,
    middleKeys: middleKeys,
    innerKeys: innerKeys
  }
}

function generateActionSequence (data, bounds = false, key = false) {
  data = data.filter(function (d) {
    return (bounds ? (
      bounds[0] <= d.date && d.date <= bounds[1]
    ) : true) && d.id !== 'mouseEnter' && (key ? true : d.id === key)
  })

  function getKeyIndex (f, k) {
    var index = -1
    for (var x = 0; x < k.length; x++) {
      if (_.isEqual(k[x], f)) {
        index = x
        break
      }
    }
    return index
  }

  // Get keyings for each matrix
  var keys = []
  for (var i = 0; i < data.length; i++) {

    // Inner keyings
    var exist = false
    for (var j = 0; j < keys.length; j++) {
      if (_.isEqual(keys[j], data[i].target)) {
        exist = true
        break
      }
    }

    if (!exist) {
      keys.push(data[i].target)
    }
  }

  var matrix = []

  // Init matrix
  for (var i = 0; i < keys.length; i++) {
    matrix.push([])
    for (var j = 0; j < keys.length; j++) {
      matrix[i].push(0)
    }
  }

  var prevTarget = null
  var prevTime = null
  for (var i = 0; i < data.length; i++) {
    if (prevTarget === null || prevTime === null) {
      prevTarget = data[i].target
      prevTime = data[i].date
    }

    // Inner
    if (!(_.isEqual(prevTarget, data[i].target)) || i === data.length - 1) {
      var fromIndex = getKeyIndex(prevTarget, keys)
      var toIndex = getKeyIndex(data[i].target, keys)

      var elapsed = data[i].date - prevTime

      matrix[fromIndex][toIndex] += elapsed / 1000
      prevTarget = data[i].target
      prevTime = data[i].date
    }
  }

  return {
    matrix: matrix,
    keys: key
  }
}
