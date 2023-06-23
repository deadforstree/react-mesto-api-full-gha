class Auth {
  constructor({ baseUrl }) {
    this._baseUrl = baseUrl;
  }

  _getResponse(res) {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(`Ошибка: ${res.status}`);
    }
  }

  register(email, password) {
    return fetch(`${BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: `${email}`, password: `${password}` }),
    }).then(this._getResponse);
  }

  login(email, password) {
    return fetch(`${BASE_URL}/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then(this._getResponse)
      .then((data) => {
        console.log('Data received:', data);
        if (data.token) {
          localStorage.setItem('token', data.token);
          return data;
        }
      });
  }

  checkToken() {
    return fetch(`${BASE_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(this._getResponse)
      .then((data) => data);
  }
}

export const auth = new Auth({
  baseUrl: 'https://api.deadforstree.nomoredomains.work',
});

const BASE_URL = "https://api.deadforstree.nomoredomains.work";