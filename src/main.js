// main.js

import {filters} from './data';
import {createChart, prepareMoneyChartData, prepareTransportChartData, updateChart, getChartLabel, CHART_PADDING} from './utils';
import API from './api';

import TripPoint from './component.trip-point';
import TripPointEdit from './component.trip-point-edit';
import Filter from './component.filter';


// Node для карточек
const POINTS_NODE = document.querySelector(`.trip-day__items`);
// Node для фильтров (вставлять в конце)
const FILTER_NODE = document.querySelector(`.view-switch`);
// Блок со статистикой
const STATS_NODE = document.querySelector(`.statistic`);
// Основной контент
const MAIN_NODE = document.querySelector(`.main`);

// Canvas для статистики
const monetCtx = STATS_NODE.querySelector(`.statistic__money`);
const transportCtx = STATS_NODE.querySelector(`.statistic__transport`);
// const timeSpendCtx = STATS_NODE.querySelector(`.statistic__time-spend`);
// Диаграммы
const moneyChart = createChart(monetCtx);
const transportChart = createChart(transportCtx);
// Размер одной графы
const BAR_HEIGHT = 55;

// Данные для взаимодействия с API
const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
const URL = `https://es8-demo-srv.appspot.com/big-trip`;

const api = new API(URL, AUTHORIZATION);


//window.moneyChart = moneyChart;


// Фильтровать Point
const filterPoints = (points, filterName) => {
  switch (filterName) {
    case `filter-everything`:
      return points;

    case `filter-future`:
      return points.map((card) =>
        (card && card.startDateTime > Date.now()) ? card : null);

    case `filter-past`:
      return points.map((card) =>
        (card && card.startDateTime <= Date.now()) ? card : null);

    default:
      return -1;
  }
};

// Обновить данные Point
const updatePoint = (point, newPoint, ind) => {
  cards[ind] = Object.assign({}, point, newPoint);
  return cards[ind];
};

// Обнулить Point из массива Points
const deletePoint = (ind) => {
  cards[ind] = null;
  return cards;
};

// Отрисовать карточки точек маршрута
const renderPoints = (points) => {
  POINTS_NODE.innerHTML = ``;
  const newPointsFragment = document.createDocumentFragment();

  points.forEach((point, ind) => {
    if (point) {
      const tripPoint = new TripPoint(point);
      const tripPointEdit = new TripPointEdit(point);
      // Редактирование карточки
      tripPoint.onEdit = () => {
        tripPointEdit.render();
        POINTS_NODE.replaceChild(tripPointEdit.element, tripPoint.element);
        tripPoint.unrender();
      };
      // Сохранение карточки
      tripPointEdit.onSave = (newObject) => {
        const updatedPoint = updatePoint(point, newObject, ind);
        tripPoint.update(updatedPoint);
        tripPoint.render();
        POINTS_NODE.replaceChild(tripPoint.element, tripPointEdit.element);
        tripPointEdit.unrender();
      };
      // Удаление карточки
      tripPointEdit.onDelete = () => {
        tripPointEdit.element.remove();
        tripPointEdit.unrender();
        deletePoint(ind);
      };
      // Добавить карточку во фрагмент
      newPointsFragment.appendChild(tripPoint.render());
    }
  });

  POINTS_NODE.appendChild(newPointsFragment);
};

// Отрисовать фильтры
const renderFilter = (filtersData) => {
  const filter = new Filter(filtersData);
  // Смена активного фильтра
  filter.onFilter = (evt) => {
    const filterName = evt.target.id;
    const filteredTasks = filterPoints(cards, filterName);
    renderPoints(filteredTasks);
  };
  filter.render();
  FILTER_NODE.appendChild(filter.element);
};


const statsBtn = FILTER_NODE.querySelector(`a[href="#stats"]`);
statsBtn.addEventListener(`click`, (evt) => {
  evt.preventDefault();

  // Подготовка данных для диаграмм
  const moneyChartData = prepareMoneyChartData(cards);
  const transportChartData = prepareTransportChartData(cards);

  // Форматирование данных для диаграммы Money
  const moneyLabels = moneyChartData.map((item) => getChartLabel(item));
  const moneyData = moneyChartData.map((item) => item.sum);
  const moneyFormatter = (val) => `€ ${val}`;

  // Форматирование данных для диаграммы Transport
  const transportLabels = transportChartData.map((item) => getChartLabel(item));
  const transportData = transportChartData.map((item) => item.count);
  const transportFormatter = (val) => `${val}x`;

  const moneyChartHeight = (BAR_HEIGHT + CHART_PADDING * 2) * moneyChartData.length;
  monetCtx.height = moneyChartHeight;
  moneyChart.height = moneyChartHeight;

  const transportChartHeight = (BAR_HEIGHT + CHART_PADDING * 2) * transportChartData.length;
  transportCtx.height = transportChartHeight;
  transportChart.height = transportChartHeight;

  updateChart(moneyChart, `MONEY`, moneyLabels, moneyData, moneyFormatter);
  updateChart(transportChart, `TRANSPORT`, transportLabels, transportData, transportFormatter);

  MAIN_NODE.classList.add(`visually-hidden`);
  STATS_NODE.classList.remove(`visually-hidden`);
});

const tableBtn = FILTER_NODE.querySelector(`a[href="#table"]`);
tableBtn.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  STATS_NODE.classList.add(`visually-hidden`);
  MAIN_NODE.classList.remove(`visually-hidden`);
});


const cards = api.getPoints()
  .then((points) => {
    console.log(points);
    renderPoints(points);
  })
  .catch((error) => {
    console.log(error);
    throw error;
  });

renderFilter(filters);
