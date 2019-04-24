// main.js

/**
 * @typedef {import('./model.point').default} ModelPoint
 * @typedef {import('./model.destination').default} ModelDestination
 * @typedef {import('./model.point').default} ModelOffer
 *
 * @typedef  {Object} TripDay
 * @property {Date}        date
 * @property {TripPoint[]} points
 */

import {createChart, prepareMoneyChartData, prepareTransportChartData, updateChart, getChartLabel, CHART_PADDING, filters, createElement} from './utils';
import API from './api';

import TripPoint from './component.trip-point';
import TripPointEdit from './component.trip-point-edit';
import Filter from './component.filter';
import moment from 'moment';
import Total from './component.total';
import ModelPoint from './model.point';


// Node для карточек
const POINTS_NODE = document.querySelector(`.trip-points`);
// Node для фильтров (вставлять в конце)
const FILTER_NODE = document.querySelector(`.view-switch`);
// Блок со статистикой
const STATS_NODE = document.querySelector(`.statistic`);
// Основной контент
const MAIN_NODE = document.querySelector(`.main`);
// Итоговая цена
const TOTAL_NODE = document.querySelector(`.trip__total`);

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
const AUTHORIZATION = `Basic da2dDQhfgh3qdasdFdADasQafWdasd`;
const URL = `https://es8-demo-srv.appspot.com/big-trip`;

const api = new API(URL, AUTHORIZATION);


/**
 * Обновляет данные Point
 *
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

/**
 * @return {Date}
 */
const getMinDay = () => {
  const min = Math.min(...points.map((point) => point.dateFrom.getTime()));
  return new Date(min);
};

/**
 * @param  {Date} minDate
 * @param  {Date} currentDate
 * @return {string}
 */
const getDayNumber = (minDate, currentDate) => {
  const momentStartCurrentDate = moment(currentDate).startOf(`day`);
  const momentStartMinDate = moment(minDate).startOf(`day`);
  return `${moment.duration(momentStartCurrentDate.diff(momentStartMinDate)).get(`d`) + 1}`;
};

/**
 * Создает шаблон, привязывает данные и обработчики и отрисовывает карточек точек маршрута
 * @param {ModelPoint[]}       points
 * @param {ModelDestination[]} destination
 * @param {ModelOffer[]}       offers
 */
const renderPoints = (points, destination, offers) => {
  POINTS_NODE.innerHTML = ``;
  const pointsFragment = document.createDocumentFragment();
  /** @type {TripDay[]} */
  const days = [];

  points.forEach((point, ind) => {
    if (!point) {
      return;
    }

    const tripPoint = new TripPoint(point);
    const tripPointEdit = new TripPointEdit(point, destination, offers);

    /**
     * Редактирование карточки
     */
    tripPoint.onEdit = () => {
      tripPointEdit.render();
      tripPoint.element.parentElement.replaceChild(tripPointEdit.element, tripPoint.element);
      tripPoint.unrender();
    };

    /**
     * Save point changes
     * @param {ModelPoint} newObject
     */
    tripPointEdit.onSave = (newObject) => {
      const submitButton = tripPointEdit.element.querySelector(`.point__button[type=submit]`);
      const resetButton = tripPointEdit.element.querySelector(`.point__button[type=reset]`);
      tripPointEdit.element.style.boxShadow = ``;
      submitButton.textContent = `Saving...`;
      submitButton.disabled = true;
      resetButton.disabled = true;

      const data = Object.assign(points[ind], newObject);

      api.updatePoint(data.id, data.toRAW())
        .then((newPoint) => {
          updatePoint(newPoint, ind);
          tripPoint.update(newPoint);
          tripPoint.render();
          tripPointEdit.element.parentElement.replaceChild(tripPoint.element, tripPointEdit.element);
          tripPointEdit.unrender();
          total.update(calculateTotal());
        })
        .catch((error) => {
          submitButton.textContent = `Save`;
          submitButton.disabled = false;
          resetButton.disabled = false;
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
          total.update(calculateTotal());
        })
        .catch((error) => {
          throw error;
        });
    };

    tripPointEdit.onEsc = () => {
      tripPoint.render();
      tripPointEdit.element.parentElement.replaceChild(tripPoint.element, tripPointEdit.element);
      tripPointEdit.unrender();
    };

    const indexOfDay = days.findIndex((day) => {
      return day.date.toDateString() === point.dateFrom.toDateString();
    });

    if (indexOfDay !== -1) {
      days[indexOfDay].points.push(tripPoint);
    } else {
      days.push({
        date: point.dateFrom,
        points: [tripPoint]
      });
    }
  });

  const minDay = getMinDay();

  days.map((day) => {
    const dayTemplate = `
      <section class="trip-day">
        <article class="trip-day__info">
          <span class="trip-day__caption">Day</span>
          <p class="trip-day__number">${getDayNumber(minDay, day.date)}</p>
          <h2 class="trip-day__title">${moment(day.date).format(`MMM D`)}</h2>
        </article>
        <div class="trip-day__items"></div>
      </section>
      `.trim();
    const dayNode = createElement(dayTemplate);
    const itemsNode = dayNode.querySelector(`.trip-day__items`);
    day.points.forEach((point) => {
      itemsNode.appendChild(point.render());
    });
    pointsFragment.appendChild(dayNode);
  });

  POINTS_NODE.appendChild(pointsFragment);
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
    renderPoints(filteredTasks, destination, offers);
  };
  filter.render();
  FILTER_NODE.appendChild(filter.element);
};


