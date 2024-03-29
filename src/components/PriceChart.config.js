export const options = {
    chart: {
      animations: { enabled: true },
      toolbar: { 
        show: true,
        offsetX: 0,
        offsetY: 0,
        tools: {
          download: false,
          selection: false,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: false,
          reset: true | '<img src="/static/icons/reset.png" width="20">',
          customIcons: []
        },
        autoSelected: 'zoom' 
       },
      width: '100px'
    },
    tooltip: {
      enabled: true,
      theme: false,
      style: {
        fontSize: '12px',
        fontFamily: undefined
      },
      x: {
        show: false,
        format: 'dd MMM',
        formatter: undefined,
      },
      y: {
        show: true,
        title: 'price'
      },
      marker: {
        show: false,
      },
      items: {
        display: 'flex',
      },
      fixed: {
        enabled: false,
        position: 'topRight',
        offsetX: 0,
        offsetY: 0,
      },
    },
    grid: {
      show: true,
      borderColor: '#767F92',
      strokeDashArray: 0
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: '#25CE8F',
          downward: '#F45353'
        }
      }
    },
    xaxis: {
      type: 'datetime',
      labels: {
        showDuplicates: false,
        offsetX: 0,
        offsetY: 0,
        hideOverlapingLabels: false,
        trim: false,
        rotateAlways: false,
        show: true,
        style: {
          colors: '#767F92',
          fontSize: '14px',
          cssClass: 'apexcharts-xaxis-label',
        },
        formatter: function (value) {
          return new Date(value).toLocaleDateString('en-US', {
             month: 'short', 
             day: 'numeric', 
             hour: 'numeric'
            });
        }
      }
    },
    yaxis: {
      labels: {
        show: true,
        minWidth: 0,
        maxWidth: 160,
        style: {
          color: '#F1F2F9',
          fontSize: '14px',
          cssClass: 'apexcharts-yaxis-label',
        },
        offsetX: 0,
        offsetY: 0,
        rotate: 0,
      }
    }
  }

