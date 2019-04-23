// component.trip-point-edit.js

import flatpickr from 'flatpickr';

import {PointType, pointCategories} from './utils';

import Component from './component.base';


// PointTrip edit View
export default class TripPointEdit extends Component {
  constructor(points, dests, offers) {
    super();
    this._id = points.id;
    this._type = points.type;
    this._dest = points.dest.name;
    this._dateFrom = points.dateFrom;
    this._dateTo = points.dateTo;
    this._basePrice = points.basePrice;
    this._offers = points.offers;
    this._dests = dests;
    this._allOffers = offers;

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
                      id="destination-${this._id}" value="${this._dest}" name="destination">
            <datalist id="destination-select-${this._id}">
              ${this._dests.map((dest) => `
                <option value="${dest.name}"></option>
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
            <p class="point__destination-text">${this._getDescription() ? this._getDescription().descr : ``}</p>
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

  _getTitle() {
    return `
      ${PointType[this._type].name} ${PointType[this._type].category === `travel` ? `to` : `at`}
    `.trim();
  }

  /**
   * @return {ModelDestination|string}
   */
  _getDescription() {
    return this._dests.find((dest) => dest.name === this._dest) || ``;
  }

  _getImages() {
    const descrObject = this._getDescription();
    let imagesHTML = ``;
    if (descrObject) {
      imagesHTML = `${descrObject.pics
        .map((pic) => `<img src="${pic.src}" alt="${pic.description}" class="point__destination-image">`)
        .join(``)}`;
    }
    return imagesHTML;
  }

  _getOffers(isReRender = false) {
    let offersHTML = `There are no any offers`;
    const modelOffers = this._allOffers.find((offer) => offer.type === this._type);
    if (modelOffers && modelOffers.offers.size > 0) {
      // console.log([...modelOffers]);
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
  _updateViewPointDestChange(destValue) {
    this._dest = destValue;
    const descrObject = this._getDescription();
    let descr = ``;
    let pics = ``;
    if (descrObject) {
      descr = descrObject.descr;
      pics = this._getImages();
    }
    this._element.querySelector(`.point__destination-text`).textContent = descr;
    this._element.querySelector(`.point__destination-images`).innerHTML = pics;
  }

  // События при изменении данных в форме
  _onChangeForm(evt) {
    if (evt.target.name === `travel-way`) {
      this._updateViewPointTypeChange(evt.target.value);
    }

    if (evt.target.name === `destination`) {
      this._updateViewPointDestChange(evt.target.value);
    }
  }

  // Создает новый объект с данными из формы
  _processForm(formData) {
    const entry = {
      type: 0,
      dest: {
        name: ``,
        description: this._getDescription().descr,
        pictures: this._getDescription().pics
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

  bind() {
    const from = this._element.querySelector(`form`);
    // Изменение типа point
    from.addEventListener(`change`, this._onChangeForm);

    // Сохранение point
    from.addEventListener(`submit`, this._onSavePoint);

    // Удаление point
    from.addEventListener(`reset`, this._onDeletePoint);

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
  }

  update(data) {
    this._type = data.type;
    this._dest = data.dest.name;
    this._dateFrom = data.dateFrom;
    this._dateTo = data.dateTo;
    this._basePrice = data.basePrice;
    this._offers = data.offers;
  }

  /**
   * Метод для связывания полей формы с объектом для записи данных
   * @param {Object} target
   * @param {string} target.type
   * @param {string} target.dest
   * @param {number} target.basePrice
   * @param {Set}    target.offers
   *
   * @return {Object}
   */
  static createMapper(target) {
    return {
      'travel-way': (value) => (target.type = value),
      'destination': (value) => (target.dest.name = value),
      'price': (value) => (target.basePrice = +value),
      'offer': (value) => {
        const [title, price] = value.split(`+`);
        target.offers.add({title, price, accepted: true});
      }
    };
  }
}
