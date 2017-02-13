function VideoHeatmap(canvasSelection, elVideo) {

  // Init with
  var width = canvasSelection.node().offsetWidth
  var height = canvasSelection.node().offsetHeight

  var eyeData = []
  var mouseData = []

  var videoTime = elVideo.currentTime * 1000
  var paused = elVideo.paused
  var trailTime = 3

  // Set on hover events for video to hide/show controls
  elVideo.addEventListener('mouseover', function () {
    elVideo.controls = true
  })

  elVideo.addEventListener('mouseout', function () {
    elVideo.controls = false
  })

  d3.timer(function () {
    if (!paused) {
      videoTime = elVideo.currentTime * 1000
      paused = elVideo.paused
      this.update()
    }
  })

  this.update = function () {
    // var e = eyeData.filter(function(d) {
    //   return
    // })
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
