
// Checking for location with coordinates gotten by geolocation API
// (Nominatim Geocoding API)
export async function checkLocation (latitude, longitude) {
  try {
    let locationData = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`);
    locationData = await locationData.json();

    if (locationData.display_name == undefined) {
      return [undefined, undefined];
    }

    let city;
    let cityInfo = [];

    locationData.display_name.split(', ').forEach( (elem, i) => {
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

// Checks weather with weather API
// (Open-Meteo Weather API)
export async function checkWeather (latitude, longitude) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
  let weatherData = await fetch(url);
  weatherData = await weatherData.json();
  if (weatherData.current_weather == undefined) {
    console.error('Wasn\'t possible to retrieve the weather data!');
    return { temperature: '?' };
  }
  return weatherData.current_weather;
}
