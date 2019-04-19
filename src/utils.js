// utils.js

import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';


// Cловарь для типов событий
const PointType = {
  'taxi': 1,
  'bus': 2,
  'train': 3,
  'ship': 4,
  'transport': 5,
  'drive': 6,
  'flight': 7,
  'check-in': 8,
  'sightseeing': 9,
  'restaurant': 10,
  'properties': new Map([
    [1, {name: `Taxi`, icon: `🚕`, type: `travel`, serviceName: `taxi`}],
    [2, {name: `Bus`, icon: `🚌`, type: `travel`, serviceName: `bus`}],
    [3, {name: `Train`, icon: `🚂`, type: `travel`, serviceName: `train`}],
    [4, {name: `Ship`, icon: `️🛳️`, type: `travel`, serviceName: `ship`}],
    [5, {name: `Transport`, icon: `🚊`, type: `travel`, serviceName: `transport`}],
    [6, {name: `Drive`, icon: `🚗`, type: `travel`, serviceName: `drive`}],
    [7, {name: `Flight`, icon: `️✈️`, type: `travel`, serviceName: `flight`}],
    [8, {name: `Check`, icon: `🏨`, type: `event`, serviceName: `check-in`}],
    [9, {name: `Sightseeing`, icon: `️🏛️`, type: `event`, serviceName: `sightseeing`}],
    [10, {name: `Restaurant`, icon: `🍴`, type: `event`, serviceName: `restaurant`}],
  ]),
  'types': [`travel`, `event`]
};

// Словарь для дополнительных предложений
const Offers = {
  'add-luggage': 1,
  'switch-to-comfort-class': 2,
  'add-meal': 3,
  'choose-seats': 4,
  'properties': new Map([
    [1, {name: `Add luggage`, pointType: [2, 3, 4, 5, 7], cost: 30, serviceName: `add-luggage`}],
    [2, {name: `Switch to comfort class`, pointType: [1, 3, 4, 5, 7, 8], cost: 100, serviceName: `switch-to-comfort-class`}],
    [3, {name: `Add meal`, pointType: [3, 4, 7, 8], cost: 15, serviceName: `add-meal`}],
    [4, {name: `Choose seats`, pointType: [3, 4, 7], cost: 5, serviceName: `choose-seats`}],
  ])
};

//
const CHART_PADDING = 5;


// Создает и возвращает dom элемент на основе полученной строки шаблона
const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

// Тестовые данные для точки путешествия
const createTripPoint = () => ({
  type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10][Math.floor(Math.random() * 10)],
  name: `test`,
  // 43200000 (12 часов) - 1800000 (30 мин)
  startDateTime: Date.now() + (Math.floor(Math.random() * (43200000 + 1 - 1800000)) + 1800000) *
    (Math.random() < 0.5 ? -1 : 1), // Math.floor(Math.random() * (43200000 + 1 - 1800000)) + 1800000, // 30m - 12h,
  endDateTime: Date.now() + 45000000,
  // от 1 до 1000
  price: Math.floor(Math.random() * 1000) + 1,
  offers: new Set(),
  img: `http://picsum.photos/300/150?r=${Math.random()}`,
  descr: [
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    `Cras aliquet varius magna, non porta ligula feugiat eget.`,
    `Fusce tristique felis at fermentum pharetra.`,
    `Aliquam id orci ut lectus varius viverra.`,
    `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
    `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
    `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
    `Sed sed nisi sed augue convallis suscipit in sed felis.`,
    `Aliquam erat volutpat.`,
    `Nunc fermentum tortor ac porta dapibus.`,
    `In rutrum ac purus sit amet tempus.`
  ]
});


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
      data[indexInData].sum += point.price;
    } else {
      data.push({
        type: point.type,
        sum: point.price
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

    if (PointType.properties.get(point.type).type === `travel`) {
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
 *
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
    ${PointType.properties.get(data.type).icon} ${PointType.properties.get(data.type).name.toUpperCase()}
  `.trim();
};


export {PointType, Offers, CHART_PADDING, createElement, createTripPoint, prepareMoneyChartData, prepareTransportChartData, createChart, updateChart, getChartLabel};
