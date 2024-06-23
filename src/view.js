import onChange from 'on-change';

import humidityImage from './assets/humidity.png';
import windImage from './assets/wind.png';
import pressureImage from './assets/pressure.png';

const type1 = 'humidity';
const type2 = 'wind';
const type3 = 'pressure';

const capitalizeDesc = (description) => {
  if (!description) {
    return description;
  }

  return description[0].toUpperCase() + description.slice(1);
};

const convertData = (state, type) => {
  switch (type) {
    case 'humidity':
      return `${state.info.humidity}%`;
    case 'pressure':
      return `${state.info.pressure} mb`;
    case 'wind':
      return `${Math.round(state.info.wind)} km/h`;
    default:
      return 'error';
  }
};

const createDetail = (state, type, way) => {
  const col = document.createElement('div');
  col.classList.add('col');

  const image = document.createElement('img');
  image.setAttribute('src', `${way}`);
  image.setAttribute('alt', `${type} icon`);
  col.prepend(image);

  const div = document.createElement('div');
  div.classList.add('card-details');
  col.append(div);

  const p1 = document.createElement('p');
  p1.classList.add(`${type}`);
  p1.textContent = `${convertData(state, type)}`;
  div.prepend(p1);

  const p2 = document.createElement('p');
  div.append(p2);

  return { col, p2 };
};

const renderLoadingData = (value, elements, i18nextInstance) => {
  const { status, error } = value;
  const { form, input, button, errorText } = elements;

  errorText.textContent = '';

  if (status === 'loading') {
    input.setAttribute('readonly', 'readonly');
    button.setAttribute('disabled', 'disabled');
  }

  if (status === 'success') {
    input.removeAttribute('readonly');
    button.removeAttribute('disabled');
    form.reset();
    input.focus();
  }

  if (status === 'failed') {
    input.removeAttribute('readonly');
    button.removeAttribute('disabled');
    const p = document.createElement('p');
    p.textContent = i18nextInstance.t(`errors.${error}`);
    errorText.prepend(p);
    input.focus();
  }
};

const renderWeather = (state, elements) => {
  const { image, location, temperature, details, description } = elements;
  image.textContent = '';
  temperature.textContent = '';
  location.textContent = '';
  details.textContent = '';
  description.textContent = '';

  const weatherImage = document.createElement('img');
  weatherImage.setAttribute('src', `${state.iconUrl}`);
  weatherImage.setAttribute('alt', 'weather icon');
  weatherImage.classList.add('weather-icon');
  image.prepend(weatherImage);

  const div = document.createElement('div');
  div.setAttribute('id', 'celcius');
  div.textContent = `${Math.round(state.info.temperature)}°C`;
  temperature.prepend(div);

  location.textContent = state.location;

  const { col: humidity, p2: parHumidity } = createDetail(state, type1, humidityImage);
  parHumidity.textContent = 'Humidity';
  details.prepend(humidity);

  const { col: wind, p2: parWind } = createDetail(state, type2, windImage);
  parWind.textContent = 'Wind';
  details.append(wind);

  const { col: pressure, p2: parPressure } = createDetail(state, type3, pressureImage);
  parPressure.textContent = 'Air pressure';
  details.append(pressure);

  const textFeelsLike = `Feels like ${Math.round(state.info.feelsLike)}°C. `;
  description.textContent = textFeelsLike + capitalizeDesc(state.info.description);
};

const watcher = (state, elements, i18nextInstance) => onChange(state, (path, value) => {
  switch (path) {
    case 'loadingData':
      renderLoadingData(value, elements, i18nextInstance);
      break;
    case 'location':
    case 'iconUrl':
    case 'info':
      renderWeather(state, elements);
      break;
    default:
      break;
  }

  return state;
});

export default watcher;
