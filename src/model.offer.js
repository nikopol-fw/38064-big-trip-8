// model.offer.js

export default class ModelOffer {
  constructor(data) {
    this.type = data[`type`];
    this.offers = new Set(data[`offers`]);
  }

  static parseOffer(data) {
    return new ModelOffer(data);
  }

  static parseOffers(data) {
    return data.map(ModelOffer.parseOffer);
  }
}
