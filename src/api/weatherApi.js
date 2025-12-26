const apiKey = 'db1d0fea490bdb2fd095dcd7e3098257';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&lang=en';

const fetchWeather = async (location) => {
    const response = await fetch(`${apiUrl}&q=${location}&appid=${apiKey}`);

    if (!response.ok) {
        const error = new Error('Network response was not ok');
        error.name = 'ResponseError';
        throw error;
    }

    return response.json();
};

export default fetchWeather;