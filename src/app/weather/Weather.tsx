import axios from 'axios'
import { LatLng, Point } from 'types/geo';

// Fetch Weather infomration of location, given as param, from OpenWeatherMap API
export const fetchWeatherAPI = async (location: LatLng) => {
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${location.lat}&lon=${location.lng}&appid=${process.env.REACT_APP_OPEN_WEATHER_API_KEY}`;
    return (await axios.get(url)).data;
};


// Format weather information as PointInfo (info: any -> are provided by the OpenWeatherAPI)
export const formatWeatherInfo = (location: LatLng, info: any, hrs_offset: number): Point => {
    const date = new Date()
    date.setHours(date.getHours() + hrs_offset);

    if (hrs_offset < 0)
        hrs_offset = 0
    else if (hrs_offset >= info.hourly.length)
        hrs_offset = info.hourly.length - 1
    const temp = (Math.round((info.hourly[hrs_offset].temp - 273.15) * 10) / 10).toString();
    const weather = info.hourly[hrs_offset].weather[0]
    const imgUrl = `https://openweathermap.org/img/wn/${weather.icon}.png`
    const imgTag = weather.main;

    return {
        lat: location.lat,
        lng: location.lng, // + .05
        key: (Math.floor(Math.random() * 10000)) + "",
        time: date.toLocaleString(navigator.language, {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: info.timezone
        }),
        temp,
        imgUrl,
        imgTag
    }
}