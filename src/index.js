
// HTML elements
const [latitude_in, longitude_in] = document.querySelectorAll('.coordinate-directive');
const city_out = document.querySelector('#city');
const cityInfo_out = document.querySelector('#city-info');
const temperature_out = document.querySelector('#temperature');
const forecast_out = document.querySelector('#forecast');

// API returns a weather code, and here we decode it
function forecastDecoder (code) {
  switch (code) {
    case 0: return 'Clear sky';
    case 1: return 'Mainly clear';
    case 2: return 'Partly cloudy';
    case 3: return 'Overcast';
    case 45: return 'Fog';
    case 48: return 'Depositing rime fog';
    case 51: return 'Light drizzle';
    case 53: return 'Moderate drizzle';
    case 55: return 'Dense intensity drizzle';
    case 56: return 'Light freezing drizzle';
    case 57: return 'Dense intensity freezing drizzle';
    case 61: return 'Slight rain';
    case 63: return 'Moderate rain';
    case 65: return 'Heavy intensity rain';
    case 66: return 'Light freezing rain';
    case 67: return 'Heavy intensity freezing rain';
    case 71: return 'Slight snow fall';
    case 73: return 'Moderate snow fall';
    case 75: return 'Heavy intensity snow fall';
    case 77: return 'Snow grains';
    case 80: return 'Slight rain showers';
    case 81: return 'Moderate rain showers';
    case 82: return 'Violent rain showers';
    case 85: return 'Slight snow showers';
    case 86: return 'Heavy snow showers';
    case 95: return 'Slight or Moderate thunderstorm';
    case 96: return 'Thunderstorm with slight hail';
    case 99: return 'Thunderstorm with heavy hail';
    default: return 'Unknown weather code';
  }
}

// Getting colors by weather code for body's background
function colorsByWeatherCode (code) {
  if (code === 0) {
    return ['gold', 'lightcyan'];
  } else if (code >= 1 && code <= 3) {
    return ['khaki', 'lightcyan'];
  } else if (code == 45 || code == 48) {
    return ['lightgray', 'lightblue'];
  } else if (code == 51 || code == 53 || code >= 55 && code <= 57
             || code == 61 || code == 63 || code >= 65 && code <= 67
             || code == 71 || code == 73 || code >= 75 && code <= 77
             || code == 85 || code == 86) {
    return ['lightgray', 'snow'];
  } else if (code == 95 || code == 96 || code == 99) {
    return ['gray', 'lightgray'];
  }
}

// Checking for location with coordinates gotten by geolocation API
// (Nominatim Geocoding API)
async function checkLocation (latitude, longitude) {
  try {
    const locationData = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`);
    const locationDataObj = await locationData.json();

    if (locationDataObj.display_name == undefined) {
      return [undefined, undefined];
    }

    let city;
    let cityInfo = [];

    locationDataObj.display_name.split(', ').forEach( (elem, i) => {
      if (i === 0) {
        city = elem
      } else {
        cityInfo.push(elem);
      }
    });

    return [city, cityInfo.join('\n')];

  } catch (e) {
    console.error(e);
    return [undefined, undefined];
  }
}

// Updates and displays all weather data
// (Open-Meteo Weather API)
function updateWeatherData () {
  const latitude = latitude_in.value;
  const longitude = longitude_in.value;

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

  fetch(url)
    .then( (response) => response.json())
    .then( async (obj) => {
      const current_weather = obj.current_weather;
      const [city, cityInfo] = await checkLocation(latitude, longitude);

      // Setting the data into the DOM
      if (city == undefined) {
        city_out.innerText = 'Unknown';
        cityInfo_out.innerText =  'Unknown';
      } else {
        city_out.innerText = city;
        cityInfo_out.innerText = cityInfo;
      }
      temperature_out.innerText = `${current_weather.temperature}ºC`;
      forecast_out.innerText = `${forecastDecoder(current_weather.weathercode)}`;
      const weatherColors = colorsByWeatherCode(current_weather.weathercode);
      document.querySelector('body').style.background = `linear-gradient(to bottom, ${weatherColors[0]}, ${weatherColors[1]})`;
    })
    .catch(console.error);

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
