// main.js

import {createChart, prepareMoneyChartData, prepareTransportChartData, updateChart, getChartLabel, CHART_PADDING, filters} from './utils';
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
// const AUTHORIZATION = `Basic da2dDQADQDDqFqGWFggsfdg=${Math.random()}`;
const AUTHORIZATION = `Basic da2dDQADQDDqFqGWFdADQafW`;
const URL = `https://es8-demo-srv.appspot.com/big-trip`;

const api = new API(URL, AUTHORIZATION);


/**
 * Обновляет данные Point
 * @param {ModelPoint} newPoint
 * @param {number} ind
 *
 * @return {ModelPoint}
 */
const updatePoint = (newPoint, ind) => {
  Object.assign(points[ind], newPoint);
  return points[ind];
};

// Обнулить Point из массива Points
const deletePoint = (ind) => {
  points[ind] = null;
  return points;
};


// Отрисовать карточки точек маршрута
const renderPoints = (points, dests, offers) => {
  POINTS_NODE.innerHTML = ``;
  const newPointsFragment = document.createDocumentFragment();

  points.forEach((point, ind) => {
    if (point) {
      const tripPoint = new TripPoint(point);
      const tripPointEdit = new TripPointEdit(point, dests, offers);

      /**
       * Редактирование карточки
       */
      tripPoint.onEdit = () => {
        tripPointEdit.render();
        POINTS_NODE.replaceChild(tripPointEdit.element, tripPoint.element);
        tripPoint.unrender();
      };

      /**
       * Сохранение карточки
       * @param {ModelPoint} newObject
       */
      tripPointEdit.onSave = (newObject) => {
        const submitBtn = tripPointEdit.element.querySelector(`.point__button[type=submit]`);
        const resetBtn = tripPointEdit.element.querySelector(`.point__button[type=reset]`);
        tripPointEdit.element.style.boxShadow = ``;
        submitBtn.textContent = `Saving...`;
        submitBtn.disabled = true;
        resetBtn.disabled = true;
        const updatedPoint = updatePoint(newObject, ind);
        api.updatePoint(updatedPoint.id, updatedPoint.toRAW())
          .then((newPoint) => {
            tripPoint.update(newPoint);
            tripPoint.render();
            POINTS_NODE.replaceChild(tripPoint.element, tripPointEdit.element);
            tripPointEdit.unrender();
          })
          .catch((error) => {
            submitBtn.textContent = `Save`;
            submitBtn.disabled = false;
            resetBtn.disabled = false;
            tripPointEdit.element.style.boxShadow = `0 0px 20px 0 rgba(255, 0, 0, 1)`;
            throw error;
          });
      };

      /**
       * Удаление карточки
       * @param {number} id
       */
      tripPointEdit.onDelete = (id) => {
        api.deletePoint(id)
          .then(() => {
            tripPointEdit.element.remove();
            tripPointEdit.unrender();
            deletePoint(ind);
          })
          .catch((error) => {
            throw error;
          });
      };

      // Добавить карточку во фрагмент
      newPointsFragment.appendChild(tripPoint.render());
    }
  });

  POINTS_NODE.appendChild(newPointsFragment);
};


// Фильтровать Point
const filterPoints = (points, filterName) => {
  switch (filterName) {
    case `filter-everything`:
      return points;

    case `filter-future`:
      return points.map((point) =>
        (point && point.dateFrom > Date.now()) ? point : null);

    case `filter-past`:
      return points.map((point) =>
        (point && point.dateFrom <= Date.now()) ? point : null);

    default:
      return -1;
  }
};

// Отрисовать фильтры
const renderFilter = (filtersData) => {
  const filter = new Filter(filtersData);
  // Смена активного фильтра
  filter.onFilter = (evt) => {
    const filterName = evt.target.id;
    const filteredTasks = filterPoints(points, filterName);
    renderPoints(filteredTasks, dests, offers);
  };
  filter.render();
  FILTER_NODE.appendChild(filter.element);
};


const statsBtn = FILTER_NODE.querySelector(`a[href="#stats"]`);
statsBtn.addEventListener(`click`, (evt) => {
  evt.preventDefault();

  // Подготовка данных для диаграмм
  const moneyChartData = prepareMoneyChartData(points);
  const transportChartData = prepareTransportChartData(points);

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


POINTS_NODE.textContent = `Loading route...`;

let points = [];
let dests = [];
let offers = [];

api.getPoints()
  .then((result) => {
    points = result;
  })
  .then(() => {
    return api.getDestinations();
  })
  .then((result) => {
    dests = result;
  })
  .then(() => {
    return api.getOffers();
  })
  .then((result) => {
    offers = result;
    renderPoints(points, dests, offers);
    renderFilter(filters);
  })
  .catch((error) => {
    POINTS_NODE.textContent = `Something went wrong while loading your route info. Check your connection or try again later`;
    throw error;
  });
