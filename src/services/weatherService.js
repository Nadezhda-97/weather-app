const mapWeatherData = (data) => {
    const { humidity, pressure, temp, feels_like: feelsLike } = data.main;
    const { description, icon } = data.weather[0];
    const { speed: wind } = data.wind;

    return {
        location: data.name,
        iconUrl: `http://openweathermap.org/img/wn/${icon}@2x.png`,
        info: {
            temperature: temp,
            feelsLike,
            humidity,
            pressure,
            description,
            wind,
        },
    };
};

export default mapWeatherData;