// utils.js

import {OFFERS} from './data';


// Cловарь для типов событий
const PointType = {
  TAXI: 1,
  BUS: 2,
  TRAIN: 3,
  SHIP: 4,
  TRANSPORT: 5,
  DRIVE: 6,
  FLIGHT: 7,
  CHECKIN: 8,
  SIGHTSEEING: 9,
  RESTAURANT: 10,
  properties: {
    1: {name: `Taxi`, icon: `🚕`},
    2: {name: `Bus`, icon: `🚌`},
    3: {name: `Train`, icon: `🚂`},
    4: {name: `Ship`, icon: `️🛳️`},
    5: {name: `Transport`, icon: `🚊`},
    6: {name: `Drive`, icon: `🚗`},
    7: {name: `Flight`, icon: `️✈️`},
    8: {name: `Check-in`, icon: `🏨`},
    9: {name: `Sightseeing`, icon: `️🏛️`},
    10: {name: `Restaurant`, icon: `🍴`},
  }
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

// Формирует множество со случайным набором из OFFERS
const getOffers = () => {
  const offers = new Set();
  let amount = Math.floor(Math.random() * (2 + 1));
  while (amount > 0) {
    let setSize = offers.size;
    offers.add(OFFERS[Math.floor(Math.random() * 4)]);
    if (offers.size > setSize) {
      amount--;
    }
  }

  return offers;
};

// Тестовые данные для точки путешествия
const createTripPoint = () => ({
  type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10][Math.floor(Math.random() * 10)],
  name: [
    `Taxi to Airport`,
    `Flight to Geneva`,
    `Drive to Chamonix`,
    `Check into a hotel`
  ][Math.floor(Math.random() * 4)],
  // 43200000 (12 часов) - 1800000 (30 мин)
  timeDuration: Math.floor(Math.random() * (43200000 + 1 - 1800000)) + 1800000, // 30m - 12h,
  // от 1 до 1000
  price: Math.floor(Math.random() * 1000) + 1,
  offers: getOffers(),
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


export {PointType, createElement, getFilter, createTripPoint};
