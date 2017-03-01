var io_x, io_y, io_r, io_canvas
var io_data = []
var io_bounds = false
function drawInteractionOverlay () {
  io_canvas = document.getElementById('interaction-overlay')
  io_canvas.width = d3.select('#app-img').node().offsetWidth
  io_canvas.height = 400

  io_r = 5
  io_x = d3.scaleLinear()
    .domain([0, 1920])
    .range([0, io_canvas.width])
  io_y = d3.scaleLinear()
    .domain([0, 1080])
    .range([0, io_canvas.height])
}

function ioSetData (_) {
  io_data = _
}

function ioSetBounds (_) {
  io_bounds = _
}

function drawInteractions (key) {
  var subset = io_data.filter(function (d) {
    return (io_bounds ? (
      io_bounds[0] <= d.date && d.date <= io_bounds[1]
    ) : true) && key === d.id
  })

  var ctx = io_canvas.getContext('2d')
  ctx.clearRect(0, 0, io_canvas.width, io_canvas.height)

  var style = window.getComputedStyle(document.getElementById(key), null)
  ctx.globalAlpha = 1
  ctx.fillStyle = style.fill
  for (var i = 0; i < subset.length; i++) {
    ctx.beginPath()
    ctx.arc(io_x(subset[i].x), io_y(subset[i].y), io_r, 0, 2 * Math.PI)
    ctx.fill()
  }
}

function drawTwoWayInteractions (sKey, tKey) {
  var set1 = io_data.filter(function (d) {
    return (io_bounds ? (
      io_bounds[0] <= d.date && d.date <= io_bounds[1]
    ) : true) && sKey === d.id
  })

  var set2 = io_data.filter(function (d) {
    return (io_bounds ? (
      io_bounds[0] <= d.date && d.date <= io_bounds[1]
    ) : true) && tKey === d.id
  })

  var ctx = io_canvas.getContext('2d')
  ctx.clearRect(0, 0, io_canvas.width, io_canvas.height)
  ctx.globalAlpha = 1

  var style = window.getComputedStyle(document.getElementById(sKey), null)
  ctx.fillStyle = style.fill
  for (var i = 0; i < set1.length; i++) {
    ctx.beginPath()
    ctx.arc(io_x(set1[i].x), io_y(set1[i].y), io_r, 0, 2 * Math.PI)
    ctx.fill()
  }

  style = window.getComputedStyle(document.getElementById(tKey), null)
  ctx.fillStyle = style.fill
  for (var i = 0; i < set2.length; i++) {
    ctx.beginPath()
    ctx.arc(io_x(set2[i].x), io_y(set2[i].y), io_r, 0, 2 * Math.PI)
    ctx.fill()
  }
}

function clearInteractions () {
  var ctx = io_canvas.getContext('2d')
  ctx.clearRect(0, 0, io_canvas.width, io_canvas.height)
}
