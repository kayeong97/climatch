import React, { useState, useEffect } from 'react';
import LocationSelector from '../components/LocationSelector';
import CurrentWeather from '../components/CurrentWeather';
import axios from 'axios';

const Weather = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecommendation = async () => {
      setLoading(true);
      setError('');
      try {
        // 로그인된 사용자는 /api/recommendation에서 추천을 받음
        const res = await axios.get('/api/recommendation');
        setRecommendation(res.data.recommendation?.text || '추천 결과를 불러올 수 없습니다.');
      } catch (err) {
        setError('추천 결과를 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendation();
  }, []);

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
          <LocationSelector onLocationSelect={setSelectedLocation} />
        </div>
        <div className="h-full flex items-center">
          <CurrentWeather location={selectedLocation} />
        </div>
      </div>
      <section className="mt-16 max-w-6xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">오늘의 의상 추천</h2>
          <div className="text-center p-8">
            {loading ? (
              <p className="text-lg text-gray-400 mb-4">추천을 불러오는 중...</p>
            ) : error ? (
              <p className="text-lg text-red-500 mb-4">{error}</p>
            ) : (
              <p className="text-lg text-gray-600 mb-4">{recommendation}</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Weather; 