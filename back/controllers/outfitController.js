const outfitModel = require('../models/outfitModel');
const weatherHistoryModel = require('../models/weatherHistoryModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads');
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
}).single('image');

// 새로운 의상 등록
const createOutfit = async (req, res) => {
  try {
    // JWT 미들웨어를 통해 전달된 사용자 ID
    const userId = req.user.userId;
    const { top_color, style, image_url, weather_temp, weather_condition, user_age } = req.body;

    // 필수 필드 확인
    if (!image_url) {
      return res.status(400).json({ error: '이미지 URL은 필수입니다.' });
    }

    // 의상 생성
    const newOutfit = await outfitModel.createOutfit({
      user_id: userId,
      top_color,
      style,
      image_url,
      weather_temp,
      weather_condition,
      user_age,
      is_recommended: false 
    });

    res.status(201).json({
      message: '의상이 등록되었습니다.',
      outfit: newOutfit
    });
  } catch (error) {
    console.error('의상 등록 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};

// 사용자의 모든 의상 조회
const getUserOutfits = async (req, res) => {
  try {
    // JWT 미들웨어를 통해 전달된 사용자 ID
    const userId = req.user.userId;

    const outfits = await outfitModel.getOutfitsByUserId(userId);

    res.status(200).json({ outfits });
  } catch (error) {
    console.error('의상 목록 조회 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};

// 특정 의상 조회
const getOutfit = async (req, res) => {
  try {
    const { id } = req.params;
    // JWT 미들웨어를 통해 전달된 사용자 ID
    const userId = req.user.userId;

    const outfit = await outfitModel.getOutfitById(id);

    // 의상이 존재하는지 확인
    if (!outfit) {
      return res.status(404).json({ error: '의상을 찾을 수 없습니다.' });
    }

    // 의상 소유자 확인
    if (outfit.user_id !== userId) {
      return res.status(403).json({ error: '이 의상에 대한 접근 권한이 없습니다.' });
    }

    res.status(200).json({ outfit });
  } catch (error) {
    console.error('의상 조회 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};

// 의상 업데이트
const updateOutfit = async (req, res) => {
  try {
    const { id } = req.params;
    // JWT 미들웨어를 통해 전달된 사용자 ID
    const userId = req.user.userId;
    const { top_color, style, image_url, weather_temp, weather_condition, user_age } = req.body;

    // 의상 존재 확인
    const outfit = await outfitModel.getOutfitById(id);
    if (!outfit) {
      return res.status(404).json({ error: '의상을 찾을 수 없습니다.' });
    }

    // 의상 소유자 확인
    if (outfit.user_id !== userId) {
      return res.status(403).json({ error: '이 의상에 대한 접근 권한이 없습니다.' });
    }

    // 의상 업데이트
    const updatedOutfit = await outfitModel.updateOutfit(id, {
      top_color: top_color || outfit.top_color,
      style: style || outfit.style,
      image_url: image_url || outfit.image_url,
      weather_temp: weather_temp || outfit.weather_temp,
      weather_condition: weather_condition || outfit.weather_condition,
      user_age: user_age || outfit.user_age
    });

    res.status(200).json({
      message: '의상이 업데이트되었습니다.',
      outfit: updatedOutfit
    });
  } catch (error) {
    console.error('의상 업데이트 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};

// 의상 삭제
const deleteOutfit = async (req, res) => {
  try {
    const { id } = req.params;
    // JWT 미들웨어를 통해 전달된 사용자 ID
    const userId = req.user.userId;

    // 의상 존재 확인
    const outfit = await outfitModel.getOutfitById(id);
    if (!outfit) {
      return res.status(404).json({ error: '의상을 찾을 수 없습니다.' });
    }

    // 의상 소유자 확인
    if (outfit.user_id !== userId) {
      return res.status(403).json({ error: '이 의상에 대한 접근 권한이 없습니다.' });
    }

    // 의상 삭제
    await outfitModel.deleteOutfit(id);

    res.status(200).json({ message: '의상이 삭제되었습니다.' });
  } catch (error) {
    console.error('의상 삭제 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};

// 날씨 기반 의상 추천
const recommendOutfitByWeather = async (req, res) => {
  try {
    const { location } = req.query;

    if (!location) {
      return res.status(400).json({ error: '위치 정보가 필요합니다.' });
    }

    // 해당 위치의 최신 날씨 정보 조회
    const latestWeather = await weatherHistoryModel.getLatestWeatherByLocation(location);

    if (!latestWeather) {
      return res.status(404).json({ error: '해당 위치의 날씨 정보를 찾을 수 없습니다.' });
    }

    // 날씨 기반 의상 추천
    const recommendedOutfits = await outfitModel.getOutfitsByWeather(
      latestWeather.weather_temp,
      latestWeather.weather_condition
    );

    res.status(200).json({
      current_weather: latestWeather,
      recommended_outfits: recommendedOutfits
    });
  } catch (error) {
    console.error('의상 추천 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};

module.exports = {
  createOutfit,
  getUserOutfits,
  getOutfit,
  updateOutfit,
  deleteOutfit,
  recommendOutfitByWeather
}; 