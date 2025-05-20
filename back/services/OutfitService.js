// services/OutfitService.js
// 코디 업로드 및 조회 처리
const OutfitModel = require('../models/Outfit');

class OutfitService {
  constructor(outfitRepository) {
    this.outfitRepository = outfitRepository; // DB 접근 객체
  }

  // 새로운 코디 저장
  async uploadOutfit(userId, outfitData) {
    const payload = { userId, ...outfitData };
    const record = await this.outfitRepository.create(payload);
    return new OutfitModel(record);
  }

  // 특정 사용자 코디 전체 조회
  async getOutfitsByUser(userId) {
    const records = await this.outfitRepository.findByUserId(userId);
    return records.map(r => new OutfitModel(r));
  }

  // 특정 날짜의 코디 조회
  async getOutfitsByDate(userId, date) {
    const start = new Date(date);
    start.setHours(0,0,0,0);
    const end = new Date(date);
    end.setHours(23,59,59,999);
    const records = await this.outfitRepository.findByUserIdAndDate(userId, start, end);
    return records.map(r => new OutfitModel(r));
  }
}

module.exports = OutfitService; 