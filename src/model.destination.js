// model.destination.js

export default class ModelDestination {
  constructor(data) {
    this.name = data[`name`];
    this.descr = data[`description`];
    this.pics = data[`pictures`];
  }

  static parseDestination(data) {
    return new ModelDestination(data);
  }

  static parseDestinations(data) {
    return data.map(ModelDestination.parseDestination);
  }
}
