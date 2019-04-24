// api.js

import ModelPoint from './model.point';
import ModelDestination from './model.destination';
import ModelOffer from './model.offer';


const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const HttpCode = {
  OK: 200,
  REDIRECT: 300
};


//
const checkStatus = (response) => {
  if (response.status >= HttpCode.OK && response.status < HttpCode.REDIRECT) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

//
const toJSON = (response) => {
  return response.json();
};


export default class API {
  constructor(url, auth) {
    this._url = url;
    this._auth = auth;
  }

  getPoints() {
    return this._load(`points`)
      .then(toJSON)
      .then(ModelPoint.parsePoints);
  }

  getDestinations() {
    return this._load(`destinations`)
      .then(toJSON)
      .then(ModelDestination.parseDestinations);
  }

  getOffers() {
    return this._load(`offers`)
      .then(toJSON)
      .then(ModelOffer.parseOffers);
  }

  createPoint(point) {
    return this._load(`points`, Method.POST, JSON.stringify(point), new Headers({'Content-Type': `application/json`}))
      .then(toJSON)
      .then(ModelPoint.parsePoint);
  }

  updatePoint(id, data) {
    return this._load(`points/${id}`, Method.PUT, JSON.stringify(data), new Headers({'Content-Type': `application/json`}))
      .then(toJSON)
      .then(ModelPoint.parsePoint);
  }

  deletePoint(id) {
    return this._load(`points/${id}`, Method.DELETE);
  }

  _load(path, method = Method.GET, body = null, headers = new Headers()) {
    headers.append(`Authorization`, this._auth);

    return fetch(`${this._url}/${path}`, {method, body, headers})
      .then(checkStatus)
      .catch((error) => {
        throw error;
      });
  }
}
