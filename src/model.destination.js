// model.destination.js

/**
 * Модель Направление
 * @module model.destination
 */

export default class ModelDestination {
  constructor(data) {
    this.name = data[`name`];
    this.description = data[`description`];
    this.images = data[`pictures`];
  }

  static parseDestination(data) {
    return new ModelDestination(data);
  }

  static parseDestinations(data) {
    return data.map(ModelDestination.parseDestination);
  }
}
