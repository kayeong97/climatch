const express = require('express');
const router = express.Router();
const outfitController = require('../controllers/outfitController');
const authMiddleware = require('../middlewares/auth');

// 인증이 필요한 모든 라우트에 미들웨어 적용
router.use(authMiddleware);

// 새로운 의상 등록
router.post('/', outfitController.createOutfit);

// 사용자의 모든 의상 조회
router.get('/', outfitController.getUserOutfits);

// 특정 의상 조회
router.get('/:id', outfitController.getOutfit);

// 의상 업데이트
router.put('/:id', outfitController.updateOutfit);

// 의상 삭제
router.delete('/:id', outfitController.deleteOutfit);

// 날씨 기반 의상 추천
router.get('/recommend/weather', outfitController.recommendOutfitByWeather);

module.exports = router; 