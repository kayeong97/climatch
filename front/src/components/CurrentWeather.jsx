import React, { useState, useEffect } from 'react';
import { getWeatherIcon } from '../utils/weatherIcons';

// 임시 날씨 데이터 생성 함수
const generateMockWeatherData = (location) => {
  // 현재 날짜 및 시간
  const now = new Date();
  
  // 랜덤 온도 (계절에 따라 다르게 설정)
  const month = now.getMonth(); // 0-11
  let tempMin, tempMax;
  
  if (month >= 11 || month <= 1) { // 겨울 (12-2월)
    tempMin = -5;
    tempMax = 10;
  } else if (month >= 2 && month <= 4) { // 봄 (3-5월)
    tempMin = 8;
    tempMax = 25;
  } else if (month >= 5 && month <= 7) { // 여름 (6-8월)
    tempMin = 20;
    tempMax = 35;
  } else { // 가을 (9-11월)
    tempMin = 10;
    tempMax = 25;
  }
  
  const temp = Math.round((Math.random() * (tempMax - tempMin) + tempMin) * 10) / 10;
  
  // 날씨 상태 랜덤 선택
  const weatherConditions = ['맑음', '구름 조금', '구름 많음', '흐림', '비', '눈', '안개'];
  const weatherIndex = Math.floor(Math.random() * weatherConditions.length);
  const condition = weatherConditions[weatherIndex];
  
  return {
    id: 1,
    location: location,
    weather_temp: temp,
    weather_condition: condition,
    fetched_at: now.toISOString()
  };
};

const CurrentWeather = ({ location }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!location) {
      setWeather(null);
      return;
    }

    setLoading(true);
    setError(null);

    // 실제 앱에서는 실제 날씨 API 호출
    // 여기서는 더미 데이터를 사용
    setTimeout(() => {
      const weatherData = {
        location,
        temperature: Math.floor(Math.random() * 15) + 15, // 15-29도 랜덤
        condition: ['맑음', '구름 조금', '흐림', '비', '비/갬'][Math.floor(Math.random() * 5)],
        humidity: Math.floor(Math.random() * 30) + 50, // 50-79% 랜덤
        windSpeed: Math.floor(Math.random() * 10) + 1, // 1-10 m/s 랜덤
      };
      
      setWeather({
        ...weatherData,
        icon: getWeatherIcon(weatherData.condition)
      });
      setLoading(false);
    }, 800);
  }, [location]);

  if (!location) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-8 w-full text-center">
        <p className="text-lg text-gray-600">지역을 선택하면 날씨 정보가 표시됩니다.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-8 w-full text-center">
        <p className="text-lg text-gray-600">날씨 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-8 w-full text-center">
        <p className="text-lg text-red-500">날씨 정보를 불러올 수 없습니다.</p>
        <p className="text-gray-600 mt-2">{error}</p>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 w-full">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="mb-6 md:mb-0">
          <h3 className="text-xl font-semibold text-gray-800 mb-1">{weather.location}</h3>
          <p className="text-gray-600">{new Date().toLocaleDateString('ko-KR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        
        <div className="flex items-center justify-center">
          <div className="text-7xl mr-4">
            {weather.icon}
          </div>
          <div className="text-center">
            <div className="text-5xl font-light text-gray-800">{weather.temperature}°C</div>
            <p className="text-gray-600">{weather.condition}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg flex items-center">
          <div className="text-blue-500 text-3xl mr-3">💧</div>
          <div>
            <h4 className="text-sm text-gray-500">습도</h4>
            <p className="text-xl text-gray-800">{weather.humidity}%</p>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg flex items-center">
          <div className="text-blue-500 text-3xl mr-3">💨</div>
          <div>
            <h4 className="text-sm text-gray-500">풍속</h4>
            <p className="text-xl text-gray-800">{weather.windSpeed} m/s</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather; 