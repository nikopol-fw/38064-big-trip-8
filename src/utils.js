// utils.js

import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';


// Cловарь для типов событий
const PointType = {
  'taxi': {
    name: `Taxi`,
    icon: `🚕`,
    category: `travel`
  },
  'bus': {
    name: `Bus`,
    icon: `🚌`,
    category: `travel`
  },
  'train': {
    name: `Train`,
    icon: `🚂`,
    category: `travel`
  },
  'ship': {
    name: `Ship`,
    icon: `🛳️`,
    category: `travel`
  },
  'transport': {
    name: `Transport`,
    icon: `🚊`,
    category: `travel`
  },
  'drive': {
    name: `Drive`,
    icon: `🚗`,
    category: `travel`
  },
  'flight': {
    name: `Flight`,
    icon: `✈️`,
    category: `travel`
  },
  'check-in': {
    name: `Check`,
    icon: `🏨`,
    category: `event`
  },
  'sightseeing': {
    name: `Sightseeing`,
    icon: `🏛️`,
    category: `event`
  },
  'restaurant': {
    name: `Restaurant`,
    icon: `🍴`,
    category: `event`
  },
};

const pointCategories = [`travel`, `event`];

// Фильтры
const filters = new Set([
  {
    id: `everything`,
    name: `Everything`,
    isActive: true
  }, {
    id: `future`,
    name: `Future`,
    isActive: false
  }, {
    id: `past`,
    name: `Past`,
    isActive: false
  }
]);

//
const CHART_PADDING = 5;


/**
 * Создает и возвращает dom элемент на основе полученной строки шаблона
 * @param  {string} template - строка с валидной HTML разметкой, в разметке должен быть один родительский элемент
 * @return {Element}
 */
const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstElementChild;
};

/**
 * Создает массив для статистики Money
 * @param {Array} points - Массив с данными точек маршрута
 *
 * @return {Array<{type: number, sum: number}>}
 */
const prepareMoneyChartData = (points) => {
  const data = [];
  points.forEach((point) => {
    if (!point) {
      return;
    }

    const indexInData = data.findIndex((item) => item.type === point.type);
    if (indexInData !== -1) {
      data[indexInData].sum += point.basePrice;
    } else {
      data.push({
        type: point.type,
        sum: point.basePrice
      });
    }
  });
  data.sort((a, b) => b.sum - a.sum);

  return data;
};

/**
 *
 * @param {Array} points
 *
 * @return {Array<{type: number, count: number}>}
 */
const prepareTransportChartData = (points) => {
  const data = [];
  points.forEach((point) => {
    if (!point) {
      return;
    }

    if (PointType[point.type].category === `travel`) {
      const indexInData = data.findIndex((item) => item.type === point.type);
      if (indexInData !== -1) {
        data[indexInData].count++;
      } else {
        data.push({
          type: point.type,
          count: 1
        });
      }
    }
  });
  data.sort((a, b) => b.count - a.count);

  return data;
};


//
const createChart = (canvasNode) => {
  const newChart = new Chart(canvasNode, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: [`label 1`, `label 2`, `label 3`],
      datasets: [{
        data: [1, 2, 3],
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      maintainAspectRatio: false,
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
        }
      },
      title: {
        display: true,
        text: `TITLE`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: CHART_PADDING,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });

  return newChart;
};

/**
 * @param {Chart} chart
 * @param {string} titleText
 * @param {Array<string>} labels
 * @param {Array<number>} data
 * @param {Function} formatter
 */
const updateChart = (chart, titleText, labels, data, formatter = null) => {
  chart.options.title.text = titleText;
  chart.data.labels = labels;
  chart.data.datasets[0].data = data;
  if (formatter) {
    chart.options.plugins.datalabels.formatter = formatter;
  }

  chart.update();
};

//
const getChartLabel = (data) => {
  return `
    ${PointType[data.type].icon} ${PointType[data.type].name.toUpperCase()}
  `.trim();
};


export {PointType, pointCategories, CHART_PADDING, createElement, prepareMoneyChartData, prepareTransportChartData, createChart, updateChart, getChartLabel, filters};
