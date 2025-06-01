// index.js
// Express 서버 진입점
require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// 데이터베이스 연결 가져오기
const { testConnection } = require('./utils/database');

// 서비스 및 레포지토리 초기화
const WeatherService = require('./services/WeatherService');
const RecommendationEngine = require('./services/RecommendationEngine');
const OutfitService = require('./services/OutfitService');
const OutfitRepository = require('./repositories/OutfitRepository');

// 인스턴스 생성
const weatherService = new WeatherService(process.env.WEATHER_API_KEY);
const outfitRepository = new OutfitRepository();
const outfitService = new OutfitService(outfitRepository);
const recommendationEngine = new RecommendationEngine(outfitService);

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// CORS 설정
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    return res.status(200).json({});
  }
  next();
});

// 기본 라우트
app.get('/', (req, res) => {
  res.send('Climatch API Server');
});

// 한국 도시 목록 API
app.get('/api/locations/cities', (req, res) => {
  try {
    const cities = weatherService.getKoreanCities();
    res.json({ cities });
  } catch (error) {
    console.error('도시 목록 조회 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 특정 도시의 구/군 목록 API
app.get('/api/locations/districts/:cityCode', (req, res) => {
  try {
    const { cityCode } = req.params;
    const districts = weatherService.getDistrictsByCity(cityCode);
    res.json({ districts });
  } catch (error) {
    console.error('구/군 목록 조회 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 현재 날씨 API
app.get('/api/weather/current', async (req, res) => {
  try {
    const { city, district } = req.query;
    
    if (!city) {
      return res.status(400).json({ error: '도시 정보가 필요합니다.' });
    }
    
    // 위치 문자열 생성 (구/군이 있는 경우 추가)
    const location = district ? `${district},${city}` : city;
    
    // 날씨 데이터 조회
    const weatherData = await weatherService.fetchWeatherByLocation(location);
    
    // 의류 추천 정보 추가
    const clothingInfo = weatherService.getWeatherBasedClothingInfo(weatherData);
    
    res.json({
      weather: weatherData,
      clothingInfo
    });
  } catch (error) {
    console.error('날씨 API 오류:', error);
    res.status(500).json({ error: '날씨 정보를 가져오는데 실패했습니다.' });
  }
});

// 날씨 예보 API
app.get('/api/weather/forecast', async (req, res) => {
  try {
    const { city, district } = req.query;
    
    if (!city) {
      return res.status(400).json({ error: '도시 정보가 필요합니다.' });
    }
    
    // 위치 문자열 생성 (구/군이 있는 경우 추가)
    const location = district ? `${district},${city}` : city;
    
    // 예보 데이터 조회
    const forecastData = await weatherService.fetchForecastByLocation(location);
    
    res.json({ forecast: forecastData });
  } catch (error) {
    console.error('예보 API 오류:', error);
    res.status(500).json({ error: '날씨 예보를 가져오는데 실패했습니다.' });
  }
});

// 날씨 기반 의류 추천 API
app.get('/api/recommendation', async (req, res) => {
  try {
    const { city, district, userId } = req.query;
    
    if (!city || !userId) {
      return res.status(400).json({ error: '도시 정보와 사용자 ID가 필요합니다.' });
    }
    
    // 위치 문자열 생성 (구/군이 있는 경우 추가)
    const location = district ? `${district},${city}` : city;
    
    // 위치 기반 날씨 조회
    const weatherData = await weatherService.fetchWeatherByLocation(location);
    
    // 사용자 객체 생성 (실제로는 DB에서 조회해야 함)
    const user = { id: userId };
    
    // 추천 받기
    const recommendation = await recommendationEngine.recommendByWeather(weatherData, user);
    
    // 의류 추천 정보 추가
    const clothingInfo = weatherService.getWeatherBasedClothingInfo(weatherData);
    
    res.json({
      weather: weatherData,
      clothingInfo,
      recommendation
    });
  } catch (error) {
    console.error('추천 API 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 서버 시작
app.listen(PORT, async () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
  
  // 데이터베이스 연결 테스트
  await testConnection();
}); 