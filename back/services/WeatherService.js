// services/WeatherService.js
// 외부 날씨 API 연동 및 데이터 파싱
const axios = require('axios');

class WeatherService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
  }

  // 위치 기반 실시간 날씨 조회
  async fetchWeatherByLocation(location) {
    const resp = await axios.get(this.baseUrl, {
      params: { q: location, appid: this.apiKey, units: 'metric' }
    });
    return this.parseWeatherData(resp.data);
  }

  // API 응답 파싱
  parseWeatherData(apiResp) {
    return {
      temperature: apiResp.main.temp,
      humidity: apiResp.main.humidity,
      description: apiResp.weather[0].description,
      windSpeed: apiResp.wind.speed,
      timestamp: new Date(apiResp.dt * 1000),
    };
  }
}

module.exports = WeatherService; 