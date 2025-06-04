import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getWeatherIcon } from '../utils/weatherIcons';

export function HomePage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [weather, setWeather] = useState({ 
    temperature: 22, 
    description: '맑음',
    icon: getWeatherIcon('맑음')
  });

  // Simulate fetching weather data
  useEffect(() => {
    // In a real app, this would be an API call to a weather service
    const weatherData = { 
      temperature: 22, 
      description: '맑음',
      icon: getWeatherIcon('맑음')
    };
    setWeather(weatherData);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex justify-end p-2 text-sm space-x-2">
        <button 
          onClick={() => navigate('/weather')} 
          className="text-gray-600 hover:underline"
        >
          다른 지역 날씨 보기
        </button>
        <button 
          onClick={() => navigate('/view')} 
          className="text-gray-600 hover:underline"
        >
          오늘의 코디 모아보기
        </button>
      </div>
      
      <div className="flex-grow flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center mb-8">
          <div className="text-8xl mb-2">{weather.icon}</div>
          <div className="text-5xl font-light">{weather.temperature}°C</div>
        </div>
        
        <p className="text-xl text-center mt-4">
          {currentUser?.name || currentUser?.id}님!<br />
          오늘 날씨엔 셔츠 어때요?
        </p>
        
        <div className="mt-8 flex space-x-3">
          <button 
            onClick={() => navigate('/view')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            코디 보기
          </button>
          <button 
            onClick={() => navigate('/upload')}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
} 