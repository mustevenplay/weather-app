
// HTML elements
const [latitude_in, longitude_in] = document.querySelectorAll('.coordinate-directive');
const location_out = document.querySelector('#location');
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

// Checking for location with coordinates gotten by weather API
// (Nominatim Geocoding API)
async function checkLocation (latitude, longitude) {
  try {
    const locationData = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`);
    const locationDataObj = await locationData.json();
    console.log(locationDataObj);
    return locationDataObj.display_name != undefined ? locationDataObj.display_name : 'Unknown';
  } catch (e) {
    console.error(e);
    return 'Unknown';
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
      location_out.innerText = await checkLocation(latitude, longitude);
      temperature_out.innerText = `${current_weather.temperature}ºC`;
      forecast_out.innerText = `${forecastDecoder(current_weather.weathercode)}`;
      console.log(obj);
    })
    .catch(console.error);

}

// Submiting weather parameters
document.querySelector('#coordinate-submit').addEventListener('click', updateWeatherData);

updateWeatherData();
