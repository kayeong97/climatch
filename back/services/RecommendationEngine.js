// services/RecommendationEngine.js
// 룰 기반 및 유사 사용자 기반 코디 추천
const OutfitModel = require('../models/Outfit');

class RecommendationEngine {
  constructor(outfitService) {
    this.outfitService = outfitService;
  }

  // 날씨 기반 간단 룰 추천
  async recommendByWeather(weather, user) {
    const desc = weather.description.toLowerCase();
    let suggestion;
    if (desc.includes('rain')) suggestion = 'waterproof/jacket style';
    else if (weather.temperature > 25) suggestion = 'light & breathable outfit';
    else suggestion = 'layered look';
    
    // 상세 의류 추천 메시지 추가
    const detailedRecommendation = this.getDetailedClothingRecommendation(weather.temperature, user.id, desc);
    
    return { 
      suggestion, 
      reason: `Based on weather: ${weather.description}`,
      detailedRecommendation 
    };
  }

  // 다른 사용자 코디 추천
  async recommendFromOthers(weather, age) {
    const minAge = age - 3;
    const maxAge = age + 3;
    const tempRange = { min: weather.temperature - 2, max: weather.temperature + 2 };
    const others = await this.outfitService.outfitRepository.findByAgeAndTempRange(minAge, maxAge, tempRange);
    return others.map(o => new OutfitModel(o).getSummary());
  }

  // 상세 온도별 의류 추천
  getDetailedClothingRecommendation(temperature, userId, description = '') {
    let recommendation = '';
    const isRaining = description && description.includes('rain');
    
    if (temperature >= 30) {
      recommendation = `${userId}님! 오늘은 기온이 ${temperature}도로 매우 덥습니다. 민소매나 반팔에 린넨 소재의 반바지처럼 시원하고 통풍이 잘 되는 옷이 좋아요. 햇볕이 강하니 모자나 선글라스로 자외선도 차단해 주세요.`;
    } 
    else if (temperature >= 26 && temperature <= 29) {
      recommendation = `${userId}님! 오늘은 기온이 ${temperature}도입니다. 가볍고 얇은 반팔이나 셔츠, 스커트, 반바지를 추천해요. 땀이 많다면 여분의 옷도 챙기는 게 좋아요. 체감 온도를 낮춰주는 밝은 색 옷이 유리해요.`;
    }
    else if (temperature >= 23 && temperature <= 25) {
      recommendation = `${userId}님! 오늘은 기온이 ${temperature}도입니다. 반팔 위에 얇은 셔츠나 가디건을 겹쳐 입고, 면바지나 얇은 슬랙스를 입는 것이 적절해요. 에어컨이 강한 실내에 대비해 얇은 겉옷을 챙기는 것도 좋아요.`;
    }
    else if (temperature >= 20 && temperature <= 22) {
      recommendation = `${userId}님! 오늘은 기온이 ${temperature}도로, 아침저녁은 약간 쌀쌀하고 낮에는 따뜻한 날씨예요. 긴팔 티셔츠나 얇은 가디건, 청바지나 면바지를 매치하면 좋습니다.`;
    }
    else if (temperature >= 17 && temperature <= 19) {
      recommendation = `${userId}님! 오늘은 기온이 ${temperature}도로 본격적인 간절기 날씨입니다. 얇은 니트나 맨투맨 위에 가디건을 걸치고, 청바지를 입으면 좋습니다. 일교차가 클 수 있으니 겉옷은 꼭 챙기세요.`;
    }
    else if (temperature >= 14 && temperature <= 16) {
      recommendation = `${userId}님! 오늘은 기온이 ${temperature}도로 초가을이나 초봄에 해당해요. 니트, 가디건, 얇은 자켓을 입고, 스타킹이나 면바지로 하체도 따뜻하게 해주세요. 아침저녁으로는 얇은 머플러도 도움이 됩니다.`;
    }
    else if (temperature >= 11 && temperature <= 13) {
      recommendation = `${userId}님! 오늘은 기온이 ${temperature}도입니다. 트렌치코트나 가을용 자켓을 입는 걸 추천해요. 이너로는 니트나 얇은 스웨터가 좋고, 바지에는 기모 소재나 청바지를 입으면 체온을 유지하기 좋습니다.`;
    }
    else if (temperature >= 8 && temperature <= 10) {
      recommendation = `${userId}님! 오늘은 기온이 ${temperature}도로 초겨울 날씨로 접어들어요. 울코트나 두꺼운 자켓 위에 니트를 입고, 히트텍 같은 이너웨어로 보온성을 높이면 좋아요. 바지는 기모 청바지가 무난해요.`;
    }
    else if (temperature >= 5 && temperature <= 7) {
      recommendation = `${userId}님! 오늘은 기온이 ${temperature}도로 꽤 쌀쌀합니다. 두꺼운 니트와 코트 조합, 또는 가죽자켓 안에 히트텍을 레이어링해서 입고, 필요하면 장갑도 준비하세요.`;
    }
    else if (temperature >= 0 && temperature <= 4) {
      recommendation = `${userId}님! 오늘은 기온이 ${temperature}도로 춥고 건조한 날씨입니다. 롱패딩, 목도리, 기모바지 등으로 체온을 보호하고, 바람이 많이 부는 날에는 바람막이 기능이 있는 옷을 걸쳐주세요.`;
    }
    else {
      recommendation = `${userId}님! 오늘은 기온이 ${temperature}도 이하로 매우 춥습니다. 최강 방한이 필요해요. 롱패딩, 니트, 기모 이너웨어를 겹겹이 입고, 장갑과 목도리, 니트모자 등으로 얼굴과 손도 잘 감싸주세요. 발도 방한 부츠로 따뜻하게 유지하는 것이 중요해요.`;
    }
    
    // 비 올 때 우산 챙기라는 메시지 추가
    if (isRaining) {
      recommendation += ` 비가 오고 있으니 외출 시 우산 꼭 챙기세요!`;
    }
    
    return recommendation;
  }
}

module.exports = RecommendationEngine; 