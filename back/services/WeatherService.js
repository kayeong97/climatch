// services/WeatherService.js
// 외부 날씨 API 연동 및 데이터 파싱
const axios = require('axios');
const WeatherData = require('../models/WeatherData');
require('dotenv').config();

class WeatherService {
  constructor(apiKey) {
    this.apiKey = apiKey || process.env.WEATHER_API_KEY;
    this.baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
    this.forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';
    this.lang = 'kr';
  }

  // 위치 기반 현재 날씨 조회
  async getCurrentWeather(location) {
    try {
      const resp = await axios.get(this.baseUrl, {
        params: { 
          q: `${location},KR`, 
          appid: this.apiKey, 
          units: 'metric',
          lang: this.lang
        }
      });
      
      // 날씨 정보 파싱 및 WeatherData 객체 생성
      const weather = resp.data.weather[0];
      return new WeatherData({
        temperature: resp.data.main.temp,
        condition: weather.description,
        location: resp.data.name
      });
    } catch (error) {
      console.error('날씨 API 호출 오류:', error.message);
      throw new Error('날씨 정보를 가져오는데 실패했습니다.');
    }
  }

  // 위치 기반 5일 예보 조회
  async fetchForecastByLocation(location) {
    try {
      const resp = await axios.get(this.forecastUrl, {
        params: { 
          q: `${location},KR`, 
          appid: this.apiKey, 
          units: 'metric',
          lang: this.lang
        }
      });
      return this.parseForecastData(resp.data);
    } catch (error) {
      console.error('예보 API 호출 오류:', error.message);
      throw new Error('날씨 예보를 가져오는데 실패했습니다.');
    }
  }

  // 위도/경도 기반 실시간 날씨 조회
  async fetchWeatherByCoordinates(lat, lon) {
    try {
      const resp = await axios.get(this.baseUrl, {
        params: { 
          lat, 
          lon, 
          appid: this.apiKey, 
          units: 'metric',
          lang: this.lang
        }
      });
      return this.parseWeatherData(resp.data);
    } catch (error) {
      console.error('날씨 API 호출 오류:', error.message);
      throw new Error('날씨 정보를 가져오는데 실패했습니다.');
    }
  }

  // API 응답 파싱
  parseWeatherData(apiResp) {
    return {
      location: {
        name: apiResp.name,
        country: apiResp.sys.country,
        coordinates: {
          lat: apiResp.coord.lat,
          lon: apiResp.coord.lon
        }
      },
      temperature: {
        current: apiResp.main.temp,
        feelsLike: apiResp.main.feels_like,
        min: apiResp.main.temp_min,
        max: apiResp.main.temp_max
      },
      weather: {
        id: apiResp.weather[0].id,
        main: apiResp.weather[0].main,
        description: apiResp.weather[0].description,
        icon: apiResp.weather[0].icon
      },
      humidity: apiResp.main.humidity,
      pressure: apiResp.main.pressure,
      wind: {
        speed: apiResp.wind.speed,
        deg: apiResp.wind.deg
      },
      clouds: apiResp.clouds.all,
      visibility: apiResp.visibility,
      timestamp: new Date(apiResp.dt * 1000),
      sunrise: new Date(apiResp.sys.sunrise * 1000),
      sunset: new Date(apiResp.sys.sunset * 1000)
    };
  }

  // 예보 데이터 파싱
  parseForecastData(apiResp) {
    return {
      location: {
        name: apiResp.city.name,
        country: apiResp.city.country,
        coordinates: {
          lat: apiResp.city.coord.lat,
          lon: apiResp.city.coord.lon
        }
      },
      forecast: apiResp.list.map(item => ({
        timestamp: new Date(item.dt * 1000),
        temperature: {
          current: item.main.temp,
          feelsLike: item.main.feels_like,
          min: item.main.temp_min,
          max: item.main.temp_max
        },
        weather: {
          id: item.weather[0].id,
          main: item.weather[0].main,
          description: item.weather[0].description,
          icon: item.weather[0].icon
        },
        humidity: item.main.humidity,
        pressure: item.main.pressure,
        wind: {
          speed: item.wind.speed,
          deg: item.wind.deg
        },
        clouds: item.clouds.all,
        visibility: item.visibility
      }))
    };
  }

  // 날씨 아이콘 URL 가져오기
  getWeatherIconUrl(iconCode) {
    return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }

  // 한국 주요 도시 목록 반환
  getKoreanCities() {
    return [
      { code: 'seoul', name: '서울특별시' },
      { code: 'busan', name: '부산광역시' },
      { code: 'daegu', name: '대구광역시' },
      { code: 'incheon', name: '인천광역시' },
      { code: 'gwangju', name: '광주광역시' },
      { code: 'daejeon', name: '대전광역시' },
      { code: 'ulsan', name: '울산광역시' },
      { code: 'sejong', name: '세종특별자치시' },
      { code: 'gyeonggi', name: '경기도' },
      { code: 'gangwon', name: '강원도' },
      { code: 'chungbuk', name: '충청북도' },
      { code: 'chungnam', name: '충청남도' },
      { code: 'jeonbuk', name: '전라북도' },
      { code: 'jeonnam', name: '전라남도' },
      { code: 'gyeongbuk', name: '경상북도' },
      { code: 'gyeongnam', name: '경상남도' },
      { code: 'jeju', name: '제주특별자치도' }
    ];
  }

