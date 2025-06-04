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

// 의상 추천 API
router.get('/recommend', async (req, res) => {
  try {
    const { temperature, weather, location } = req.query;
    
    // 임시 추천 데이터
    const recommendations = {
      top: ['가디건', '긴팔 티셔츠', '후드티'],
      bottom: ['청바지', '면바지'],
      outer: temperature < 15 ? ['트렌치코트', '자켓'] : [],
      accessory: weather === 'rain' ? ['우산', '레인부츠'] : ['모자', '선글라스']
    };
    
    res.json({ success: true, recommendations });
  } catch (error) {
    console.error('의상 추천 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 사용자 의상 등록 API (인증 필요)
router.post('/', authMiddleware, async (req, res) => {
  try {
    // 실제 구현에서는 DB에 저장
    res.status(201).json({ 
      success: true, 
      message: '의상이 등록되었습니다.',
      outfit: req.body 
    });
  } catch (error) {
    console.error('의상 등록 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router; 