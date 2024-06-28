import i18next from 'i18next';

import resources from './locales/locale.js';
import watcher from './view.js';

const apiKey = 'db1d0fea490bdb2fd095dcd7e3098257';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&lang=en';

const handleError = (error) => {
  switch (error.name) {
    case 'ResponseError':
      return 'responseError';
    case 'TypeError':
      return 'connectionError';
    default:
      return 'unknownError';
  }
};

const checkWeather = (location, watchedState) => {
  watchedState.loadingData = { status: 'loading', error: null };
  fetch(`${apiUrl}&q=${location}&appid=${apiKey}`)
    .then((response) => {
      if (!response.ok) {
        const error = new Error('Network response was not ok');
        error.name = 'ResponseError';
        throw error;
      }
      return response.json();
    })
    .then((data) => {
      const {
        humidity,
        pressure,
        temp,
        feels_like: feelsLike,
      } = data.main;
      const { description, icon } = data.weather[0];
      const { speed: wind } = data.wind;

      const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;

      watchedState.loadingData = { status: 'success', error: null };
      watchedState.info = {
        temperature: temp,
        feelsLike,
        humidity,
        pressure,
        description,
        wind,
      };
      watchedState.location = data.name;
      watchedState.iconUrl = iconUrl;
    })
    .catch((error) => {
      watchedState.loadingData = { status: 'failed', error: handleError(error) };
      console.error(error);
    });
};

const init = async () => {
  const i18nextInstance = i18next.createInstance();
  await i18nextInstance.init({
    lng: 'en',
    debug: true,
    resources,
  });

  const elements = {
    form: document.querySelector('.location-form'),
    input: document.getElementById('search-input'),
    button: document.querySelector('.btn'),
    weather: document.querySelector('.weather'),
    image: document.querySelector('.weather-image'),
    location: document.querySelector('.location'),
    temperature: document.querySelector('.temperature'),
    details: document.querySelector('.details'),
    description: document.querySelector('.description'),
    errorText: document.querySelector('.errorText'),
  };

  const state = {
    loadingData: {
      status: 'filling',
      error: null,
    },

    location: '',
    iconUrl: '',

    info: {
      temperature: null,
      feelsLike: null,
      humidity: null,
      pressure: null,
      description: '',
      wind: null,
    },
  };

  const watchedState = watcher(state, elements, i18nextInstance);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const location = formData.get('location');

    checkWeather(location, watchedState);
  });
};

export default init;
