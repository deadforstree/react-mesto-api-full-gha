class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(`Ошибка: ${res.status}`);
    }
  }

  getUserInfo() {
    const token = localStorage.getItem("token");
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    }).then(this._checkResponse);
  }

  getInitialCards() {
    const token = localStorage.getItem("token");
    return fetch(`${this._baseUrl}/cards`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    }).then(this._checkResponse);
  }

  setUserInfo(userData) {
    const token = localStorage.getItem("token");
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: userData.name,
        about: userData.about
      }),
    }).then(this._checkResponse);
  }

  addUserCard(data) {
    const token = localStorage.getItem("token");
    return fetch(`${this._baseUrl}/cards`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        link: data.link
      }),
    }).then(this._checkResponse);
  }

  changeLikeCardStatus(id, isLiked) {
    const token = localStorage.getItem("token");
    if (!isLiked) {
      isLiked = true;
    } else {
      isLiked = false;
    }

    return fetch(`${this._baseUrl}/cards/${id}/likes`, {
      method: isLiked ? 'PUT' : 'DELETE',
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then(this._checkResponse);
  }

  deleteCard(id) {
    const token = localStorage.getItem("token");
    return fetch(`${this._baseUrl}/cards/${id}`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  }

  setUserAvatar(img) {
    const token = localStorage.getItem("token");
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        avatar: `${img.avatar}`,
      }),
    }).then(this._checkResponse);
  }
}

export const api = new Api({
  baseUrl: 'https://api.deadforstree.nomoredomains.work',
  headers: {
    // authorization: 'e35b94b1-baff-4190-b21b-fc912cacb94b',
    'Content-Type': 'application/json',
  },
});