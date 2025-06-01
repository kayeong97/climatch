import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const LocationSelector = ({ onLocationSelect }) => {
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 도시 목록 불러오기
  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/locations/cities`);
        setCities(response.data.cities);
        setError(null);
      } catch (err) {
        console.error('도시 목록 로딩 실패:', err);
        setError('도시 목록을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  // 선택된 도시에 따라 구/군 목록 불러오기
  useEffect(() => {
    if (!selectedCity) {
      setDistricts([]);
      return;
    }

    const fetchDistricts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/locations/districts/${selectedCity}`);
        setDistricts(response.data.districts);
        setError(null);
      } catch (err) {
        console.error('구/군 목록 로딩 실패:', err);
        setError('구/군 목록을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchDistricts();
  }, [selectedCity]);

  // 도시 선택 핸들러
  const handleCityChange = (e) => {
    const cityCode = e.target.value;
    setSelectedCity(cityCode);
    setSelectedDistrict('');
    
    // 부모 컴포넌트에 위치 정보 전달
    onLocationSelect({ city: cityCode, district: null });
  };

  // 구/군 선택 핸들러
  const handleDistrictChange = (e) => {
    const districtCode = e.target.value;
    setSelectedDistrict(districtCode);
    
    // 부모 컴포넌트에 위치 정보 전달
    onLocationSelect({ city: selectedCity, district: districtCode });
  };

  if (error) {
    return <div className="text-red-500 text-sm mt-2">{error}</div>;
  }

  return (
    <div className="location-selector">
      <div className="mb-4">
        <label htmlFor="city-select" className="block text-sm font-medium text-gray-700 mb-1">
          도시 선택
        </label>
        <select
          id="city-select"
          value={selectedCity}
          onChange={handleCityChange}
          disabled={loading || cities.length === 0}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">도시를 선택하세요</option>
          {cities.map((city) => (
            <option key={city.code} value={city.code}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      {selectedCity && (
        <div className="mb-4">
          <label htmlFor="district-select" className="block text-sm font-medium text-gray-700 mb-1">
            구/군 선택
          </label>
          <select
            id="district-select"
            value={selectedDistrict}
            onChange={handleDistrictChange}
            disabled={loading || districts.length === 0}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">구/군을 선택하세요</option>
            {districts.map((district) => (
              <option key={district.code} value={district.code}>
                {district.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {loading && <div className="text-gray-500 text-sm">로딩 중...</div>}
    </div>
  );
};

export default LocationSelector; 