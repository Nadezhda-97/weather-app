import * as yup from 'yup';
import watcher from './view.js';

const apiKey = '';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&lang=en';

const validateData = (data) => {
  const schema = yup.string().trim().required();
  return schema.validate(data)
    .then(() => null)
    .catch((error) => error);
};

const elements = {
  form: document.getElementById('location-form'),
  input: document.getElementById('search-input'),
  button: document.querySelector('.btn'),
  weather: document.querySelector('.weather'),
  image: document.querySelector('.weather-image'),
  location: document.querySelector('.location'),
  temperature: document.querySelector('.temperature'),
  details: document.querySelector('.details'),
  description: document.querySelector('.description'),
  error: document.querySelector('.error'),
};

const state = {
  form: {
    isValid: null,
    error: null,
  },

  loadingData: {
    status: 'filling',
    error: null,
  },

  location: '',
  iconUrl: '',

  info: {
    temperature: null,
    humidity: null,
    pressure: null,
    description: '',
  },
};

const watchedState = watcher(state, elements);

const checkWeather = (location) => {
  watchedState.loadingData = { status: 'loading', error: null };
  try {
    fetch(`${apiUrl}&q=${location}&appid=${apiKey}`)
      .then((response) => {
        const data = response.json();
        const { temp, humidity, pressure } = data.main;
        const { description, icon } = data.weather[0];

        const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;

        watchedState.loadingData = { status: 'success', error: null };
        watchedState.location = data.name;
        watchedState.iconUrl = iconUrl;
        watchedState.info = { temperature: temp, humidity, pressure, description };
      })
  } catch (error) {
    watchedState.loadingData = { status: 'failed', error };
  }
};

elements.button.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const location = formData.get('location');

  validateData(location)
    .then((error) => {
      if (error) {
        watchedState.form = { isValid: false, error: error.message };
        return;
      }

      watchedState.form = { isValid: true, error: null };
      checkWeather(location);
    });
});
