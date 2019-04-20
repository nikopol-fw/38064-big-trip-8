// data.js

import {createTripPoint} from "./utils";


// Количество карточек
const POINTS_COUNT = 8;

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


const getTripPoints = (count) => {
  const newPoints = [];
  for (let i = 0; i < count; i++) {
    newPoints.push(createTripPoint());
  }
  return newPoints;
};


const cards = getTripPoints(POINTS_COUNT);


export {filters};
