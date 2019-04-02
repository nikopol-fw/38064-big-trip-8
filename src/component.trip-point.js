// component.trip-point.js

import {PointType} from './utils';
import Component from './component.base';


// Карточка точки путешествия
export default class TripPoint extends Component {
  constructor(point) {
    super();
    this._type = point.type;
    this._name = point.name;
    this._price = point.price;
    this._offers = point.offers;

    this._element = null;
    this._onEdit = null;

    this._onEditPointClick = this._onEditPointClick.bind(this);
  }

  get template() {
    return `<article class="trip-point">
      <i class="trip-icon">${PointType.properties[this._type].icon}</i>
      <h3 class="trip-point__title">${this._name}</h3>
      <p class="trip-point__schedule">
        <span class="trip-point__timetable">10:00&nbsp;&mdash; 11:00</span>
        <span class="trip-point__duration">1h 30m</span>
      </p>
      <p class="trip-point__price">&euro;&nbsp;${this._price}</p>
      <ul class="trip-point__offers">${[...this._offers]
        .map((offer) => `<li><button class="trip-point__offer">${offer}</button></li>`)
        .join(``)}</ul>
    </article>`;
  }

  get element() {
    return this._element;
  }

  set onEdit(fn) {
    this._onEdit = fn;
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
}
