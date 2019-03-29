// main.js

import getFilter from './filter';
import getTripPoint from './trip-point';


const POINTS_NODE = document.querySelector(`.trip-day__items`);

const filters = [
  {
    id: `everything`,
    name: `Everything`,
    isChecked: true
  }, {
    id: `future`,
    name: `Future`,
    isChecked: false
  }, {
    id: `past`,
    name: `Past`,
    isChecked: false
  }
];

const OFFERS = [`Add luggage`, `Switch to comfort class`, `Add meal`, `Choose seats`];

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


// Удаляет все события
const resetPoints = () => {
  POINTS_NODE.innerHTML = ``;
};

// Отрисовывает события в количесте count
const renderTripPoints = (amount) => {
  const tripPoints = document.createDocumentFragment();
  for (let i = 0; i < amount; i++) {
    const point = getTripPoint(createTripPoint());
    tripPoints.appendChild(point);
  }
  POINTS_NODE.appendChild(tripPoints);
};


let filtersTemplate = ``;
filters.forEach((filter) => {
  const filterTemplate = getFilter(filter.id, filter.name, filter.isChecked);
  filtersTemplate += filterTemplate;
});

const filtersContainer = document.querySelector(`.trip-filter`);
filtersContainer.insertAdjacentHTML(`afterBegin`, filtersTemplate);


renderTripPoints(7);


const tripFilter = document.querySelector(`.trip-filter`);
tripFilter.addEventListener(`change`, () => {
  resetPoints();
  let i = Math.floor(Math.random() * 10) + 1;
  renderTripPoints(i);
});
