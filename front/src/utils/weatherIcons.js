// Weather icon mapping
const weatherIcons = {
  clear: '☀️',       // 맑음
  partlyCloudy: '🌤️', // 구름 조금
  cloudy: '☁️',      // 흐림
  rain: '🌧️',        // 비
  sunnyRain: '🌦️',   // 비/갬
  storm: '⛈️',       // 뇌우
  snow: '❄️',        // 눈
  moonClear: '🌙',   // 밤/맑음
  default: '☀️'      // 기본값
};

// Function to get weather icon based on condition
export const getWeatherIcon = (condition) => {
  if (!condition) return weatherIcons.default;
  
  const lowerCondition = condition.toLowerCase();
  
  if (lowerCondition.includes('맑음') || lowerCondition.includes('clear') || lowerCondition.includes('sunny')) {
    return weatherIcons.clear;
  }
  if (lowerCondition.includes('구름') && (lowerCondition.includes('조금') || lowerCondition.includes('partly'))) {
    return weatherIcons.partlyCloudy;
  }
  if (lowerCondition.includes('흐림') || lowerCondition.includes('cloudy') || lowerCondition.includes('overcast')) {
    return weatherIcons.cloudy;
  }
  if (lowerCondition.includes('비') && !lowerCondition.includes('갬')) {
    return weatherIcons.rain;
  }
  if ((lowerCondition.includes('비') && lowerCondition.includes('갬')) || lowerCondition.includes('shower')) {
    return weatherIcons.sunnyRain;
  }
  if (lowerCondition.includes('뇌우') || lowerCondition.includes('thunder') || lowerCondition.includes('storm')) {
    return weatherIcons.storm;
  }
  if (lowerCondition.includes('눈') || lowerCondition.includes('snow')) {
    return weatherIcons.snow;
  }
  
  return weatherIcons.default;
};

export default weatherIcons; 