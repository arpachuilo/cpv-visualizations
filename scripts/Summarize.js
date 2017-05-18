function summarize (selection, summary) {
  var table = document.createElement('table')
  table.classList.add('heatmap-summary')

  var headerInfo = document.createElement('tr')
  var headerLabel = document.createElement('td')

  var headerData = document.createElement('td')
  var headerText = []
  for (var i = 0; i < summary.headers.length; i++) {
    headerText.push(summary.headers[i])
  }
  headerText = headerText.filter(function(item, i, arr) { return arr.indexOf(item) === i })

  headerInfo.appendChild(headerLabel)
  headerInfo.appendChild(headerData)

  table.appendChild(headerInfo)

  headerLabel.textContent = 'Table Headers Used'
  headerData.textContent = headerText.join(', ')

  var timeInfo = document.createElement('tr')
  var timeLabel = document.createElement('td')
  var timeData = document.createElement('td')

  var times = []
  var times = []
  for (var i = 0; i < summary.data.length; i++) {
    if ('filters' in summary.data[i]) {
      Object.keys(summary.data[i].filters).forEach(function (key) {
        if (key === 'AccessTime') {
          var accessTimes = summary.data[i].filters[key]
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

  timeInfo.appendChild(timeLabel)
  timeInfo.appendChild(timeData)

  table.appendChild(timeInfo)

  timeLabel.textContent = 'Time Windows Observed'
  if (times.length > 0) {
    timeData.textContent = times.join('d, ') + 'd'    
  }

  selection.appendChild(table)
}
