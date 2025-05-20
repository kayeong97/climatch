// repositories/OutfitRepository.js
// 코디 데이터 접근 계층 (임시 in-memory 구현)
class OutfitRepository {
  constructor() {
    this.outfits = []; // 임시 저장용 (실제 구현은 DB 사용)
    this.nextId = 1;
  }

  async create(outfitData) {
    const id = this.nextId++;
    const newOutfit = { ...outfitData, id };
    this.outfits.push(newOutfit);
    return newOutfit;
  }

  async findByUserId(userId) {
    return this.outfits.filter(outfit => outfit.userId === userId);
  }

  async findByUserIdAndDate(userId, startDate, endDate) {
    return this.outfits.filter(outfit => {
      const uploadDate = new Date(outfit.uploadDate);
      return outfit.userId === userId && 
             uploadDate >= startDate && 
             uploadDate <= endDate;
    });
  }

  async findByAgeAndTempRange(minAge, maxAge, tempRange) {
    return this.outfits.filter(outfit => {
      const userAge = outfit.userAge;
      const temp = outfit.weatherData?.temperature;
      
      return userAge >= minAge && 
             userAge <= maxAge && 
             temp >= tempRange.min && 
             temp <= tempRange.max;
    });
  }
}

module.exports = OutfitRepository; 