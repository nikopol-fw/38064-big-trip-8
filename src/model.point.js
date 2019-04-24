// model.point.js

/**
 * Модель Точка маршрута
 * @module model.point
 */

export default class ModelPoint {
  constructor(data) {
    this.id = data[`id`];
    this.type = data[`type`];
    this.destination = data[`destination`];
    this.dateFrom = new Date(data[`date_from`]);
    this.dateTo = new Date(data[`date_to`]);
    /** @type {number} */
    this.basePrice = data[`base_price`];
    this.offers = new Set(data[`offers`] || []);
  }

  toRAW() {
    return {
      'id': this.id,
      'type': this.type,
      'destination': this.destination,
      'date_from': this.dateFrom.getTime(),
      'date_to': this.dateTo.getTime(),
      'base_price': this.basePrice,
      'offers': [...this.offers],
      'is_favorite': false
    };
  }

  static parsePoint(data) {
    return new ModelPoint(data);
  }

  static parsePoints(data) {
    return data.map(ModelPoint.parsePoint);
  }
}
