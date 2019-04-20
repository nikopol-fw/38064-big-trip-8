// api.js

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

/**
 *
 * @param {Promise<response>} response
 *
 * @return {Promise<response>|void}
 */
const checkStatus = (response) => {
  console.log(response);
  if (response.status >= 200 && response.status < 300) {
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
      .then(toJSON);
  }

  getOffers() {
    return this._load(`offers`)
      .then(toJSON);
  }

  createPoint() {

  }

  updatePoint() {

  }

  deletePoint() {

  }

  _load(path, method = Method.GET, requestBody = null, requestHeaders = new Headers()) {
    requestHeaders.append(`Authorization`, this._auth);
    console.log(requestHeaders.get(`Authorization`));

    return fetch(`${this._url}/${path}`, {method, requestBody, requestHeaders})
      .then(checkStatus)
      .catch((error) => {
        throw error;
      });
  }
}
