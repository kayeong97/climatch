import React, { useState } from 'react';
import LocationSelector from '../components/LocationSelector';
import CurrentWeather from '../components/CurrentWeather';

const Weather = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">날씨 정보</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          현재 날씨 정보를 확인하고 Climatch의 의상 추천 서비스를 이용해보세요.
          지역을 선택하면 해당 지역의 실시간 날씨 정보를 볼 수 있습니다.
        </p>
      </section>
      
      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8 h-full">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">지역 선택</h2>
          <LocationSelector onLocationSelect={handleLocationSelect} />
        </div>
        
        <div className="h-full flex items-center">
          <CurrentWeather location={selectedLocation} />
        </div>
      </div>
      
      {selectedLocation && (
        <section className="mt-16 max-w-6xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">오늘의 의상 추천</h2>
            <div className="text-center p-8">
              <p className="text-lg text-gray-600 mb-4">
                {selectedLocation}의 현재 날씨에 맞는 의상을 추천해 드립니다.
              </p>
              <button className="bg-indigo-600 text-white px-8 py-3 rounded-full text-lg hover:bg-indigo-700 transition-colors">
                의상 추천 보기
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Weather; 