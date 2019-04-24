// component.total

import Component from './component.base';


export default class Total extends Component {
  /**
   * @param {number} data
   */
  constructor(data) {
    super();
    this._total = data;
  }

  get template() {
    return `
      <span class="trip__total-cost">&euro;&nbsp;${this._total}</span>
    `.trim();
  }

  get element() {
    return this._element;
  }

  update(data) {
    this._total = data;
    this._element.innerHTML = `&euro;&nbsp;${this._total}`;
  }
}
