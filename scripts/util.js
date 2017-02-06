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

function convertDataForAOI (data) {
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

  var converted = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
  ];

  var previousId = ''
  var previousTime = ''
  for (let i = 0; i < data.length; i++) {
    if (data[i].id !== 'mouseEnter') {
      if (previousId === '' || previousTime === '') {
        previousId = data[i].id
        previousTime = data[i].time
      }
      if (previousId !== data[i].id) {
        var fromIndex = +keys[subKeys[previousId]]
        var toIndex = +keys[subKeys[data[i].id]]

        if (fromIndex !== toIndex) {
          timeLapsed = data[i].time - previousTime

          converted[fromIndex][toIndex] += timeLapsed
          previousId = data[i].id
          previousTime = data[i].time
        }
      }
    }
  }
  for (let i = 0; i < converted.length; i++) {
    for (let j = 0; j < converted[i].length; j++) {
      converted[i][j] = converted[i][j] / 1000
    }
  }
  console.table(converted)
  return converted;
}
