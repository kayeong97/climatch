import React, { useState } from 'react';
import LocationSelector from '../components/LocationSelector';
import CurrentWeather from '../components/CurrentWeather';

const Weather = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  return (
    <div className="weather-page container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">날씨 정보</h1>
      
      <div className="max-w-xl mx-auto mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">지역 선택</h2>
          <LocationSelector onLocationSelect={handleLocationSelect} />
        </div>
      </div>
      
      <div className="mt-8">
        <CurrentWeather location={selectedLocation} />
      </div>
    </div>
  );
};

export default Weather; 