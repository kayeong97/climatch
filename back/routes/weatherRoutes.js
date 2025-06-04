const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');
const authMiddleware = require('../middlewares/auth');

// 날씨 정보 저장 (관리자만 가능)
router.post('/', authMiddleware, weatherController.saveWeatherData);

// 위치 기반 최신 날씨 정보 조회 (공개)
router.get('/latest', weatherController.getLatestWeather);

// 위치 기반 날씨 기록 조회 (공개)
router.get('/history', weatherController.getWeatherHistory);

// 날짜별 날씨 기록 조회 (공개)
router.get('/date', weatherController.getWeatherByDate);

// 오래된 날씨 기록 정리 (관리자만 가능)
router.delete('/cleanup', authMiddleware, weatherController.cleanupWeatherHistory);

// 현재 날씨 가져오기 API
router.get('/current', async (req, res) => {
  try {
    const { location } = req.query;
    
    // 임시 날씨 데이터
    const weatherData = {
      location: location || '서울',
      temperature: 18,
      feels_like: 16,
      condition: '맑음',
      humidity: 60,
      wind_speed: 3.5,
      precipitation: 0,
      updated_at: new Date().toISOString()
    };
    
    res.json({ success: true, weather: weatherData });
  } catch (error) {
    console.error('날씨 정보 조회 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 주간 날씨 예보 API
router.get('/forecast', async (req, res) => {
  try {
    const { location } = req.query;
    
    // 임시 예보 데이터
    const today = new Date();
    const forecast = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      
      return {
        date: date.toISOString().split('T')[0],
        temperature_min: 15 + Math.floor(Math.random() * 5),
        temperature_max: 20 + Math.floor(Math.random() * 8),
        condition: ['맑음', '구름 조금', '구름 많음', '비'][Math.floor(Math.random() * 4)],
        precipitation_chance: Math.floor(Math.random() * 100),
        humidity: 50 + Math.floor(Math.random() * 30)
      };
    });
    
    res.json({ 
      success: true, 
      location: location || '서울',
      forecast 
    });
  } catch (error) {
    console.error('날씨 예보 조회 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router; 