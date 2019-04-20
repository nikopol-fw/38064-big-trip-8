// component.trip-point-edit.js

import flatpickr from 'flatpickr';

import {PointType, Offers} from './utils';
import Component from './component.base';


// PointTrip edit View
export default class TripPointEdit extends Component {
  constructor(point) {
    super();
    this._type = point.type;
    this._name = point.name;
    this._price = point.price;
    this._offers = point.offers;
    this._startDateTime = point.startDateTime;
    this._endDateTime = point.endDateTime;

    this._element = null;
    this._onSave = null;

    this._onSavePoint = this._onSavePoint.bind(this);
    this._onDeletePoint = this._onDeletePoint.bind(this);
    this._onChangeForm = this._onChangeForm.bind(this);
  }

  get template() {
    return `<article class="point">
      <form action="/" method="post" enctype="multipart/form-data">
        <header class="point__header">
          <label class="point__date">choose day
            <input class="point__input" type="text" placeholder="MAR 18" name="day">
          </label>

          <div class="travel-way">
            <label class="travel-way__label" for="travel-way__toggle">${PointType.properties.get(this._type).icon}</label>

            <input type="checkbox" class="travel-way__toggle visually-hidden" id="travel-way__toggle">

            <div class="travel-way__select">
              ${PointType.types
                .map((type) => `
                  <div class="travel-way__select-group">
                    ${Array.from(PointType.properties)
                      .map((item) => item[1].type === type ? `
                        <input class="travel-way__select-input visually-hidden" type="radio"
                               id="travel-way-${item[1].serviceName}"
                               name="travel-way" value="${item[1].serviceName}"
                               ${this._type === item[0] ? `checked` : ``}>
                        <label class="travel-way__select-label"
                               for="travel-way-${item[1].serviceName}">${item[1].icon} ${item[1].serviceName}</label>
                      `.trim() : ``)
                      .join(``)}
                  </div>
                `.trim())
                .join(``)}
            </div>
          </div>

          <div class="point__destination-wrap">
            <label class="point__destination-label" for="destination"
              >${PointType.properties
                .get(this._type).name}${PointType.properties
                .get(this._type).type === `travel` ? ` to` : ``}${PointType.properties
                .get(this._type).name === `Check` ? ` into` : ``}</label>
            <input class="point__destination-input" list="destination-select" id="destination" value="${this._name}" name="destination">
            <datalist id="destination-select">
              <option value="airport"></option>
              <option value="Geneva"></option>
              <option value="Chamonix"></option>
              <option value="hotel"></option>
            </datalist>
          </div>

          <label class="point__time">
            choose time
            <input class="point__input" type="text" value="19:00" name="date-start" placeholder="19:00">
            <input class="point__input" type="text" value="21:00" name="date-end" placeholder="21:00">
          </label>

          <label class="point__price">
            write price
            <span class="point__price-currency">€</span>
            <input class="point__input" type="text" value="${this._price}" name="price">
          </label>

          <div class="point__buttons">
            <button class="point__button point__button--save" type="submit">Save</button>
            <button class="point__button" type="reset">Delete</button>
          </div>

          <div class="paint__favorite-wrap">
            <input type="checkbox" class="point__favorite-input visually-hidden" id="favorite" name="favorite">
            <label class="point__favorite" for="favorite">favorite</label>
          </div>
        </header>

        <section class="point__details">
          <section class="point__offers">
            <h3 class="point__details-title">offers</h3>

            <div class="point__offers-wrap">${Array.from(Offers.properties)
              .filter((offer) => offer[1].pointType.some((type) => this._type === type))
              .map((offer) => `
                  <input class="point__offers-input visually-hidden" type="checkbox"
                         id="${offer[1].serviceName}" name="offer"
                         value="${offer[1].serviceName}"
                         ${this._offers.has(offer[0]) ? `checked` : ``}>
                  <label for="${offer[1].serviceName}" class="point__offers-label">
                    <span class="point__offer-service">${offer[1].name}</span> + €<span class="point__offer-price">${offer[1].cost}</span>
                  </label>
                `.trim())
              .join(``) || `There are no any offers`}</div>
          </section>
          <section class="point__destination">
            <h3 class="point__details-title">Destination</h3>
            <p class="point__destination-text">Geneva is a city in Switzerland that lies at the southern tip of expansive Lac Léman (Lake Geneva). Surrounded by the Alps and Jura mountains, the city has views of dramatic Mont Blanc.</p>
            <div class="point__destination-images">
              <img src="http://picsum.photos/330/140?r=123" alt="picture from place" class="point__destination-image">
              <img src="http://picsum.photos/300/200?r=1234" alt="picture from place" class="point__destination-image">
              <img src="http://picsum.photos/300/100?r=12345" alt="picture from place" class="point__destination-image">
              <img src="http://picsum.photos/200/300?r=123456" alt="picture from place" class="point__destination-image">
              <img src="http://picsum.photos/100/300?r=1234567" alt="picture from place" class="point__destination-image">
            </div>
          </section>
          <input type="hidden" class="point__total-price" name="total-price" value="">
        </section>
      </form>
    </article>`;
  }

