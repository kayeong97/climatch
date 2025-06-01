import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const CurrentWeather = ({ location }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [clothingInfo, setClothingInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!location || !location.city) {
      setWeatherData(null);
      setClothingInfo(null);
      return;
    }

    const fetchWeatherData = async () => {
      setLoading(true);
      try {
        // 쿼리 파라미터 구성
        const params = { city: location.city };
        if (location.district) {
          params.district = location.district;
        }

        const response = await axios.get(`${API_BASE_URL}/api/weather/current`, { params });
        setWeatherData(response.data.weather);
        setClothingInfo(response.data.clothingInfo);
        setError(null);
      } catch (err) {
        console.error('날씨 데이터 로딩 실패:', err);
        setError('날씨 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [location]);

  if (loading) {
    return <div className="text-center py-6">날씨 정보를 불러오는 중...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-6">{error}</div>;
  }

  if (!weatherData) {
    return <div className="text-center py-6">지역을 선택하면 날씨 정보가 표시됩니다.</div>;
  }

  // 날씨 아이콘 URL 생성
  const weatherIconUrl = `http://openweathermap.org/img/wn/${weatherData.weather.icon}@2x.png`;

  return (
    <div className="current-weather bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="location text-xl font-bold mb-2">
        {weatherData.location.name}, {weatherData.location.country}
      </div>
      
      <div className="weather-main flex items-center justify-between mb-4">
        <div className="temperature text-4xl font-bold">
          {Math.round(weatherData.temperature.current)}°C
        </div>
        <div className="weather-icon flex flex-col items-center">
          <img src={weatherIconUrl} alt={weatherData.weather.description} className="w-16 h-16" />
          <span className="text-sm capitalize">{weatherData.weather.description}</span>
        </div>
      </div>
      
      <div className="weather-details grid grid-cols-2 gap-2 mb-4">
        <div className="detail-item">
          <span className="text-gray-500">체감 온도:</span>
          <span className="ml-2 font-medium">{Math.round(weatherData.temperature.feelsLike)}°C</span>
        </div>
        <div className="detail-item">
          <span className="text-gray-500">습도:</span>
          <span className="ml-2 font-medium">{weatherData.humidity}%</span>
        </div>
        <div className="detail-item">
          <span className="text-gray-500">풍속:</span>
          <span className="ml-2 font-medium">{weatherData.wind.speed} m/s</span>
        </div>
        <div className="detail-item">
          <span className="text-gray-500">기압:</span>
          <span className="ml-2 font-medium">{weatherData.pressure} hPa</span>
        </div>
      </div>
      
      {clothingInfo && (
        <div className="clothing-recommendation p-4 bg-blue-50 rounded-lg mt-4">
          <h3 className="text-lg font-semibold mb-2">오늘의 옷차림 추천</h3>
          <p className="mb-2">{clothingInfo.recommendation}</p>
          {clothingInfo.weatherWarning && (
            <p className="text-red-600 text-sm">{clothingInfo.weatherWarning}</p>
          )}
        </div>
      )}
      
      <div className="text-xs text-gray-500 mt-4">
        마지막 업데이트: {new Date(weatherData.timestamp).toLocaleString()}
      </div>
    </div>
  );
};

export default CurrentWeather; 