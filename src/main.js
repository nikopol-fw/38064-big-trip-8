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


// Удаляет все события
const resetPoints = () => {
  POINTS_NODE.innerHTML = ``;
};

// Отрисовывает события в количесте count
const renderTripPoints = (count) => {
  const tripPoints = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const point = getTripPoint();
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
