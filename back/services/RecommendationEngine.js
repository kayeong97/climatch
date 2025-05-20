// services/RecommendationEngine.js
// 룰 기반 및 유사 사용자 기반 코디 추천
const OutfitModel = require('../models/Outfit');

class RecommendationEngine {
  constructor(outfitService) {
    this.outfitService = outfitService;
  }

  // 날씨 기반 간단 룰 추천
  async recommendByWeather(weather, age) {
    const desc = weather.description.toLowerCase();
    let suggestion;
    if (desc.includes('rain')) suggestion = 'waterproof/jacket style';
    else if (weather.temperature > 25) suggestion = 'light & breathable outfit';
    else suggestion = 'layered look';
    return { suggestion, reason: `Based on weather: ${weather.description}` };
  }

  // 다른 사용자 코디 추천
  async recommendFromOthers(weather, age) {
    const minAge = age - 3;
    const maxAge = age + 3;
    const tempRange = { min: weather.temperature - 2, max: weather.temperature + 2 };
    const others = await this.outfitService.outfitRepository.findByAgeAndTempRange(minAge, maxAge, tempRange);
    return others.map(o => new OutfitModel(o).getSummary());
  }
}

module.exports = RecommendationEngine; 