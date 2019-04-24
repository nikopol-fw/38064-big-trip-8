// component.base.js

import {createElement} from './utils';

export default class Component {
  constructor() {
    if (new.target === Component) {
      throw new Error(`Can't instantiate Component, only concrete one.`);
    }

    this._element = null;
  }

  get template() {
    throw new Error(`You have to define template`);
  }

  bind() {}

  unbind() {}

  render() {
    this._element = createElement(this.template);
    this.bind();
    return this._element;
  }

  /**
   * * Вызывает метод unbind для компоненты
   * * Записывает в поле _element null
   */
  unrender() {
    this.unbind();
    this._element = null;
  }

  update() {}
}