  get element() {
    return this._element;
  }

  set onChangeForm(fn) {
    this._onChange = fn;
  }

  set onSave(fn) {
    this._onSave = fn;
  }

  set onDelete(fn) {
    this._onDelete = fn;
  }

  // Обновляем контент элемента компоненты при изменении типа точки маршрута
  _updateViewPointTypeChange(value) {
    this._type = PointType[value];
    this._element.querySelector(`.travel-way__label`).textContent = PointType.properties.get(this._type).icon;
    this._element.querySelector(`.point__destination-label`).textContent = `
      ${PointType.properties
      .get(this._type).name}${PointType.properties
      .get(this._type).type === `travel` ? ` to` : ``}${PointType.properties
      .get(this._type).name === `Check` ? ` into` : ``}
    `.trim();
  }

  // События при изменении данных в форме
  _onChangeForm(evt) {
    if (evt.target.name === `travel-way`) {
      this._updateViewPointTypeChange(evt.target.value);
    }
  }

  // Создает новый объект с данными из формы
  _processForm(formData) {
    const entry = {
      type: 0,
      name: ``,
      price: 0,
      offers: new Set(),
      descr: ``
    };

    const pointEditMapper = TripPointEdit.createMapper(entry);

    for (const pair of formData.entries()) {
      const [property, value] = pair;
      if (pointEditMapper[property]) {
        pointEditMapper[property](value);
      }
    }

    return entry;
  }

  // Submit PointEdit
  _onSavePoint(evt) {
    evt.preventDefault();

    if (typeof this._onSave === `function`) {
      const formData = new FormData(this._element.querySelector(`form`));
      const newData = this._processForm(formData);

      this.update(newData);
      this._onSave(newData);
    }
  }

  // Reset PointEdit
  _onDeletePoint(evt) {
    evt.preventDefault();

    if (typeof this._onDelete === `function`) {
      this._onDelete();
    }
  }

  bind() {
    const from = this._element.querySelector(`form`);
    // Изменение типа point
    from.addEventListener(`change`, this._onChangeForm);

    // Сохранение point
    from.addEventListener(`submit`, this._onSavePoint);

    // Удаление point
    from.addEventListener(`reset`, this._onDeletePoint);

    // Подключаем flatpickr
    const inputTimeStart = this._element.querySelector(`.point__input[name=date-start]`);
    const inputTimeEnd = this._element.querySelector(`.point__input[name=date-end]`);
    flatpickr(inputTimeStart, {
      // 'mode': `range`,
      'enableTime': true,
      'altInput': true,
      'altFormat': `H:i`,
      'dateFormat': `H:i`,
      'time_24hr': true,
    });
    flatpickr(inputTimeEnd, {
      // 'mode': `range`,
      'enableTime': true,
      'altInput': true,
      'altFormat': `H:i`,
      'dateFormat': `H:i`,
      'time_24hr': true,
    });
  }

  unbind() {
    const form = this._element.querySelector(`form`);
    form.removeEventListener(`change`, this._onChangeForm);
    form.removeEventListener(`submit`, this._onSavePoint);
    form.removeEventListener(`reset`, this._onDeletePoint);
  }

  update(data) {
    this._type = data.type;
    this._name = data.name;
    this._price = data.price;
    this._offers = data.offers;
  }

  /**
   * Метод для связывания полей формы с объектом для записи данных
   * @param {Object} target
   * @param {number} target.type
   * @param {string} target.name
   * @param {number} target.price
   * @param {Set}    target.offers
   * @param {string} target.descr
   *
   * @return {Object}
   */
  static createMapper(target) {
    return {
      'travel-way': (value) => (target.type = +PointType[value]),
      'destination': (value) => (target.name = value),
      'price': (value) => (target.price = +value),
      'offer': (value) => target.offers.add(Offers[value])
    };
  }
}
