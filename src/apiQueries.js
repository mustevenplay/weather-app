
// Checks location with custom query gotten by geolocation API
// (Nominatim Geocoding API)
export async function checkLocationBy (queryType, query) {
  const url = queryType == 'coordinates'
    ? `https://nominatim.openstreetmap.org/reverse?format=json&lat=${query[0]}&lon=${query[1]}&zoom=10`
    : `https://nominatim.openstreetmap.org/search?city=${query}&format=json`;
  try {
    let locationData = await fetch(url);
    return await locationData.json();
  } catch (e) {
    console.error(e);
    return {};
  }
}

// Checks weather with weather API
// (Open-Meteo Weather API)
export async function checkWeather (coordinates) {
  const [latitude, longitude] = coordinates;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
  let weatherData = await fetch(url);
  weatherData = await weatherData.json();
  if (weatherData.current_weather == undefined) {
    console.error('Wasn\'t possible to retrieve the weather data!');
    return { temperature: '?' };
  }
  return weatherData.current_weather;
}
