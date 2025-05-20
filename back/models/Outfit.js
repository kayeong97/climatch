// models/Outfit.js
// 코디 모델 정의
class Outfit {
  constructor({ id, topColor, style, imageUrl, uploadDate, weatherData, userAge }) {
    this.id = id;
    this.topColor = topColor;
    this.style = style;
    this.imageUrl = imageUrl;
    this.uploadDate = new Date(uploadDate);
    this.weatherData = weatherData;
    this.userAge = userAge;
  }

  // 코디 요약 정보 반환
  getSummary() {
    return {
      id: this.id,
      topColor: this.topColor,
      style: this.style,
      imageUrl: this.imageUrl,
      date: this.uploadDate.toISOString(),
      weather: this.weatherData,
      age: this.userAge,
    };
  }
}

module.exports = Outfit; 