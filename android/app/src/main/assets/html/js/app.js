let data = []
let seriesValue = [
  {
    name: '',
    type: 'spline',
    color: '#003180',
    data: data,
  },
]
let unit = ''
let chart = new Highcharts.Chart({
  chart: {
    renderTo: 'chart',
    type: 'spline',
    marginTop: 20,
    events: {
      load: requestData,
    },
  },
  time: {
    useUTC: false,
  },
  title: {
    text: '',
  },
  legend: {
    enabled: false,
  },
  credits: {
    enabled: false,
  },
  exporting: {
    enabled: false,
  },
  tooltip: {
    headerFormat: '<b>{series.name}</b><br/>',
    pointFormat: '{point.x:%Y-%m-%d %H:%M:%S}<br/>{point.y:.2f} ',
  },
  xAxis: {
    type: 'datetime',
    tickPixelInterval: 150,
    maxPadding: 0.1,
  },
  yAxis: {
    title: {
      text: '',
    },
    plotLines: [
      {
        value: 0,
        width: 1,
        color: '#808080',
      },
    ],
  },
  series: seriesValue,
})

// Plugin to add a pulsating marker on add point
Highcharts.addEvent(Highcharts.Series, 'addPoint', e => {
  const point = e.point,
    series = e.target

  if (!series.pulse) {
    series.pulse = series.chart.renderer.circle().add(series.markerGroup)
  }

  setTimeout(() => {
    series.pulse
      .attr({
        x: series.xAxis.toPixels(point.x, true),
        y: series.yAxis.toPixels(point.y, true),
        r: series.options.marker.radius,
        opacity: 1,
        fill: series.color,
      })
      .animate(
        {
          r: 20,
          opacity: 0,
        },
        {
          duration: 1000,
        },
      )
  }, 1)
})

function requestData() {
  document.addEventListener('message', message => {
    try {
      let messageData = JSON.parse(message.data)

      if (messageData.type === 'initialData') {
        data = messageData.data.map(entry => [entry.x, entry.y])

        seriesValue[0].name = messageData.serieName
        seriesValue[0].data = data
        unit = messageData.unit
        chart.update({
          series: seriesValue,
          tooltip: {
            headerFormat: '<b>{series.name}</b><br/>',
            pointFormat:
              '{point.x:%Y-%m-%d %H:%M:%S}<br/>{point.y:.2f} ' + unit,
          },
        })

        window.ReactNativeWebView.postMessage('createdChart')
      } else if (messageData.type === 'addNewPoint') {
        const newPoint = [messageData.data.x, messageData.data.y]

        chart.series[0].addPoint(newPoint, true, false)
        data.push(newPoint)

        //Remove older five minutes
        const fiveMinutesAgo = new Date().getTime() - 5 * 60 * 1000
        var dataExceded = data.filter(point => point[0] < fiveMinutesAgo)
        if (dataExceded.length > 0) {
          data = data.filter(point => point[0] >= fiveMinutesAgo)
          chart.series[0].setData(data, true, false, false)
          window.ReactNativeWebView.postMessage('se eliminan puntos ')
        }
      }

      let yAxisValues = data.map(item => item[1])
      let max = Math.max(...yAxisValues)
      let min = Math.min(...yAxisValues)
      chart.yAxis[0].update({
        max,
        min: min < max ? min : 0,
      })
      document.getElementById('max').innerHTML = max.toString() + ' ' + unit
      document.getElementById('min').innerHTML = min.toString() + ' ' + unit
    } catch (error) {
      window.ReactNativeWebView.postMessage('error ' + error)
    }
  })
}
true
