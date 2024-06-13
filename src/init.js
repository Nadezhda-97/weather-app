import * as yup from 'yup';
import watcher from './view.js';

const apiKey = 'db1d0fea490bdb2fd095dcd7e3098257';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&lang=en';

const validateData = (data) => {
  const schema = yup.string().trim().required();
  return schema.validate(data)
    .then(() => null)
    .catch((error) => error);
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
      const { humidity, pressure, temp } = data.main;
      const { description, icon } = data.weather[0];

      const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;

      watchedState.loadingData = { status: 'success', error: null };
      watchedState.info = { temperature: temp, humidity, pressure, description };
      watchedState.location = data.name;
      watchedState.iconUrl = iconUrl;
    })
    .catch((error) => {
      watchedState.loadingData = { status: 'failed', error: 'yes' };
      console.error(error);
      console.log('error in catch, name ->', error.name);
      console.log('error in catch, message ->', error.message);
    })
};

const init = () => {
  const elements = {
    form: document.querySelector('.location-form'),
    input: document.getElementById('search-input'),
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

  elements.form.addEventListener('submit', (e) => {
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
        checkWeather(location, watchedState);
      });
  });
};

export default init;
