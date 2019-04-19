// component.filter.js

import Component from './component.base';


// Filter View
export default class Filter extends Component {
  constructor(filters) {
    super();
    this.filters = filters;

    this._onChangeForm = this._onChangeForm.bind(this);
  }

  get template() {
    return `
      <form class="trip-filter">${[...this.filters]
        .map((filter) => `
          <input type="radio" id="filter-${filter.id}" name="filter" value="${filter.id}"
            ${filter.isActive ? `checked` : ``}>
          <label class="trip-filter__item" for="filter-${filter.id}">${filter.name}</label>
        `.trim())
        .join(``)}</form>
      `.trim();
  }

  get element() {
    return this._element;
  }

  set onFilter(fn) {
    this._onFilter = fn;
  }

  _onChangeForm(evt) {
    if (typeof this._onFilter === `function`) {
      this._onFilter(evt);
    }
  }

  bind() {
    this._element.addEventListener(`change`, this._onChangeForm);
  }

  unbind() {
    this._element.removeEventListener(`change`, this._onChangeForm);
  }
}
