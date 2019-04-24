// component.trip-point.js

import moment from 'moment';

import {PointType} from './utils';

import Component from './component.base';


// PointTrip View
export default class TripPoint extends Component {
  constructor(data) {
    super();
    this._id = data.id;
    this._type = data.type;
    this._destination = data.destination.name;
    this._dateFrom = data.dateFrom;
    this._dateTo = data.dateTo;
    this._basePrice = data.basePrice;
    this._offers = data.offers;

    this._element = null;
    this._onEdit = null;

    this._onEditPointClick = this._onEditPointClick.bind(this);
  }

  get template() {
    return `
    <article class="trip-point">
      <i class="trip-icon">${PointType[this._type].icon}</i>
      <h3 class="trip-point__title">${this._getTitle()} ${this._destination}</h3>
      <p class="trip-point__schedule">
        <span class="trip-point__timetable"
          >${moment(this._dateFrom).format(`H:mm`)}&nbsp;&mdash; ${moment(this._dateTo).format(`H:mm`)}</span>
        <span class="trip-point__duration">${this._getDuration()}</span>
      </p>
      <p class="trip-point__price">&euro;&nbsp;${this._basePrice}</p>
      <ul class="trip-point__offers">${[...this._offers]
        .filter((offer) => offer.accepted)
        .map((offer, ind) => ind < 3 ? `
          <li><button class="trip-point__offer">${offer.title}</button></li>
        `.trim() : ``)
        .join(``)}</ul>
    </article>`.trim();
  }

  get element() {
    return this._element;
  }

  set onEdit(fn) {
    this._onEdit = fn;
  }

  _getTitle() {
    return `${PointType[this._type].name} ${PointType[this._type].category === `travel` ? `to` : `at`}`;
  }

  _getDuration() {
    const duration = moment.duration(moment(this._dateTo).diff(this._dateFrom));
    return `${duration.get(`d`) ? `${duration.get(`d`)}d ` : ``}` +
           `${duration.get(`h`) ? `${duration.get(`h`)}h ` : ``}` +
           `${duration.get(`m`)}m`;
  }

  _onEditPointClick() {
    if (typeof this._onEdit === `function`) {
      this._onEdit();
    }
  }

  bind() {
    this._element.addEventListener(`click`, this._onEditPointClick);
  }

  unbind() {
    this._element.removeEventListener(`click`, this._onEditPointClick);
  }

  update(data) {
    this._type = data.type;
    this._destination = data.destination.name;
    this._dateFrom = data.dateFrom;
    this._dateTo = data.dateTo;
    this._basePrice = data.basePrice;
    this._offers = data.offers;
  }
}
