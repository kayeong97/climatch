const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel'); // DB에서 사용자 정보 조회
const WeatherService = require('../services/WeatherService');
const RecommendationEngine = require('../services/RecommendationEngine');
const OutfitService = require('../services/OutfitService');
const OutfitRepository = require('../repositories/OutfitRepository');
const authMiddleware = require('../middlewares/auth'); // JWT 인증 미들웨어

const weatherService = new WeatherService(process.env.WEATHER_API_KEY);
const outfitRepository = new OutfitRepository();
const outfitService = new OutfitService(outfitRepository);
const recommendationEngine = new RecommendationEngine(outfitService);

// 로그인한 사용자의 정보로 추천
router.get('/recommendation', authMiddleware, async (req, res) => {
  try {
    // JWT 미들웨어에서 userId 추출
    const userId = req.user.userId;
    const user = await userModel.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: '사용자 정보를 찾을 수 없습니다.' });
    }

    // 사용자의 지역 정보로 날씨 조회
    const weatherData = await weatherService.fetchWeatherByLocation(user.location);
    const recommendation = await recommendationEngine.recommendByWeather(weatherData, user);
    // text 필드 추가: detailedRecommendation이 있으면 그걸, 없으면 suggestion을 text로 사용
    const recommendationWithText = {
      ...recommendation,
      text: recommendation.detailedRecommendation || recommendation.suggestion || '오늘은 가벼운 옷차림을 추천합니다!'
    };

    res.json({
      user: { id: user.id, location: user.location, age: user.age },
      weather: weatherData,
      recommendation: recommendationWithText
    });
  } catch (error) {
    console.error('추천 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router; 