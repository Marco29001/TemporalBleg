let data = [];
let history = [];
let seriesValue = [
  {
    type: 'spline',
    name: window.getElementById('variableName').innerHTML,
    data: data,
    color: '#003180',
  },
];
let chart = new Highcharts.Chart({
  chart: {
    renderTo: 'chart',
    defaultSeriesType: 'spline',
    marginRight: 10,
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
    tickWidth: 0,
    lineWidth: 0,
    labels: {
      enabled: false,
    },
    max: 20,
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
    max: parseFloat(window.getElementById('max').innerHTML),
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

function requestData() {
  window.addEventListener('message', message => {
    try {
      let newPoint = parseFloat(message.data);

      // add the point
      if (data.length >= 21) {
        data.shift(); //delete last point
        seriesValue[0].data = data;
        chart.update({
          series: seriesValue,
        });
      }

      data = [...data, newPoint];

      //Update series
      seriesValue[0].data = data;
      chart.update({
        series: seriesValue,
      });

      //Update max value
      chart.yAxis[0].update({
        max: parseFloat(window.getElementById('max').innerHTML),
      });

      //insert history
      insertHistory(newPoint);
    } catch (error) {
      window.alert('Error al recibir la informacion', error);
    }
  });
}

function insertHistory(value) {
  let template = '';
  let date = moment().format('DD/MM/YYYY, hh:mm:ss');

  history = [...history, {date, value}];

  history.map(obj => {
    template += `
        <article class="footer-card">
          <div class="footer-card-date-hour">
            <p class="footer-card-date-text">Fecha y hora</p>
            <p class="footer-card-date">${obj.date}</p>
          </div>
          <h1 class="footer-card-temp">${obj.value}</h1>
        </article>
        `;
  });

  $('.footer-cards-wrap').html(template);
}

$('.footer-title').click(function () {
  window.ReactNativeWebView.postMessage('History');
  if ($('footer').css('top') > '200px') {
    $('footer').removeClass('footer');
    $('footer').addClass('footerSpan');
  } else {
    $('footer').removeClass('footerSpan');
    $('footer').addClass('footer');
  }
});

true;
