import React, { useEffect, useRef } from 'react'
import { Platform, StyleSheet } from 'react-native'
import WebView from 'react-native-webview'

export const Graphic = ({ variable }) => {
  const webRef = useRef(null)
  const sourceUri =
    Platform.OS === 'android'
      ? 'file:///android_asset/html/index.html'
      : 'Web.bundle/site/index.html'

  const addDataPoint = newDataPoint => {
    //setData(prevData => [...prevData, newDataPoint])
    const script = `
          var newDataPoint = ${JSON.stringify(newDataPoint)};
          var chart = Highcharts.charts[0];
          chart.series[0].addPoint(newDataPoint);
        `
    //webViewRef.current.injectJavaScript(script)
  }

  useEffect(() => {
    if (variable && webRef.current) {
      webRef.current.postMessage(JSON.stringify(variable.history))
    }
  }, [variable, webRef.current])

  return (
    <WebView
      style={Styles.mainContainer}
      ref={r => (webRef.current = r)}
      originWhitelist={['*']}
      javaScriptEnabled={true}
      setBuiltInZoomControls={false}
      bounces={false}
      textInteractionEnabled={false}
      onMessage={event => {
        console.log(event.nativeEvent.data)
      }}
      //source={{uri: sourceUri}}
      source={{
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
        <meta charset="UTF-8">
        <link type="text/css" rel="stylesheet" href="./css/styles.css" >
        <style type="text/css">
          body {
            background: rgba(221, 221, 221, 1);
          }
          
          #box {
            display: flex;
            flex-flow: column;
            height: 90vh;                
          }
          
          #chart {
            border-radius: 10px 10px 0px 0px;
          
            box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.51);
            -webkit-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.51);
            -moz-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.51);
            width: 100%;
            height: 90%;
          }
          
          #footerContainer {
            background-color: white;
            border-radius: 0 0 10px 10px;
          
            display: flex;
            flex-flow: row wrap;
            justify-content: space-between;
            align-items: center;
          
            padding: 10px;
          
            margin: 0;
          
            box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.51);
            -webkit-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.51);
            -moz-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.51);
          }
          
          #chart-min,
          #chart-max {
            display: flex;
            flex-flow: column;
            justify-content: center;
            align-items: center;
          }
          
          #txtMin,
          #txtMax {
            color: #3e3e3e;
            font-weight: 500;
            font-size: 15px;
          }
          
          #min,
          #max {
            color: #003180;
            font-weight: 700;
            font-size: 20px;
          }
        </style>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js"></script>
        <script src="https://code.highcharts.com/highcharts.js"></script>
      </head>
      <body>
        <div id="box">
          <div id="chart"></div>
          <div id="footerContainer">
            <div id="chart-min">
              <p id="txtMin">MIN</p>
              <p id="min">-</p>
            </div>
            <div id="chart-max">
              <p id="txtMax">MAX</p>
              <p id="max">-</p>
            </div>
          </div>
        </div>
      </body>
      <script>
        let seriesValue = [
          {
            type: 'line',
            name: 'Temperatura',
            data: [],
            color: '#003180',
          },
        ];

        let chart = new Highcharts.Chart({
          chart: {
            renderTo: 'chart',
            type: 'spline',
            marginTop: 20,
            events: {
              load: onChartLoad,
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
          tooltip: {
            headerFormat: '<b>{series.name}</b><br/>',
            pointFormat: '{point.x:%Y-%m-%d %H:%M:%S}<br/>{point.y:.2f}',
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

        function onChartLoad() {
          document.addEventListener('message', message => {
            try {
                let data = JSON.parse(message.data);

                data.map(obj => {
                  obj.x = obj.x.getTime();
                })

                /*seriesValue[0].data = data;

                chart.update({ 
                  series: seriesValue
                });*/

                window.ReactNativeWebView.postMessage(
                  'updated data ' + JSON.stringify(data),
              ); 
            } catch (error) {
              window.ReactNativeWebView.postMessage('error ' + error);
            }
          })
        }
        true
      </script>
      </html>
    `,
      }}
    />
  )
}

const Styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
})
