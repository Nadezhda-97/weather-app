const apiKey = '';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&lang=en';

const elements = {
  form: document.getElementById('location-form'),
  input: document.getElementById('search-input'),
  button: document.querySelector('.btn'),
  weather: document.querySelector('.weather'),
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

const checkWeather = (location) => {
  try {
    fetch(`${apiUrl}&q=${location}&appid=${apiKey}`)
      .then((response) => {
        const data = response.json();

        const { temp, humidity, pressure } = data.main;
        const { description, icon } = data.weather[0];
        const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;

        state.loadingData = { status: 'success', error: null };
        state.location = data.name;
        state.iconUrl = iconUrl;
        state.info = { temperature: temp, humidity, pressure, description };
      })
  } catch (error) {
    state.loadingData = { status: 'failed', error };
    throw new Error('Unable to fetch weather data');
  }
};

elements.button.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const location = formData.get('location');

  checkWeather(location);
});
