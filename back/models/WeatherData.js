// models/WeatherData.js
// 날씨 데이터 모델 정의

class WeatherData {
  constructor({ temperature, condition, location }) {
    this.temperature = temperature;
    this.condition = condition;
    this.location = location;
  }
  
  // 간단한 날씨 요약 반환
  getSummary() {
    return {
      temperature: this.temperature,
      condition: this.condition,
      location: this.location
    };
  }
}

module.exports = WeatherData; 