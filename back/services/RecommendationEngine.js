// services/RecommendationEngine.js
// 룰 기반 및 유사 사용자 기반 코디 추천
const Outfit = require('../models/Outfit');

class RecommendationEngine {
  constructor(outfitService) {
    this.outfitService = outfitService;
  }

  // 날씨 기반 코디 추천
  async recommendByWeather(weather, user) {
    const desc = weather.condition.toLowerCase();
    
    // 다양한 추천 문구 중 랜덤 선택
    const suggestion = this.getRandomWeatherSuggestion(weather.temperature, desc);
    
    // 상세 의류 추천 메시지 생성
    const detailedRecommendation = this.getDetailedClothingRecommendation(weather.temperature, user.id, desc);
    
    return { 
      suggestion, 
      reason: `현재 날씨: ${weather.condition}, 온도: ${weather.temperature}°C`,
      detailedRecommendation 
    };
  }

  // 온도와 날씨 상태에 따른 랜덤 추천 문구 선택
  getRandomWeatherSuggestion(temp, desc) {
    let suggestionOptions = [];
    let rainSuggestion = '';

    // 비 오는 날 추가 문구
    if (desc.includes('rain') || desc.includes('비')) {
      const rainOptions = [
        '우산을 꼭 챙기세요.',
        '방수 기능이 있는 신발을 신는 것이 좋겠어요.',
        '우산과 함께 방수 스프레이도 챙기면 좋아요.',
        '비가 오니 슬리퍼보다는 발이 젖지 않는 신발을 신으세요.'
      ];
      rainSuggestion = rainOptions[Math.floor(Math.random() * rainOptions.length)];
    }

    // 온도별 추천 옵션
    if (temp >= 30) {
      suggestionOptions = [
        '민소매나 린넨 소재의 옷으로 더위를 이겨내세요.',
        '통풍이 잘 되는 가벼운 옷과 자외선 차단제가 필수입니다.',
        '밝은 색상의 반팔과 반바지로 시원하게 입으세요.',
        '얇은 소재의 원피스나 반바지가 좋은 선택입니다.'
      ];
    } 
    else if (temp >= 26 && temp <= 29) {
      suggestionOptions = [
        '얇은 반팔 셔츠와 면 소재 하의가 적당합니다.',
        '시원한 반팔 티셔츠와 통기성 좋은 바지를 추천합니다.',
        '시원한 원피스나 반바지, 짧은 치마 등이 좋아요.',
        '땀 흡수가 잘 되는 면 소재 의류가 쾌적할 거예요.'
      ];
    }
    else if (temp >= 23 && temp <= 25) {
      suggestionOptions = [
        '반팔에 얇은 가디건을 함께 챙기세요.',
        '셔츠나 얇은 긴팔도 괜찮은 날씨입니다.',
        '얇은 긴팔과 면바지가 편안할 거예요.',
        '에어컨 냉방에 대비해 얇은 아우터를 준비하세요.'
      ];
    }
    else if (temp >= 20 && temp <= 22) {
      suggestionOptions = [
        '긴팔 티셔츠나 얇은 가디건이 적당한 날씨입니다.',
        '얇은 맨투맨이나 니트가 좋은 선택입니다.',
        '긴팔 셔츠와 가벼운 청바지 조합이 잘 어울려요.',
        '가디건이나 얇은 자켓을 준비하면 좋습니다.'
      ];
    }
    else if (temp >= 17 && temp <= 19) {
      suggestionOptions = [
        '가벼운 자켓이나 트렌치코트가 필요한 날씨입니다.',
        '니트나 맨투맨에 청바지가 좋은 조합입니다.',
        '가디건이나 얇은 코트로 체온을 유지하세요.',
        '일교차가 큰 날씨이니 얇은 겉옷을 챙기세요.'
      ];
    }
    else if (temp >= 14 && temp <= 16) {
      suggestionOptions = [
        '트렌치코트나 가벼운 자켓이 좋은 선택입니다.',
        '얇은 니트에 재킷을 매치해 입으세요.',
        '히트텍 같은 내복 위에 두꺼운 맨투맨을 입어보세요.',
        '가벼운 코트와 니트로 보온성을 높이세요.'
      ];
    }
    else if (temp >= 11 && temp <= 13) {
      suggestionOptions = [
        '코트나 가죽자켓 등의 보온성 있는 아우터가 필요합니다.',
        '두꺼운 니트와 자켓을 레이어드해 입으세요.',
        '내복과 함께 따뜻한 코트로 체온을 지키세요.',
        '코트와 목도리로 따뜻하게 입어보세요.'
      ];
    }
    else if (temp >= 8 && temp <= 10) {
      suggestionOptions = [
        '도톰한 코트와 니트로 따뜻하게 입으세요.',
        '울 코트나 가벼운 패딩으로 보온성을 높이세요.',
        '내복, 니트, 코트로 레이어드하여 입으세요.',
        '장갑과 목도리까지 필요한 날씨입니다.'
      ];
    }
    else if (temp >= 5 && temp <= 7) {
      suggestionOptions = [
        '패딩이나 두꺼운 코트가 필요한 추운 날씨입니다.',
        '히트텍, 기모 바지 등 보온 내의가 필요해요.',
        '목도리와 장갑으로 체온 유지에 신경 쓰세요.',
        '두꺼운 코트나 숏패딩으로 따뜻하게 입으세요.'
      ];
    }
    else if (temp >= 0 && temp <= 4) {
      suggestionOptions = [
        '두꺼운 패딩과 방한용 액세서리가 필수입니다.',
        '내복, 히트텍을 여러 겹 입고 롱패딩을 추천합니다.',
        '목도리, 장갑, 모자 등으로 체온 유지가 중요해요.',
        '방한 부츠와 두꺼운 패딩으로 외출 준비를 하세요.'
      ];
    }
    else {
      suggestionOptions = [
        '롱패딩과 두꺼운 목도리, 장갑, 모자 모두 필수입니다.',
        '최대한 따뜻하게 여러 겹의 옷을 입고 외출하세요.',
        '기모 내의와 두꺼운 니트, 롱패딩으로 체온 유지가 중요해요.',
        '귀까지 덮는 모자와 목도리로 꼼꼼하게 방한하세요.'
      ];
    }
    
    // 랜덤으로 추천 문구 선택
    const suggestion = suggestionOptions[Math.floor(Math.random() * suggestionOptions.length)];
    
    // 비 오는 날에는 추가 문구 포함
    return rainSuggestion ? `${suggestion} ${rainSuggestion}` : suggestion;
  }

  // 유사 사용자 기반 코디 추천
  async recommendBySimilarity(age, weatherData) {
    // 비슷한 나이대 범위 설정 (±3세)
    const minAge = age - 3;
    const maxAge = age + 3;
    
    // 비슷한 온도 범위 설정 (±2도)
    const tempRange = { min: weatherData.temperature - 2, max: weatherData.temperature + 2 };
    
    // 비슷한 조건의 다른 사용자 코디 조회
    const outfits = await this.outfitService.outfitRepository.findByAgeAndTempRange(minAge, maxAge, tempRange);
    
    // Outfit 객체로 변환해서 반환
    return outfits.map(outfit => new Outfit(outfit));
  }

  // 상세 온도별 의류 추천
  getDetailedClothingRecommendation(temperature, userId, description = '') {
    let recommendation = '';
    const isRaining = description && (description.includes('rain') || description.includes('비'));
    
    // 온도별 추천 메시지
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