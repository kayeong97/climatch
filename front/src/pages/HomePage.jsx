import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getWeatherIcon } from '../utils/weatherIcons';
import axios from 'axios';

export function HomePage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [weather, setWeather] = useState({ 
    temperature: null, 
    description: '',
    icon: ''
  });
  const [userLocation, setUserLocation] = useState(null);

  // Fetch user's location and weather data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get user's location from their profile
        const userResponse = await axios.get('/api/users/profile');
        const { city, district } = userResponse.data;
        setUserLocation({ city, district });

        // Get weather data for user's location
        const weatherResponse = await axios.get(`/api/weather?city=${city}&district=${district}`);
        setWeather({
          temperature: weatherResponse.data.temperature,
          description: weatherResponse.data.description,
          icon: getWeatherIcon(weatherResponse.data.description)
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (currentUser) {
      fetchUserData();
    }
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex justify-end p-2 text-sm space-x-2">
        <button 
          onClick={() => navigate('/view')} 
          className="text-gray-600 hover:underline"
        >
          오늘의 코디 모아보기
        </button>
      </div>
      
      <div className="flex-grow flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center mb-8">
          {weather.icon && <div className="text-8xl mb-2">{weather.icon}</div>}
          {weather.temperature && <div className="text-5xl font-light">{weather.temperature}°C</div>}
        </div>
        
        <p className="text-xl text-center mt-4">
          {currentUser?.username}님!<br />
          {weather.temperature && userLocation && 
            `오늘 ${userLocation.city} ${userLocation.district}의 날씨는 ${weather.temperature}°C로 ${weather.description}입니다.`}
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