// services/OutfitService.js
// 코디 업로드 및 조회, 추천 처리
const Outfit = require('../models/Outfit');
const WeatherService = require('./WeatherService');
const RecommendationEngine = require('./RecommendationEngine');
const ImageUploader = require('../utils/ImageUploader');

class OutfitService {
  constructor(outfitRepository) {
    this.outfitRepository = outfitRepository;
    this.weatherService = new WeatherService(process.env.WEATHER_API_KEY);
    this.recommendationEngine = new RecommendationEngine(this);
    this.imageUploader = new ImageUploader('uploads/outfits/');
  }

  // 새로운 코디 업로드
  async uploadOutfit(user, outfit) {
    // 이미지 URL이 없는 경우 기본 이미지 사용
    if (!outfit.imageUrl) {
      outfit.imageUrl = '/images/default-outfit.png';
    }
    
    // 사용자 나이 자동 설정
    outfit.userAge = user.age;
    
    // 현재 시간 설정
    outfit.uploadedAt = new Date();
    
    // 코디 저장
    const result = await this.outfitRepository.create({
      userId: user.id,
      ...outfit
    });
    
    return new Outfit(result);
  }

  // 사용자의 지난 코디 조회
  async viewPastOutfits(user) {
    const outfits = await this.outfitRepository.findByUserId(user.id);
    return outfits.map(outfit => new Outfit(outfit));
  }

  // 오늘 날씨에 맞는 코디 추천
  async getTodayOutfitRecommendation(user) {
    // 사용자 위치 기반 날씨 정보 조회
    const weatherData = await this.weatherService.getCurrentWeather(user.location);
    
    // 날씨 데이터를 기반으로 추천 엔진에 요청
    const recommendation = await this.recommendationEngine.recommendByWeather(weatherData, user);
    
    return recommendation;
  }

  // 비슷한 상황의 다른 사용자 코디 추천
  async getOthersOutfitRecommendation(user) {
    // 사용자 위치 기반 날씨 정보 조회
    const weatherData = await this.weatherService.getCurrentWeather(user.location);
    
    // 유사한 나이대와 날씨 조건의 코디 추천
    const recommendations = await this.recommendationEngine.recommendBySimilarity(user.age, weatherData);
    
    return recommendations;
  }
}

module.exports = OutfitService; 