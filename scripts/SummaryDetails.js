function drawSummaryDetails (obj) {
  // headers
  var headerList = document.getElementById('summary-headers')
  while (headerList.firstChild) {
    headerList.removeChild(headerList.firstChild)
  }

  for (var i = 0; i < obj.headers.length; i++) {
    var li = document.createElement('li')
    li.textContent = obj.headers[i]
    if (i > 2) {
      li.classList.add('hidden')
      li.classList.add('headerHidden')
    }
    headerList.appendChild(li)
  }

  if (document.contains(document.getElementById('headerMoreButton'))) {
    document.getElementById('headerMoreButton').remove()
  }
  if (obj.headers.length > 3) {
    var moreHeaderButton = document.createElement('a')
    moreHeaderButton.id = 'headerMoreButton'
    moreHeaderButton.textContent = 'more'
    moreHeaderButton.onclick = function () {
      var mb = document.getElementById('headerMoreButton')
      if (mb.textContent === 'more') {
        mb.textContent = 'less'
      } else {
        mb.textContent = 'more'
      }
      d3.selectAll('.headerHidden')
        .classed('hidden', function () {
          return !d3.select(this).classed('hidden')
        })
    }
    headerList.parentNode.appendChild(moreHeaderButton)
  }

  var actionList = document.getElementById('summary-actions')
  while (actionList.firstChild) {
    actionList.removeChild(actionList.firstChild)
  }

  // actions
  var actions = []
  Object.keys(obj).forEach(function (key) {
    if (key !== 'data' && key !== 'headers' && key !== 'tEnd' && key !== 'tStart') {
      actions.push({
        key: key,
        n: obj[key]
      })
    }
  })
  actions.sort(function (a, b) {
    return b.n - a.n
  })

  for (var i = 0; i < actions.length; i++) {
    var li = document.createElement('li')
    li.textContent = actions[i].key + ': ' + actions[i].n
    if (i > 2) {
      li.classList.add('hidden')
      li.classList.add('actionHidden')
    }
    actionList.appendChild(li)
  }

  if (document.contains(document.getElementById('actionMoreButton'))) {
    document.getElementById('actionMoreButton').remove()
  }
  if (actions.length > 3) {
    var moreActionButton = document.createElement('a')
    moreActionButton.id = 'actionMoreButton'
    moreActionButton.textContent = 'more'
    moreActionButton.onclick = function () {
      var mb = document.getElementById('actionMoreButton')
      if (mb.textContent === 'more') {
        mb.textContent = 'less'
      } else {
        mb.textContent = 'more'
      }
      d3.selectAll('.actionHidden')
        .classed('hidden', function () {
          return !d3.select(this).classed('hidden')
        })
    }
    actionList.parentNode.appendChild(moreActionButton)
  }

  // pois
  var poi = []
  for (var i = 0; i < obj.data.length; i++) {
    if ('filters' in obj.data[i]) {
      Object.keys(obj.data[i].filters).forEach(function (key) {
        if (key === 'SourceIP') {
          obj.data[i].filters[key].forEach(function (d) {
            var item = +d.split('.')[3]
            if (!poi.includes(item)) {
              poi.push(item)
            }
          })
        }
      })
    }
  }
  poi.sort(function (a, b) {
    return a - b
  })

  var poiList = document.getElementById('poi')
  poiList.textContent = poi.join(', ')

  // time windows
  var times = []
  for (var i = 0; i < obj.data.length; i++) {
    if ('filters' in obj.data[i]) {
      Object.keys(obj.data[i].filters).forEach(function (key) {
        if (key === 'AccessTime') {
          var accessTimes = obj.data[i].filters[key]
          var delta =  moment(accessTimes[1]).diff(moment(accessTimes[0]), 'days', true).toFixed(2)
          if (!times.includes(delta)) {
            times.push(delta)
          }
        }
      })
    }
  }

  times.sort(function (a, b) {
    return a < b
  })
  var timeList = document.getElementById('times')
  timeList.textContent = times.join(', ')
}
