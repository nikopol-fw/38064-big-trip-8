// data.js

import {createTripPoint} from "./utils";

// Фильтры
const FILTERS = [
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


const point = createTripPoint();


export {FILTERS, point};
