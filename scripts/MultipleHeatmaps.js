function MultipleHeatmaps (el, fn) {
  var el = el
  var fn = fn

  var eyeData = []
  var mouseData = []
  var segments = []
  var summary = []
  var inflections = []

  this.drawHeatmaps = function () {
    // Clear old version
    while (el.firstChild) {
        el.removeChild(el.firstChild)
    }

    for (var i = 0; i < segments.length - 1; i++) {
      var container = document.createElement('div')
      container.style.display = 'inline-block'
      container.classList.add('heatmapContainer')
      container.addEventListener('click', fn.bind(null, i))

      var topContainer = document.createElement('div')
      var bottomContainer = document.createElement('div')

      var leftContainer = document.createElement('div')
      leftContainer.style.display = 'inline-block'
      var rightContainer = document.createElement('div')
      rightContainer.style.display = 'inline-block'

      var heatmap = document.createElement('canvas')

      // var times = document.createElement('div')
      //
      // var t0 = document.createElement('span')
      // t0.style.float = 'left'
      // t0.innerText = moment.duration(segments[i], 'ms').format('m:ss')
      //
      // var t1 = document.createElement('span')
      // t1.style.float = 'right'
      // t1.innerText = moment.duration(segments[i + 1], 'ms').format('m:ss')
      //
      // times.appendChild(t0)
      // times.appendChild(t1)

      rightContainer.appendChild(heatmap)
      // rightContainer.appendChild(times)

      var e = eyeData.filter(function (d) {
        return d.time < segments[i + 1] &&
         d.time >= segments[i] &&
         d.x !== '-nan(ind)' &&
         d.y !== '-nan(ind)'
       })

      var m = mouseData.filter(function (d) {
        return d.date < segments[i + 1] &&
         d.date >= segments[i]
       })

      bottomContainer.appendChild(leftContainer)
      bottomContainer.appendChild(rightContainer)

      container.appendChild(topContainer)
      container.appendChild(bottomContainer)

      el.appendChild(container)
      timeBar(leftContainer, segments[0], segments[segments.length - 1], segments[i], segments[i + 1], inflections)

      summarize(topContainer, summary[i])

      Heatmap(heatmap)
        .setE(e)
        .setM(m)
        .draw()
    }
  }

  this.setSummaryInfo = function (_) {
    if (!arguments.length) return summary
    summary = _
    return this
  }

  this.setSegments = function (_) {
    if (!arguments.length) return segments
    segments = _
    return this
  }

  this.setEyeData = function (_) {
    if (!arguments.length) return eyeData
    eyeData = _
    return this
  }

  this.setMouseData = function (_) {
    if (!arguments.length) return mouseData
    mouseData = _
    return this
  }

  this.setInflections = function (_) {
    if (!arguments.length) return inflections
    inflections = _
    return this
  }

  return this
}
