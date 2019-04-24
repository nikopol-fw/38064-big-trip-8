// component.trip-point-edit.js

/**
 * @typedef {import('./model.point').default} ModelPoint
 * @typedef {import('./model.destination').default} ModelDestination
 * @typedef {import('./model.point').default} ModelOffer
 */

import flatpickr from 'flatpickr';

import {PointType, pointCategories} from './utils';

import Component from './component.base';


const ESC_KODE = 27;

// PointTrip edit View
export default class TripPointEdit extends Component {
  /**
   * @param {ModelPoint} point
   * @param {ModelDestination[]} destinations
   * @param {ModelOffer[]} offers
   */
  constructor(point, destinations, offers) {
    super();
    this._id = point.id;
    this._type = point.type;
    this._destination = point.destination.name;
    this._dateFrom = point.dateFrom;
    this._dateTo = point.dateTo;
    this._basePrice = point.basePrice;
    this._offers = point.offers;
    this._destinations = destinations;
    this._allOffers = offers;

    this._element = null;
    this._onSave = null;

    this._onSavePoint = this._onSavePoint.bind(this);
    this._onDeletePoint = this._onDeletePoint.bind(this);
    this._onChangeForm = this._onChangeForm.bind(this);
    this._onEscDown = this._onEscDown.bind(this);
  }

