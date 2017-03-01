function VideoHeatmap(canvas, video) {

  // Default sizes
  canvas.width = 1280
  canvas.height = 720

  var videoOffset = 27 * 1000 + 500

  var eyeData = []
  var mouseData = []

  var videoTime = video.currentTime * 1000
  var paused = video.paused
  var trailTime = 5 * 1000

  var r = 2
  var x = d3.scaleLinear()
    .domain([0, 1920])
    .range([0, canvas.width])

  var y = d3.scaleLinear()
    .domain([0, 1080])
    .range([0, canvas.height])

  // Pause/play on click
  video.addEventListener('click', function () {
    if (video.paused) {
      video.play()
    } else {
      video.pause()
    }
  })

  // Set on hover events for video to hide/show controls
  video.addEventListener('mouseover', function () {
    video.controls = true
  })

  video.addEventListener('mouseout', function () {
    video.controls = false
  })

  // Resize if needed in future
  video.addEventListener('resize', function () {
    canvas.width = video.offsetWidth
    canvas.height = video.offsetHeight
    x = d3.scaleLinear()
      .domain([0, 1920])
      .range([0, canvas.width])

    y = d3.scaleLinear()
      .domain([0, 1080])
      .range([0, canvas.height])
  })

  d3.timer(function () {
    paused = video.paused

    if (!paused) {
      videoTime = video.currentTime * 1000 - videoOffset
      update()
    }
  })

  var circle = new Path2D()
  circle.moveTo(125, 35)
  circle.arc(100, 35, 25, 0, 2 * Math.PI)

  function update () {
    var e = eyeData.filter(function(d) {
      return d.time < videoTime &&
        d.time > videoTime - trailTime
        d.x !== '-nan(ind)' &&
        d.x !== '-nan(ind)'
    })

    var m = mouseData.filter(function(d) {
      return d.date < videoTime &&
        d.date > videoTime - trailTime
    })

    // Get context
    var ctx = canvas.getContext('2d')

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw eye dots
    ctx.globalAlpha = 0.5
    ctx.fillStyle = '#fc8d59'
    for (var i = 0; i < e.length; i++) {
      ctx.beginPath()
      ctx.arc(x(e[i].x), y(e[i].y), r, 0, 2 * Math.PI)
      ctx.fill()
    }

    // Draw mouse dots
    ctx.fillStyle = '#99d594'
    for (var i = 0; i < m.length; i++) {
      ctx.beginPath()
      ctx.arc(x(m[i].x), y(m[i].y), r, 0, 2 * Math.PI)
      ctx.fill()
    }
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

  this.setTrailTime = function (_) {
    if (!arguments.length) return trailTime
    trailTime = _
    return this
  }

  return this
}
