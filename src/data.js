// data.js

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

// Предложения
const OFFERS = [`Add luggage`, `Switch to comfort class`, `Add meal`, `Choose seats`];


export {FILTERS, OFFERS};
