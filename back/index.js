// index.js
// Express 서버 진입점
require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

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

// 기본 라우트
app.get('/', (req, res) => {
  res.send('Climatch API Server');
});

// API 라우트
// 날씨 기반 의류 추천 API
app.get('/api/recommendation', async (req, res) => {
  try {
    const { location, userId } = req.query;
    
    if (!location || !userId) {
      return res.status(400).json({ error: '위치와 사용자 ID가 필요합니다.' });
    }
    
    // 위치 기반 날씨 조회
    const weatherData = await weatherService.fetchWeatherByLocation(location);
    
    // 사용자 객체 생성 (실제로는 DB에서 조회해야 함)
    const user = { id: userId };
    
    // 추천 받기
    const recommendation = await recommendationEngine.recommendByWeather(weatherData, user);
    
    res.json({
      weather: weatherData,
      recommendation: recommendation
    });
  } catch (error) {
    console.error('추천 API 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
}); 