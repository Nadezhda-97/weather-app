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
  try {
    fetch(`${apiUrl}&q=${location}&appid=${apiKey}`)
      .then((response) => {
        if (!response.ok) {
          watchedState.loadingData = { status: 'failed', error: 'yes' };
          console.log('watchedState in error', watchedState);
          return;
        } else {
          const data = response.json();
          return data;
        }
      })
      .then((data) => {
        console.log('state in checkWeather before data ->', watchedState);
        console.log('data.main ->', data.main);
        console.log('data.weather[0] ->', data.weather[0]);
        console.log('data.main.temp ->', data.main.humidity);
        console.log('data.weather[0].description ->', data.weather[0].description);
        const { humidity, pressure, temp } = data.main;
        const { description, icon } = data.weather[0];

        const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;

        watchedState.loadingData = { status: 'success', error: null };
        console.log('success');
        watchedState.info = { temperature: temp, humidity, pressure, description };
        console.log('info');
        watchedState.location = data.name;
        console.log('location');
        watchedState.iconUrl = iconUrl;
        console.log('iconUrl');
        console.log('state in checkWeather after data -> ', watchedState);
      })
  } catch (error) {
    watchedState.loadingData = { status: 'failed', error };
  }
};

const init = () => {
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