//
const calculateTotal = () => {
  let total = 0;
  for (let point of points) {
    if (!point) {
      continue;
    }
    const acceptedOffers = [...point.offers].filter((offer) => offer.accepted === true);
    total += acceptedOffers.reduce((acc, cur) => acc + +cur.price, 0);
    total += point.basePrice;
  }
  return total;
};

//
const renderTotal = () => {
  const totalValue = calculateTotal();
  const total = new Total(totalValue);
  TOTAL_NODE.appendChild(total.render());
  return total;
};


/** @type {HTMLButtonElement} */
const createPointButton = document.querySelector(`.new-event`);

const onCreatePointButtonClick = () => {
  createPointButton.disabled = true;

  const newPointNode = document.createElement(`section`);
  newPointNode.classList.add(`new-point`);
  newPointNode.innerHTML = `
    <section class="trip-points">
      <section class="trip-day">
        <article class="trip-day__info"></article>
        <div class="trip-day__items"></div>
      </section>
    </section>
  `.trim();

  const data = new ModelPoint({
    'type': `flight`,
    'destination': destination[0],
    'date_from': Date.now(),
    'date_to': Date.now(),
    'base_price': 0,
    'offers': []
  });

  const newTripPointEdit = new TripPointEdit(data, destination, offers);

  /**
   * Save new point
   * @param {ModelPoint} newObject
   */
  newTripPointEdit.onSave = (newObject) => {
    const submitButton = newTripPointEdit.element.querySelector(`.point__button[type=submit]`);
    const resetButton = newTripPointEdit.element.querySelector(`.point__button[type=reset]`);
    newTripPointEdit.element.style.boxShadow = ``;
    submitButton.textContent = `Saving...`;
    submitButton.disabled = true;
    resetButton.disabled = true;

    Object.assign(data, newObject);
    api.createPoint(data.toRAW())
      .then((point) => {
        points.push(point);
        newTripPointEdit.unrender();
        newPointNode.remove();
        renderPoints(points, destination, offers);
        total.update(calculateTotal());
        createPointButton.disabled = false;
      })
      .catch((error) => {
        submitButton.textContent = `Save`;
        submitButton.disabled = false;
        resetButton.disabled = false;
        newTripPointEdit.element.style.boxShadow = `0 0px 20px 0 rgba(255, 0, 0, 1)`;
        throw error;
      });
  };

  newTripPointEdit.onDelete = () => {
    newTripPointEdit.unrender();
    newPointNode.remove();
    createPointButton.disabled = false;
  };

  newTripPointEdit.onEsc = () => {
    newTripPointEdit.unrender();
    newPointNode.remove();
    createPointButton.disabled = false;
  };

  newPointNode.querySelector(`.trip-day__items`).appendChild(newTripPointEdit.render());

  document.querySelector(`.main`).insertBefore(newPointNode, document.querySelector(`.trip-points`));
};

createPointButton.addEventListener(`click`, onCreatePointButtonClick);


// Фильтры
const statsButton = FILTER_NODE.querySelector(`a[href="#stats"]`);
const tableButton = FILTER_NODE.querySelector(`a[href="#table"]`);

statsButton.addEventListener(`click`, (evt) => {
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

  tableButton.classList.remove(`view-switch__item--active`);
  statsButton.classList.add(`view-switch__item--active`);
});

tableButton.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  STATS_NODE.classList.add(`visually-hidden`);
  MAIN_NODE.classList.remove(`visually-hidden`);

  statsButton.classList.remove(`view-switch__item--active`);
  tableButton.classList.add(`view-switch__item--active`);
});


POINTS_NODE.textContent = `Loading route...`;

/** @type {ModelPoint[]} */
let points = [];
let destination = [];
let offers = [];

/** @type {Total} */
let total;

api.getPoints()
  .then((result) => {
    points = result;
  })
  .then(() => {
    return api.getDestinations();
  })
  .then((result) => {
    destination = result;
  })
  .then(() => {
    return api.getOffers();
  })
  .then((result) => {
    offers = result;
    renderPoints(points, destination, offers);
    renderFilter(filters);
    total = renderTotal();
  })
  .catch((error) => {
    POINTS_NODE.textContent = `Something went wrong while loading your route info. Check your connection or try again later`;
    throw error;
  });
