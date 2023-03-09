
import {checkWeather, checkLocationBy} from './apiQueries.js';
import {forecastDecoder, colorsByWeatherCode} from './weatherDataHandling.js';


// HTML elements
const queryMode_in = document.querySelector('#query-mode');
const querySwitch_in = queryMode_in.querySelector('#query-switch');
const queryModeLabels = document.querySelectorAll('.query-mode-label');
const controls = document.querySelector('#controls');
const city_out = document.querySelector('#city');
const cityInfo_out = document.querySelector('#city-info');
const temperature_out = document.querySelector('#temperature');
const forecast_out = document.querySelector('#forecast');


// Global
let queryModeIsCity = true;
let cityName = '', coordinates = ['', ''];

function updateQueryMode () {
  if (queryModeIsCity) {
    querySwitch_in.style.justifyContent = 'left';
    queryModeLabels[0].style.color = '#999';
    queryModeLabels[1].style.color = 'revert';
    controls.innerHTML = `
      <label>City:
        <input type="text" id="city-directive" value="${cityName}">
      </label>
    `;
  } else {
    querySwitch_in.style.justifyContent = 'right';
    queryModeLabels[0].style.color = 'revert';
    queryModeLabels[1].style.color = '#999';
    controls.innerHTML = `
      <label>Latitude:
        <input type="text" name="latitude" class="coordinate-directive" value="${coordinates[0]}">
      </label>
      <label>Longitude:
        <input type="text" name="longitude" class="coordinate-directive" value="${coordinates[1]}">
      </label>
    `;
  }
}

// Toggle query mode
function toggleQueryMode () {
  queryModeIsCity = !queryModeIsCity;
  updateQueryMode();
}

async function submitQuery () {
  if (queryModeIsCity) {
    cityName = document.querySelector('#city-directive').value;
  } else {
    const coordinates_in = document.querySelectorAll('.coordinate-directive');
    coordinates[0] = coordinates_in[0].value;
    coordinates[1] = coordinates_in[1].value;
  }
  await updateWeatherData();
}

async function updateWeatherData () {

  let locationData;

  if (queryModeIsCity) {
    locationData = await checkLocationBy('cityName', cityName);
    locationData = locationData[0];
  } else {
    locationData = await checkLocationBy('cityName', coordinates);
  }

  coordinates[0] = locationData.lat;
  coordinates[1] = locationData.lon;

  let city;
  let cityInfo = [];

  locationData.display_name.split(', ').forEach( (elem, i) => {
    if (i === 0) {
      city = elem
    } else {
      cityInfo.push(elem);
    }
  });
  cityInfo = cityInfo.join('\n');

  if (city == undefined) {
    city_out.innerText = 'Unknown';
    cityInfo_out.innerText =  'Unknown';
  } else {
    city_out.innerText = city;
    cityInfo_out.innerText = cityInfo;
  }

  const currentWeather = await checkWeather(coordinates);

  // Setting the data into the DOM
  temperature_out.innerText = `${currentWeather.temperature}ºC`;
  forecast_out.innerText = `${forecastDecoder(currentWeather.weathercode)}`;
  const weatherColors = colorsByWeatherCode(currentWeather.weathercode);
  document.querySelector('body').style.background = `linear-gradient(to bottom, ${weatherColors[0]}, ${weatherColors[1]})`;
}


querySwitch_in.addEventListener('click', toggleQueryMode);

// Submiting weather parameters
document.querySelector('#coordinate-submit').addEventListener('click', submitQuery);


/* Initial protocol */

updateQueryMode();

// Ask for location permission
navigator.geolocation.getCurrentPosition( async function (pos) {
  const coords = pos.coords;
  coordinates[0] = coords.latitude;
  coordinates[1] = coords.longitude;
  let cityData = await checkLocationBy('coordinates', coordinates);
  cityName = cityData.display_name.split(', ')[0];

  updateQueryMode();
  updateWeatherData();
});
