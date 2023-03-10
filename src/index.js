
import {checkWeather, checkLocationBy} from './apiQueries.js';
import {forecastDecoder, colorsByWeatherCode} from './weatherDataHandling.js';



/* HTML elements */
const queryMode_in = document.querySelector('#query-mode');
const querySwitch_in = queryMode_in.querySelector('#query-switch');
const queryModeLabels = document.querySelectorAll('.query-mode-label');
const controls = document.querySelector('#controls');
const submitButton = document.querySelector('#submit-button');
const city_out = document.querySelector('#city');
const cityInfo_out = document.querySelector('#city-info');
const temperature_out = document.querySelector('#temperature');
const forecast_out = document.querySelector('#forecast');


/* Global */
let queryModeIsCity = true;
let cityName = '', coordinates = ['', ''];


/* Function defining */

// Updates everything related to the query mode switch
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

// Toggles between the query modes
function toggleQueryMode () {
  queryModeIsCity = !queryModeIsCity;
  updateQueryMode();
}

// Checks, arranges and displays location data
async function updateLocationData () {
  let locationData;
  if (queryModeIsCity) {
    locationData = await checkLocationBy('cityName', cityName);
    locationData = locationData[0];
  } else {
    locationData = await checkLocationBy('coordinates', coordinates);
  }
  coordinates[0] = locationData.lat;
  coordinates[1] = locationData.lon;

  let cityInfo = locationData.display_name.split(', ') ;
  let city = cityInfo.shift();
  cityInfo = cityInfo.join('\n');

  if (city == undefined) {
    city_out.innerText = 'Unknown';
    cityInfo_out.innerText =  'Unknown';
  } else {
    city_out.innerText = city;
    cityInfo_out.innerText = cityInfo;
  }
}

// Checks and displays weather data
async function updateWeatherData () {
  const currentWeather = await checkWeather(coordinates);

  temperature_out.innerText = `${currentWeather.temperature}ºC`;
  forecast_out.innerText = `${forecastDecoder(currentWeather.weathercode)}`;
  const weatherColors = colorsByWeatherCode(currentWeather.weathercode);
  document.querySelector('body').style.background = `linear-gradient(to bottom, ${weatherColors[0]}, ${weatherColors[1]})`;
}

// Evaluates the query parameters, queries the API, and displays the information in a single function
async function updateData () {
  await updateLocationData();
  await updateWeatherData();
}

// Updates input data and starts query process
async function submitQuery () {
  if (queryModeIsCity) {
    cityName = document.querySelector('#city-directive').value;
  } else {
    const coordinates_in = document.querySelectorAll('.coordinate-directive');
    coordinates[0] = coordinates_in[0].value;
    coordinates[1] = coordinates_in[1].value;
  }
  updateData();
}


/* onClick Event Listeners */
querySwitch_in.addEventListener('click', toggleQueryMode);
submitButton.addEventListener('click', submitQuery);


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
  await updateData();
});
