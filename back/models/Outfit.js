// models/Outfit.js
// 코디 모델 정의
class Outfit {
  constructor({ id, topColor, style, imageUrl, weatherTemp, weatherCondition, userAge, uploadedAt }) {
    this.id = id;
    this.topColor = topColor;
    this.style = style;
    this.imageUrl = imageUrl;
    this.weatherTemp = weatherTemp;
    this.weatherCondition = weatherCondition;
    this.userAge = userAge;
    this.uploadedAt = new Date(uploadedAt);
  }

  // 코디 요약 정보 반환
  getSummary() {
    return {
      id: this.id,
      topColor: this.topColor,
      style: this.style,
      imageUrl: this.imageUrl,
      weatherTemp: this.weatherTemp,
      weatherCondition: this.weatherCondition,
      age: this.userAge,
      date: this.uploadedAt.toISOString()
    };
  }
}

module.exports = Outfit; 