// main.js

import {FILTERS} from './data';
import {getFilter, createTripPoint} from './utils';
import TripPoint from './component.trip-point';
import TripPointEdit from './component.trip-point-edit';


const POINTS_NODE = document.querySelector(`.trip-day__items`);


let filtersTemplate = ``;
FILTERS.forEach((filter) => {
  const filterTemplate = getFilter(filter.id, filter.name, filter.isChecked);
  filtersTemplate += filterTemplate;
});

const filtersContainer = document.querySelector(`.trip-filter`);
filtersContainer.insertAdjacentHTML(`afterBegin`, filtersTemplate);


const tripPoint = new TripPoint(createTripPoint());
const tripPointEdit = new TripPointEdit(createTripPoint());
POINTS_NODE.appendChild(tripPoint.render());

tripPoint.onEdit = () => {
  tripPointEdit.render();
  POINTS_NODE.replaceChild(tripPointEdit.element, tripPoint.element);
  tripPoint.unrender();
};

tripPointEdit.onSave = () => {
  tripPoint.render();
  POINTS_NODE.replaceChild(tripPoint.element, tripPointEdit.element);
  tripPointEdit.unrender();
};
