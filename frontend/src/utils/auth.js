// export const BASE_URL = 'https://api.aszelenkov.nomoredomains.work';
export const BASE_URL = 'http://localhost:3000';

const checkResponse = (res) => {
  if (res.ok) {
    return res.json();
  } else {
    switch (res.status) {
      case 400:
        return Promise.reject('400 - Некорректно заполнено одно из полей');
      case 401:
        return Promise.reject('401 - Пользователь с таким email не найден');
      default:
        return Promise.reject(`Ошибка: ${res.status}`);
    }
  }
};

export const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
  .then(checkResponse);
}

export const authorize = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
  .then(checkResponse)
  .then((data) => {
    if (data.token){
      localStorage.setItem('token', data.token);
      return data;
    }
  });
};

export const checkToken = () => {
  const token = localStorage.getItem('token');
  if (token){
    return fetch(`${BASE_URL}/users/me`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    })
    .then(checkResponse);
  } else {
    return Promise.reject('Токен не найден');
  }
};