  // 각 시별 구/군 목록 반환
  getDistrictsByCity(cityCode) {
    const districts = {
      seoul: [
        { code: 'jongno', name: '종로구' },
        { code: 'jung', name: '중구' },
        { code: 'yongsan', name: '용산구' },
        { code: 'seongdong', name: '성동구' },
        { code: 'gwangjin', name: '광진구' },
        { code: 'dongdaemun', name: '동대문구' },
        { code: 'jungnang', name: '중랑구' },
        { code: 'seongbuk', name: '성북구' },
        { code: 'gangbuk', name: '강북구' },
        { code: 'dobong', name: '도봉구' },
        { code: 'nowon', name: '노원구' },
        { code: 'eunpyeong', name: '은평구' },
        { code: 'seodaemun', name: '서대문구' },
        { code: 'mapo', name: '마포구' },
        { code: 'yangcheon', name: '양천구' },
        { code: 'gangseo', name: '강서구' },
        { code: 'guro', name: '구로구' },
        { code: 'geumcheon', name: '금천구' },
        { code: 'yeongdeungpo', name: '영등포구' },
        { code: 'dongjak', name: '동작구' },
        { code: 'gwanak', name: '관악구' },
        { code: 'seocho', name: '서초구' },
        { code: 'gangnam', name: '강남구' },
        { code: 'songpa', name: '송파구' },
        { code: 'gangdong', name: '강동구' }
      ],
      busan: [
        { code: 'jung', name: '중구' },
        { code: 'seo', name: '서구' },
        { code: 'dong', name: '동구' },
        { code: 'yeongdo', name: '영도구' },
        { code: 'busanjin', name: '부산진구' },
        { code: 'dongnae', name: '동래구' },
        { code: 'nam', name: '남구' },
        { code: 'buk', name: '북구' },
        { code: 'haeundae', name: '해운대구' },
        { code: 'saha', name: '사하구' },
        { code: 'geumjeong', name: '금정구' },
        { code: 'gangseo', name: '강서구' },
        { code: 'yeonje', name: '연제구' },
        { code: 'suyeong', name: '수영구' },
        { code: 'sasang', name: '사상구' },
        { code: 'gijang', name: '기장군' }
      ],
      // 나머지 도시에 대한 구/군 정보도 추가 가능
      // ...
    };
    
    return districts[cityCode] || [];
  }

  // 날씨 데이터를 기반으로 의류 추천을 위한 정보 제공
  getWeatherBasedClothingInfo(weatherData) {
    const { temperature, weather, wind } = weatherData;
    
    let clothingType = '';
    let description = '';
    
    // 기온별 의류 타입 결정
    if (temperature.current <= 5) {
      clothingType = 'winter';
      description = '패딩, 두꺼운 코트, 목도리, 장갑, 기모 제품';
    } else if (temperature.current <= 9) {
      clothingType = 'earlyWinter';
      description = '코트, 가죽자켓, 히트텍, 니트, 두꺼운 바지';
    } else if (temperature.current <= 11) {
      clothingType = 'fallWinter';
      description = '트렌치코트, 야상, 자켓, 니트, 청바지, 스타킹';
    } else if (temperature.current <= 16) {
      clothingType = 'fall';
      description = '자켓, 가디건, 야상, 스타킹, 청바지, 면바지';
    } else if (temperature.current <= 19) {
      clothingType = 'earlySummer';
      description = '얇은 가디건, 긴팔티, 면바지, 청바지';
    } else if (temperature.current <= 22) {
      clothingType = 'spring';
      description = '얇은 가디건, 니트, 맨투맨, 긴팔티, 면바지, 청바지';
    } else if (temperature.current <= 27) {
      clothingType = 'summer';
      description = '반팔, 얇은 셔츠, 반바지, 면바지';
    } else {
      clothingType = 'hotSummer';
      description = '민소매, 반팔, 반바지, 원피스';
    }
    
    // 날씨 상태별 추가 정보
    const weatherCondition = weather.main.toLowerCase();
    let weatherSpecificInfo = '';
    
    if (weatherCondition.includes('rain') || weatherCondition.includes('drizzle')) {
      weatherSpecificInfo = '비가 오고 있어요. 우산과 방수 옷을 준비하세요.';
    } else if (weatherCondition.includes('snow')) {
      weatherSpecificInfo = '눈이 오고 있어요. 방한 및 방수 준비를 하세요.';
    } else if (weatherCondition.includes('thunderstorm')) {
      weatherSpecificInfo = '천둥번개가 치고 있어요. 외출을 삼가하세요.';
    } else if (weatherCondition.includes('mist') || weatherCondition.includes('fog')) {
      weatherSpecificInfo = '안개가 끼었어요. 운전 시 주의하세요.';
    } else if (wind.speed > 10) {
      weatherSpecificInfo = '바람이 강해요. 바람막이 옷을 챙기세요.';
    }
    
    return {
      clothingType,
      recommendation: description,
      weatherWarning: weatherSpecificInfo,
      temperature: temperature.current,
      weatherCondition: weather.main,
      weatherDescription: weather.description
    };
  }
}

module.exports = WeatherService; 