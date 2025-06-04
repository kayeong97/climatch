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

module.exports = router; 