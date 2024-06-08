import onChange from 'on-change';

const humidityImgWay = '';
const pressureImgWay = '';

const detailType1 = 'humidity';
const detailType2 = 'pressure';

const createDetail = (state, detail, way) => {
  const col = document.createElement('div');
  col.classList.add('col');

  const image = document.createElement('img');
  image.setAttribute('src', `${way}`);
  image.setAttribute('alt', `${detail} icon`);
  col.prepend(image);

  const div = document.createElement('div');
  div.classList.add('card-details');
  col.append(div);

  const p1 = document.createElement('p');
  p1.classList.add(`${detail}`);
  p1.textContent = `${detail === 'humidity' ? state.info.humidity : state.info.pressure}%`;
  div.prepend(p1);

  const p2 = document.createElement('p');
  p2.textContent = `${detail === 'humidity' ? 'Humidity' : 'Air pressure'}`;
  div.append(p2);

  return col;
};

const renderForm = (value, elements) => {
  const { error, image, temperature, location, details, description } = elements;
  if (value.isValid === false) {
    image.textContent = '';
    temperature.textContent = '';
    location.textContent = '';
    details.textContent = '';
    description.textContent = '';

    const errorText = document.createElement('p');
    errorText.textContent = 'Invalid city name. Please, check again';
    error.prepend(errorText);
  } else {
    error.textContent = '';
  }
};

const renderLoadingData = (value, elements) => {
  const { form, input, button, error } = elements;

  if (value.status === 'loading') {
    input.setAttribute('readonly', 'readonly');
    button.setAttribute('disabled', 'disabled');
  }

  if (value.status === 'success') {
    input.removeAttribute('readonly');
    button.removeAttribute('disabled');
    form.reset();
    input.focus();
  }

  if (value.status === 'failed') {
    input.removeAttribute('readonly');
    button.removeAttribute('disabled');
    error.textContent = 'Connection error. Please, try again!';
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

  const celciusDiv = document.createElement('div');
  celciusDiv.setAttribute('id', 'celcius');
  celciusDiv.textContent = `${state.info.temperature.toFixed(2)} °C`;
  temperature.prepend(celciusDiv);

  location.textContent = state.location;

  const humidity = createDetail(state, detailType1, humidityImgWay);
  details.prepend(humidity);

  const pressure = createDetail(state, detailType2, pressureImgWay);
  details.append(pressure);

  description.textContent = state.info.description;
};

const watcher = (state, elements) => onChange(state, (path, value) => {
  switch (path) {
    case 'form':
      renderForm(value, elements);
      break;
    case 'loadingData':
      renderLoadingData(value, elements);
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