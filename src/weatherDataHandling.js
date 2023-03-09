
// API returns a weather code, and here we decode it
export function forecastDecoder (code) {
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
export function colorsByWeatherCode (code) {
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
