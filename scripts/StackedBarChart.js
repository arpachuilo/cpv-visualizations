function StackedBarChart(selection, brushable = false) {
  // init chart here
  var svg, gChart, gXaxis, gYaxis, gBrush

  selection.each(function (d) {
    //Select the svg element, if it exists
    svg = d3.select(this).selectAll('svg').data(d)

    //Otherwise, create the skeletal chart
    var gEnter = svg.enter().append('svg')

    gChart = gEnter.append('g')
      .attr('class', 'chart')

    gXaxis = gEnter.append('g')
      .attr('class', 'x axis')

    gYaxis = gEnter.append('g')
      .attr('class', 'y axis')

    if (brushable) {
      gBrush = gEnter.append('g')
        .attr('class', 'brush')
    }
  })

  var xScale, yScale
  function update(data) {

  }

}

StackedBarChart.data = function (d) {
  return StackedBarChart
}
