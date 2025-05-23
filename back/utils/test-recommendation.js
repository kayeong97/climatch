// utils/test-recommendation.js
// 의류 추천 시스템 테스트 스크립트
require('dotenv').config({ path: '../.env' });

const WeatherService = require('../services/WeatherService');
const RecommendationEngine = require('../services/RecommendationEngine');
const OutfitService = require('../services/OutfitService');
const OutfitRepository = require('../repositories/OutfitRepository');

// 인스턴스 생성
const weatherService = new WeatherService(process.env.WEATHER_API_KEY || 'YOUR_API_KEY');
const outfitRepository = new OutfitRepository();
const outfitService = new OutfitService(outfitRepository);
const recommendationEngine = new RecommendationEngine(outfitService);

// 테스트 사용자
const testUser = { id: 'testUser123' };

// 모의 날씨 데이터로 테스트
async function testWithMockWeather() {
  console.log('=== 모의 날씨 데이터로 테스트 ===');
  
  const temperatures = [32, 28, 24, 21, 18, 15, 12, 9, 6, 3, -2];
  
  for (const temp of temperatures) {
    const mockWeather = {
      temperature: temp,
      description: 'clear sky',
      humidity: 70,
      windSpeed: 5,
      timestamp: new Date()
    };
    
    const recommendation = await recommendationEngine.recommendByWeather(mockWeather, testUser);
    console.log(`\n온도: ${temp}°C`);
    console.log(`추천: ${recommendation.suggestion}`);
    console.log(`상세 추천: ${recommendation.detailedRecommendation}`);
    console.log('-'.repeat(80));
  }
}

// 실제 날씨 API 호출로 테스트 (API 키가 있는 경우)
async function testWithRealWeather() {
  if (!process.env.WEATHER_API_KEY) {
    console.log('실제 날씨 API 테스트를 건너뜁니다 (API 키 없음)');
    return;
  }
  
  console.log('\n=== 실제 날씨 API로 테스트 ===');
  const locations = ['Seoul', 'Tokyo', 'New York', 'London', 'Sydney'];
  
  for (const location of locations) {
    try {
      const weatherData = await weatherService.fetchWeatherByLocation(location);
      const recommendation = await recommendationEngine.recommendByWeather(weatherData, testUser);
      
      console.log(`\n지역: ${location}`);
      console.log(`날씨: ${weatherData.temperature}°C, ${weatherData.description}`);
      console.log(`추천: ${recommendation.suggestion}`);
      console.log(`상세 추천: ${recommendation.detailedRecommendation}`);
      console.log('-'.repeat(80));
    } catch (error) {
      console.error(`${location} 날씨 조회 실패:`, error.message);
    }
  }
}

// 테스트 실행
async function runTests() {
  await testWithMockWeather();
  await testWithRealWeather();
}

runTests().catch(console.error); 