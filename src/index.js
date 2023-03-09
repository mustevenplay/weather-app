
import {checkWeather, checkLocation} from './apiQueries.js';
import {forecastDecoder, colorsByWeatherCode} from './weatherDataHandling.js';


// HTML elements
const [latitude_in, longitude_in] = document.querySelectorAll('.coordinate-directive');
const city_out = document.querySelector('#city');
const cityInfo_out = document.querySelector('#city-info');
const temperature_out = document.querySelector('#temperature');
const forecast_out = document.querySelector('#forecast');


function getCoordinates () {
  return [latitude_in.value, longitude_in.value];
}

async function updateWeatherData () {

    // IF CITY THING, IF COORDS ANOTHER THING
    // 
    //
    //
  const [latitude, longitude] = getCoordinates();
  const [city, cityInfo] = await checkLocation(latitude, longitude);

  const currentWeather = await checkWeather(latitude, longitude);
  console.log(currentWeather);
  // Setting the data into the DOM
  if (city == undefined) {
    city_out.innerText = 'Unknown';
    cityInfo_out.innerText =  'Unknown';
  } else {
    city_out.innerText = city;
    cityInfo_out.innerText = cityInfo;
  }
  temperature_out.innerText = `${currentWeather.temperature}ºC`;
  forecast_out.innerText = `${forecastDecoder(currentWeather.weathercode)}`;
  const weatherColors = colorsByWeatherCode(currentWeather.weathercode);
  document.querySelector('body').style.background = `linear-gradient(to bottom, ${weatherColors[0]}, ${weatherColors[1]})`;
}

// Submiting weather parameters
document.querySelector('#coordinate-submit').addEventListener('click', updateWeatherData);

// Ask for location permission
navigator.geolocation.getCurrentPosition( function (pos) {
  const coordinates = pos.coords;
  latitude_in.value = coordinates.latitude;
  longitude_in.value = coordinates.longitude;
  updateWeatherData();
});

updateWeatherData();
