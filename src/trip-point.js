// trip-point.js

const TripTypeEnum = {
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


const getTripPointView = (point) => {
  const template = `<i class="trip-icon">${TripTypeEnum.properties[point.type].icon}</i>
  <h3 class="trip-point__title">${point.name}</h3>
  <p class="trip-point__schedule">
    <span class="trip-point__timetable">10:00&nbsp;&mdash; 11:00</span>
    <span class="trip-point__duration">1h 30m</span>
  </p>
  <p class="trip-point__price">&euro;&nbsp;${point.price}</p>
  <ul class="trip-point__offers">${[...point.offers]
    .map((offer) => `<li><button class="trip-point__offer">${offer}</button></li>`)
    .join(``)}</ul>`;

  const article = document.createElement(`article`);
  article.classList.add(`trip-point`);
  article.innerHTML = template;

  return article;
};

export default getTripPointView;
