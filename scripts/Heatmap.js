function Heatmap (canvas) {

  canvas.width = 320
  canvas.height = 239

  var e = []
  var m = []
  var t = 'CPV'

  var r = 3
  var x = d3.scaleLinear()
    .domain([0, 1920])
    .range([0, canvas.width])

  var y = d3.scaleLinear()
    .domain([0, 1080])
    .range([0, canvas.height])

  var circle = new Path2D()
  circle.moveTo(125, 35)
  circle.arc(100, 35, 25, 0, 2 * Math.PI)

  this.draw = function () {
    // Get context
    var ctx = canvas.getContext('2d')

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    var img = (t === 'CPV')
     ? document.getElementById('templateImgCPV')
     : document.getElementById('templateImgPV')
    ctx.drawImage(img, 0, 0, 1920, 1080, 0, 0, canvas.width, canvas.height)

    // Draw eye dots
    ctx.globalAlpha = 0.5
    ctx.fillStyle = '#52ef99'
    for (var i = 0; i < e.length; i++) {
      ctx.beginPath()
      ctx.arc(x(e[i].x), y(e[i].y), r, 0, 2 * Math.PI)
      ctx.fill()
    }

    // Draw mouse dots
    ctx.fillStyle = '#6f1996'
    for (var i = 0; i < m.length; i++) {
      ctx.beginPath()
      ctx.arc(x(m[i].x), y(m[i].y), r, 0, 2 * Math.PI)
      ctx.fill()
    }

    return this
  }

  this.setT = function (_) {
    if (!arguments.length) return t
    t = _
    return this
  }

  this.setE = function (_) {
    if (!arguments.length) return e
    e = _
    return this
  }

  this.setM = function (_) {
    if (!arguments.length) return m
    m = _
    return this
  }

  return this
}
