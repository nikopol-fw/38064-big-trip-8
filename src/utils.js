// utils.js

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

// Создает и возвращает dom элемент на основе полученной строки шаблона
const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

/**
 * Создает разметку для фильтра
 *
 * @param {string} id часть id "filter-*" для элементов в разметке
 * @param {string} name отображаемое имя фильтра
 * @param {boolean} isChecked флаг определяющий атрибут checked фильтра
 *
 * @return {string} строка с разметкой фильтра
 */
const getFilter = (id, name, isChecked) => {
  const filterTemplate = `<input type="radio" id="filter-${id}" name="filter" value="${id}"${isChecked ? ` checked` : ``}>
<label class="trip-filter__item" for="filter-${id}">${name}</label>`;

  return filterTemplate;
};

// Тестовые данные для точки путешествия
const createTripPoint = () => ({
  type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10][Math.floor(Math.random() * 10)],
  name: `test`,
  // 43200000 (12 часов) - 1800000 (30 мин)
  timeDuration: Math.floor(Math.random() * (43200000 + 1 - 1800000)) + 1800000, // 30m - 12h,
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


export {PointType, Offers, createElement, getFilter, createTripPoint};