  get template() {
    return `<article class="point">
      <form action="/" method="post" enctype="multipart/form-data">
        <header class="point__header">
          <label class="point__date">choose day
            <input class="point__input" type="text" placeholder="MAR 18" name="day">
          </label>

          <div class="travel-way">
            <label class="travel-way__label" for="travel-way__toggle">${PointType[this._type].icon}</label>

            <input type="checkbox" class="travel-way__toggle visually-hidden" id="travel-way__toggle">

            <div class="travel-way__select">${pointCategories.map((category) => `
              <div class="travel-way__select-group">${Object.entries(PointType)
                .map((item) => item[1].category === category ? `
                  <input class="travel-way__select-input visually-hidden" type="radio"
                            id="travel-way-${item[0]}"
                          name="travel-way" value="${item[0]}"
                          ${item[0] === this._type ? `checked` : ``}>
                  <label class="travel-way__select-label"
                           for="travel-way-${item[0]}">${item[1].icon} ${item[1].name}</label>
              `.trim() : ``)
              .join(``)}</div>
            `.trim())
            .join(``)}</div>
          </div>

          <div class="point__destination-wrap">
            <label class="point__destination-label" for="destination-${this._id}">${this._getTitle()}</label>
            <input class="point__destination-input" list="destination-select-${this._id}"
                      id="destination-${this._id}" value="${this._destination}" name="destination">
            <datalist id="destination-select-${this._id}">
              ${this._destinations.map((destination) => `
                <option value="${destination.name}"></option>
              `.trim())
              .join(``)}
            </datalist>
          </div>

          <label class="point__time">choose time
            <input class="point__input" type="text" value="${this._dateFrom}" name="date-start" placeholder="19:00">
            <input class="point__input" type="text" value="${this._dateTo}" name="date-end" placeholder="21:00">
          </label>

          <label class="point__price">write price
            <span class="point__price-currency">€</span>
            <input class="point__input" type="text" value="${this._basePrice}" name="price">
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

            <div class="point__offers-wrap">${this._getOffers()}</div>
          </section>
          <section class="point__destination">
            <h3 class="point__details-title">Destination</h3>
            <p class="point__destination-text">${this._getDescription() ? this._getDescription().description : ``}</p>
            <div class="point__destination-images">${this._getImages()}</div>
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

  set onEsc(fn) {
    this._onEsc = fn;
  }

  _getTitle() {
    return `
      ${PointType[this._type].name} ${PointType[this._type].category === `travel` ? `to` : `at`}
    `.trim();
  }

  _getDescription() {
    return this._destinations.find((destination) => destination.name === this._destination) || ``;
  }

  _getImages() {
    const descriptionObject = this._getDescription();
    let imagesHTML = ``;
    if (descriptionObject) {
      imagesHTML = `${descriptionObject.images
        .map((image) => `<img src="${image.src}" alt="${image.description}" class="point__destination-image">`)
        .join(``)}`;
    }
    return imagesHTML;
  }

  _getOffers(isReRender = false) {
    let offersHTML = `There are no any offers`;
    const modelOffers = this._allOffers.find((offer) => offer.type === this._type);
    if (modelOffers && modelOffers.offers.size > 0) {
      offersHTML = [...modelOffers.offers].map((offer) => `
        <input class="point__offers-input visually-hidden" type="checkbox"
                  id="${offer.name.toLowerCase().split(` `).join(`-`)}-${this._id}" name="offer"
               value="${offer.name}+${offer.price}"
                      ${[...this._offers].some((item) => item.title === offer.name && item.accepted === true && !isReRender) ? `checked` : ``}>
        <label for="${offer.name.toLowerCase().split(` `).join(`-`)}-${this._id}" class="point__offers-label">
          <span class="point__offer-service">${offer.name}</span> + €<span class="point__offer-price">${offer.price}</span>
        </label>
      `.trim())
      .join(``);
    }
    return offersHTML;
  }

  // Обновляем контент элемента компоненты при изменении типа точки маршрута
  _updateViewPointTypeChange(typeValue) {
    this._type = typeValue;
    this._element.querySelector(`.travel-way__label`).textContent = PointType[this._type].icon;
    this._element.querySelector(`.point__destination-label`).textContent = this._getTitle();
    this._element.querySelector(`.point__offers-wrap`).innerHTML = this._getOffers(true);
  }

  // Обновляет описание направления
  _updateViewPointDestinationChange(destinationValue) {
    this._destination = destinationValue;
    const descriptionObject = this._getDescription();
    let description = ``;
    let images = ``;
    if (descriptionObject) {
      description = descriptionObject.description;
      images = this._getImages();
    }
    this._element.querySelector(`.point__destination-text`).textContent = description;
    this._element.querySelector(`.point__destination-images`).innerHTML = images;
  }

  // События при изменении данных в форме
  _onChangeForm(evt) {
    if (evt.target.name === `travel-way`) {
      this._updateViewPointTypeChange(evt.target.value);
    }

    if (evt.target.name === `destination`) {
      this._updateViewPointDestinationChange(evt.target.value);
    }
  }

  // Создает новый объект с данными из формы
  _processForm(formData) {
    const entry = {
      type: ``,
      destination: {
        name: ``,
        description: this._getDescription().description,
        pictures: this._getDescription().images
      },
      dateFrom: this._dateFrom,
      dateTo: this._dateTo,
      basePrice: 0,
      offers: new Set(),
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
      this._onDelete(this._id);
    }
  }

  _onEscDown(evt) {
    if (evt.keyCode === ESC_KODE && typeof this._onEsc === `function`) {
      this._onEsc();
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

    //
    document.addEventListener(`keydown`, this._onEscDown);

    // Подключаем flatpickr
    const inputDateFrom = this._element.querySelector(`.point__input[name=date-start]`);
    const inputDateTo = this._element.querySelector(`.point__input[name=date-end]`);
    const self = this;
    flatpickr(inputDateFrom, {
      'enableTime': true,
      'altInput': true,
      'altFormat': `H:i`,
      'dateFormat': `H:i`,
      'time_24hr': true,
      'defaultDate': this._dateFrom,
      'onChange': function (selectedDates) {
        self._dateFrom = selectedDates[0];
      }
    });
    flatpickr(inputDateTo, {
      'enableTime': true,
      'altInput': true,
      'altFormat': `H:i`,
      'dateFormat': `H:i`,
      'time_24hr': true,
      'defaultDate': this._dateTo,
      'onChange': function (selectedDates) {
        self._dateTo = selectedDates[0];
      }
    });
  }

  unbind() {
    const form = this._element.querySelector(`form`);
    form.removeEventListener(`change`, this._onChangeForm);
    form.removeEventListener(`submit`, this._onSavePoint);
    form.removeEventListener(`reset`, this._onDeletePoint);
    document.removeEventListener(`keydown`, this._onEscDown);
  }

  update(data) {
    this._type = data.type;
    this._destination = data.destination.name;
    this._dateFrom = data.dateFrom;
    this._dateTo = data.dateTo;
    this._basePrice = data.basePrice;
    this._offers = data.offers;
  }

  /**
   * Метод для связывания полей формы с объектом для записи данных
   * @param {Object} target
   * @param {string} target.type
   * @param {Object} target.destination
   * @param {number} target.basePrice
   * @param {Set}    target.offers
   *
   * @return {Object}
   */
  static createMapper(target) {
    return {
      'travel-way': (value) => (target.type = value),
      'destination': (value) => (target.destination.name = value),
      'price': (value) => (target.basePrice = +value),
      'offer': (value) => {
        const [title, price] = value.split(`+`);
        target.offers.add({title, price, accepted: true});
      }
    };
  }
}
