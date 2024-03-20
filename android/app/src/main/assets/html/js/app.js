$(document).ready(function () {
  requestData();
});

let chart = null;
let data = [];
let seriesValue = [
  {
    type: 'line',
    name: 'Temperatura',
    data: data,
    color: '#003180',
  },
];

function requestData() {
  document.addEventListener('message', message => {
    try {
      let tempData = JSON.parse(message.data);

      tempData.map(obj => {
        data.push(obj);
      });

      //get min and max value
      let values = data.map(item => item[1]);
      document.getElementById('min').innerHTML = Math.min(...values).toString();
      document.getElementById('max').innerHTML = Math.max(...values).toString();

      seriesValue[0].data = values;

      if (chart) {
        values.map(item => {
          seriesValue[0].data = [...seriesValue[0].data, item];
          chart.update({
            series: seriesValue,
          });

          chart.yAxis[0].update({
            min: 0,
            max: data[data.length - 1][1],
          });
        });
      } else {
        createChart();
      }

      window.ReactNativeWebView.postMessage(
        'updated data ' + JSON.stringify(data),
      );
    } catch (error) {
      window.ReactNativeWebView.postMessage('error ' + error);
    }
  });
}

function createChart() {
  try {
    chart = new Highcharts.Chart({
      chart: {
        renderTo: 'chart',
        marginTop: 15,
        events: {
          load: requestData,
        },
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
      title: {
        text: '',
      },
      xAxis: {
        type: 'datetime',
        tickWidth: 0,
        lineWidth: 0,
        labels: {
          enabled: false,
        },
        //max: 20,
        scrollbar: {
          enabled: true,
        },
      },
      yAxis: {
        title: {
          text: '',
        },
        gridLineColor: '#2E3F59',
        gridLineWidth: 1,
        lineWidth: 0,
        min: 0,
        max: 30,
      },
      plotOptions: {
        series: {
          animation: false,
          getExtremesFromAll: true,
          borderRadius: 18,
          pointWidth: 100,
          borderWidth: 0,
          marker: {
            radius: 5,
          },
        },
      },
      series: seriesValue,
    });
  } catch (error) {
    window.alert('Error en la gráfica', error);
  }
}
true;
