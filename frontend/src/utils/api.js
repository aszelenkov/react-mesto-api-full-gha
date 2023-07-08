class Api {
  constructor({ baseUrl }) {
    this._baseUrl = baseUrl;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    } else {
     return Promise.reject(`Ошибка: ${res.status}`);
    }
  }

  getItems() {
    const token = localStorage.getItem('token');
    return fetch(`${this._baseUrl}/cards`, { 
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    }).then((res) => this._checkResponse(res));
  }

  setItem(data) {
    const token = localStorage.getItem('token');
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        name: data.name,
        link: data.link,
      }),
    }).then((res) => this._checkResponse(res));
  }

  deleteCard(_id) {
    const token = localStorage.getItem('token');
    return fetch(`${this._baseUrl}/cards/${_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    }).then((res) => this._checkResponse(res));
  }

  addLike(_id) {
    const token = localStorage.getItem('token');
    return fetch(`${this._baseUrl}/cards/${_id}/likes`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    }).then((res) => this._checkResponse(res));
  }

  deleteLike(_id) {
    const token = localStorage.getItem('token');
    return fetch(`${this._baseUrl}/cards/${_id}/likes`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    }).then((res) => this._checkResponse(res));
  }

  changeLikeCardStatus(_id, isLiked) {
    return isLiked ? this.deleteLike(_id) : this.addLike(_id);
  };

  editAvatar(avatar) {
    const token = localStorage.getItem('token');
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        avatar
      }),
    }).then((res) => this._checkResponse(res));
  };

  getUserInfo() {
    const token = localStorage.getItem('token');
    return fetch(`${this._baseUrl}/users/me`, { 
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => this._checkResponse(res));
  };

  setUserInfo({ name, about }) {
    const token = localStorage.getItem('token');
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: name, about: about }),
    }).then((res) => this._checkResponse(res));
  };

};

const api = new Api({
  baseUrl: 'http://localhost:3000',
});

export default api;